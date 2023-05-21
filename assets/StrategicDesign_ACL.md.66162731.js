import{_ as s,c as a,o as n,a as l}from"./app.9803107f.js";const i=JSON.parse('{"title":"防腐层(Anti-Corruption Layer)","description":"","frontmatter":{},"headers":[{"level":2,"title":"1. 防腐层的概念理解","slug":"_1-防腐层的概念理解","link":"#_1-防腐层的概念理解","children":[]},{"level":2,"title":"2. 防腐层的设计与实现","slug":"_2-防腐层的设计与实现","link":"#_2-防腐层的设计与实现","children":[]}],"relativePath":"StrategicDesign/ACL.md"}'),p={name:"StrategicDesign/ACL.md"},o=l(`<h1 id="防腐层-anti-corruption-layer" tabindex="-1">防腐层(Anti-Corruption Layer) <a class="header-anchor" href="#防腐层-anti-corruption-layer" aria-hidden="true">#</a></h1><h2 id="_1-防腐层的概念理解" tabindex="-1">1. 防腐层的概念理解 <a class="header-anchor" href="#_1-防腐层的概念理解" aria-hidden="true">#</a></h2><p>多个上下文进行交互时会涉及到多个领域模型，如果我们直接将外部上下文的模型引入到本地上下文，往往会出现很多问题，比如命名冲突、数据类型不匹配、业务逻辑不一致、外部上下文模型变更导致本地上下文模型改动等等。为了屏蔽外部上下文的领域模型，避免其污染本地模型，我们使用防腐层解决引用外部上下文模型的问题。</p><p>防腐层（Anti-Corruption Layer，ACL）是 DDD 中的一个重要概念，是一种隔离外部上下文、确保本地上下文中的领域模型能够保持独立和纯净的方法。</p><p>防腐层通过一系列的转换和映射来将外部的数据转换为本地限界上下文的领域模型所需要的数据格式，即使外部系统和服务发生了变化，本地上下文也不会受到影响。</p><p>举个例子，有 A 和 B 两个上下文，其中 B 通过开放主机服务提供对外访问，A 上下文请求 B 上下文的 RPC 接口时，B 将会返回一个模型，如果 A 直接在领域模型中引用 B 返回的模型，将会早上 A 上下文被污染。</p><p>B 上下文对外提供的 RPC 接口：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"> * B上下文对外暴露的查询服务，查询</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"> */</span></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">BRpcQueryService</span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">Response</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">BView</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">query</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">Query</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">query</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">BView</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">Integer</span><span style="color:#A6ACCD;"> property1</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">String</span><span style="color:#A6ACCD;"> property2</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//省略其他属性以及get/set方法</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>当 A 调用<code>ContextBQueryService</code>的<code>query1</code>方法，将会得到<code>BView</code>这个类。如果 A 的领域模型直接引用了 BView，将会导致 A 自己的上下文被污染，容易引发很多问题：</p><ul><li><p>类级别的：随着 B 上下文的迭代，可能 BView 这个类路径、名称、属性名等都会改变。举个例子，B 上下文可能会进行系统重构，重构时会重新发布一个新的 jar 包，要求调用方切换到的新的 jar 包上，这个情况在我实际工作中遇到的不少。如果直接将 BView 引入到本地上下文中，A 将需要进行大量的改动，并且需要大量回归测试才能确保切换无风险。</p></li><li><p>属性级别的：BView 中的某个属性的类型与 A 上下文中对应的属性类型并不一致，因而使用时必须进行强转；BView 中某个字段的名称与本地上下文某个字段的名称相同，调用时容易引起歧义，例如我在工作中遇到过外部接口返回的模型中有个<code>source</code>字段，本地领域模型中也有一个<code>source</code>字段，但是两者的含义并不一致。</p></li></ul><h2 id="_2-防腐层的设计与实现" tabindex="-1">2. 防腐层的设计与实现 <a class="header-anchor" href="#_2-防腐层的设计与实现" aria-hidden="true">#</a></h2><p>防腐层的设计和实现并不难，主要注意一下要点：</p><ul><li>防腐层方法返回值必须是本地上下文的值对象或者基本数据类型，不得返回外部上下文的模型</li></ul><p>伪代码如下：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">BContextGateway</span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">BRpcQueryService</span><span style="color:#A6ACCD;"> bRpc</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">SomeValue</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">queryFromBContext</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">Prams</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">params</span><span style="color:#89DDFF;">){</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//封转查询报文</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Query</span><span style="color:#A6ACCD;"> query</span><span style="color:#89DDFF;">=this.</span><span style="color:#82AAFF;">fromPrams</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">params</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//执行查询</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Response</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">BView</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> bResponse</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">bRpc</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">query</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">query</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//忽略判空、查询失败等逻辑</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">BView</span><span style="color:#A6ACCD;"> bView</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">bResponse</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getData</span><span style="color:#89DDFF;">();</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//重点：封装本地上下文的值对象进行返回</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">SomeValue</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">bView</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getProperty1</span><span style="color:#89DDFF;">());</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div><ul><li>防腐层方法要捕获外部异常，并抛出的本地上下文自定义的异常</li></ul><p>伪代码例子：</p><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">BContextGateway</span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">BRpcQueryService</span><span style="color:#A6ACCD;"> bRpc</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">SomeValue</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">queryFromBContext</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">Prams</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">params</span><span style="color:#89DDFF;">){</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//封转查询报文</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Query</span><span style="color:#A6ACCD;"> query</span><span style="color:#89DDFF;">=this.</span><span style="color:#82AAFF;">fromPrams</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">params</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Response</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">BView</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> bResponse</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">try</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#676E95;font-style:italic;">//查询结果</span></span>
<span class="line"><span style="color:#A6ACCD;">            bResponse</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">bRpc</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">query</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">query</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span><span style="color:#89DDFF;font-style:italic;">catch</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">Exception</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">e</span><span style="color:#89DDFF;">){</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#676E95;font-style:italic;">//重点：捕获异常，并抛出本地自定义的异常</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;font-style:italic;">throw</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">QueryContextBException</span><span style="color:#89DDFF;">();</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//省略其他逻辑</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><ul><li>外部上下文返回的错误码，应该转化成本地异常进行抛出，不应该将错误码返回给上层</li></ul><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">BContextGateway</span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">BRpcQueryService</span><span style="color:#A6ACCD;"> bRpc</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">SomeValue</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">queryFromBContext</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">Prams</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">params</span><span style="color:#89DDFF;">){</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//封转查询报文</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Query</span><span style="color:#A6ACCD;"> query</span><span style="color:#89DDFF;">=this.</span><span style="color:#82AAFF;">fromPrams</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">params</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//执行查询</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Response</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">BView</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> bResponse</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">bRpc</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">query</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">query</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//重点：根据错误码时抛出本地自定义的异常</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">equals</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">bResponse</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getCode</span><span style="color:#89DDFF;">())){</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;font-style:italic;">throw</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">QueryContextBException</span><span style="color:#89DDFF;">();</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//忽略其他逻辑</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div><ul><li>按需返回，只返回需要的字段或者数据类型。只返回需要的字段，这个很好理解不用过多解释；只返回需要的数据类型，举个例子，外部上下文可能返回字符串的 0 和 1 代表 false 和 true，但是我们本地是使用布尔类型的，因此要在防腐层转换好再返回。</li></ul><div class="language-java"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">BContextGateway</span><span style="color:#89DDFF;">{</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">private</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">BRpcQueryService</span><span style="color:#A6ACCD;"> bRpc</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">Boolean</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">checkFromBContext</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">Prams</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">params</span><span style="color:#89DDFF;">){</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//封转查询报文</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Query</span><span style="color:#A6ACCD;"> query</span><span style="color:#89DDFF;">=this.</span><span style="color:#82AAFF;">fromPrams</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">params</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//执行查询</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C792EA;">Response</span><span style="color:#89DDFF;">&lt;</span><span style="color:#C792EA;">Integer</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> bResponse</span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;">bRpc</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">check</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">query</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//重点：查询失败，根据错误码时抛出本地自定义的异常</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">ERROR</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">equals</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">bResponse</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getCode</span><span style="color:#89DDFF;">())){</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#89DDFF;font-style:italic;">throw</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">QueryContextBException</span><span style="color:#89DDFF;">();</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">        </span><span style="color:#676E95;font-style:italic;">//转换成需要的布尔类型进行返回</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">equals</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">bResponse</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getData</span><span style="color:#89DDFF;">());</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><hr><div><img src="https://s1.ax1x.com/2023/04/15/p9p2mKP.jpg"></div><p>欢迎加入本书作者的知识星球，在星球中您将获得：</p><ul><li>本书作者答疑，无论是DDD学习过程中的问题，还是对现有项目进行DDD重构，都可以一起探讨</li><li>获得本书配套源码以及多个完整的DDD项目实战源码，包括权限系统、电商系统、校招平台、直播平台等项目</li><li>DDD属于开发中的高阶知识，历来掌握者寥寥，研究DDD的同行职级都不低，这里是拓宽人脉的好地方</li><li>与即将推出的《TOGAF架构方法论》、《悟道项目管理》、《悟道团队管理》、《悟道产品经理》等书共用一个星球，一次加入即可同时可获得其他知识专题的答疑</li></ul>`,27),e=[o];function t(c,r,y,D,A,F){return n(),a("div",null,e)}const u=s(p,[["render",t]]);export{i as __pageData,u as default};
