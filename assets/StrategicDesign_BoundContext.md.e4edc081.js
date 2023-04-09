import{_ as e,c as a,o as t,a as n}from"./app.47369ddf.js";const f=JSON.parse('{"title":"限界上下文","description":"","frontmatter":{},"headers":[{"level":2,"title":"1. 限界上下文的定义","slug":"_1-限界上下文的定义","link":"#_1-限界上下文的定义","children":[]},{"level":2,"title":"2. 上下文划分","slug":"_2-上下文划分","link":"#_2-上下文划分","children":[]},{"level":2,"title":"实践经验","slug":"实践经验","link":"#实践经验","children":[]}],"relativePath":"StrategicDesign/BoundContext.md"}'),r={name:"StrategicDesign/BoundContext.md"},i=n('<h1 id="限界上下文" tabindex="-1">限界上下文 <a class="header-anchor" href="#限界上下文" aria-hidden="true">#</a></h1><h2 id="_1-限界上下文的定义" tabindex="-1">1. 限界上下文的定义 <a class="header-anchor" href="#_1-限界上下文的定义" aria-hidden="true">#</a></h2><p>限界上下文（BOUNDED CONTEXT）是在有边界的范围内相关的领域知识，限界上下文定义了每个模型的应用范围，模型只能在各自的限界上下文内使用。</p><p>领域模型在上下文内要保证统一，但不需要考虑模型在上下文外的影响，限界上下文之间的代码重用是很危险的，应该避免。</p><h2 id="_2-上下文划分" tabindex="-1">2. 上下文划分 <a class="header-anchor" href="#_2-上下文划分" aria-hidden="true">#</a></h2><p>其实在日常的开发中我们都实践过上下文的划分，只不过没有显式地归纳出来。</p><p>限界上下文的划分，主要考虑以下几个点：</p><p>首先是基于领域知识的划分，例如我们很轻易就对电商系统划分出商品上下文、订单上下文。</p><p>其次是基于组织架构的划分。不同的团队负责的开发内容不一样，大而全的统一模型反而造成沟通上的效率低下，因此为了减少沟通成本，通常都会自然而然地根据团队划分不同的上下文。</p><h2 id="实践经验" tabindex="-1">实践经验 <a class="header-anchor" href="#实践经验" aria-hidden="true">#</a></h2><p>在多团队共同开发大型系统时，要求领域模型的完全统一是不可行的，会极大地增加沟通成本。因此，要根据各团队的职责、各自可提供的能力划分上下文，让不同地团队自己在上下文内部完成建模。</p>',11),d=[i];function _(s,c,h,o,l,p){return t(),a("div",null,d)}const x=e(r,[["render",_]]);export{f as __pageData,x as default};
