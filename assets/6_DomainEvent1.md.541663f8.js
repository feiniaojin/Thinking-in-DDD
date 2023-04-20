import{_ as s,c as a,o as n,a as l}from"./app.8e3f2715.js";const A=JSON.parse('{"title":"领域事件 1——领域事件的建模","description":"","frontmatter":{},"headers":[{"level":2,"title":"1. 领域事件的概念","slug":"_1-领域事件的概念","link":"#_1-领域事件的概念","children":[]},{"level":2,"title":"2. 领域事件的应用","slug":"_2-领域事件的应用","link":"#_2-领域事件的应用","children":[]},{"level":2,"title":"3. 领域事件的消息内容","slug":"_3-领域事件的消息内容","link":"#_3-领域事件的消息内容","children":[]},{"level":2,"title":"4. 领域事件的建模","slug":"_4-领域事件的建模","link":"#_4-领域事件的建模","children":[]}],"relativePath":"6/DomainEvent1.md"}'),p={name:"6/DomainEvent1.md"},o=l(`<h1 id="领域事件-1——领域事件的建模" tabindex="-1">领域事件 1——领域事件的建模 <a class="header-anchor" href="#领域事件-1——领域事件的建模" aria-hidden="true">#</a></h1><h2 id="_1-领域事件的概念" tabindex="-1">1. 领域事件的概念 <a class="header-anchor" href="#_1-领域事件的概念" aria-hidden="true">#</a></h2><p>领域事件是发生在聚合中的一些事情，代表聚合内已经发生的业务操作或状态变化。例如，在电子商务领域中，订单创建、支付完成等操作都可以被视为领域事件。领域事件的发生通常会影响领域模型中的一些对象状态，并且可能会触发一些业务逻辑。</p><p>领域事件通常由聚合根或其他领域对象产生，可以被其他对象订阅和处理。</p><p>领域事件是领域模型的组成部分，可以帮助我们深入理解领域模型。</p><p>关于领域事件需要注意几点：</p><ul><li>应该根据限界上下文中的通用语言来命名事件</li></ul><p>如果事件由聚合上的命令操作产生，通常根据该操作方法的名字来命名事件，并且通常采用过去式。</p><p>例如：<code>账户已激活</code>这个事件可以使用<code>AccountActivated</code>进行命名。</p><ul><li>应该将事件建模成值对象的形式</li></ul><p>应该将事件建模成值对象的形式，并根据实际情况进行妥协以适应序列化和反序列化框架需求。</p><blockquote><p>所谓的妥协，主要是指：值对象一般建模为不可变对象，所以不提供 set 方法，领域事件由于需要序列化和反序列化，所以需要提供空的构造方法以及 set 方法，避免框架运行错误。</p></blockquote><h2 id="_2-领域事件的应用" tabindex="-1">2. 领域事件的应用 <a class="header-anchor" href="#_2-领域事件的应用" aria-hidden="true">#</a></h2><p>在 DDD 中，领域事件有着多种用途。</p><ul><li>保证聚合间的数据一致性</li></ul><p>当一个聚合根发生了状态变化，可以通过领域事件的方式，通知其他聚合根进行相应的更新，以保证数据一致性。</p><ul><li>使用领域事件避免批量处理</li></ul><p>逐个地处理业务事件，而不必等待所有事件都发生后再处理。</p><ul><li>实现事件源模式（Event Sourcing）</li></ul><p>使用只追加存储来记录对数据采取的完整系列操作，而不是仅存储域中数据的当前状态，通过记录系统中的所有状态变化以便跟踪问题。</p><ul><li>进行限界上下文集成</li></ul><p>实现跨域模块的通信与协作。</p><h2 id="_3-领域事件的消息内容" tabindex="-1">3. 领域事件的消息内容 <a class="header-anchor" href="#_3-领域事件的消息内容" aria-hidden="true">#</a></h2><p>领域事件可能只包含业务主键、事件发生时间、事件类型，这种情况下，消费者可能需要调相应的接口查询出完整的业务信息以执行业务操作。</p><p>举个例子：</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">eventType</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">MobileChanged</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">rootId</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">123456</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">eventTime</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">1681812559707</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">eventId</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">1234555</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p><code>rootId</code>即聚合根 ID，是执行业务操作的业务主键，订阅者可以通过 rootId 进行获得发生该领域事件的聚合根的信息；<code>eventId</code>是领域事件的 ID，订阅者可以根据其来实现幂等；<code>eventType</code>用来区分领域事件的类型;<code>eventTime</code>是发生该领域事件的事件。</p><blockquote><p>事件订阅者消费到消息之后，需要拿着 rootId 去查对应的服务，获取修改后的手机号的值。</p></blockquote><p>领域事件也可以使用<code>事件增强</code>的方式，在领域事件中包含消费者需要的完整信息，避免消费者进行额外的查询。</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">eventType</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">MobileChanged</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">rootId</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">123456</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">eventTime</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">1681812559707</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">afterMobile</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">168168168</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">eventId</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">1234555</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p><code>afterMobile</code>是发生该<code>MobileChanged</code>事件后，用户手机号的值。</p><blockquote><p>上面这个消息中采取了事件增强的方式，消息中直接提供了修改后的手机号（afterMobile 字段），不需要再去调用接口查询。</p></blockquote><h2 id="_4-领域事件的建模" tabindex="-1">4. 领域事件的建模 <a class="header-anchor" href="#_4-领域事件的建模" aria-hidden="true">#</a></h2><p>上文有提到领域事件应该建模为值对象，因此我们可以建模一个抽象的领域事件基类。</p><p>示例代码如下。</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"></span>
<span class="line"><span style="color:#89DDFF;">@</span><span style="color:#C792EA;">Data</span></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">abstract</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">DomainEvent</span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> eventId</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> eventType</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> rootId</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">Long</span><span style="color:#A6ACCD;"> eventTime</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div><hr><p>欢迎加入本书作者的知识星球，在星球中您将获得：</p><ul><li>本书作者答疑，无论是DDD学习过程中的问题，还是对现有项目进行DDD重构，都可以找作者唠唠</li><li>获得本书配套源码以及多套完整的DDD项目实战源码，包括权限系统、电商系统、校招平台、直播平台等项目</li><li>DDD属于开发中的高阶知识，历来掌握者寥寥，研究DDD的同行职级都不低，这里是拓宽人脉的好地方</li><li>与即将推出的《TOGAF架构方法论》、《悟道项目管理》、《悟道团队管理》、《悟道产品经理》等书共用一个星球，一次加入即可同时可获得其他知识专题的答疑</li></ul><div><img src="https://s1.ax1x.com/2023/04/15/p9p2mKP.jpg"></div>`,40),e=[o];function t(c,r,D,i,y,F){return n(),a("div",null,e)}const d=s(p,[["render",t]]);export{A as __pageData,d as default};
