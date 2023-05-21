import{_ as s,c as a,o as n,a as l}from"./app.0703c3d1.js";const F=JSON.parse('{"title":"贫血模型和充血模型","description":"","frontmatter":{},"headers":[{"level":2,"title":"1. 贫血模型","slug":"_1-贫血模型","link":"#_1-贫血模型","children":[]},{"level":2,"title":"2. 充血模型","slug":"_2-充血模型","link":"#_2-充血模型","children":[]},{"level":2,"title":"3. DDD 对模型的要求","slug":"_3-ddd-对模型的要求","link":"#_3-ddd-对模型的要求","children":[]}],"relativePath":"2/2.2.md"}'),p={name:"2/2.2.md"},o=l(`<h1 id="贫血模型和充血模型" tabindex="-1">贫血模型和充血模型 <a class="header-anchor" href="#贫血模型和充血模型" aria-hidden="true">#</a></h1><p>在学习贫血模型和充血模型之前，首先要理解对象的属性和对象的行为这两个概念。</p><p>对象的属性：指的是对象的内部状态，通常表现为类的属性。</p><p>对象的行为：指的是对象具备的能力，通常表现为类的方法。</p><h2 id="_1-贫血模型" tabindex="-1">1. 贫血模型 <a class="header-anchor" href="#_1-贫血模型" aria-hidden="true">#</a></h2><p>贫血模型指的是只有属性没有行为的模型。我们目前开发中经常用的 Java Bean，实际上就是贫血模型，例如：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">/**</span></span>
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
<span class="line"></span></code></pre></div><h2 id="_2-充血模型" tabindex="-1">2. 充血模型 <a class="header-anchor" href="#_2-充血模型" aria-hidden="true">#</a></h2><p>充血模型是指既有属性也有行为的模型。</p><p>如果我们采用面向对象的思想去建模，则产出的模型应该既有属性，也有行为，那么这种模型就是充血模型。例如下面的 VideoPlayer 类，既有属性（playlist），也有行为（play 方法），则 VideoPlayer 是充血模型：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"> * 视频播放器</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"> */</span></span>
<span class="line"><span style="color:#89DDFF;">@</span><span style="color:#C792EA;">Data</span></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">VideoPlayer</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    /**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * 播放列表</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">List</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">String</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> playlist</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    /**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     * 播放节目</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">play</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> v </span><span style="color:#89DDFF;font-style:italic;">:</span><span style="color:#A6ACCD;"> playlist</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">            System</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">out</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">printf</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">正在播放：</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">+</span><span style="color:#A6ACCD;"> v</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="_3-ddd-对模型的要求" tabindex="-1">3. DDD 对模型的要求 <a class="header-anchor" href="#_3-ddd-对模型的要求" aria-hidden="true">#</a></h2><p>由于贫血模型真的是太方便了，因此大部分 Java 程序员习惯了使用贫血模型。贫血模型的使用方式大概时这样的：先通过 ORM 框架从数据库查询数据，然后在 Service 层的方法中操作这些数据对象完成业务逻辑，然后 Service 层中调用 ORM 框架对数据库做更新。Service 承担了实现所有业务逻辑的责任，稍微遗漏了业务逻辑的约束，就会造成问题。</p><p>DDD 要求使用充血模型完成业务逻辑，原因在于模型的行为也是模型的一部分。贫血模型只是提供了属性数据的容器，然后向 Service 公开了这些属性，操作这些属性完成业务逻辑的职责转嫁给了 Service，这会导致 Service 所有的方法都必须充分了解模型的领域知识，面向对象三大特征之一的封装性荡然无存。</p><p>我们经常看到某个业务校验的逻辑在每个 Service 方法里面都出现一次，就是贫血模型泄漏了领域知识造成的。</p><p>充血模型拥有完整的属性，同时具备业务行为（即业务方法），因此 Service 只要调用充血模型的行为，充血模型内部即自行修改对应的状态以完成业务操作，Service 再也不需要理解领域的业务规则了，因为都是充血模型自己在维护。</p><p>以上面的 VideoPlayer 为例：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">VideoService</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">play</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//TODO 1.获得领域对象</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//2. 执行业务操作，Service只需要调用充血模型的行为就能完成业务操作，</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//   不再需要了解播放的逻辑</span></span>
<span class="line"><span style="color:#A6ACCD;">        videoPlayer</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">play</span><span style="color:#89DDFF;">();</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div><p>可以看到，当采用充血模型的建模方式后，业务逻辑由对应的充血模型进行维护，很好地被封装在充血模型中，Service 方法会变得清晰明了。</p><hr><div><img src="https://s1.ax1x.com/2023/04/15/p9p2mKP.jpg"></div><p>欢迎加入本书作者的知识星球，在星球中您将获得：</p><ul><li>本书作者答疑，无论是DDD学习过程中的问题，还是对现有项目进行DDD重构，都可以一起探讨</li><li>获得本书配套源码以及多个完整的DDD项目实战源码，包括权限系统、电商系统、校招平台、直播平台等项目</li><li>DDD属于开发中的高阶知识，历来掌握者寥寥，研究DDD的同行职级都不低，这里是拓宽人脉的好地方</li><li>与即将推出的《TOGAF架构方法论》、《悟道项目管理》、《悟道团队管理》、《悟道产品经理》等书共用一个星球，一次加入即可同时可获得其他知识专题的答疑</li></ul>`,23),e=[o];function t(c,r,i,y,D,C){return n(),a("div",null,e)}const d=s(p,[["render",t]]);export{F as __pageData,d as default};