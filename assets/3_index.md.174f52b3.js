import{_ as s,c as n,o as a,a as p}from"./app.1136664d.js";const D=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[{"level":2,"title":"一、Domain层的实现","slug":"一、domain层的实现","link":"#一、domain层的实现","children":[{"level":3,"title":"1.领域组件先定义后使用","slug":"_1-领域组件先定义后使用","link":"#_1-领域组件先定义后使用","children":[]},{"level":3,"title":"2.领域知识内部闭环","slug":"_2-领域知识内部闭环","link":"#_2-领域知识内部闭环","children":[]},{"level":3,"title":"3.按照限界上下文分包","slug":"_3-按照限界上下文分包","link":"#_3-按照限界上下文分包","children":[]},{"level":3,"title":"4.实体、值对象内部不引用基础设施组件","slug":"_4-实体、值对象内部不引用基础设施组件","link":"#_4-实体、值对象内部不引用基础设施组件","children":[]}]},{"level":2,"title":"二、Infrastructure层的实现","slug":"二、infrastructure层的实现","link":"#二、infrastructure层的实现","children":[{"level":3,"title":"1.不擅自引入新的领域知识","slug":"_1-不擅自引入新的领域知识","link":"#_1-不擅自引入新的领域知识","children":[]},{"level":3,"title":"2.封装Infrastructure层内部知识","slug":"_2-封装infrastructure层内部知识","link":"#_2-封装infrastructure层内部知识","children":[]},{"level":3,"title":"3.Infrastructure层返回值先在Domain层定义","slug":"_3-infrastructure层返回值先在domain层定义","link":"#_3-infrastructure层返回值先在domain层定义","children":[]}]},{"level":2,"title":"三、Application层的实现","slug":"三、application层的实现","link":"#三、application层的实现","children":[{"level":3,"title":"1.Application层的类型流转","slug":"_1-application层的类型流转","link":"#_1-application层的类型流转","children":[]},{"level":3,"title":"2.Application层DTO分类","slug":"_2-application层dto分类","link":"#_2-application层dto分类","children":[]},{"level":3,"title":"3.Application层保持单一职责","slug":"_3-application层保持单一职责","link":"#_3-application层保持单一职责","children":[]}]},{"level":2,"title":"四、User Interface层实现","slug":"四、user-interface层实现","link":"#四、user-interface层实现","children":[]}],"relativePath":"3/index.md"}'),l={name:"3/index.md"},e=p(`<p>本文是领域驱动设计落地系列文章的第三篇。</p><p>书接上文，通过对经典三层架构进行演化，得到了我们DDD落地的架构，如下图：</p><p><img src="https://mmbiz.qpic.cn/sz_mmbiz_png/sNtDzfAUItK313RJRrurur44vqIjmIOzap0jVqlMv9TOoGdPia6Ce2g7aAyxSibB5adHX91zY9Oe5ToiaiaPBuVcgA/640?wx_fmt=png&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1" alt="图片"></p><p>项目架构只是大方向上的骨架，要使其有机运作起来还需要肌肉以及流动的血液。</p><p>所谓肌肉，就是这个骨架每个模块的详细实现；所谓血液，则是数据类型在各个模块间的流转。</p><p>本文主要讲解项目各个模块的详细实现，也就是“肌肉”。</p><p>话不多说，现在我们从项目架构出发，逐个模块进行讲解。</p><h2 id="一、domain层的实现" tabindex="-1">一、Domain层的实现 <a class="header-anchor" href="#一、domain层的实现" aria-hidden="true">#</a></h2><p>Domain层实现的关键是要确保领域知识的完备，主要需要注意几点：</p><h3 id="_1-领域组件先定义后使用" tabindex="-1">1.领域组件先定义后使用 <a class="header-anchor" href="#_1-领域组件先定义后使用" aria-hidden="true">#</a></h3><p>领域模型相关的组件，例如Factory、Repository，都应该先在Domain包进行定义，然后在Application层或者Infrastructure层实现，而不是没有定义就直接提供给上层。</p><p>通过阅读Domain的代码，就应该能了解领域相关的所有组件，避免知识分散导致维护成本过大。</p><h3 id="_2-领域知识内部闭环" tabindex="-1">2.领域知识内部闭环 <a class="header-anchor" href="#_2-领域知识内部闭环" aria-hidden="true">#</a></h3><p>领域模型相关的组件，其方法的入参、出参，必须是领域对象（实体、值对象）或者基本类型。一定要避免引入ORM用的数据模型（data object）和数据传输对象(dto)，因为这两种都不是领域对象。</p><h3 id="_3-按照限界上下文分包" tabindex="-1">3.按照限界上下文分包 <a class="header-anchor" href="#_3-按照限界上下文分包" aria-hidden="true">#</a></h3><p>Domain层根据限界上下文分包，把所有的领域知识放到限界上下文对应的包下即是最佳实践，没必要再根据对象的用途做分包。</p><p>如果可以预料某种子类会很多（例如Command、Query），可以建立子包，但是应避免一个类创建一个包。</p><p>以下是一种分包方式，可以看到很多包只有一个类，这样分包虽然看起来很清晰，但是其实跟不分包是一样的。</p><p><img src="https://mmbiz.qpic.cn/sz_mmbiz_png/sNtDzfAUItJnttB21ibUo8n2NViaic28LRE9CMFicb9icP96ISxajQ3l5zyefIgpVk7jO4RjeaHMk5dhH410Dia3icpCw/640?wx_fmt=png&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1" alt="图片"></p><p>不是说把包分的很细就不好，分包主要是为了归类或者封装，一个类一个包并没有达到这两个目的。</p><p>以下是我个人的分包方式：</p><p><img src="https://mmbiz.qpic.cn/sz_mmbiz_png/sNtDzfAUItJnttB21ibUo8n2NViaic28LREK6JxiaCzeoleT90A1yhGjGs45D0VP6wglRBpPbfAgbLXn5Cmkvyvj9Q/640?wx_fmt=png&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1" alt="图片"></p><p>可以看到，除了可能存在很多的值对象单独分包了，其他都是一股脑放在aaa这个上下文的包根路径下。</p><p>可以感受一下java.util包：</p><p><img src="https://mmbiz.qpic.cn/sz_mmbiz_png/sNtDzfAUItJnttB21ibUo8n2NViaic28LREpUnAtAN4wQWwricXwibYcN6ISyvpyQsvmUIPB5sUo52OLCnxdClBM3bQ/640?wx_fmt=png&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1" alt="图片"></p><h3 id="_4-实体、值对象内部不引用基础设施组件" tabindex="-1">4.实体、值对象内部不引用基础设施组件 <a class="header-anchor" href="#_4-实体、值对象内部不引用基础设施组件" aria-hidden="true">#</a></h3><p>领域驱动设计采用充血模型，大部分的业务逻辑由领域对象承接。</p><p>领域对象执行业务逻辑所需要的必要参数，应当在方法的入参传入，而不是在领域对象内部产生。</p><p>领域对象不应该在自己内部手工调用基础设施以获取执行参数或者持久化自己，这样会导致领域模型的方法职责不再单一，这样做其实又变成了贫血模型。</p><p>基础设施千变万化，假如需要引入新的基础设施，需要做很大的变更。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">//以下是反例</span></span>
<span class="line"><span style="color:#A6ACCD;">public class Entity{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    EntityId entityId;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    InfrastructureRpc rpc;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    Repository repository;</span></span>
<span class="line"><span style="color:#A6ACCD;">    //值对象，领域基本类型，DP</span></span>
<span class="line"><span style="color:#A6ACCD;">    SomeValue someValue;</span></span>
<span class="line"><span style="color:#A6ACCD;">    ……</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public void bizOperate(){</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        //执行业务操作时，内部调了基础设施rpc取某个值</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.someValue=rpc.getSomeValue(this.entityId.getString());</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        //此处是业务逻辑代码，省略</span></span>
<span class="line"><span style="color:#A6ACCD;">        ……</span></span>
<span class="line"><span style="color:#A6ACCD;">        //持久化自己</span></span>
<span class="line"><span style="color:#A6ACCD;">        repository.save(this);</span></span>
<span class="line"><span style="color:#A6ACCD;">        //后续其他操作，略  </span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">//分割线</span></span>
<span class="line"><span style="color:#A6ACCD;">//以下是推荐实践</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">public class Entity{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    EntityId entityId;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    ……</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    //执行业务操作时需要的数据，在Application层准备好，再从方法传入</span></span>
<span class="line"><span style="color:#A6ACCD;">    public void bizOperate(SomeValue someValue){</span></span>
<span class="line"><span style="color:#A6ACCD;">          //使用入参做一系列操作  </span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">public class ApplicationService{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  Repository repository;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  InfrastructureRpc rpc;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void bizOperate(BizCommand command){</span></span>
<span class="line"><span style="color:#A6ACCD;">        //加载实体</span></span>
<span class="line"><span style="color:#A6ACCD;">        Entity entity =  repository.load(new EntityId(command.getEntityIdValue()));</span></span>
<span class="line"><span style="color:#A6ACCD;">        //准备实体执行业务所需的SomeValue</span></span>
<span class="line"><span style="color:#A6ACCD;">        SomeValue someValue=rpc.getSomeValue(entity.getEntityId());</span></span>
<span class="line"><span style="color:#A6ACCD;">        //将SomeValue传递给实体执行操作</span></span>
<span class="line"><span style="color:#A6ACCD;">        entity.bizOperate(someValue);</span></span>
<span class="line"><span style="color:#A6ACCD;">        repository.save(entity);</span></span>
<span class="line"><span style="color:#A6ACCD;">        ……</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="二、infrastructure层的实现" tabindex="-1">二、Infrastructure层的实现 <a class="header-anchor" href="#二、infrastructure层的实现" aria-hidden="true">#</a></h2><p>Infrastructure层为Domain层定义的领域支撑组件提供实现，主要有几点需要注意：</p><h3 id="_1-不擅自引入新的领域知识" tabindex="-1">1.不擅自引入新的领域知识 <a class="header-anchor" href="#_1-不擅自引入新的领域知识" aria-hidden="true">#</a></h3><p>Domain层定义了很多领域支撑组件，Infrastructure层对这些已经定义好的组件提供实现。如果某个组件未在Domain层定义，Infrastructure层不应绕开Domain层而将其暴露给应用层使用。</p><h3 id="_2-封装infrastructure层内部知识" tabindex="-1">2.封装Infrastructure层内部知识 <a class="header-anchor" href="#_2-封装infrastructure层内部知识" aria-hidden="true">#</a></h3><p>举个例子，对于我们常用的ORM框架MyBatis，我们有时候需要实现一个Interceptor，例如一个用于打印SQL的Interceptor，那么这个打印SQL的Interceptor就应该在Infrastructure-Persistence包内，不应该放置在Application层或者User Interface层。</p><p>Infrastructure层中间件的配置信息，也应该放置在这一层，并提供修改配置值的途径。</p><p>举个例子，Infrastructure-Persistence对应的数据库配置、分库分表配置应该本层；Infrastructure-Cache如果用到了Redis，那么Redis客户端的配置文件也应该放在本层。Infrastructure-Consumer包需要配置调用远程服务的token，所以RpcConfig这个配置文件留在本包内，但是预留了 <code>infrastructure.rpc.token</code>这个配置项，可以在启动包的application.properties文件中更改：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class RpcConfig{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  @Value(&quot;\${infrastructure.rpc.token}&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">  private String token;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  ……</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h3 id="_3-infrastructure层返回值先在domain层定义" tabindex="-1">3.Infrastructure层返回值先在Domain层定义 <a class="header-anchor" href="#_3-infrastructure层返回值先在domain层定义" aria-hidden="true">#</a></h3><p>Infrastructure层的返回值是Domain层执行业务逻辑所必须的，Infrastructure层的返回值应先在Domain层定义。</p><p>Infrastructure层不允许返回Infrastructure层执行的过程对象，更不应该返回外部系统定义的类型，应当封装好再返回，这样Infrastructure层可以充当防腐层（ACL）的角色。</p><p>举个例子：</p><p>如果我们系统需要用户的地址查询地理位置信息，我们不能直接使用外部地理位置信息接口定义的类型，而是应该先在Domain层定义一个我们自己的地理位置信息类，然后将接口返回的属性拷贝到我们自己的地理位置信息类中。</p><p>假设我们用了外部接口的类型，下次外部系统重构升级调整了包结构或者其他类型信息，很容易就造成己方系统改动过大，每个引用该类型的地方的都需要改动。</p><p>如果我们自己定义了一个地理位置信息类型，我们只需要改动调用该接口的适配器，即可完成升级替换。</p><h2 id="三、application层的实现" tabindex="-1">三、Application层的实现 <a class="header-anchor" href="#三、application层的实现" aria-hidden="true">#</a></h2><p>Application层将用例入参转化为领域知识，但Application层不应了解Domain层内部的业务逻辑，Application层只为领域对象提供执行业务逻辑的先决条件。</p><h3 id="_1-application层的类型流转" tabindex="-1">1.Application层的类型流转 <a class="header-anchor" href="#_1-application层的类型流转" aria-hidden="true">#</a></h3><p>Application层方法的入参是各种各样的DTO。这些DTO并不是领域模型，Application层要通过DTO携带的关键参数，调用领域基础设施组件，获得聚合根对象，再将DTO中其他的参数翻译成领域知识，再交给聚合根执行业务逻辑。</p><p>这里有两种场景：一种是实体不存在，需要通过Factory创建；一种是实体已存在，则需要通过Repository加载。</p><p>以下是示例：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class ApplicationService{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    /**</span></span>
<span class="line"><span style="color:#A6ACCD;">    * 实体不存在</span></span>
<span class="line"><span style="color:#A6ACCD;">    */</span></span>
<span class="line"><span style="color:#A6ACCD;">    public void newEntity(CreateCommand command){</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">          //factory了解创建的全部知识，例如factory才知道唯一标识ID是如何生成的</span></span>
<span class="line"><span style="color:#A6ACCD;">          Entity entity=factory.newInstance(new Value1(command.getProperty1()),</span></span>
<span class="line"><span style="color:#A6ACCD;">                              new Value2(command.getProperty2());</span></span>
<span class="line"><span style="color:#A6ACCD;">          //初始化，并生成初始化事件</span></span>
<span class="line"><span style="color:#A6ACCD;">          entity.init();</span></span>
<span class="line"><span style="color:#A6ACCD;">          //保存实体</span></span>
<span class="line"><span style="color:#A6ACCD;">          repository.save(entity);</span></span>
<span class="line"><span style="color:#A6ACCD;">          //抽取事件发布出去</span></span>
<span class="line"><span style="color:#A6ACCD;">          publisher.publish(entity.domainEvents());</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    /**</span></span>
<span class="line"><span style="color:#A6ACCD;">    * 实体已存在</span></span>
<span class="line"><span style="color:#A6ACCD;">    */</span></span>
<span class="line"><span style="color:#A6ACCD;">    public void modifyEntity(ModifyCommand cmd){</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        //repository根据唯一标识加载实体</span></span>
<span class="line"><span style="color:#A6ACCD;">        Entity entity=repository.load(new EntityId(cmd.getProperty0()));</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        //实体执行业务操作</span></span>
<span class="line"><span style="color:#A6ACCD;">        entity.bizOperate(new Value1(cmd.getProperty1()),</span></span>
<span class="line"><span style="color:#A6ACCD;">                              new Value2(cmd.getProperty2()));</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        //repository保存实体</span></span>
<span class="line"><span style="color:#A6ACCD;">        repository.save(entity);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        //抽取事件发布出去</span></span>
<span class="line"><span style="color:#A6ACCD;">        publisher.publish(entity.domainEvents());</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>上面代码中，repository完成保存操作之后，事务已经提交，后续如果系统宕机，如何确保领域事件能正常补偿发出去，我们未来会在单独的章节进行探讨。</p><p>有很多的案例在应用层直接将DTO转成聚合根，然后由这个聚合根执行业务操作，这是有问题的。首先，聚合根的获得，要么是通过领域层定义的Factory创建，要么是通过Respository加载，不能任意一个DTO来了都能转成聚合根，如果每个DTO都要转一次聚合根，那么相当于聚合根创建和获取的知识没有得到封装，所有人都需要理解聚合根的创建过程，每新增一个DTO都要配备一个装配器；其次，转过来的聚合根通常不具备完整的状态数据，要投入更多的精力才能确保正确执行业务逻辑。</p><p>以下是不推荐的示例：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class ApplicationService{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    /**</span></span>
<span class="line"><span style="color:#A6ACCD;">    * 不推荐的编码实践</span></span>
<span class="line"><span style="color:#A6ACCD;">    */</span></span>
<span class="line"><span style="color:#A6ACCD;">    public void modifyDomain(ModifyCommand cmd){</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        //不推荐直接将cmd转成聚合，会导致每个cmd都要有一个converter</span></span>
<span class="line"><span style="color:#A6ACCD;">        //并且直接转过来的属性不一定完整</span></span>
<span class="line"><span style="color:#A6ACCD;">        Aggregate aggregate=converter.convert(cmd);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        aggregate.bizOperate(new Value1(cmd.getProperty1()),</span></span>
<span class="line"><span style="color:#A6ACCD;">                              new Value2(cmd.getProperty2()));</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        ……</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>Application层的方法，入参出参都是DTO，不应该将领域细节暴露给User Interface层。</p><p>那什么是领域细节呢？上面案例的EntityId这个类，是Domain层的一个值对象，是实体的唯一标识，这个是领域层内部非常细节的知识，User Interface层调用任何方法时，不应该需要了解这个EntityId，所以Application层的方法入参是字符串类型的entityId，而不是值对象EntityId。</p><h3 id="_2-application层dto分类" tabindex="-1">2.Application层DTO分类 <a class="header-anchor" href="#_2-application层dto分类" aria-hidden="true">#</a></h3><p>对于Application层的DTO，按照其功能主要分为3类：</p><p>Command，这一类DTO表示写操作（包括创建与更新），Command内装载了写操作必需的参数。入参为Command的应用层方法，代表将会引起领域对象状态的改变，如果执行成功应该返回空；</p><p>Query，这一类DTO表示查询操作，Query内装载查询参数。入参为Query的方法，不会对领域对象进行状态变更，技术上理解是幂等的，其方法的返回类型为View（包括Page <code>&lt;View&gt;</code>）或者基本类型；</p><p>View，用于Query方法返回，包含用户接口层关注的所有信息。</p><table><thead><tr><th>DTO</th><th>用途</th><th>返回信息</th></tr></thead><tbody><tr><td>Command</td><td>领域对象状态变更操作</td><td>void</td></tr><tr><td>Query</td><td>领域对象查询操作</td><td>View对象</td></tr><tr><td>View</td><td>Query查询结果封装</td><td>/</td></tr></tbody></table><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public interface ApplicationService{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    //这是一个会引起领域对象状态变更的方法，入参是command，返回void</span></span>
<span class="line"><span style="color:#A6ACCD;">    void userCase1(Command cmd);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    //这是一个不会引起领域对象状态变更的查询方法，入参是Query，返回结果是View，或者Page&lt;View&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    View userCase2(Query query);</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>有的场景比较特殊，例如登录操作，登录成功后既要写库保存token，又要在接口中返回token，这类场景灵活处理即可。</p><p>关于有的Repository承载了过多查询职责的问题，未来会在CQRS章节中探讨解决方案；关于领域事件，后续也会在专门的章节做探讨。</p><h3 id="_3-application层保持单一职责" tabindex="-1">3.Application层保持单一职责 <a class="header-anchor" href="#_3-application层保持单一职责" aria-hidden="true">#</a></h3><p>很多示例都会在Application层处理数据库事务，例如在Application层的方法上加 <code>@Transactional</code>注解，这是需要探讨的。</p><p>首先，事务是Infrastructure层的职责，事务处理是数据库非常专业的术语，Application层不应具备这个事务处理的知识；</p><p>其次，Application层加了 <code>@Transactional</code>并不能确保一定没问题，因为里面还会涉及到领域事件的发布、外部RPC的调用，背过八股文的同学应该都知道；</p><p>最后，由于Application层要调用Infrastructure层，Infrastructure层如果执行耗时过长，例如如RPC调用的耗时很长，导致事务迟迟不能commit，进而引发性能问题。</p><p>推荐的实践是将事务控制下沉到Infrastructure层的Repository实现类中，即在repository.save()方法上做事务控制。</p><h2 id="四、user-interface层实现" tabindex="-1">四、User Interface层实现 <a class="header-anchor" href="#四、user-interface层实现" aria-hidden="true">#</a></h2><p>User Interface层通过某种协议将应用层的用例暴露给用户。这里的用户，可能是自然人，也可能是其他外部系统。</p><p>用户接口层的入参出参，有可能复用Application层的入参出参（Command、Query、View），也有可能将需要将Application层的入参出参做转换。</p><p>一般通过HTTP/REST对外提供的接口，直接复用Application层的入参出参即可，因为最终都会转成JSON字符串，JSON字符串不要求具体的类型信息。</p><p>而通过RPC对外提供的服务的接口，consumer方往往要求provider方提供入参出参类型信息，为了不暴露Application层的编码细节，这就需要抽象一个公共的jar包，jar包内包括接口和DTO。</p><p>示例：</p><p>假设有一个需求需要我们提供一个RPC接口，用于验证当天是否是用户生日。</p><p>首先，定义了一个jar包，假设是以下的包：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">&lt;dependency&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;groupId&gt;com.feiniaojin.ddd&lt;/groupId&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;artifactId&gt;user-api&lt;/artifactId&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;version&gt;1.0.1&lt;/version&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">&lt;/dependency&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>由于我们不能直接暴露Application层的类型，所以我们在这个包里定义了入参出参的DTO和接口，如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">//请求对象</span></span>
<span class="line"><span style="color:#A6ACCD;">public class BirthdayQueryRequest implements Serializable{</span></span>
<span class="line"><span style="color:#A6ACCD;">    private String uid;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    //get&amp;set</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">//响应对象</span></span>
<span class="line"><span style="color:#A6ACCD;">public class BirthdayViewResponse implements Serializable{</span></span>
<span class="line"><span style="color:#A6ACCD;">    private Boolean todayIsBirthday;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    //get&amp;set</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">//定义的接口</span></span>
<span class="line"><span style="color:#A6ACCD;">public interface UserBirthdayQueryApi{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    Response&lt;BirthdayViewResponse&gt; checkUserBirthday(BirthdayQueryRequest req);</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>我们在用户接口层引入这个Jar包，并实现这个接口，在此省略日志、异常处理和监控等逻辑。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class UserBirthdayQueryApiImpl implements UserBirthdayQueryApi{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    private ApplicationService applicationService;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    Response&lt;BirthdayViewResponse&gt; checkUserBirthday(BirthdayQueryRequest req){</span></span>
<span class="line"><span style="color:#A6ACCD;">        //转成应用层的Query对象</span></span>
<span class="line"><span style="color:#A6ACCD;">        BirthdayQuery query=propertyMapper.mapping(req);</span></span>
<span class="line"><span style="color:#A6ACCD;">        //执行查询，获得View对象</span></span>
<span class="line"><span style="color:#A6ACCD;">        BirthdayView view=applicationService.checkUserBirthday(query);</span></span>
<span class="line"><span style="color:#A6ACCD;">        //转成接口响应类型</span></span>
<span class="line"><span style="color:#A6ACCD;">        BirthdayViewResponse bvr=propertyMapper.mapping(view);    </span></span>
<span class="line"><span style="color:#A6ACCD;">        //封装返回结果</span></span>
<span class="line"><span style="color:#A6ACCD;">        return Response.success(bvr);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>有时候接口的调用会涉及到鉴权，也建议将鉴权逻辑实现在用户接口层。</p><p>原因是对于Appication层的同一个方法，可能在Interfaces-Web和Interfaces-Provider等多个模块都有调用，鉴权是跟调用场景密切相关的，一般只对外部调用做鉴权，鉴权逻辑放置在Appication层会对所有的调用来源进行鉴权。</p><p>（未完待续）</p>`,91),t=[e];function c(o,i,r,A,C,y){return a(),n("div",null,t)}const u=s(l,[["render",c]]);export{D as __pageData,u as default};
