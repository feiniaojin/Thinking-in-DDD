import{_ as s,c as a,o as n,a as l}from"./app.1400b7bb.js";const F=JSON.parse('{"title":"2.5 领域对象的生命周期","description":"","frontmatter":{},"headers":[],"relativePath":"2/2.5.md"}'),p={name:"2/2.5.md"},o=l(`<h1 id="_2-5-领域对象的生命周期" tabindex="-1">2.5 领域对象的生命周期 <a class="header-anchor" href="#_2-5-领域对象的生命周期" aria-hidden="true">#</a></h1><p>《领域驱动设计》一书在其第六章讲解了领域对象的生命周期，如下图：</p><p><img src="https://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/9a90c5f1e4424cabbca01503ae66df22~noop.image?_iz=58558&amp;from=article.pc_detail&amp;x-expires=1675792891&amp;x-signature=0MOXeP5WpkyE%2F7n55n986m4O6gw%3D" alt="">领域对象的生命周期（图片来自《领域驱动设计》）</p><p>这个状态图是理解领域对象生命周期以及领域对象与各个组件交互的关键。</p><p>我们围绕领域对象进行分析，上图主要展示了活动状态的领域对象的获取和消亡的过程。</p><p>领域对象的获取过程，主要通过两种方式：创建和重建。创建由Factory来支持，重建则是通过Resposiitory来支持。</p><p>获取领域对象的示例：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">//创建，通过Factory</span></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ArticleDomainFactory</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">ArticleEntity</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">newInstance</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">ArticleTitle</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">articleTitle</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">ArticleContent</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">articleContent</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//重建，通过Repository</span></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ArticleDomainRepository</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">ArticleEntity</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">load</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">ArticleId</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">articleId</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//省略其他方法</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>要避免在Application层直接将DTO转成实体或者聚合来执行业务操作，这种做法实际上架空了Factory和Repository，造成领域模型生命周期的不完整。</p><p>错误的示例代码：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">newDraft</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">ArticleCreateCmd</span><span style="color:#A6ACCD;"> cmd</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//直接将Command转成领域模型</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">ArticleEntity</span><span style="color:#A6ACCD;"> articleEntity </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> converter</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">convert</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">cmd</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//后面的省略</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>领域对象的消亡过程，本质上是领域对象进行序列化后出站的过程，主要有通过Respository进行持久化，或者通过其他基础设施进行类似的操作，如缓存。</p>`,12),t=[o];function e(c,r,i,y,A,C){return n(),a("div",null,t)}const d=s(p,[["render",e]]);export{F as __pageData,d as default};