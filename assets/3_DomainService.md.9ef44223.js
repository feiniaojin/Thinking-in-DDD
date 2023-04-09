import{_ as s,c as a,o as n,a as l}from"./app.47369ddf.js";const F=JSON.parse('{"title":"领域服务","description":"","frontmatter":{},"headers":[{"level":2,"title":"1. 什么是领域服务","slug":"_1-什么是领域服务","link":"#_1-什么是领域服务","children":[]},{"level":2,"title":"2. 领域服务的特点","slug":"_2-领域服务的特点","link":"#_2-领域服务的特点","children":[]},{"level":2,"title":"3. 领域服务实践","slug":"_3-领域服务实践","link":"#_3-领域服务实践","children":[]},{"level":2,"title":"4. 领域服务与应用服务的区别","slug":"_4-领域服务与应用服务的区别","link":"#_4-领域服务与应用服务的区别","children":[]}],"relativePath":"3/DomainService.md"}'),p={name:"3/DomainService.md"},e=l(`<h1 id="领域服务" tabindex="-1">领域服务 <a class="header-anchor" href="#领域服务" aria-hidden="true">#</a></h1><h2 id="_1-什么是领域服务" tabindex="-1">1. 什么是领域服务 <a class="header-anchor" href="#_1-什么是领域服务" aria-hidden="true">#</a></h2><p>通过对实体和值对象的建模，我们将领域中绝大部分的过程和操作清晰地归属到对应的实体和值对象上。</p><p>然而，当领域中的某个重要的过程或转换操作不是实体和值对象的自然职责时，如果强加到实体或者值对象上，会显得非常的突兀并且不合理。</p><p>这种情况下，应该定义一个独立的接口，在接口中声明这样的操作，这样的接口就是领域服务（Domain Service）。</p><h2 id="_2-领域服务的特点" tabindex="-1">2. 领域服务的特点 <a class="header-anchor" href="#_2-领域服务的特点" aria-hidden="true">#</a></h2><p>第一点，领域服务与领域相关，但是领域服务的操作无法归属于实体和值对象。</p><p>第二点，接口是根据操作命名定义的。</p><p>第三点，领域服务是无状态的，更多类似工具类一样的角色。</p><h2 id="_3-领域服务实践" tabindex="-1">3. 领域服务实践 <a class="header-anchor" href="#_3-领域服务实践" aria-hidden="true">#</a></h2><p>创建领域服务时要经过慎重考虑，确认领域服务的操作不能归属于实体和值对象，否则会造成领域服务的滥用，形成新的贫血模型。</p><p>领域服务通常根据其实现的功能进行进行命名，例如导出数据到Excel的领域服务可命名为DomainExportService。</p><p>领域服务通常以多个领域对象作为入参，以值对象作为出参。</p><p>以上面说的DomainExportService为例。</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">DomainExportService</span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    /**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">    * 多个领域对象作为入参，以值对象作为出参</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">ExcelData</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">export</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">List</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">DomainObject</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">list</span><span style="color:#89DDFF;">);</span><span style="color:#A6ACCD;"> </span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>而在Application Service中我们这样使用：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">ApplicationService</span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">@</span><span style="color:#C792EA;">Resource</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">DomainExportService</span><span style="color:#A6ACCD;"> domainExportService</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">Excel</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">exportToExcel</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">Params</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">params</span><span style="color:#89DDFF;">){</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//TODO 加载领域模型</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//将领域模型转为输出</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">ExcelData</span><span style="color:#A6ACCD;"> excelData </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> domainExportService</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">export</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">list</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//TODO 根据ExcelData生成Excel文件并返回</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> excel</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="_4-领域服务与应用服务的区别" tabindex="-1">4. 领域服务与应用服务的区别 <a class="header-anchor" href="#_4-领域服务与应用服务的区别" aria-hidden="true">#</a></h2><p>领域服务（Domain Service）是领域知识的一部分，领域服务可以理解领域模型内部的逻辑。</p><p>应用服务（Application Service）不是领域知识，应用服务也不应该去理解领域模型，不会做业务逻辑处理。</p>`,20),o=[e];function t(c,r,i,D,y,A){return n(),a("div",null,o)}const d=s(p,[["render",t]]);export{F as __pageData,d as default};
