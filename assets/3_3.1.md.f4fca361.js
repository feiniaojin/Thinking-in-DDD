import{_ as s,c as a,o as n,a as p}from"./app.a40d8636.js";const d=JSON.parse('{"title":"3.1 实体和值对象","description":"","frontmatter":{},"headers":[],"relativePath":"3/3.1.md"}'),l={name:"3/3.1.md"},e=p(`<h1 id="_3-1-实体和值对象" tabindex="-1">3.1 实体和值对象 <a class="header-anchor" href="#_3-1-实体和值对象" aria-hidden="true">#</a></h1><p>本文是领域驱动设计落地系列文章的第五篇，在接下来的文章中，将会着重讲解如何通过领域驱动设计的充血模型解决复杂业务问题。</p><p>本章先对实体（Entity）和值对象（Value Object）这两个基础概念进行讲解。</p><h1 id="一、实体与值对象的建模" tabindex="-1">一、实体与值对象的建模 <a class="header-anchor" href="#一、实体与值对象的建模" aria-hidden="true">#</a></h1><p>我们在电商网站购物下单时需要提供收货地址信息（一般包括省、市、区、街道、门牌号、收件人、收件人手机号等），这些信息联系非常紧密，而且需要形成一个整体才会有意义。我们能想到要把这些关系非常密切的信息建模成领域模型，从这些联系紧密的信息抽象出一个业务上的概念，也就是“收货地址信息”，但将其建模成实体（Entity），还是建模成值对象（Value Object）比较合适呢？这是作者经常被问到的问题。</p><p>实体（Entity）和值对象（Value Object）是对事物进行领域建模后的两种表现形式，两者在技术实现上的区别在于有没有业务唯一标识。</p><p>许多资料将技术上的区别当成实体和值对象的根本区别，但技术实现是一种表象，其根本原因是在一个限界上下文内是否关心某个领域模型在业务上的唯一性和连续性。</p><p>收货地址信息建模成实体，还是建模成值对象，在不同的限界上下文中是不一样的。</p><h1 id="_1-收货地址服务对地址信息的建模" tabindex="-1">1. 收货地址服务对地址信息的建模 <a class="header-anchor" href="#_1-收货地址服务对地址信息的建模" aria-hidden="true">#</a></h1><p>电商APP中一般都会有地址管理这个功能，也就是用户收货地址服务。通过地址管理功能，用户可以预先录入地址信息，并将某个地址设置为默认地址，在用户下单的时候可以直接选择已录入的地址信息，避免多次重复输入，提升用户体验。</p><p><img src="https://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/6d63f9653db445c2adae9295746f41c4~noop.image?_iz=58558&amp;from=article.pc_detail&amp;x-expires=1675793125&amp;x-signature=v4P28EvCQ0Komj0HT6ZfsxAQUgc%3D" alt="">地址列表页与新建收货地址页</p><p>注意，“将某个地址设置为默认地址”这句话体现了两个逻辑：</p><p>第一，用户可以录入自己的收货地址，并且在后续可以对其进行业务操作，例如设置为默认地址、取消设置默认地址，这体现了连续性；</p><p>第二，用户可以将某个地址信息设置为默认地址，而不是将其他的地址设置为默认，也就意味着这些地址信息之间是需要区分的。省、市、区、街道、门牌号、收货人、收货人手机号等每个字段都一模一样的A和B两个地址，但是用户选择将B设置为常用地址，可以看出其属性（省、市、区、街道、门牌号等）并不是其核心特征，只要确定了“B&quot;这个地址，甚至其属性可以是任意的，而是“B&quot;这个唯一标识，才是区分“A&quot;和“B&quot;的关键，这体现了唯一性。</p><p>有读者会问，地址信息不一样的两个地址，例如一个是朝阳的地址，一个是海淀的地址，我们将朝阳的地址设置为默认地址，是不是地址信息的属性起了决定作用？其实这种情况我们看起来是根据属性做的选择，本质上是根据属性筛选出某个唯一标识，然后将这个唯一标识对应的地址信息设置为默认地址。</p><p>在用户收货地址服务中并不关心地址信息的各个属性。某个被设置为默认的收货地址，我们通过唯一标识获取到其对应的属性后，完全有可能把省、市、区、街道、门牌号等信息全部都修改为新的值，但这个地址依旧被标记为默认地址，虽然可能已经和原来代表的地理位置相差了十万八千里。</p><p>因此，在用户收货地址服务中，我们自然而然地把地址对象建模成实体，并且在用户添加地址时赋予一个业务上的唯一标识。</p><blockquote><p>注意，这个唯一标识是业务上的，通常不会使用数据库中table的自增主键作为业务的唯一标识，而是通过分布式ID服务申请一个唯一标识。</p></blockquote><h1 id="_2-订单、配送服务对地址信息的建模" tabindex="-1">2. 订单、配送服务对地址信息的建模 <a class="header-anchor" href="#_2-订单、配送服务对地址信息的建模" aria-hidden="true">#</a></h1><p>用户下单时，订单、配送服务通常会保存地址的快照，此时并不关心这个地址信息是否有唯一标识，也不关心是用户下单时录入的，还是用户从地址薄里选择的，它只是对订单的配送地址做了描述。</p><p>订单、配送服务的地址信息，其生命周期与订单、运单等实体的生命周期相同。通常我们不会单独关注这个地址信息，一般都是关注某个特定订单、运单的地址信息。这是因为地址信息这个领域对象，其描述的是对应聚合根的某个特征，只有在其聚合根的范围内才有意义。</p><p>在订单、配送服务中，有时候在数据库层面，有可能会将地址信息存储在单独的一张表中，通常称之为扩展表。此时虽然地址信息的数据库记录有table的自增主键，但是其并没有业务上的唯一标识，所以我们不要将其错误地认为此时地址信息被建模为实体了。关于这种单独扩展表存储的值对象在技术上该如何实现，读者可参考本系列文章<a href="https://www.toutiao.com/i7128300706108342823/?group_id=7128300706108342823?group_id=7128300706108342823" target="_blank" rel="noreferrer">Thinking in DDD（四）</a>，文中详细讲解了使用扩展表存储的数据模型该如何映射为领域模型。</p><p>我们从数据库读取某个订单的地址信息，一般都是通过其订单号进行查询的，脱离了订单的订单收货地址，即使强行为其赋予了唯一标识，业务上也没有意义。</p><p>我们一般将值对象建模为不可变对象，一经创建，则值对象的属性不能修改，如果需要修改值对象的属性，必须重新生成值对象，使用新的值对象整体替换旧的值对象。有时候会直接把值对象的属性设置为final，通过构造方法实例化对象之后，其属性就无法更改，这当然是非常好的实践。假如由于其他的原因不得不暴露了set方法，则可以通过形成开发团队内的研发规范，约定不通过set方法修改值对象的属性，而是通过无副作用函数产生新的值对象以满足修改值对象属性的需求。</p><h1 id="二、无副作用函数" tabindex="-1">二、无副作用函数 <a class="header-anchor" href="#二、无副作用函数" aria-hidden="true">#</a></h1><h1 id="_1-无副作用函数的定义" tabindex="-1">1.无副作用函数的定义 <a class="header-anchor" href="#_1-无副作用函数的定义" aria-hidden="true">#</a></h1><p>无副作用函数不是什么新的概念，在《领域驱动设计 软件核心复杂性应对之道》、《实现领域驱动设计》、《重构 改善既有代码的设计》等许多书中均有提及。</p><p>函数的副作用指的是函数除了其声明的作用之外，还在函数体内部做了一些暗箱操作，主要是对外进行写操作，例如修改某些全局配置项、修改某些状态值。</p><p>这种未声明的副作用很容易导致线上系统出现无法预知的异常，引发线上事故。一般来说，某个特定的调用方、在某个特定的调用时机，调用这种有未声明副作用的函数，是可以得到正确的结果的，然而一旦其他调用方在不了解函数内部实现的情况下调用了这类函数，或者在错误的时机进行了调用，就很有可能导致错误的结果。</p><p>函数产生副作用的问题，在查询和命令不分离方法中也很常见：一个方法本应该是执行命令（Command），引起领域对象状态改变的，但是却返回了查询结果；一个方法本应该是查询(Query)，不应引起领域对象状态改变的，却在内部对外实施写操作，改变了领域对象的状态。因此，查询和命令要分开：要么实现为查询，纯粹返回查询结果；要么实现为命令，纯粹进行状态变更，不返回查询结果。</p><p>无副作用函数，也就是除了函数声明的作用外，不会引起其他隐藏变化的函数，执行某个函数（即方法）时，不会修改入参、不会修改外部的状态。无副作用函数之所以在领域驱动设计中再次被提及，主要是无副作用函数的特性与值对象非常贴合，无副作用函数搭配值对象使用，能使值对象如虎添翼。</p><p>函数产生副作用的问题，举个例子：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public ArticleEntity findById(String articleId){</span></span>
<span class="line"><span style="color:#A6ACCD;">    //根据id加载某个实体</span></span>
<span class="line"><span style="color:#A6ACCD;">    ArticleEntity entity=repository.load(articleId);</span></span>
<span class="line"><span style="color:#A6ACCD;">    //生成一个缓存key，用于统计某个实体被访问的次数</span></span>
<span class="line"><span style="color:#A6ACCD;">    String key=&quot;article:pv:&quot;+articleId;</span></span>
<span class="line"><span style="color:#A6ACCD;">    //缓存中访问次数加1</span></span>
<span class="line"><span style="color:#A6ACCD;">    cache.incr(key,1);</span></span>
<span class="line"><span style="color:#A6ACCD;">    return entity;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>以上这段代码的主要逻辑是：在CMS应用中，读者阅读某个文章时需要加载文章详情，因此提供findById方法，根据articleIdI加载文章实体，然而方法将entity返回之前，还操作缓存给这个文章的访问次数加1。这个方法理应只进行查询返回文章实体，但却在执行过程中修改文章的访问次数，因此这个方法是有副作用的。</p><p>函数的副作用很容易导致很难排查的错误。以上面的代码为例，可能一开始的时候是正常运行的，在别的地方读取这个访问次数的缓存时，也能返回正确的访问次数。随着需求的迭代，某天有个定时任务不断地根据articleIdi调用findById方法查询实体，就会突然出现访问次数离奇增加的问题。</p><blockquote><p>实际项目中的统计某个页面的访问次数一般通过埋点和大数据实时处理，此处只是用来给展示函数的副作用，非生产环境实现方案。</p></blockquote><p>另外，方法缓存自己的查询结果是无副作用的，例如：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public ArticleEntity findById2(String articleId){</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    String key=&quot;article:&quot;+articleId;</span></span>
<span class="line"><span style="color:#A6ACCD;">    ArticleEntity entity=cache.get(key);</span></span>
<span class="line"><span style="color:#A6ACCD;">    if(entity!=null){</span></span>
<span class="line"><span style="color:#A6ACCD;">				return entity;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">    entity=repository.load(articleId);</span></span>
<span class="line"><span style="color:#A6ACCD;">    cache.set(key,entity);</span></span>
<span class="line"><span style="color:#A6ACCD;">    return entity;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>findById2这个方法通过articleId查询文章，查询时先尝试通过缓存获取，如果能获取到，直接返回从缓存中取出来的文章；如果获取不到则通过repository的load方法加载，并将其缓存。虽然在这个方法中也操作了缓存，但是并没有对外造成影响，所以findById2也是无副作用的。</p><h1 id="_2-无副作用函数的实现方法" tabindex="-1">2.无副作用函数的实现方法 <a class="header-anchor" href="#_2-无副作用函数的实现方法" aria-hidden="true">#</a></h1><p>无副作用函数有两种实现方式：纯函数，以及不修改外部数据的非纯函数。</p><ul><li>纯函数</li></ul><p>纯函数是指，用于计算的所有输入均来自方法的入参，函数计算时不依赖非入参的数据，函数执行的结果只通过返回值传递到外部，不会修改入参的函数。</p><p>举个例子：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">//这是一个纯函数，函数不依赖非入参的外部数据，执行的结果通过返回值传递到外部</span></span>
<span class="line"><span style="color:#A6ACCD;">public int sum(int x,int y){</span></span>
<span class="line"><span style="color:#A6ACCD;">    return x+y;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li>非纯函数</li></ul><p>非纯函数在执行的过程中依赖了外部的数据，如果希望非纯函数成为无副作用函数，那么非纯函数不应该修改外部的值。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class CustomInt{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    private int a;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public CustomInt(int a){</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.a=a;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    //这个方法依赖了属性a，但是并没有修改a的值</span></span>
<span class="line"><span style="color:#A6ACCD;">    public int plus(int x){</span></span>
<span class="line"><span style="color:#A6ACCD;">        return a+x;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>以上这个plus方法在计算时不仅依赖入参x，还需要依赖CustomInt的属性a，因此plus方法是非纯函数。</p><p>虽然plus方法依赖了CustomInt的属性a，但是plus方法并没有修改a的值，因此plus方法也是无副作用的。</p><h1 id="_3-无副作用的值对象方法" tabindex="-1">3.无副作用的值对象方法 <a class="header-anchor" href="#_3-无副作用的值对象方法" aria-hidden="true">#</a></h1><p>值对象的属性一般要求不可变，值对象对外提供的方法，我们要求实现为无副作用函数。</p><p>值对象的方法，如果返回类型也是值对象，我们要求创建新的值对象进行返回，而不是修改原有值对象的属性。</p><p>案例如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class CustomInt{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    private int a;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public CustomInt(int a){</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.a=a;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public CustomInt plus(int x){</span></span>
<span class="line"><span style="color:#A6ACCD;">        return new CustomInt(a+x);</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>plus这个方法需要返回CustomInt类型的结果，我们不是通过修改旧的值对象，而是通过创建新的值对象进行返回。</p><h1 id="三、领域对象的创建" tabindex="-1">三、领域对象的创建 <a class="header-anchor" href="#三、领域对象的创建" aria-hidden="true">#</a></h1><p>领域对象的创建过程，我们要求是原子的：不管是通过构造方法，还是通过Factory/Builder进行创建，创建完成的领域对象必须包含其必须的属性，且创建完成的对象必须满足业务规则，在创建过程中，任意必须的业务规则得不到满足，都必须终止创建过程。</p><p>例如下文的ValueObjectFactory和CustomValue.Builder，通过Objects.requireNonNull对入参进行校验，任意必须的入参没有满足条件，立即通过抛异常结束创建过程。</p><p>特别地，值对象创建完成时所有的属性都必须被正确初始化，创建过程结束之后不允许赋值或者修改，所有的属性修改需求都必须通过创建新的值对象来满足。</p><h1 id="_1-值对象的创建" tabindex="-1">1.值对象的创建 <a class="header-anchor" href="#_1-值对象的创建" aria-hidden="true">#</a></h1><p>我们可以直接通过有入参的构造方法创建值对象，但更好的实践是提供Factory或者Builder。</p><ul><li>通过Factory创建</li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class ValueObjectFactory{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#A6ACCD;">    public ValueObject newInstance(prop1,prop2,prop3……){</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#A6ACCD;">        Objects.requireNonNull(prop1,&quot;prop1不能为空&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;">        Objects.requireNonNull(prop2,&quot;prop2不能为空&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;">        Objects.requireNonNull(prop3,&quot;prop3不能为空&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        ValueObject valueObject = new ValueObject();</span></span>
<span class="line"><span style="color:#A6ACCD;">				valueObject.setProp1(prop1);</span></span>
<span class="line"><span style="color:#A6ACCD;">				//省略其余赋值语句</span></span>
<span class="line"><span style="color:#A6ACCD;">				return valueObject;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li>通过Builder创建</li></ul><p>如果值对象需要初始化的属性比较多，很容易导致工厂方法入参过多，我们可以采用建造者模式改善这种情况。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class CustomValue {</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    private String prop1;</span></span>
<span class="line"><span style="color:#A6ACCD;">    private String prop2;</span></span>
<span class="line"><span style="color:#A6ACCD;">    private String prop3;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public static class Builder {</span></span>
<span class="line"><span style="color:#A6ACCD;">        private String prop1;</span></span>
<span class="line"><span style="color:#A6ACCD;">        private String prop2;</span></span>
<span class="line"><span style="color:#A6ACCD;">        private String prop3;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        public Builder withProp1(String prop1) {</span></span>
<span class="line"><span style="color:#A6ACCD;">            this.prop1 = prop1;</span></span>
<span class="line"><span style="color:#A6ACCD;">            return this;</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        public Builder withProp2(String prop2) {</span></span>
<span class="line"><span style="color:#A6ACCD;">            this.prop2 = prop2;</span></span>
<span class="line"><span style="color:#A6ACCD;">            return this;</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        public Builder withProp3(String prop3) {</span></span>
<span class="line"><span style="color:#A6ACCD;">            this.prop3 = prop3;</span></span>
<span class="line"><span style="color:#A6ACCD;">            return this;</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        public CustomValue build() {</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            Objects.requireNonNull(prop1,&quot;prop1不能为空&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;">            Objects.requireNonNull(prop2,&quot;prop2不能为空&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;">            Objects.requireNonNull(prop3,&quot;prop3不能为空&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">            CustomValue customValue = new CustomValue();</span></span>
<span class="line"><span style="color:#A6ACCD;">            customValue.setProp1(prop1);</span></span>
<span class="line"><span style="color:#A6ACCD;">            customValue.setProp2(prop2);</span></span>
<span class="line"><span style="color:#A6ACCD;">            customValue.setProp3(prop3);</span></span>
<span class="line"><span style="color:#A6ACCD;">            return customValue;</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">   //省略get/set方法</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>需要创建CustomValue实例时，通过其Builder进行实例化。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">CustomValue customValue = new Builder().withProp1(&quot;prop1&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">                .withProp2(&quot;prop2&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">                .withProp3(&quot;prop3&quot;).build();</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h1 id="_2-实体的创建和重建" tabindex="-1">2.实体的创建和重建 <a class="header-anchor" href="#_2-实体的创建和重建" aria-hidden="true">#</a></h1><p>在领域对象的生命周期中，实体会涉及到创建和重建。</p><h1 id="_2-1-实体的创建" tabindex="-1">2.1 实体的创建 <a class="header-anchor" href="#_2-1-实体的创建" aria-hidden="true">#</a></h1><p>创建指的是从无到有生成一个实体，并为其赋予唯一标识，创建的过程一般是通过Factory进行的。</p><p>创建实体时需要为其授予唯一标识。在《实现领域驱动设计》一书中，有多种方式生成唯一标识：用户提供唯一标识、应用程序生成唯一标识、持久化机制生成唯一标识、另一个限界上下文提供唯一标识等。</p><p>在此不对这几种方式进行展开，笔者一般在Factory创建实体时请求分布式ID服务申请一个唯一标识。</p><h1 id="_2-2-实体的重建" tabindex="-1">2.2 实体的重建 <a class="header-anchor" href="#_2-2-实体的重建" aria-hidden="true">#</a></h1><p>重建是指实体已经存在了，只不过暂时被输出到内存之外了，需要通过其唯一标识重新加载到内存中，这个重新加载到内存的过程就是重建，重建的过程往往通过Repository进行。</p><p>注意，重建的过程是面向聚合根的，因为只有聚合根才会拥有自己的Repository，才会通过Repository持久化自己。聚合根内部的实体不会拥有自己的Repository，聚合根内的实体的重建，只是聚合根重建的一个环节。</p><p>关于聚合、聚合根相关的知识，以后会在专门的章节讲解，此处先简单提一下。</p><p>聚合根通过Repository被持久化时，这个过程中先Repository把领域模型翻译成数据库对应的数据模型，再由对应的ORM组件将数据模型持久化到数据库；聚合根通过Repository被加载时，Repository先通过ORM组件将数据库记录读取为数据模型，再由Repository将数据模型翻译为领域模型（此处即聚合根）。</p><p>非常不建议直接将领域模型映射到数据库的表，许多框架都提供了将领域模型中的实体或者值对象映射到表的实现，但我认为这不是一个好的实践，一方面使得领域模型承担的职责不再单一，一方面使得领域模型被数据库设计绑架。</p><p>有的资料把聚合根的创建和重建统一放到Factory中，我这也不是好的实践。实体的重建和创建是不同的概念：创建实体时Factory不需要通过数据模型获取数据，直接操作领域模型（实体和值对象）即可；重建实体一般发生在持久化层，Repository需要了解如何将数据模型映射为领域模型。</p><p>可以从现实生活去理解这两个过程：汽车通过工厂（Factory）从无到有被生产出来，我们将汽车停到车库（Repository）后，我们并不关心车库是怎么存这辆车的，可能车库将车一个个零件拆下来存（例如将实体翻译为数据模型，再存到数据库中），也可能整体地存（例如直接转成JSON字符串存入缓存），只要我们根据车牌号（即唯一标识）去车库取车的时候，车库能正常把车提供给我们即可。</p>`,83),o=[e];function t(c,i,r,C,A,u){return n(),a("div",null,o)}const D=s(l,[["render",t]]);export{d as __pageData,D as default};
