# 领域事件 3——领域事件的发布

上文介绍了几种领域事件的生成方案，这几种方案中，领域事件生成之后直接调用 publisher
进行发布，都有可能造成丢失消息，无法可靠地发布领域事件。因此本节探讨该如何可靠地发布领域事件。

上文中发布消息的方案之所以不可靠，是因为`消息发布`与`本地数据库事务提交`这两个操作属于分布式事务，要想可靠地发布消息，要么支持分布式事务，要么规避分布式事务。

分布式事务通常性能都不是很好，所以我们很少会选择支持分布式事务，因此我们着重讲如何规避分布式事务。

## 1. 事件存储（Event Store）

为了可靠地发布领域事件，我们考虑把领域事件消息发送的过程，整合到本地事务中作为本地事务的一部分，因此我们需要实现事件存储（Event
Store）。

新增一张本地消息表，用于记录待发布的领域事件。

以下是表结构：

```sql
CREATE TABLE `domain_event_store`(
  `event_id` varchar(64) NOT NULL COMMENT '事件id',
  `event_body` varchar(65000) NOT NULL COMMENT '事件消息体',
  `ts` datetime NOT NULL COMMENT '事件发生时间',
  `event_type` varchar (32) NOT NULL COMMENT '事件类型',
  PRIMARY KEY(`event_id`)
) ENGINE = InnoDB;
```

以上的表结构可以根据实际需要增加字段。

我们还需要对聚合根的 DomainRepository 的 save 进行改造，在其保存聚合根的时候，同时持久化领域事件。

```java
public class DomainRepository {

    @Resource
    private DomainEventStoreDao domainEventStoreDao;

    @Transactional
    public void save(AggregateRoot root) {

        //1. 保存聚合根，忽略

        //2. 抽取领域事件
        List<DomainEvent> events = root.getDomainEvents();

        //3. 保存领域事件
        List<DomainEventStore> storeList = this.toDomainEventStore(events);
        domainEventStoreDao.insertBatch(storeList);
    }
}
```

有时候消息内容会很大，我们可以对领域事件的消息体压缩之后再进行存储。

```java

public class DomainRepository {

    private List<DomainEventStore> toDomainEventStore(List<DomainEvent> events) {
        if (Collections.isEmpty(events)) {
            return Lists.emptyList();
        }
        List<DomainEventStore> list = new ArrayList<>(events.length());
        for (DomainEvent e : events) {
            DomainEventStore s = new DomainEventStore();
            //转成JSON之后压缩
            s.setEventBody(this.compress(JSON.toJSONString(e)));
            //省略部分逻辑
            list.add(s);
        }
        return list;
    }
}

```

我们可以在`compress`方法中实现压缩逻辑，目前有许多的库支持可以完成这项工作。Ï

## 2. 直接发布+轮询发布消息补偿

在实现了事件存储之后，我们可以依赖事件存储实现领域事件的可靠发布，整体实现过程如下图：

![直接发布+轮询发布消息补偿架构图](/images/2/ct.007.jpg)

我们在`domain_event_store`表中加入一个发布状态字段，用于标识领域事件是否成功发送至消息中间件。

```sql
CREATE TABLE `domain_event_store`(
  `event_id` varchar(64) NOT NULL COMMENT '事件id',
  `event_body` varchar(65000) NOT NULL COMMENT '事件消息体',
  `event_time` datetime NOT NULL COMMENT '事件发生时间',
  `event_type` varchar (32) NOT NULL COMMENT '事件类型',
  `event_state` INT NOT NULL DEFAULT 0 COMMENT '事件状态，0发布中，1已发布',
  PRIMARY KEY(`event_id`)
) ENGINE = InnoDB;
```

在应用层我们可以直接发布领域事件，如下图：

```java
public class ApplicationService {

    public void changeMobile(String bizId, String mobile) {

        AggregateRoot entity = repository.load(bizId);
        entity.changeMobile(mobile);
        repository.save(entity);

        //注意，此处publisher和repository存在分布式事务的问题
        //有可能repository正常提交，但是publisher发送失败，造成丢消息
        publisher.publish(entity.getDomainEvents());
        //TODO 更新领域存储中事件的状态
    }

}

```

此时，由于`DomainRepository`中保存了领域事件，如果发送过程发生异常，事件存储中的状态就不会被置成已发布；或者已经发送成功了，但是事件存储中的状态没有被置成已发布。我们可以提供一个定时任务，定期扫表，把过期未置状态的领域事件补偿发送出去。

伪代码如下：

```java

public class Task {

    public void doTask() {

        //TODO 1. 扫出数据库超时未发送成功的领域事件

        //TODO 2. 发布领域事件到消息中间件

        //TODO 3. 修改数据库领域事件发布状态为已发布
    }
}

```

## 3. 采用事务日志拖尾发布领域事件

轮询数据库进行领域事件补偿的方案可以可靠地发布领域事件，但是可能给数据库造成压力，我们可以采用事务日志拖尾的方式发布领域事件。

事务日志拖尾的含义是监听事务日志，获取到增量的新数据。事务日志拖尾的实现，可以选择一些 CDC 中间件，常见的 CDC 中间件有：Flink CDC、Debezium、DataX、Canal 等。

Debezium 基于 MySQL 数据库增量日志进行解析，提供增量数据订阅，并且支持 MySQL、PostgreSQL、Oracle、SqlServer、MongoDB 主流数据库，因此我们选择 Debezium 进行示例讲解。


采用事务日志拖尾发布领域事件的架构图如下：

![采用事务日志拖尾发布领域事件的架构图](/images/2/ct.008.jpg)

当采用日志拖尾的形式时，主要有几点区别：

- Application层不再手动发布领域事件，领域事件的发布依赖CDC，CDC捕获数据库事务日志再推送消息中间件

- 不需要额外的定时任务进行扫表标记领域事件的状态，减轻数据库压力

- CDC应用可成为统一的消息下发层，在此处将消息处理后转发到各个不同的Topic

<!--@include: ../footer.md-->
