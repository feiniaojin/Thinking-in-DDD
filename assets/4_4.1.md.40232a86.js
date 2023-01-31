import{_ as s,c as n,o as a,a as l}from"./app.f0191df1.js";const d=JSON.parse('{"title":"4.1 Repository","description":"","frontmatter":{},"headers":[],"relativePath":"4/4.1.md"}'),p={name:"4/4.1.md"},e=l(`<h1 id="_4-1-repository" tabindex="-1">4.1 Repository <a class="header-anchor" href="#_4-1-repository" aria-hidden="true">#</a></h1><p>假设我们在开发一个CMS应用，其核心子域是内容子域，内容子域领域模型的聚合根我们称之为Article（文章）。</p><p>关于如何分析建模未来会专门展开，此处仅为了展示领域模型与数据模型阻抗不匹配的问题以及如何领域模型与数据模型的映射。</p><h1 id="_1-初步领域建模" tabindex="-1">1.初步领域建模 <a class="header-anchor" href="#_1-初步领域建模" aria-hidden="true">#</a></h1><p>首先，分析Article的行为。类似公众号，一般会先创建一个草稿，所以Article有一个创建草稿的能力；创建好的公众号文章，可以修改标题或者内容；最后可以把草稿箱的文章发布到公众号，读者这时候可以进行阅读。</p><p>其次，分析Article的属性。文章需要有title(标题)、content(正文)两个基本的字段；Article作为一个实体，需要有自己的唯一标识，我们称之为articleId；Article涉及发布或者未发布，所以还需要有记录发布状态的的字段publishState。</p><p>于是我们得到了一个聚合根Article，如下面代码，方法的入参出参暂时先不用过多关注。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class Article{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  private String articleId;</span></span>
<span class="line"><span style="color:#A6ACCD;">  private String title;</span></span>
<span class="line"><span style="color:#A6ACCD;">  private String content;</span></span>
<span class="line"><span style="color:#A6ACCD;">  private Integer publishState;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void createDraft(){}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void modifyTitle(){}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void modifyContent(){}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void publishArticle(){}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h1 id="_2-领域知识封装" tabindex="-1">2.领域知识封装 <a class="header-anchor" href="#_2-领域知识封装" aria-hidden="true">#</a></h1><p>再进一步思考，我们每次通过articleId进行业务操作时，都需要判断articleId是否存在，所以我们把articleId字段建模为一个值对象，这样每次创建ArticleId时，构造方法中都会进行非空判断，这样把判断逻辑封装起来，想知道ArticleId有什么业务逻辑只需要看ArticleId的代码即可。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class ArticleId implements EntityId&lt;String&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    private String value;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public ArticleId() {</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public ArticleId(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.check(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.value = value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public void setValue(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.check(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.value = value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    private void check(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        Objects.requireNonNull(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        if (&quot;&quot;.equals(value)) {</span></span>
<span class="line"><span style="color:#A6ACCD;">            throw new IllegalArgumentException();</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    @Override</span></span>
<span class="line"><span style="color:#A6ACCD;">    public String getValue() {</span></span>
<span class="line"><span style="color:#A6ACCD;">        return this.value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>领域驱动设计不推荐我们在Application层使用set方法直接赋值，但是有时候我们使用的序列化框架需要进行set/get，所以我们提供了set方法，同时我们要注意在关键属性的set方法中也进行业务校验，避免盲区；另外，要在团队内部形成开发指南，在开发者的层面达成共识，避免在Application层使用没有业务含义的set方法。</p><p>思考titile和content这两个字段，自身可能包含了非空、长度限制等逻辑，并且其生命周期与聚合根的生命周期相同，也不具备自己的唯一标识，所以可以将其建模为值对象。假设titile字段不允许长度超过64，可以得到以下的值对象。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">//标题字段建模为值对象（Value Object）</span></span>
<span class="line"><span style="color:#A6ACCD;">public class ArticleTitle implements ValueObject&lt;String&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    private String value;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public ArticleTitle() {</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public ArticleTitle(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.check(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.value = value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    @Override</span></span>
<span class="line"><span style="color:#A6ACCD;">    public String getValue() {</span></span>
<span class="line"><span style="color:#A6ACCD;">        return this.value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public void setValue(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.check(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.value = value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    //未来通过规约模式做进一步优化</span></span>
<span class="line"><span style="color:#A6ACCD;">    private void check(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        Objects.requireNonNull(value, &quot;title不能为空&quot;);</span></span>
<span class="line"><span style="color:#A6ACCD;">        if (&quot;&quot;.equals(value) || value.length() &gt; 64) {</span></span>
<span class="line"><span style="color:#A6ACCD;">            throw new IllegalArgumentException();</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">//正文内容字段建模为值对象（Value Object）</span></span>
<span class="line"><span style="color:#A6ACCD;">public class ArticleContent implements ValueObject&lt;String&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    private String value;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public ArticleContent() {</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public ArticleContent(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.check(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.value = value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public void setValue(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.check(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.value = value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#A6ACCD;">    //未来通过规约模式做进一步优化</span></span>
<span class="line"><span style="color:#A6ACCD;">    private void check(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        Objects.requireNonNull(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        if (&quot;&quot;.equals(value)) {</span></span>
<span class="line"><span style="color:#A6ACCD;">            throw new IllegalArgumentException();</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    @Override</span></span>
<span class="line"><span style="color:#A6ACCD;">    public String getValue() {</span></span>
<span class="line"><span style="color:#A6ACCD;">        return this.value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>到这里，我们的领域模型Article变成：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class Article{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  private ArticleId articleId;</span></span>
<span class="line"><span style="color:#A6ACCD;">  private ArticleTitle title;</span></span>
<span class="line"><span style="color:#A6ACCD;">  private ArticleContent content;</span></span>
<span class="line"><span style="color:#A6ACCD;">  private Integer state;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void createDraft(){}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void modifyTitle(){}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void modifyContent(){}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void publishArticle(){}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h1 id="_3-领域模型持久化" tabindex="-1">3.领域模型持久化 <a class="header-anchor" href="#_3-领域模型持久化" aria-hidden="true">#</a></h1><p>领域模型的建模是不关心持久化的，只关心聚合根内领域知识是否完整，但是我们在基础设施层实现Repository时，就需要考虑如何建模数据库表结构了。</p><p>考虑ArticleContent（文章正文）这个值对象，它的值一般是富文本，文本比较长而且长度不定。这类文本在数据库层面，我们一般用text，Blob之类的类型去存储，为了考虑性能还要单独一张表，通过articleId提供查找。</p><p>所以，聚合根Article在数据库层面要存成两张表。</p><p>再者，由于公司数据库开发的规范，要求每张表必须有deleted、created_by、created_time、modified_by、modified_time这几个字段。</p><p>最后，还要求每张表都有一个自增id字段，并且自增id不能用于业务操作。</p><p>这个时候，我们得到了文章Article在数据存储层的表结构，如下：</p><ul><li>Article的基本属性由cms_article表进行存储</li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">CREATE TABLE \`cms_article\` (</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`id\` bigint NOT NULL AUTO_INCREMENT COMMENT &#39;自增主键&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`article_id\` varchar(64) NULL COMMENT &#39;article业务主键&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`title\` varchar(64) NULL COMMENT &#39;标题&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`publish_state\` int NOT NULL DEFAULT 0 COMMENT &#39;发布状态，默认为0,0未发布，1已发布&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`deleted\` tinyint NULL DEFAULT 0 COMMENT &#39;逻辑删除标记[0-正常；1-已删除]&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`created_by\` VARCHAR(100) COMMENT &#39;创建人&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`created_time\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT &#39;创建时间&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`modified_by\` VARCHAR(100) COMMENT &#39;更新人&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`modified_time\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT &#39;更新时间&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`version\` bigint DEFAULT 1 COMMENT &#39;乐观锁&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  PRIMARY KEY (\`id\`),</span></span>
<span class="line"><span style="color:#A6ACCD;">  INDEX \`idx_articleId\`(\`article_id\`)</span></span>
<span class="line"><span style="color:#A6ACCD;">) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE utf8mb4_bin COMMENT &#39;article主表&#39;;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li>Article的正文属性由cms_article_content表进行存储</li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">CREATE TABLE \`cms_article_content\` (</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`id\` bigint NOT NULL AUTO_INCREMENT COMMENT &#39;自增主键&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`article_id\` varchar(64) NULL COMMENT &#39;article业务主键&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`content\` text NOT NULL COMMENT &#39;正文内容&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`deleted\` tinyint NULL DEFAULT 0 COMMENT &#39;逻辑删除标记[0-正常；1-已删除]&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`created_by\` VARCHAR(100) COMMENT &#39;创建人&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`created_time\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT &#39;创建时间&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`modified_by\` VARCHAR(100) COMMENT &#39;更新人&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`modified_time\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT &#39;更新时间&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  \`version\` bigint DEFAULT 1 COMMENT &#39;乐观锁&#39;,</span></span>
<span class="line"><span style="color:#A6ACCD;">  PRIMARY KEY (\`id\`),</span></span>
<span class="line"><span style="color:#A6ACCD;">  INDEX \`idx_articleId\`(\`article_id\`)</span></span>
<span class="line"><span style="color:#A6ACCD;">) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE utf8mb4_bin COMMENT &#39;article正文内容表&#39;;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>现在Article、ArticleContent都要记录很多数据库层面的信息，例如deleted、created_by、created_time、modified_by、modified_time这几个字段。</p><p>如果我们直接把这些字段放到值对象中会造成误解，因为这些不是值对象的领域知识，但是为了持久化我们不得不做适当的妥协。我们通过层超类型（Layer Supertype）的模式，把这些额外的字段抽取封装到一个抽象类中，在项目中我将之命名为AbstractDomainMask，可以理解为领域模型掩码或者领域模型面具，主要是为了掩盖这些数据库层面的字段。</p><p>AbstractDomainMask的代码如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">@Data</span></span>
<span class="line"><span style="color:#A6ACCD;">public abstract class AbstractDomainMask {</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    /**</span></span>
<span class="line"><span style="color:#A6ACCD;">     * 自增主键</span></span>
<span class="line"><span style="color:#A6ACCD;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    private Long id;</span></span>
<span class="line"><span style="color:#A6ACCD;">    /**</span></span>
<span class="line"><span style="color:#A6ACCD;">     * 逻辑删除标记[0-正常；1-已删除]</span></span>
<span class="line"><span style="color:#A6ACCD;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    private Integer deleted;</span></span>
<span class="line"><span style="color:#A6ACCD;">    /**</span></span>
<span class="line"><span style="color:#A6ACCD;">     * 创建人</span></span>
<span class="line"><span style="color:#A6ACCD;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    private String createdBy;</span></span>
<span class="line"><span style="color:#A6ACCD;">    /**</span></span>
<span class="line"><span style="color:#A6ACCD;">     * 创建时间</span></span>
<span class="line"><span style="color:#A6ACCD;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    private Date createdTime;</span></span>
<span class="line"><span style="color:#A6ACCD;">    /**</span></span>
<span class="line"><span style="color:#A6ACCD;">     * 更新人</span></span>
<span class="line"><span style="color:#A6ACCD;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    private String modifiedBy;</span></span>
<span class="line"><span style="color:#A6ACCD;">    /**</span></span>
<span class="line"><span style="color:#A6ACCD;">     * 更新时间</span></span>
<span class="line"><span style="color:#A6ACCD;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    private Date modifiedTime;</span></span>
<span class="line"><span style="color:#A6ACCD;">    /**</span></span>
<span class="line"><span style="color:#A6ACCD;">     * 乐观锁</span></span>
<span class="line"><span style="color:#A6ACCD;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    private Long version;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>需要进行持久化的实体和值对象，都会继承该抽象类。</p><p>ArticleContent还提供了工厂方法用于从旧的ArticleContent对象中生成新的对象，生成的过程中仅把AbstractDomainMask中的字段带过去。</p><p>ArticleContent代码如下：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">//正文内容字段建模为值对象（Value Object）,并继承了层超类型AbstractDomainMask</span></span>
<span class="line"><span style="color:#A6ACCD;">public class ArticleContent extends AbstractDomainMask implements ValueObject&lt;String&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  	private String value;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#A6ACCD;">    public ArticleContent() {</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">    public ArticleContent(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.check(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.value = value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    public void setValue(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.check(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        this.value = value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">    private void check(String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        Objects.requireNonNull(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        if (&quot;&quot;.equals(value)) {</span></span>
<span class="line"><span style="color:#A6ACCD;">            throw new IllegalArgumentException();</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    @Override</span></span>
<span class="line"><span style="color:#A6ACCD;">    public String getValue() {</span></span>
<span class="line"><span style="color:#A6ACCD;">        return this.value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    /**</span></span>
<span class="line"><span style="color:#A6ACCD;">     * 从一个旧的ArticleContent中得到一个新的ArticleContent</span></span>
<span class="line"><span style="color:#A6ACCD;">     * @param old</span></span>
<span class="line"><span style="color:#A6ACCD;">     * @param value</span></span>
<span class="line"><span style="color:#A6ACCD;">     * @return</span></span>
<span class="line"><span style="color:#A6ACCD;">     */</span></span>
<span class="line"><span style="color:#A6ACCD;">    public static ArticleContent newInstanceFrom(AbstractDomainMask old, String value) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        ArticleContent newContent = new ArticleContent();</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span></span>
<span class="line"><span style="color:#A6ACCD;">        newContent.setDeleted(old.getDeleted());</span></span>
<span class="line"><span style="color:#A6ACCD;">        newContent.setCreatedBy(old.getCreatedBy());</span></span>
<span class="line"><span style="color:#A6ACCD;">        newContent.setCreatedTime(old.getCreatedTime());</span></span>
<span class="line"><span style="color:#A6ACCD;">        newContent.setModifiedBy(old.getModifiedBy());</span></span>
<span class="line"><span style="color:#A6ACCD;">        newContent.setModifiedTime(old.getModifiedTime());</span></span>
<span class="line"><span style="color:#A6ACCD;">        newContent.setVersion(old.getVersion());</span></span>
<span class="line"><span style="color:#A6ACCD;">        newContent.setId(old.getId());</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span></span>
<span class="line"><span style="color:#A6ACCD;">        newContent.setValue(value);</span></span>
<span class="line"><span style="color:#A6ACCD;">        return newContent;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>此时Article的代码如下:</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">public class Article extends AbstractDomainMask implements Entity{</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  private ArticleId articleId;</span></span>
<span class="line"><span style="color:#A6ACCD;">  private ArticleTitle title;</span></span>
<span class="line"><span style="color:#A6ACCD;">  private ArticleContent content;</span></span>
<span class="line"><span style="color:#A6ACCD;">  private Integer state;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void createDraft(ArticleCreateCmd cmd){}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void modifyTitle(ArticleModifyTitleCmd cmd){}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void modifyContent(ArticleModifyContentCmd){}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  public void publishArticle(ArticlePublishCmd cmd){}</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>Article领域模型与数据模型的映射，主要体现在Respository实现类的load和save方法，详细可以看项目代码，代码的获取方式见本文开头。</p><p>ArticleContent是一个值对象，content变更时会重新创建一个新的对象去替换旧的，但是创建新的ArticleContent时，需要把旧对象中AbstractDomainMask里面的字段带过去。</p><p>以下是content变更时的示例代码：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">//Application层</span></span>
<span class="line"><span style="color:#A6ACCD;">public class ArticleApplicationService {</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  //……其他代码省略</span></span>
<span class="line"><span style="color:#A6ACCD;">  @Retryable(value = OptimisticLockingFailureException.class, maxAttempts = 2)</span></span>
<span class="line"><span style="color:#A6ACCD;">  public void modifyContent(ArticleModifyContentCmd cmd) {</span></span>
<span class="line"><span style="color:#A6ACCD;">      ArticleEntity entity = domainRepository.load(new ArticleId(cmd.getArticleId()));</span></span>
<span class="line"><span style="color:#A6ACCD;">      entity.modifyContent(ArticleContent.newInstanceFrom(entity.getContent(),</span></span>
<span class="line"><span style="color:#A6ACCD;">              cmd.getContent()));</span></span>
<span class="line"><span style="color:#A6ACCD;">      domainRepository.save(entity);</span></span>
<span class="line"><span style="color:#A6ACCD;">      domainEventPublisher.publish(entity.domainEvents());</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">//领域层实体</span></span>
<span class="line"><span style="color:#A6ACCD;">public class ArticleEntity extends AbstractDomainMask implements Entity {</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  //……其他代码省略</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  //修改内容</span></span>
<span class="line"><span style="color:#A6ACCD;">  public void modifyContent(ArticleContent articleContent) {</span></span>
<span class="line"><span style="color:#A6ACCD;">      this.setContent(articleContent);</span></span>
<span class="line"><span style="color:#A6ACCD;">      events.add(new ModifyContentEvent(this.getArticleId().getValue(),</span></span>
<span class="line"><span style="color:#A6ACCD;">              articleContent.getValue()));</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  //……其他代码省略</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>4.接口测试用例</p><ul><li>创建草稿</li></ul><p><img src="https://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/4bef621cf352496ba2b7367d143fde93~noop.image?_iz=58558&amp;from=article.pc_detail&amp;x-expires=1675792891&amp;x-signature=XdisxzF%2B7vwaJur2O24aQWwLjcg%3D" alt="">创建草稿的测试用例</p><ul><li>修改标题</li></ul><p><img src="https://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/e26e38014e854699a6a0a072048b40f8~noop.image?_iz=58558&amp;from=article.pc_detail&amp;x-expires=1675792891&amp;x-signature=ZQjI2yfNznr0%2By2rjqTi%2BZpOqxs%3D" alt="">修改标题的测试用例</p><ul><li>修改正文</li></ul><p><img src="https://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/353b74d419ee439ea2280ecdfee684d7~noop.image?_iz=58558&amp;from=article.pc_detail&amp;x-expires=1675792891&amp;x-signature=i9OP8gaICQO%2Bt7z3F7RBWhhD%2Bto%3D" alt="">修改正文的测试用例</p><ul><li>获取文章详情</li></ul><p><img src="https://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/fc5f50d1e93f4dce8401c9dc72ac0ab2~noop.image?_iz=58558&amp;from=article.pc_detail&amp;x-expires=1675792891&amp;x-signature=joLhVm%2BJh62q3xPUasjlCQj6OSk%3D" alt="">获取文章详情的测试用例</p>`,50),t=[e];function c(o,i,A,C,r,y){return a(),n("div",null,t)}const u=s(p,[["render",c]]);export{d as __pageData,u as default};
