import{_ as s}from"./chunks/ct.001.e4aa0619.js";import{_ as a}from"./chunks/ct.005.2b4875c3.js";import{_ as n,c as p,o as l,a as o}from"./app.0703c3d1.js";const e="/images/2/ct.002.png",t="/images/2/ct.003.png",r="/images/2/ct.004.png",f=JSON.parse('{"title":"应用架构演化","description":"","frontmatter":{},"headers":[{"level":2,"title":"1. 数据模型与DAO层合并","slug":"_1-数据模型与dao层合并","link":"#_1-数据模型与dao层合并","children":[]},{"level":2,"title":"2. Service层抽取业务逻辑","slug":"_2-service层抽取业务逻辑","link":"#_2-service层抽取业务逻辑","children":[]},{"level":2,"title":"3. 维护领域对象生命周期","slug":"_3-维护领域对象生命周期","link":"#_3-维护领域对象生命周期","children":[]},{"level":2,"title":"4. 泛化抽象","slug":"_4-泛化抽象","link":"#_4-泛化抽象","children":[]},{"level":2,"title":"5. 完整的包结构","slug":"_5-完整的包结构","link":"#_5-完整的包结构","children":[]},{"level":2,"title":"6. 抽象后的思考","slug":"_6-抽象后的思考","link":"#_6-抽象后的思考","children":[]}],"relativePath":"2/2.3.md"}'),c={name:"2/2.3.md"},D=o('<h1 id="应用架构演化" tabindex="-1">应用架构演化 <a class="header-anchor" href="#应用架构演化" aria-hidden="true">#</a></h1><p>DDD 的实现架构有很多，有经典四层架构、六边形（适配器端口）架构、整洁架构（clean architecture）、CQRS 架构等，相信很多读者跟我刚开始接触时一样，完全不知道该选择什么架构进行落地。</p><p>本文不会逐个去讲解这些架构，而是从我们日常的三层架构出发，带领大家思考适合我们落地的架构。</p><p>我们很多项目是基于三层架构的，其结构如图：</p><p><img src="'+s+`" alt="三层架构"></p><p>我们说三层架构，为什么还画了一层 Model 呢？因为 Model 只是简单的 Java Bean，里面只有数据库表对应的属性，有的应用会将其单独拎出来作为一个 maven 模块，但实际上可以合并到 DAO 层。</p><p>接下来我们开始对这个三层架构进行抽象精炼。</p><h2 id="_1-数据模型与dao层合并" tabindex="-1">1. 数据模型与DAO层合并 <a class="header-anchor" href="#_1-数据模型与dao层合并" aria-hidden="true">#</a></h2><p>为什么数据模型要与数据访问层合并呢？</p><p>首先，数据模型是贫血模型，数据模型中不包含业务逻辑，只作为装载模型属性的容器；</p><p>其次，数据模型与数据库表结构的字段是一一对应的，数据模型最主要的应用场景就是持久层用来进行 ORM，给 Service 层返回封装好的数据模型，供 Service 获取模型属性以执行业务；</p><p>最后，数据模型的 Class 或者属性字段上，通常带有 ORM 框架的一些注解，跟持久层联系非常紧密，可以认为数据模型就是持久层拿来查询或者持久化数据的，数据模型脱离了持久化层，意义不大。</p><h2 id="_2-service层抽取业务逻辑" tabindex="-1">2. Service层抽取业务逻辑 <a class="header-anchor" href="#_2-service层抽取业务逻辑" aria-hidden="true">#</a></h2><p>下面是一个常见的 Service 方法的伪代码，既有缓存、数据库的调用，也有实际的业务逻辑，整体过于臃肿，要进行单元测试更是无从下手。</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Service</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">@</span><span style="color:#C792EA;">Transactional</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">bizLogic</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">Param</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">param</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#82AAFF;">checkParam</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">param</span><span style="color:#89DDFF;">);</span><span style="color:#676E95;font-style:italic;">//校验不通过则抛出自定义的运行时异常</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Data</span><span style="color:#A6ACCD;"> data </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Data</span><span style="color:#89DDFF;">();</span><span style="color:#676E95;font-style:italic;">//或者是mapper.queryOne(param);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        data</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">setId</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">param</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getId</span><span style="color:#89DDFF;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">condition1 </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">            biz1 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">biz1</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">param</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getProperty1</span><span style="color:#89DDFF;">());</span></span>
<span class="line"><span style="color:#A6ACCD;">            data</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">setProperty1</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">biz1</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">else</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">            biz1 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">biz11</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">param</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getProperty1</span><span style="color:#89DDFF;">());</span></span>
<span class="line"><span style="color:#A6ACCD;">            data</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">setProperty1</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">biz1</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">condition2 </span><span style="color:#89DDFF;">==</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">            biz2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">biz2</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">param</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getProperty2</span><span style="color:#89DDFF;">());</span></span>
<span class="line"><span style="color:#A6ACCD;">            data</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">setProperty2</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">biz2</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">else</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">            biz2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">biz22</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">param</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getProperty2</span><span style="color:#89DDFF;">());</span></span>
<span class="line"><span style="color:#A6ACCD;">            data</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">setProperty2</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">biz2</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//省略一堆set方法</span></span>
<span class="line"><span style="color:#A6ACCD;">        mapper</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">updateXXXById</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>这是典型的事务脚本的代码：先做参数校验，然后通过 biz1、biz2 等子方法做业务，并将其结果通过一堆 Set 方法设置到数据模型中，再将数据模型更新到数据库。</p><p>由于所有的业务逻辑都在 Service 方法中，造成 Service 方法非常臃肿，Service 需要了解所有的业务规则，并且要清楚如何将基础设施串起来。同样的一条规则，例如 if(condition1=true)，很有可能在每个方法里面都出现。</p><p>我们知道，专业的事情就该让专业的人干。既然业务逻辑是跟具体的业务场景相关的，我们想办法把业务逻辑提取出来，形成一个模型，让这个模型的对象去执行具体的业务逻辑。这样Service 方法就不用再关心里面的 if/else 业务规则，只需要给业务模型执行的舞台，并提供基础设施完成用例即可。</p><p>将业务逻辑抽形成模型，这样的模型就是领域模型。</p><p>我们先不管领域模型怎么得到，总之，拿到 Service 方法的入参之后，我们通过某种途径得到一个模型，我们让这个模型去做业务逻辑，最后执行的结果也都在模型里，我们再将模型回写数据库，当然，怎么写数据库的我们也先不管。</p><p>抽取之后，将得到如下的伪代码：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Service</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">bizLogic</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">Param</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">param</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//如果校验不通过，则抛一个运行时异常</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#82AAFF;">checkParam</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">param</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//加载模型</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Domain</span><span style="color:#A6ACCD;"> domain </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">loadDomain</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">param</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//调用外部服务取值</span></span>
<span class="line"><span style="color:#A6ACCD;">	    </span><span style="color:#C792EA;">SomeValue</span><span style="color:#A6ACCD;"> someValue</span><span style="color:#89DDFF;">=this.</span><span style="color:#82AAFF;">getSomeValueFromOtherService</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">param</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getProperty2</span><span style="color:#89DDFF;">());</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//模型自己去做业务逻辑，Service不关心模型内部的业务规则</span></span>
<span class="line"><span style="color:#A6ACCD;">        domain</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">doBusinessLogic</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">param</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getProperty1</span><span style="color:#89DDFF;">(),</span><span style="color:#A6ACCD;"> someValue</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//保存模型</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#82AAFF;">saveDomain</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">domain</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div><p>根据代码，我们已经将业务逻辑抽取出来了，领域相关的业务规则封闭在领域模型内部。此时 Service 方法非常直观，就是获取模型、执行业务逻辑、保存模型，再协调基础设施完成其余的操作。</p><p>抽取完领域模型后，我们工程的结构如下图：</p><p><img src="`+e+`" alt="三层架构"></p><h2 id="_3-维护领域对象生命周期" tabindex="-1">3. 维护领域对象生命周期 <a class="header-anchor" href="#_3-维护领域对象生命周期" aria-hidden="true">#</a></h2><p>在第二步中，loadDomain、saveDomain 两个方法还没有得到讨论，这两个方法跟领域对象的生命周期息息相关。</p><p>关于领域对象的生命周期的详细知识，我们将在<a href="./2.5.html">领域对象的生命周期</a>中详细讲解。</p><p>不管是 loadDomain 还是 saveDomain，我们一般都要依赖于数据库或者其他中间件，所以这两个方法对应的逻辑，肯定是要跟 DAO 产生联系的。</p><p>保存或者加载领域模型，我们可以抽象成一种组件，通过这种组件进行封装数据库操作，这种组件就是 Repository，在Repository中调用DAO完成模型加载和持久化操作。</p><p>注意，Repository 是对加载或者保存领域模型（这里指的是聚合根，因为只有聚合根才会有 Repository）的抽象，可以对上层屏蔽领域模型持久化的细节，因此其方法的入参或者出参，一定是基本数据类型或者领域内定义的类型，不能是数据库表对应的数据模型。</p><p>以下是 Repository 的伪代码：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">DomainRepository</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">save</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">AggregateRoot</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">root</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">AggregateRoot</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">load</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">EntityId</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">id</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>既然 DomainRepository 与底层数据库有关联，但是我们现在 DAO 层并没有引入 Domain 这个包，DAO 层自然无法提供 DomainRepository 的实现，我们初步考虑可以将这个 DomainRepository 实现在 Service 中。</p><p>我们再推敲推敲，如果我们在 Service 中实现DomainRepository，势必需要在 Service 中操作数据模型：查询出来数据模型再封装为领域模型、或者将领域模型转为数据模型再通过 ORM 保存，这个过程不该是 Service 层关心的。</p><p>所以，我们决定在 DAO 层直接引入 Domain 包，并在 DAO 层提供 DomainRepository 接口的实现，DAO 层的 Mapper 查询出数据模型之后，封装成领域模型供 DomainRepository 返回。</p><p>这样调整之后， DAO 层不再向 Service 返回数据模型，而是返回领域模型，这就隐藏了数据库交互的细节，我们也把DAO层换个名字称之为Repository。</p><p>现在，我们项目的架构图是这样的了：</p><p><img src="`+t+'" alt="应用架构演化第三步"></p><blockquote><p>由于数据模型属于贫血模型，自身没有业务逻辑，并且只有Repository这个包会用到，因此我们将之合并到Repository中，接下来不再单独列举。</p></blockquote><h2 id="_4-泛化抽象" tabindex="-1">4. 泛化抽象 <a class="header-anchor" href="#_4-泛化抽象" aria-hidden="true">#</a></h2><p>在第三步中，我们的架构图已经跟经典四层架构非常相似了，我们再对某些层进行泛化抽象。</p><ul><li>Infrastructure</li></ul><p>Repository 仓储层其实属于基础设施层，只不过其职责是持久化和加载聚合，所以，我们将 Repository 层改名为 <code>infrastructure-persistence</code>，可以理解为基础设施层持久化包。</p><p>之所以采取这种 infrastructure-XXX 的格式进行命名，是由于 Infrastructure 可能会有很多的包，分别提供不同的基础设施支持。</p><p>例如：一般的项目，还有可能需要引入缓存，我们就可以再加一个包，名字叫 <code>infrastructure-cache</code>。</p><p>对于外部的调用，DDD中有防腐层的概念，将外部模型通过防腐层进行隔离，避免污染本地上下文的领域模型。我们使用入口（Gateway）来封装对外部系统或资源的访问（详细见《企业应用架构模式》，18.1 入口（Gateway）），因此将对外调用这一层称之为<code>infrastructure-gateway</code>。</p><blockquote><p>注意：Infrastructure 层的门面接口都应先在Domain 层定义，其方法的入参、出参，都应该是领域模型（实体、值对象）或者基本类型。</p></blockquote><ul><li>User Interface</li></ul><p>Controller 层其实就是用户接口层，即 User Interface 层，我们在项目简称 ui。当然了可能很多开发者会觉得叫UI好像很别扭，认为 UI 就是 UI 设计师设计的图形界面。</p><p>Controller 层的名字有很多，有的叫 Rest，有的叫 Resource，考虑到我们这一层不只是有 Rest 接口，还可能还有一系列 Web 相关的拦截器，所以我一般比较称之为 Web。</p><p>因此，我们将其改名为 ui-web，即用户接口层的 Web 包。</p><p>同样，我们可能会有很多的用户接口，但是他们通过不同的协议对外提供服务，因而被划分到不同的包中。我们如果有对外提供的 RPC 服务，那么其服务实现类所在的包就可以命名为 ui-provider。</p><p>有时候引入某个中间件既会增加 Infrastructure 也会增加 User Interface。</p><p>例如，如果引入 Kafka 就需要考虑一下，如果是给 Service 层提供调用的，例如逻辑执行完发送消息通知下游，那么我们再加一个包 infrastructure-publisher；如果是消费 Kafka 的消息，然后调用 Service 层执行业务逻辑的，那么就可以命名为 ui-subscriber。</p><ul><li>Application</li></ul><p>至此，Service 层目前已经没有业务逻辑了，业务逻辑都在 Domain 层去执行了，Service 只是提供了应用服务，协调领域模型、基础设施层完成业务逻辑。</p><p>所以，我们把 Service 层改名为 Application Service 层。</p><p>经过第四步的抽象，其架构图为：</p><p><img src="'+r+'" alt="三层架构第四步"></p><h2 id="_5-完整的包结构" tabindex="-1">5. 完整的包结构 <a class="header-anchor" href="#_5-完整的包结构" aria-hidden="true">#</a></h2><p>将第四步中出现的包进行整理，并加入启动包，我们就得到了完整的 maven 包结构。</p><p>此时还需要考虑一个问题，我们的启动类应该放在哪里？由于有很多的 User Interface，所以启动类放在任意一个User Interface中都不合适，并且放置再Application Service中也不合适，因此，启动类应该存放在单独的模块中。又因为 application 这个名字被应用层占用了，所以将启动类所在的模块命名为 launcher，一个项目可以存在多个launcher，按需引用User Interface。</p><p>包结构如图所示：</p><p><img src="'+a+'" alt="DDD完整包结构"></p><p>至此，DDD 项目的整体结构基本讲完了。</p><h2 id="_6-抽象后的思考" tabindex="-1">6. 抽象后的思考 <a class="header-anchor" href="#_6-抽象后的思考" aria-hidden="true">#</a></h2><p>在经过前面五步抽象得到这个架构图中，经典四层架构的四层都出现了，而且长得跟六边形架构也很像。这是为什么呢？</p><p>其实，不管是经典四层架构、还是六边形架构，亦或者整洁架构，都是对系统应用的描述，也许描述的侧重点不一样，但是描述的是同一个事物。既然描述的是同一个事物，长得像才是理所当然的。</p><p>对于任何一个应用，都可以看成“输入-处理-输出”的过程。</p><p>“输入”环节：通过某种协议对外暴露领域的能力，这些协议可能是 REST、可能是 RPC、可能是 MQ 的监听器，也可能是 WebSocket，也可能是一些任务调度的 Task；</p><p>”处理“环节：处理环节是整个应用的核心，代表了应用具备的核心能力，是应用的价值所在，应用在这个环节执行业务逻辑，贫血模型由 Service 执行业务处理，充血模型则是由模型进行业务处理。</p><p>“输出”环节，业务逻辑执行完成之后将结果输出到外部。</p><p>不管我们采用的什么架构，其描述的应用的核心都是这个过程，不必生搬硬套非得用什么应用架构。</p><p>正如《金刚经》所言：一切有为法，如梦幻泡影，如露亦如电，应作如是观；凡有所相，皆是虚妄；若见诸相非相，即见如来。</p><hr><div><img src="https://s1.ax1x.com/2023/04/15/p9p2mKP.jpg"></div><p>欢迎加入本书作者的知识星球，在星球中您将获得：</p><ul><li>本书作者答疑，无论是DDD学习过程中的问题，还是对现有项目进行DDD重构，都可以一起探讨</li><li>获得本书配套源码以及多个完整的DDD项目实战源码，包括权限系统、电商系统、校招平台、直播平台等项目</li><li>DDD属于开发中的高阶知识，历来掌握者寥寥，研究DDD的同行职级都不低，这里是拓宽人脉的好地方</li><li>与即将推出的《TOGAF架构方法论》、《悟道项目管理》、《悟道团队管理》、《悟道产品经理》等书共用一个星球，一次加入即可同时可获得其他知识专题的答疑</li></ul>',79),i=[D];function y(A,F,C,d,u,m){return l(),p("div",null,i)}const g=n(c,[["render",y]]);export{f as __pageData,g as default};
