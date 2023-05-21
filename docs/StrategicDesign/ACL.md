# 防腐层(Anti-Corruption Layer)

## 1. 防腐层的概念理解

多个上下文进行交互时会涉及到多个领域模型，如果我们直接将外部上下文的模型引入到本地上下文，往往会出现很多问题，比如命名冲突、数据类型不匹配、业务逻辑不一致、外部上下文模型变更导致本地上下文模型改动等等。为了屏蔽外部上下文的领域模型，避免其污染本地模型，我们使用防腐层解决引用外部上下文模型的问题。

防腐层（Anti-Corruption Layer，ACL）是 DDD 中的一个重要概念，是一种隔离外部上下文、确保本地上下文中的领域模型能够保持独立和纯净的方法。

防腐层通过一系列的转换和映射来将外部的数据转换为本地限界上下文的领域模型所需要的数据格式，即使外部系统和服务发生了变化，本地上下文也不会受到影响。

举个例子，有 A 和 B 两个上下文，其中 B 通过开放主机服务提供对外访问，A 上下文请求 B 上下文的 RPC 接口时，B 将会返回一个模型，如果 A 直接在领域模型中引用 B 返回的模型，将会早上 A 上下文被污染。

B 上下文对外提供的 RPC 接口：

```java
/**
 * B上下文对外暴露的查询服务，查询
 */
public interface BRpcQueryService{

    Response<BView> query(Query query);
}
```

```java
public class BView{
    private Integer property1;
    private String property2;
    //省略其他属性以及get/set方法
}
```

当 A 调用`ContextBQueryService`的`query1`方法，将会得到`BView`这个类。如果 A 的领域模型直接引用了 BView，将会导致 A 自己的上下文被污染，容易引发很多问题：

- 类级别的：随着 B 上下文的迭代，可能 BView 这个类路径、名称、属性名等都会改变。举个例子，B 上下文可能会进行系统重构，重构时会重新发布一个新的 jar 包，要求调用方切换到的新的 jar 包上，这个情况在我实际工作中遇到的不少。如果直接将 BView 引入到本地上下文中，A 将需要进行大量的改动，并且需要大量回归测试才能确保切换无风险。

- 属性级别的：BView 中的某个属性的类型与 A 上下文中对应的属性类型并不一致，因而使用时必须进行强转；BView 中某个字段的名称与本地上下文某个字段的名称相同，调用时容易引起歧义，例如我在工作中遇到过外部接口返回的模型中有个`source`字段，本地领域模型中也有一个`source`字段，但是两者的含义并不一致。

## 2. 防腐层的设计与实现

防腐层的设计和实现并不难，主要注意一下要点：

- 防腐层方法返回值必须是本地上下文的值对象或者基本数据类型，不得返回外部上下文的模型

伪代码如下：

```java

public class BContextGateway{

    private BRpcQueryService bRpc;

    public SomeValue queryFromBContext(Prams params){
        //封转查询报文
        Query query=this.fromPrams(params);
        //执行查询
        Response<BView> bResponse=bRpc.query(query);
        //忽略判空、查询失败等逻辑
        BView bView=bResponse.getData();
        //重点：封装本地上下文的值对象进行返回
        return new SomeValue(bView.getProperty1());
    }
}

```

- 防腐层方法要捕获外部异常，并抛出的本地上下文自定义的异常

伪代码例子：

```java

public class BContextGateway{

    private BRpcQueryService bRpc;

    public SomeValue queryFromBContext(Prams params){
        //封转查询报文
        Query query=this.fromPrams(params);
        Response<BView> bResponse;
        try{
            //查询结果
            bResponse=bRpc.query(query);
        }catch(Exception e){
            //重点：捕获异常，并抛出本地自定义的异常
            throw new QueryContextBException();
        }
        //省略其他逻辑
    }
}
```

- 外部上下文返回的错误码，应该转化成本地异常进行抛出，不应该将错误码返回给上层

```java

public class BContextGateway{

    private BRpcQueryService bRpc;

    public SomeValue queryFromBContext(Prams params){
        //封转查询报文
        Query query=this.fromPrams(params);
        //执行查询
        Response<BView> bResponse=bRpc.query(query);

        //重点：根据错误码时抛出本地自定义的异常
        if("1".equals(bResponse.getCode())){
            throw new QueryContextBException();
        }
        //忽略其他逻辑
    }
}

```

- 按需返回，只返回需要的字段或者数据类型。只返回需要的字段，这个很好理解不用过多解释；只返回需要的数据类型，举个例子，外部上下文可能返回字符串的 0 和 1 代表 false 和 true，但是我们本地是使用布尔类型的，因此要在防腐层转换好再返回。

```java
public class BContextGateway{

    private BRpcQueryService bRpc;

    public Boolean checkFromBContext(Prams params){
        //封转查询报文
        Query query=this.fromPrams(params);
        //执行查询
        Response<Integer> bResponse=bRpc.check(query);

        //重点：查询失败，根据错误码时抛出本地自定义的异常
        if("ERROR".equals(bResponse.getCode())){
            throw new QueryContextBException();
        }
        //转换成需要的布尔类型进行返回
        return "1".equals(bResponse.getData());
    }
}
```

<!--@include: ../footer.md-->
