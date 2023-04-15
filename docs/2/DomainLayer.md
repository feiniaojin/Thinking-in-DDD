# Domain 层的实现细节

Domain 层实现的关键是要确保领域知识的完备，主要需要注意几点：

## 1. 领域相关组件先定义后使用

领域模型相关的组件，例如 Factory、Repository，都应该先在 Domain 包进行定义，然后在 Application 层或者 Infrastructure 层实现，而不是没有定义就直接提供给上层。

通过阅读 Domain 的代码，就应该能了解领域相关的所有组件。

## 2. 领域知识内部闭环

领域模型相关的组件，其方法的入参、出参，必须是领域对象（实体、值对象）或者基本类型。一定要避免引入 ORM 用的数据模型（Data Object）和数据传输对象(DTO)，因为这两种都不是领域对象。

## 3. 按照限界上下文分包

Domain 层根据限界上下文分包，把所有的领域知识放到限界上下文对应的包下即是最佳实践，没必要再根据对象的用途做分包。

如果可以预料某种子类会很多（例如 Command、Query），可以建立子包，但是应避免一个类创建一个包。

以下是一种分包方式，可以看到很多包只有一个类，这样分包虽然看起来很清晰，但是其实跟不分包是一样的。

不是说把包分得很细就不好，分包主要是为了归类或者封装，一个类一个包并没有达到这两个目的。

以下是我个人的分包方式：

可以看到，除了可能存在很多的值对象单独分包了，其他都是一股脑放在 aaa 这个上下文的包根路径下。

可以感受一下 java.util 包：

![](https://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/0d278f053f3f4178be89924c9ff9cf3d~noop.image?_iz=58558&from=article.pc_detail&x-expires=1675792835&x-signature=8mxiBNb3Wc5R3KKYMYoiSWHsnpo%3D)JDK 中 java.util 包

## 4. 实体、值对象内部不引用基础设施组件

领域驱动设计采用充血模型，大部分的业务逻辑由领域对象承接。

领域对象执行业务逻辑所需要的必要参数，应当在方法的入参传入，而不是在领域对象内部产生。

领域对象不应该在自己内部手工调用基础设施以获取执行参数或者持久化自己，这样会导致领域模型的方法职责不再单一，这样做其实又变成了贫血模型。

应当在Application层中调用基础设施或者持久化。

以下是反例：

```java

public class Entity{

    EntityId entityId;

    InfrastructureRpc rpc;

    Repository repository;

    //值对象，领域基本类型，DP
    SomeValue someValue;

    //省略其他属性……

    public void bizOperate(){

        //执行业务操作时，内部调了基础设施rpc取某个值
        this.someValue=rpc.getSomeValue(this.entityId.getString());

        //TODO 此处是业务逻辑代码，省略

        //持久化自己
        repository.save(this);
        //TODO 后续其他操作，略
    }

}

```

以下是推荐实践：

```java
public class Entity{
    EntityId entityId;

    //执行业务操作时需要的数据，在Application层准备好，再从方法传入
    public void bizOperate(SomeValue someValue){
        //使用入参做一系列操作，不会在领域模型调用基础设施层
    }
}


public class ApplicationService{

  Repository repository;
  InfrastructureRpc rpc;

  public void bizOperate(BizCommand command){
        //加载实体
        Entity entity =  repository.load(new EntityId(command.getEntityIdValue()));
        //准备实体执行业务所需的SomeValue
        SomeValue someValue=rpc.getSomeValue(entity.getEntityId());
        //将SomeValue传递给实体执行操作
        entity.bizOperate(someValue);
        repository.save(entity);
        //省略后续操作
  }
}
```
