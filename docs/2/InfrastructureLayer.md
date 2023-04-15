# Infrastructure 层的实现细节

Infrastructure 层为 Domain 层定义的领域支撑组件提供实现，在 Application 层的协调下提供基础设施支持。

## 1. 不擅自引入新的领域知识

Domain 层定义了很多支撑领域模型完成业务操作组件，Infrastructure 层对这些已经定义好的组件提供实现。

如果某个组件未在 Domain 层定义，Infrastructure 层就不应该暴露给 Application 层使用。

## 2. 封装 Infrastructure 层内部知识

Infrastructure 层通过实现 Domain 层定义的组件为 Aplication 层提供服务，并且 Application 层只能使用 Domain 包中定义的组件。Infrastructure 在实现这些组件时，不应该要求 Application 层掌握 Infrastructure 层的内部知识。

举个例子，对于我们常用的 ORM 框架 MyBatis，我们有时候需要实现一个 Interceptor，例如一个用于打印 SQL 的 Interceptor，那么这个打印 SQL 的 Interceptor 就应该在 infrastructure-persistence 这个包内，不应该放置在 Application 层或者 User Interface 层。

Infrastructure 层中间件的配置信息，也应该放置在这一层，并提供修改配置值的途径。

举一些例子：

infrastructure-persistence 对应的数据库配置、分库分表配置应该本层；

Infrastructure-Cache 如果用到了 Redis，那么 Redis 客户端的Java配置文件也应该放在本层；

Infrastructure-Consumer 包需要配置调用远程服务的 token，因此提供一个RpcConfig用于装载配置项。

RpcConfig 这个配置文件留在本包内，但是预留了 infrastructure.rpc.token 这个配置项，可以在启动包的 application.properties 文件中更改：

```java
public class RpcConfig{

  @Value("${infrastructure.rpc.token}")
  private String token;

  //省略其他代码……
}
```

## 3. Infrastructure 层返回值先在 Domain 层定义

Infrastructure 层的返回值是 Domain 层执行业务逻辑所必须的，Infrastructure 层的返回值应先在 Domain 层定义。

Infrastructure 层不允许返回 Infrastructure 层执行的过程对象，更不应该返回外部系统定义的类型，应当封装好再返回，这样 Infrastructure 层可以充当防腐层（ACL）的角色。

举个例子：

如果我们系统需要用户的地址查询地理位置信息，我们不能直接使用外部地理位置信息接口定义的类型，而是应该先在 Domain 层定义一个我们自己的地理位置信息类，然后将接口返回的属性拷贝到我们自己的地理位置信息类中。

假设我们用了外部接口的类型，下次外部系统重构升级调整了包结构或者其他类型信息，很容易就造成己方系统改动过大，每个引用该类型的地方的都需要改动。

如果我们自己定义了一个地理位置信息类型，我们只需要改动调用该接口的适配器，即可完成升级替换。
