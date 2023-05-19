import{_ as e,c as t,o as i,a as p}from"./app.d9f712a7.js";const D=JSON.parse('{"title":"子域","description":"","frontmatter":{},"headers":[{"level":2,"title":"1. 子域的定义","slug":"_1-子域的定义","link":"#_1-子域的定义","children":[]},{"level":2,"title":"2. 子域划分","slug":"_2-子域划分","link":"#_2-子域划分","children":[{"level":3,"title":"2.1 核心子域","slug":"_2-1-核心子域","link":"#_2-1-核心子域","children":[]},{"level":3,"title":"2.2 通用子域","slug":"_2-2-通用子域","link":"#_2-2-通用子域","children":[]}]}],"relativePath":"StrategicDesign/SubDomain.md"}'),l={name:"StrategicDesign/SubDomain.md"},a=p('<h1 id="子域" tabindex="-1">子域 <a class="header-anchor" href="#子域" aria-hidden="true">#</a></h1><h2 id="_1-子域的定义" tabindex="-1">1. 子域的定义 <a class="header-anchor" href="#_1-子域的定义" aria-hidden="true">#</a></h2><p>子域的是对已存在的领域进行精炼的结果。因此，要划分子域，必须先有领域、先有限界上下文、先有模型。</p><blockquote><p>精炼是把一堆混杂在一起的组件分开的过程，以便从中提取出最重要、最有价值的内容。</p></blockquote><p>目前业界把子域定义在所谓的&quot;问题空间&quot;，把限界上下文归在&quot;解空间&quot;，这是错误的认知。&quot;问题空间&quot;和&quot;解空间&quot; 其实隐含了一种因果关系：先有问题才能有“解”，也就是说必须先有子域才有限界上下文，但这正好与子域的定位相反。</p><p>我们之所以对子域的概念觉得别扭，是因为子域并不是用来指导限界上下文划分的，而是对领域进行精炼的过程。正是因为业界对子域的认识颠倒了，所以业界没有办法解释限界上下文和子域之间的关系。</p><p>对子域正确的认知：先有领域；划定限界上下文，建模领域模型；根据现有的限界上下文和模型进行精炼抽取子域。</p><p>用《道德经》的话说，道生一（先有领域），一生二（划定限界上下文，建模领域模型），二生三（根据现有的限界上下文和模型进行精炼抽取子域）。</p><p>在这里以炼丹为例进行说明：</p><p>读过玄幻修真小说的都知道，&quot;丹药&quot;是小说中必不可少的道具，许多修真大能更是在练气期把&quot;筑基丹&quot; 当糖果嗑。由于炼丹师的水平参差不齐，有的炼丹师炼制的&quot;筑基丹&quot; 里面含有比较多的杂质，这些杂质并不能帮助修真者突破修炼瓶颈，反而是对人体有害的。由于纯度越高的筑基丹效果越明显，因此，为了提高&quot; 筑基丹&quot;的使用效果，炼丹师就会对&quot;筑基丹&quot;进行精炼，把里面的杂质抽取出去。</p><p>显而易见，必须先有实实在在的&quot;筑基丹&quot; ，炼丹师才能开始精炼提纯，而且精炼之前并不知道具体有什么杂质；炼丹师不可能在没有&quot;筑基丹&quot;的情况下就开始精炼并提炼出杂质。</p><h2 id="_2-子域划分" tabindex="-1">2. 子域划分 <a class="header-anchor" href="#_2-子域划分" aria-hidden="true">#</a></h2><p>划分子域的目的是为了更好地组织业务领域模型，使其更加清晰、简洁和易于理解。通过将业务领域划分为不同的子域，我们可以更加专注地处理每个子域的业务需求，减少复杂性和耦合性，提高代码的可维护性和可扩展性。</p><p>另外，划分子域还可以帮助我们更好地进行团队协作。不同的团队可以负责不同的子域开发，减少不同团队之间的干扰和冲突。</p><p>通过对领域的抽取，可以得到核心子域（Core SubDomain）、通用子域（Generic Subdomain）。</p><h3 id="_2-1-核心子域" tabindex="-1">2.1 核心子域 <a class="header-anchor" href="#_2-1-核心子域" aria-hidden="true">#</a></h3><ul><li>核心子域的定义</li></ul><p>核心子域是指业务系统中最重要、最核心的部分。它通常包含了业务系统中最关键的业务逻辑、最核心的业务数据和最重要的业务流程。核心子域通常会被认为是业务系统中最具有价值的部分，因为它直接关系到业务系统的成功与否，直接关系到业务系统的核心竞争力和盈利能力。</p><ul><li>核心子域的意义</li></ul><p>核心子域涉及到系统的核心业务逻辑和价值，是系统的灵魂所在。</p><p>核心子域通常是业务性的部分，需要深入了解业务领域并进行精细的设计和实现。如果对核心子域的理解不够深入，或者设计和实现不够精细，就无法确保业务的正确执行。</p><p>核心子域是软件系统中最容易变化的部分。随着业务发展和变化，核心子域的业务规则和流程也会发生变化。如果对核心子域的变化不够敏感或者不够及时地进行更新，就会导致软件系统无法满足业务需求。</p><ul><li>如何确定核心子域</li></ul><p>确定核心子域需要深入了解业务领域，并与业务专家进行紧密合作。在DDD中，可以通过以下几个方面来确定核心子域：</p><p>业务价值：确定哪些子域对业务价值贡献最大，哪些子域是系统的核心部分。</p><p>业务复杂度：确定哪些子域的业务规则和流程最为复杂，需要进行深入的设计和实现。</p><p>业务变化：确定哪些子域的业务规则和流程最容易发生变化，需要进行灵活的设计和实现。</p><p>技术可行性：确定哪些子域的技术实现难度较高，需要进行技术评估和方案设计。</p><h3 id="_2-2-通用子域" tabindex="-1">2.2 通用子域 <a class="header-anchor" href="#_2-2-通用子域" aria-hidden="true">#</a></h3><ul><li>通用子域的定义</li></ul><p>通用子域的概念最早是由Eric Evans在《领域驱动设计》中提出的。他认为，在大型软件系统中，不同的领域模型之间往往存在着一些共同的概念和业务流程。这些共同点可以抽象成通用子域，以便多个领域模型都可以使用。</p><p>在多个业务领域中都存在的一些通用概念或者通用业务流程，这些通用的东西可以抽取出来，将其作为一个独立的模块进行设计和实现，形成一个子域，其他业务领域都可以使用这个子域，因为这个子域具备通用性，因此称之为通用子域。</p><ul><li>通用子域通常的特点</li></ul><p>与业务相关：通用子域是与业务相关的，而不是与技术相关的。通用子域自身有一定的业务行为，是用来支持核心业务执行的；与技术相关的例如基础设施（缓存、数据库、消息队列等中间件），是不会被视作通用子域的。</p><p>不属于任何一个具体的领域模型：通用子域不属于任何一个具体的领域模型，而是多个领域模型都需要使用到的共同子集。</p><p>可复用：通用子域是可复用的，可以在不同的领域模型中使用，从而提高系统的可维护性和灵活性。</p><p>可扩展：通用子域是可扩展的，可以根据业务需求进行扩展和修改。</p><ul><li>常见的通用子域</li></ul><p>常见的通用子域有很多，在这简单举例如下。</p><p>用户管理：用户管理的功能在多个领域模型都会使用到，因此可以将用户管理抽取为通用子域。用户管理子域包括用户注册、登录、权限管理等功能。</p><p>通知与消息：许多场景例如物流信息更新、流程审核结果等，都需要通知用户，因此可将通知和消息抽取为通用子域。通知与消息包括电子邮件、短信、推送通知等。</p><hr><div><img src="https://s1.ax1x.com/2023/04/15/p9p2mKP.jpg"></div><p>欢迎加入本书作者的知识星球，在星球中您将获得：</p><ul><li>本书作者答疑，无论是DDD学习过程中的问题，还是对现有项目进行DDD重构，都可以一起探讨</li><li>获得本书配套源码以及多个完整的DDD项目实战源码，包括权限系统、电商系统、校招平台、直播平台等项目</li><li>DDD属于开发中的高阶知识，历来掌握者寥寥，研究DDD的同行职级都不低，这里是拓宽人脉的好地方</li><li>与即将推出的《TOGAF架构方法论》、《悟道项目管理》、《悟道团队管理》、《悟道产品经理》等书共用一个星球，一次加入即可同时可获得其他知识专题的答疑</li></ul>',45),o=[a];function u(r,n,d,_,c,h){return i(),t("div",null,o)}const q=e(l,[["render",u]]);export{D as __pageData,q as default};
