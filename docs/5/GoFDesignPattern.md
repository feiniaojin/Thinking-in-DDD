# 设计模式（GoF Design Pattern）

我们在创建领域对象时使用了工厂模式（部分还使用了建造者模式），其他的设计模式也完全可以应用在 DDD
中。本章选择部分设计模式直接举例，不会讲解设计模式的基本概念，这方面知识请读者自行预习。

## 1. 责任链模式

责任链模式的使用要点，在于要将维护责任链的代码与业务代码分开，提高代码可维护性。

在此推荐笔者提取自 Netty 的责任链框架 Pie，可以像使用 Netty 一样优雅的完成责任链模式。

GitHub 地址：https://github.com/feiniaojin/pie

### 1.1 快速入门

#### 1.1.1 引入 maven 依赖

pie 目前已打包发布到 maven 中央仓库，开发者可以直接通过 maven 坐标将其引入到项目中。

```xml

<dependency>
    <groupId>com.feiniaojin.ddd.ecosystem</groupId>
    <artifactId>pie</artifactId>
    <version>1.0</version>
</dependency>
```

> 请到 maven 中央仓库获得最新的版本

#### 1.1.2 实现出参工厂

出参也就是执行结果，一般的执行过程都要求有执行结果返回。实现 OutboundFactory 接口，用于产生接口默认返回值。

例如：

```java
public class OutFactoryImpl implements OutboundFactory {
    @Override
    public Object newInstance() {
        Result result = new Result();
        result.setCode(0);
        result.setMsg("ok");
        return result;
    }
}
```

#### 1.1.3 实现 handler 接口完成业务逻辑

在 pie 案例工程( https://github.com/feiniaojin/pie-example.git )的**Example1**中，为了展示 pie 的使用方法，实现了一个虚拟的业务逻辑：CMS
类项目修改文章标题、正文，大家不要关注修改操作放到两个 handler 中是否合理。

三个 Handler 功能如下：

**CheckParameterHandler**：用于参数校验。

**ArticleModifyTitleHandler**：用于修改文章的标题。

**ArticleModifyContentHandler**：用于修改文章的正文。

CheckParameterHandler 的代码如下：

```java
public class CheckParameterHandler implements ChannelHandler {

    private Logger logger = LoggerFactory.getLogger(CheckParameterHandler.class);

    @Override
    public void channelProcess(ChannelHandlerContext ctx,
                               Object in,
                               Object out) throws Exception {

        logger.info("参数校验:开始执行");

        if (in instanceof ArticleTitleModifyCmd) {
            ArticleTitleModifyCmd cmd = (ArticleTitleModifyCmd) in;
            String articleId = cmd.getArticleId();
            Objects.requireNonNull(articleId, "articleId不能为空");
            String title = cmd.getTitle();
            Objects.requireNonNull(title, "title不能为空");
            String content = cmd.getContent();
            Objects.requireNonNull(content, "content不能为空");
        }
        logger.info("参数校验:校验通过,即将进入下一个Handler");
        ctx.fireChannelProcess(in, out);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx,
                                Throwable cause,
                                Object in,
                                Object out) throws Exception {
        logger.error("参数校验:异常处理逻辑", cause);
        Result re = (Result) out;
        re.setCode(400);
        re.setMsg("参数异常");
    }
}
```

ArticleModifyTitleHandler 的代码如下：

```java
public class ArticleModifyTitleHandler implements ChannelHandler {

    private Logger logger = LoggerFactory.getLogger(ArticleModifyTitleHandler.class);

    @Override
    public void channelProcess(ChannelHandlerContext ctx,
                               Object in,
                               Object out) throws Exception {

        logger.info("修改标题:进入修改标题的Handler");

        ArticleTitleModifyCmd cmd = (ArticleTitleModifyCmd) in;

        String title = cmd.getTitle();
        //修改标题的业务逻辑
        logger.info("修改标题:title={}", title);

        logger.info("修改标题:执行完成,即将进入下一个Handler");
        ctx.fireChannelProcess(in, out);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx,
                                Throwable cause,
                                Object in,
                                Object out) throws Exception {
        logger.error("修改标题:异常处理逻辑");
        Result re = (Result) out;
        re.setCode(1501);
        re.setMsg("修改标题发生异常");
    }
}
```

ArticleModifyContentHandler 的代码如下：

```java
public class ArticleModifyContentHandler implements ChannelHandler {

    private Logger logger = LoggerFactory.getLogger(ArticleModifyContentHandler.class);

    @Override
    public void channelProcess(ChannelHandlerContext ctx,
                               Object in,
                               Object out) throws Exception {

        logger.info("修改正文:进入修改正文的Handler");
        ArticleTitleModifyCmd cmd = (ArticleTitleModifyCmd) in;
        logger.info("修改正文,content={}", cmd.getContent());
        logger.info("修改正文:执行完成,即将进入下一个Handler");
        ctx.fireChannelProcess(in, out);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx,
                                Throwable cause,
                                Object in,
                                Object out) throws Exception {

        logger.error("修改标题:异常处理逻辑");

        Result re = (Result) out;
        re.setCode(1502);
        re.setMsg("修改正文发生异常");
    }
}

```

#### 1.1.4 通过 BootStrap 拼装并执行

```java
public class ArticleModifyExample1 {

    private final static Logger logger = LoggerFactory.getLogger(ArticleModifyExample1.class);

    public static void main(String[] args) {
        //构造入参
        ArticleTitleModifyCmd dto = new ArticleTitleModifyCmd();
        dto.setArticleId("articleId_001");
        dto.setTitle("articleId_001_title");
        dto.setContent("articleId_001_content");

        //创建引导类
        BootStrap bootStrap = new BootStrap();

        //拼装
        Result result = (Result) bootStrap
                .inboundParameter(dto)//入参
                .outboundFactory(new ResultFactory())//出参工厂
                .channel(new ArticleModifyChannel())//自定义channel
                .addChannelHandlerAtLast("checkParameter", new CheckParameterHandler())//第一个handler
                .addChannelHandlerAtLast("modifyTitle", new ArticleModifyTitleHandler())//第二个handler
                .addChannelHandlerAtLast("modifyContent", new ArticleModifyContentHandler())//第三个handler
                .process();//执行
        //result为执行结果
        logger.info("result:code={},msg={}", result.getCode(), result.getMsg());
    }
}
```

#### 1.1.5 执行结果

以下是运行 ArticleModifyExample1 的 main 方法打出的日志，可以看到我们定义的 handler 被逐个执行了。

[![vKSLpq.png](https://s1.ax1x.com/2022/08/07/vKSLpq.png)](https://imgtu.com/i/vKSLpq)

### 1.2 DDD中使用责任链框架Pie

在DDD中使用责任链，要注意不能将责任链的维护放在应用服务（Application Service）或者领域模型中，应该创建一个领域服务接口，在领域服务中完成责任链创建和执行。

举例子如下：

```java
/**
 * 发布内容的领域服务
 */
public class PublishService {


    /**
     * 领域服务
     */
    public void publish(Article article) {

        //创建引导类
        BootStrap bootStrap = new BootStrap();

        //拼装并执行
        bootStrap.inboundParameter(article)//入参
                .outboundFactory(new ResultFactory())//出参工厂
                .addChannelHandlerAtLast("IllegalTextDetection", new IllegalTextDetectionHandler())//违规文字检测
                .addChannelHandlerAtLast("IntelligentAuditing", new IntelligentAuditingHandler())//智能检测
                .addChannelHandlerAtLast("CompletePublish", new CompletePublishHandler())//完成发布，修改发布状态
                .process();//执行
    }
}
```

