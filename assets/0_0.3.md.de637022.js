import{_ as D,c as p,o as t,a as e}from"./app.ac4c3fb8.js";const h=JSON.parse('{"title":"全文导读","description":"","frontmatter":{},"headers":[],"relativePath":"0/0.3.md"}'),i={name:"0/0.3.md"},a=e('<h1 id="全文导读" tabindex="-1">全文导读 <a class="header-anchor" href="#全文导读" aria-hidden="true">#</a></h1><p>DDD（Domain-Driven Design，领域驱动设计）是面向对象的极致，是业务代码的巅峰，是微服务架构的灵魂。</p><p>DDD 火爆了二十年，然而至今鲜有成功落地的案例。大部分时候我们听得比较多的，都是“根据 DDD 的思想做的服务拆分“之类的话术，我个人感觉这种话术基本都是在碰瓷。</p><p>DDD 落地难的原因有很多：</p><ul><li><p>一方面，DDD 不是技术架构，没有明确的代码规范。事实上目前业界也没有很好的实践指南，因此无法像日常开发一样先定义接口文档，然后大家按照文档按图索骥地开发，每个人、每个研发团队对 DDD 的理解都不一样；</p></li><li><p>一方面，DDD 的门槛比较高，学习曲线非常陡峭。《 <strong>领域驱动设计 软件核心复杂性应对之道</strong> 》、《 <strong>实现领域驱动设计</strong> 》这两本书概念繁多、晦涩难懂，除此之外，还有经典四层架构、六边形架构、整洁架构、CQRS、应用服务、领域服务、领域事件等非常多的概念，里面水太深新手实在把握不住。</p></li></ul><p>有感于 DDD 落地难，因此作者希望借由本书向大家分享我个人的 DDD 实战经验和教训。我尝试着降低学习难度，为大家摸索一条稍微平坦的学习路径。我相信只要按照这个路径进行学习，读者一定都能掌握 DDD。</p><p>以下是全书导读：</p><p>第 0 章，主要是前言、作者简介部分。</p><p>第 1 章，1.1 主要是带领读者初步认识领域驱动设计的一些核心概念，笔者试图用较少的篇幅，让读者对领域驱动设计有个大体的了解；1.2 之后会给读者介绍该如何学习 DDD，希望通过我的学习经历，使读者能少走弯路；1.3 则是笔者整理的目前 DDD 落地过程中的一些常见问题答疑，理清楚这些问题有利于念头通达，在学习的过程中就不会迷惘了。</p><p>第 2 章，主要讲解 DDD 落地时采用的应用架构。在我们将领域知识转化成代码时，需要有合适的应用架构去承接，我们经常看到很多尝试 DDD 的团队什么领域建模、限界上下文划分、子域划分搞得头头是道，但是落实到代码层面时根本无从下手，最直接的原因就是没有很好的应用架构。在本章，我将带领大家从常用的三层架构出发，一起推导出适合 DDD 的应用架构，大家掌握了该应用架构之后，不仅能落地 DDD，对大家的编码水平也能带来一定的提升。之后还会详细讲解该应用架构的各个模块，以及领域对象的生命周期、应用架构中各层交互时的数据类型流转。</p><p>第 3 章，主要讲解领域驱动设计的一些核心概念。之所以没有一开始就讲这些概念，是因为脱离了代码讲纯概念会让读者很难理解，因此我讲这一章安排在应用架构之后，希望能降低大家的理解难度。本章将会介绍实体和值对象、聚合与聚合根，以及限界上下文等概念，这些可以说是 DDD 的核心概念了。领域事件也是非常重要的概念，会放到第 6 章去专门讲。</p><p>第 4 章，讲解 DDD 涉及到的核心组件。这些组件的存在的目的，是为了维护领域对象的生命周期，一定是跟领域对象的生命周期息息相关的。其中 Factory 组件用于创建领域对象，Repository 组件用于加载和保存领域对象，两者的区别在于 Factory 是从 0 开始创造领域对象，Repository 则是用于维护已有的领域对象。</p><p>第 5 章，讲解如何在 DDD 中实现复杂的业务逻辑。我们前几章已经了解了许多 DDD 的概念，应用这些知识实现简单的业务逻辑相信是没有问题的，但是在实现复杂的逻辑时，难免有点束手束脚，这一章我将帮大家打通任督二脉，复杂的业务实现从此不在话下。</p><p>第 6 章，介绍领域事件。领域事件也是 DDD 中非常核心的概念，领域事件在异步处理、跨聚合一致性、CQRS 中有非常重要的应用。我们将会探讨该以什么方式发布领域消息、领域消息该包含哪些内容、如何确保领域消息不会丢失、如何确保领域消息不会重复消费等话题。</p><p>第 7 章，介绍 CQRS。我们有领域消息的基础后，我们将展开 CQRS 的学习。CQRS 是一个非常宽广的话题，我不仅会给大家介绍方法级别的 CQRS，也会给大家介绍架构级别的 CQRS。事件溯源的实现往往跟 CQRS 分不开，但事件溯源并不只是 CQRS，DDD 的实践者们一直在探索事件溯源的落地方案，在本章我将会给大家介绍我所采用的方案。</p><p>第 8 章，在本章我们将会讨论 DDD 下的一致性，例如如何实现聚合内的强制一致，以及跨聚合的最终一致性。</p><p>第 9 章，在本章我们将会探讨 DDD 下的代码质量保障。我们使用 DDD 去落地复杂的业务逻辑，如果我们 DDD 工程本身的代码质量不高，往往是抛弃了一个大泥球，又自己亲手创造一个大泥球，所以我们在编码过程中要确保代码质量，提高代码的可读性、可维护性。</p><p>第 10 章，在本章中我将会给大家介绍一些 DDD 的生态建设，这些主要是我个人的一些开源项目。DDD 落地难的原因，一方面是缺少成功案例，一方面也是生态基础的薄弱，我希望未来读者与我一起，投身于 DDD 生态基础建设。</p><p>第 11 章，在本章中我们会探讨如何进行领域建模。在很多书中领域建模被放到了第一章或者比较考前的位置，在读者对 DDD 缺乏基本理解的时候，探讨领域建模意义不大，可以说 DDD 里面都吹牛大师，都是因为首先接触的就是领域建模。脚踏实地才是最快的捷径，我希望读者能务实地落地 DDD，我把领域建模放到了最后。</p><hr><p>欢迎加入本书作者的知识星球，在星球中您将获得：</p><ul><li>本书作者答疑，无论是DDD学习过程中的问题，还是对现有项目进行DDD重构，都可以找作者唠唠</li><li>获得本书配套源码以及多套完整的DDD项目实战源码，包括权限系统、电商系统、校招平台、直播平台等项目</li><li>DDD属于开发中的高阶知识，历来掌握者寥寥，研究DDD的同行职级都不低，这里是拓宽人脉的好地方</li><li>与即将推出的《TOGAF架构方法论》、《悟道项目管理》、《悟道团队管理》、《悟道产品经理》等书共用一个星球，一次加入即可同时可获得其他知识专题的答疑</li></ul><div><img src="https://s1.ax1x.com/2023/04/15/p9p2mKP.jpg"></div>',23),o=[a];function r(s,_,n,c,l,d){return t(),p("div",null,o)}const m=D(i,[["render",r]]);export{h as __pageData,m as default};
