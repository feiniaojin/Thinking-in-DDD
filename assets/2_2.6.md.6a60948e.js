import{_ as s,c as a,o as n,a as l}from"./app.1136664d.js";const F=JSON.parse('{"title":"2.6 应用架构各层间数据流转","description":"","frontmatter":{},"headers":[{"level":2,"title":"2.61. 创建过程的类型流转","slug":"_2-61-创建过程的类型流转","link":"#_2-61-创建过程的类型流转","children":[]},{"level":2,"title":"2.6.2 修改过程的类型流转","slug":"_2-6-2-修改过程的类型流转","link":"#_2-6-2-修改过程的类型流转","children":[]}],"relativePath":"2/2.6.md"}'),p={name:"2/2.6.md"},e=l(`<h1 id="_2-6-应用架构各层间数据流转" tabindex="-1">2.6 应用架构各层间数据流转 <a class="header-anchor" href="#_2-6-应用架构各层间数据流转" aria-hidden="true">#</a></h1><p>DDD各层间数据类型的流转，主要分创建、修改、查询三个流程。</p><p>为什么没有删除呢，因为删除这个操作比较危险，一般的删除都是逻辑删除，即把数据的删除标志置为已删除。因此，删除操作可以归类于修改这个流程中。</p><h2 id="_2-61-创建过程的类型流转" tabindex="-1">2.61. 创建过程的类型流转 <a class="header-anchor" href="#_2-61-创建过程的类型流转" aria-hidden="true">#</a></h2><p><img src="https://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/5f88933603c74b24aa5d50890e0845a4~noop.image?_iz=58558&amp;from=article.pc_detail&amp;x-expires=1675792891&amp;x-signature=FLDG2YmhgXFcOq196OJTKqT2STo%3D" alt="">创建过程的类型流转</p><p>整体的过程是：</p><ul><li>User Interface</li></ul><p>如果User Interface复用了Application的DTO（Command和Query），直接透传给Application层即可；如果User Interface有自己的入参类型，例如RPC接口会在API包中定义一些类型，这时候需要将其换成Application的DTO（一般是Command、Query）。</p><ul><li>Application</li></ul><p>Application层内将Command和Query承载的基本数据类型，转化成领域内定义的数据类型，传递给领域工厂以创建领域模型。</p><p>例如Command中定义的content字段是String类型，而领域内定义了一个ArticleContent的领域类型，此时需要将String类型换成ArticleContent类型。</p><p>示例代码如下：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">//Application层的DTO</span></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ArticleCreateCmd</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> title</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> content</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//Application层的创建草稿方法</span></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">newDraft</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">ArticleCreateCmd</span><span style="color:#A6ACCD;"> cmd</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//领域工厂创建ArticleEntity时，需要通过String类型的content创建ArticleContent类型</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">ArticleEntity</span><span style="color:#A6ACCD;"> articleEntity </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> domainFactory</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">newInstance</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">ArticleTitle</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">cmd</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getTitle</span><span style="color:#89DDFF;">()),</span></span>
<span class="line"><span style="color:#A6ACCD;">                </span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">ArticleContent</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">cmd</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getContent</span><span style="color:#89DDFF;">()));</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//后面的省略</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><ul><li>Domain</li></ul><p>领域模型内部执行创建草稿的逻辑。</p><p>创建草稿看起来很像一个对象的初始化逻辑，但是不要把创建草稿的逻辑放在对象的构造方法中，因为创建草稿是业务操作，对象初始化是技术实现。每个对象都会调用构造方法初始化，但是不可能每次构造一个对象都创建一遍草稿。有的article是已经发布了的，如果创建草稿的初始化放到构造方法中，那么已经发布的article对象也会再创建一遍草稿，并且再次产生一个新的事件，这是不合理的。</p><p>另外，关于领域事件的设计，未来专门会展开，此处只给事件填充了一个article id。</p><ul><li>Infrastructure</li></ul><p>Infrastructure-Persistence包内部有用于对象关系映射的数据模型，Infrastructure将领域模型转成数据模型并进行持久化。</p><p>注意，领域模型和数据模型通常不是1对1的，有的领域模型内的值对象，很可能在数据模型中会有单独的对象。例如，Article在数据库层面由多张表完成存储，例如主表cms_article、正文表cms_article_content。</p><p>有一些ORM框架（例如JPA），可以通过技术手段，在实体上加入一系列注解，就可以将实体内的字段映射到数据库表。存在即合理，这种方式用得合理可能会带来一些便利，但是我个人不会采用这种方法，因为这样使得聚合承载了过多的职责。</p><h2 id="_2-6-2-修改过程的类型流转" tabindex="-1">2.6.2 修改过程的类型流转 <a class="header-anchor" href="#_2-6-2-修改过程的类型流转" aria-hidden="true">#</a></h2><p><img src="https://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/4301ce87f7934d61880e09d20ad7faee~noop.image?_iz=58558&amp;from=article.pc_detail&amp;x-expires=1675792891&amp;x-signature=aNFfxwZ0hisgmObDISgNyL7EEl4%3D" alt="">修改过程的类型流转</p><p>修改过程与创建过程的区别在于，创建是通过Factory生成聚合根，而修改是通过Repository加载聚合根。</p>`,24),t=[e];function o(c,r,i,A,y,D){return n(),a("div",null,t)}const d=s(p,[["render",o]]);export{F as __pageData,d as default};
