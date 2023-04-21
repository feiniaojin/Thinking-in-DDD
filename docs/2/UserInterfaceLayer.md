# User Interface 层的实现细节

User Interface 层通过某种协议将应用层的用例暴露给用户。这里的用户，可能是自然人，也可能是其他外部系统。

用户接口层的入参出参，有可能复用 Application 层的入参出参（Command、Query、View），也有可能将需要将 Application 层的入参出参做转换。

一般通过 HTTP/REST 对外提供的接口，直接复用 Application 层的入参出参即可，因为最终都会转成 JSON 字符串，JSON 字符串不要求具体的类型信息。

而通过 RPC 对外提供的服务的接口，consumer 方往往要求 provider 方提供入参出参类型信息，为了不暴露 Application 层的编码细节，这就需要抽象一个公共的 jar 包，jar 包内提供独立接口和 DTO。

示例：

假设有一个需求需要我们提供一个 RPC 接口，用于验证当天是否是用户生日。

首先，定义了一个 jar 包，假设是以下的包：

```xml
<dependency>
    <groupId>com.feiniaojin.ddd</groupId>
    <artifactId>user-api</artifactId>
    <version>1.0.0</version>
</dependency>
```

由于我们不能直接暴露 Application 层的类型，所以我们在这个包里定义了入参出参的 DTO 和接口，如下：

```java
//请求对象
public class BirthdayQueryRequest implements Serializable{

    private String uid;

    //get&set
}


//响应对象
public class BirthdayViewResponse implements Serializable{

    private Boolean todayIsBirthday;

    //get&set
}


//定义的接口
public interface UserBirthdayQueryApi{

    Response<BirthdayViewResponse> checkUserBirthday(BirthdayQueryRequest req);
}
```

我们在用户接口层引入这个 Jar 包，并实现这个接口，在此省略日志、异常处理和监控等逻辑。

```java
public class UserBirthdayQueryApiImpl implements UserBirthdayQueryApi{

    private ApplicationService applicationService;

    Response<BirthdayViewResponse> checkUserBirthday(BirthdayQueryRequest req){
        //转成应用层的Query对象
        BirthdayQuery query=propertyMapper.mapping(req);
        //执行查询，获得View对象
        BirthdayView view=applicationService.checkUserBirthday(query);
        //转成接口响应类型
        BirthdayViewResponse bvr=propertyMapper.mapping(view);
        //封装返回结果
        return Response.success(bvr);
    }
}
```

有时候接口的调用会涉及到鉴权，也建议将鉴权逻辑实现在用户接口层。

原因是对于 Application 层的同一个方法，可能在 Interfaces-Web 和 Interfaces-Provider 等多个模块都有调用，鉴权是跟调用场景密切相关的，一般只对外部调用做鉴权，鉴权逻辑放置在 Application 层会对所有的调用来源进行鉴权。
