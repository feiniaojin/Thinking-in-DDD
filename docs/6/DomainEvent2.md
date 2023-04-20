# 领域事件 2——领域事件的生成

领域事件的生成有几种方案，我们分别进行介绍。

## 1. 第一种、聚合创建领域事件并调用基础设施发布

领域事件是聚合状态发生变化时产生的，并且聚合知晓自身状态变化前后的值，因此聚合可以负责领域事件的创建。并且聚合创建领域事件之后，可以调用基础设施将领域消息发布出去。

举个例子：

```java
public class Entity {

    private Publisher publisher;

    public void changeMobile(String mobile) {
        //业务逻辑处理
        this.mobile = mobile;
        //以下是发布消息的逻辑
        Event e = new Event();
        e.setTimestamp(new Date().getTime());
        e.setBizId(this.uid);
        e.setAfterMobile(mobile);
        e.setEventType("MobileChanged");
        publisher.publish(e);
    }

}

```

但是，聚合根的创建不应该有依赖注入，如果聚合调用基础设施进行发布的话，也就意味着一个聚合根做了两件事情：执行业务操作、发布领域事件，这正是贫血模型做的事情，因此，我们要避免在聚合根内调用基础设施发布领域消息，应该将领域事件的生成和发布两个过程分开。

因此，这种方式不推荐使用。

## 2. 第二种、聚合创建事件并返回给应用服务

第一种方式中，聚合自己创建事件并且自己调用基础设施发布事件，我们发现这会造成聚合根方法职责不单一，因此我们选择让聚合根创建事件之后，返回给应用服务，之后应用服务调用基础设施发布事件。

领域模型聚合根的伪代码：

```java

/**
 * 聚合根
 */
public class Entity {

    /**
     * 此时方法不能返回空，必须返回创建的事件，如果事件多个的，需要返回List<Event>
     * @param mobile
     * @return
     */
    public Event changeMobile(String mobile) {
        //业务逻辑处理
        this.mobile = mobile;
        //以下是发布消息的逻辑
        Event e = new Event();
        e.setTimestamp(new Date().getTime());
        e.setBizId(this.uid);
        e.setAfterMobile(mobile);
        e.setEventType("MobileChanged");
    }
}

```

ApplicationService 的伪代码：

```java
public class ApplicationService {


    public void changeMobile(String bizId, String mobile) {

        Entity entity = repository.load(bizId);

        Event e = entity.changeMobile(mobile);

        repository.save(entity);

        //注意，此处publisher和repository存在分布式事务的问题
        //有可能repository正常提交，但是publisher发送失败，造成丢消息
        publisher.publish(e);
    }

}
```

注意：publisher 和 repository 存在分布式事务的问题,有可能 repository 正常提交数据库事务，但是 publisher 发送失败，造成丢消息。

## 3. 第三种、聚合创建事件并提供抽取事件的方法

这种方法在《微服务设计模式》一书中有提到，在聚合根内定义一个用来存放事件的字段，通常时一个 Collection 集合，当聚合根生成事件时，将该事件存放到集合中，然后聚合根提供一个抽取已存放事件的方法。

伪代码如下：

先定义一个层超类型抽象类，该抽象内定义了用来存放事件的字段，以及注册事件、抽取事件的方法。

```java
public abstract class AbstractAggregateRoot{

    private List<Event> domainEvents=new ArrayList<>();

    public void registerDomainEvent(Event evnet){
        this.domainEvents.add(event);
    }

    public List<Event> getDomainEvents(){
        return domainEvents;
    }

}

```

聚合根要继承该层超类型，在执行业务操作时将生成的事件通过`registerDomainEvent`方法保存起来。

```java

public class AggregateRoot extends AbstractAggregateRoot{

    public Event changeMobile(String mobile) {
        //业务逻辑处理
        this.mobile = mobile;
        //以下是发布消息的逻辑
        Event e = new Event();
        e.setTimestamp(new Date().getTime());
        e.setBizId(this.uid);
        e.setAfterMobile(mobile);
        e.setEventType("MobileChanged");
        //注册保存起来
        super.registerDomainEvent(e);
    }
}

```

在 ApplicationService 中，通过 getDomainEvents 获取聚合内的事件。

```java
public class ApplicationService {

    public void changeMobile(String bizId, String mobile) {

        AggregateRoot entity = repository.load(bizId);

        entity.changeMobile(mobile);

        repository.save(entity);

        //注意，此处publisher和repository存在分布式事务的问题
        //有可能repository正常提交，但是publisher发送失败，造成丢消息
        publisher.publish(entity.getDomainEvents());
    }

}
```

注意：publisher 和 repository 存在分布式事务的问题,有可能 repository 正常提交数据库事务，但是 publisher 发送失败，造成丢消息。

## 4. 总结

以上几种生成领域事件的方式：

第一种由于耦合太强，不推荐使用；

第二种虽然耦合不强，但是修改了方法的返回值，《微服务架构模式》中推荐使用，但我不推荐使用；

第三种虽然定义了层超类型，但是规避了对领域模型方法的返回值，所以我推荐使用。

<!--@include: ../footer.md-->
