# Application 层的实现细节

Application 层将用例入参转化为领域知识，但 Application 层不应了解 Domain 层内部的业务逻辑，Application 层只为领域对象提供执行业务逻辑的场所。

## 1. Application 层的类型流转

Application 层方法的入参是各种各样的 DTO。这些 DTO 并不是领域模型，Application 层要通过 DTO 携带的关键参数，调用领域基础设施组件，获得聚合根对象，再将 DTO 中其他的参数翻译成领域知识，再交给聚合根执行业务逻辑。

这里有两种场景：一种是实体不存在，需要通过 Factory 创建；一种是实体已存在，则需要通过 Repository 加载。

以下是示例：

```java
public class ApplicationService{

    /**
    * 实体不存在
    */
    public void newEntity(CreateCommand command){

          //factory了解创建的全部知识，例如factory才知道唯一标识ID是如何生成的
          Entity entity=factory.newInstance(new Value1(command.getProperty1()),
                              new Value2(command.getProperty2());
          //初始化，并生成初始化事件
          entity.init();
          //保存实体
          repository.save(entity);
    }

    /**
    * 实体已存在
    */
    public void modifyEntity(ModifyCommand cmd){
        //repository根据唯一标识加载实体
        Entity entity=repository.load(new EntityId(cmd.getProperty0()));
        //实体执行业务操作
        entity.bizOperate(new Value1(cmd.getProperty1()),
                              new Value2(cmd.getProperty2()));
        //repository保存实体
        repository.save(entity);
    }
}
```

上面代码中，没有包含领域事件的处理，我们未来会在单独的章节进行探讨。

## 2. 业界常见的错误实现

有很多的案例在应用层直接将 DTO 转成聚合根，然后由这个聚合根执行业务操作，这是不正确的。

首先，聚合根的获得，要么是通过领域层定义的 Factory 创建，要么是通过 Repository 加载，不能任意一个 DTO 来了都能转成聚合根，如果每个 DTO 都要转一次聚合根，那么相当于聚合根创建和获取的知识没有得到封装，所有人都需要理解聚合根的创建过程，每新增一个 DTO 都要配备一个装配器；

其次，转过来的聚合根通常不具备完整的状态数据，不足以确保正确执行业务逻辑。

以下是不推荐的示例：

```java
public class ApplicationService{

    /**
    * 不推荐的编码实践
    */
    public void modifyDomain(ModifyCommand cmd){

        //不推荐直接将cmd转成聚合，会导致每个cmd都要有一个converter
        //并且直接转过来的状态不一定完整
        Aggregate aggregate=converter.convert(cmd);
        aggregate.bizOperate(new Value1(cmd.getProperty1()),
                              new Value2(cmd.getProperty2()));
        //省略后续代码
    }
}
```

Application 层的方法，入参出参都是 DTO，不应该将领域内部细节暴露给 User Interface 层。

那什么是领域内部细节呢？上面案例的 EntityId 这个类，是 Domain 层的一个值对象，是实体的唯一标识，这个是领域层内部非常细节的知识，User Interface 层调用任何方法时，都不应该了解这个 EntityId，所以 Application 层的方法入参是字符串类型的 entityId，而不是值对象 EntityId。

## 3. Application 层 DTO 分类

对于 Application 层的 DTO，按照其功能主要分为 3 类：

- Command

这一类 DTO 表示写操作（包括创建与更新），Command 内装载了写操作必需的参数。

入参为 Command 的应用层方法，代表将会引起领域对象状态的改变，如果执行成功应该返回空。

- Query

这一类 DTO 表示查询操作，Query 内装载查询参数。

入参为 Query 的方法，不会对领域对象进行状态变更，其方法的返回类型为 View（包括 `Page<View>`）或者基本类型。

- View

用于 Query 方法返回，包含 User Interface 层关注的信息。

总结如下表：

| DTO     | 用途                 | 返回信息  |
|---------|--------------------|-----------|
| Command | 领域对象状态变更操作 | void      |
| Query   | 领域对象查询操作     | View 对象 |
| View    | Query 查询结果封装   | /         |

示例代码如下：

```java
public interface ApplicationService{

    //这是一个会引起领域对象状态变更的方法，入参是command，返回void
    void userCase1(Command cmd);

    //这是一个不会引起领域对象状态变更的查询方法，入参是Query，返回结果是View，或者Page<View>
    View userCase2(Query query);
}
```

有的场景比较特殊，例如登录操作，登录成功后既要写库保存 token，又要在接口中返回 token，这类场景灵活处理即可。

关于有的 Repository 承载了过多查询职责的问题，未来会在 CQRS 章节中探讨解决方案；关于领域事件，后续也会在专门的章节做探讨。

## 4. Application 层保持单一职责

很多示例都会在 Application 层处理数据库事务，例如在 Application 层的方法上加`@Transactional`注解，这是需要探讨的。

首先，事务处理是数据库非常专业的术语，应该由专业的 Infrastructure 去负责，Application 层不应具备这个事务处理的能力；

其次，Application 层加了`@Transactional` 并不能确保一定没问题，因为里面还会涉及到领域事件的发布、外部 RPC 的调用，背过八股文的同学应该都知道；

最后，由于 Application 层要调用 Infrastructure 层，Infrastructure 层如果执行耗时过长，例如如 RPC 调用的耗时很长，导致事务迟迟不能 commit，进而引发性能问题。

推荐的实践是将事务控制下沉到 Infrastructure 层的 Repository 实现类中，即在 repository.save()方法上做事务控制。
