import{_ as s,c as a,o as n,a as l}from"./app.1400b7bb.js";const d=JSON.parse('{"title":"2.2 贫血模型和充血模型","description":"","frontmatter":{},"headers":[{"level":2,"title":"2.2.1 贫血模型","slug":"_2-2-1-贫血模型","link":"#_2-2-1-贫血模型","children":[]},{"level":2,"title":"2.2.2 充血模型","slug":"_2-2-2-充血模型","link":"#_2-2-2-充血模型","children":[{"level":3,"title":"2.2.3 DDD对模型的要求","slug":"_2-2-3-ddd对模型的要求","link":"#_2-2-3-ddd对模型的要求","children":[]}]}],"relativePath":"2/2.2.md"}'),p={name:"2/2.2.md"},e=l(`<h1 id="_2-2-贫血模型和充血模型" tabindex="-1">2.2 贫血模型和充血模型 <a class="header-anchor" href="#_2-2-贫血模型和充血模型" aria-hidden="true">#</a></h1><h2 id="_2-2-1-贫血模型" tabindex="-1">2.2.1 贫血模型 <a class="header-anchor" href="#_2-2-1-贫血模型" aria-hidden="true">#</a></h2><p>贫血模型指的是只有属性没有行为的模型。 我们目前开发中经常用的Java Bean，实际上就是贫血模型，例如：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"> * Computer类中只有属性，没有行为，所以是贫血模型</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"> */</span></span>
<span class="line"><span style="color:#89DDFF;">@</span><span style="color:#C792EA;">Data</span></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Computer</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    /**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * 操作系统</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> os</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    /**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * 键盘</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> keyboard</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//……其他属性</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="_2-2-2-充血模型" tabindex="-1">2.2.2 充血模型 <a class="header-anchor" href="#_2-2-2-充血模型" aria-hidden="true">#</a></h2><p>充血模型是指既有属性也有行为的模型。</p><p>如果我们采用面向对象的思想去建模，则产出的模型应该既有属性，也有行为，那么这种模型就是充血模型。例如下面的TV类，既有属性（playlist），也有行为（play方法），则TV是充血模型：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"></span>
<span class="line"><span style="color:#89DDFF;">@</span><span style="color:#C792EA;">Data</span></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">TV</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    /**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * 节目单</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">List</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">String</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> playlist</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    /**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * 播放节目</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">play</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>对象的属性，指的是对象的内部状态；对象的行为，指的是对象具备的能力，也就是我们所预期的业务逻辑。</p><h3 id="_2-2-3-ddd对模型的要求" tabindex="-1">2.2.3 DDD对模型的要求 <a class="header-anchor" href="#_2-2-3-ddd对模型的要求" aria-hidden="true">#</a></h3><p>大部分Java程序员习惯了使用贫血模型：先通过ORM框架从数据库查询数据，然后在Service层的方法中操作这些数据对象完成业务逻辑，然后Service层中调用ORM框架对数据库做更新。原本Service只需要给模型一个执行环境，现在需要又当爹又当妈把所有业务逻辑实现了再把结果更新到数据库，同时要兼顾数据库事务，稍微遗漏了业务逻辑的约束，就会造成问题。</p><p>DDD要求充血模型的原因，在于模型的行为也是模型的一部分。贫血模型只是提供了属性数据的容器，然后向Service公开了这些属性，操作这些属性完成业务逻辑的职责转嫁给了Service，这会导致Service所有的方法都必须充分了解模型的领域知识，面向对象三大特征之一的封装性荡然无存。</p><p>我们经常看到某个业务校验的逻辑在每个Service方法里面都出现一次，就是贫血模型泄漏了领域知识造成的。</p>`,13),o=[e];function t(c,i,r,y,C,D){return n(),a("div",null,o)}const _=s(p,[["render",t]]);export{d as __pageData,_ as default};
