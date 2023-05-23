# Repository

## 1. Repository 的职责

只有聚合根才有配套的 Repository。

Repository 是非常重要的组件，主要有几种职责：

- 将聚合根持久化到数据库

Repository 的`save`方法中，将聚合根转成数据对象，然后持久化到数据库。

- 将聚合根从数据库加载到内存

Repository 的`load`方法中，查询数据库获得数据对象，再将数据对象拼装成将聚合根。

- 数据库事务控制

Repository 的实现方案有两种：

- 表级

Repository的方法在进行查询或者更新时会操作多个领域模型，则该Repository是表级的。例如：

```java
public class Repository {
    public List<Model> queryForList() {
        //省略业务逻辑
    }

    public void batchSave(List<Model> modelList) {
        //省略业务逻辑
    }
}
```
queryForList方法返回多个Model实例、batchSave同时保存多个Model实例，因此这个Repository是表级的。

- 行级

Repository的方法在进行查询或者更新时只会操作一个领域模型，则该Repository是行级的。例如：

```java
public class Repository {
    public Model load(EntityId entityId) {
        //省略业务逻辑
    }

    public void save(Model model) {
        //省略业务逻辑
    }
}
```
load、save方法都只操作一个领域模型，因此是行级的。

>在DDD中，我们要求Repository实现为行级的，并且只有load和save两个方法。其他类似queryForList，应通过CQRS将其分离出去；又由于一次事务只更新一个聚合，因此不会提供类似batchSave这种批量更新的方法。

## 2. 初步领域建模

本文将以一个 CMS 应用为例，讲解 Repository 的实现细节，展示领域模型与数据模型阻抗不匹配的问题以及如何实现领域模型与数据模型的映射。

CMS 应用的核心子域是内容子域，我们将内容对应的实体称之为 Article。

首先，分析 Article 的行为。

- 类似公众号，一般会先创建一个草稿，所以 Article 有一个创建草稿的能力；

- 创建好的公众号文章，可以修改标题或者内容；

- 可以把草稿箱的文章发布到公众号，读者可以阅读已发布状态的 Article。

其次，分析 Article 的属性。文章需要有 title(标题)、content(正文)两个基本的字段；Article 作为一个实体，需要有自己的唯一标识，称之为
ArticleId；Article 涉及发布或者未发布，所以还需要有记录发布状态的的字段，称之为 publishState。

于是我们得到了一个实体 Article，并且 Article 是一个聚合根，如下面代码，方法的入参出参暂时先不用过多关注。

```java
public class Article {

    private String articleId;
    private String title;
    private String content;
    private Integer publishState;

    public void createDraft() {
    }

    public void modifyTitle() {
    }

    public void modifyContent() {
    }

    public void publishArticle() {
    }

}
```

## 3. 领域知识封装

再进一步思考，我们每次通过 articleId 进行业务操作时，都需要判断 articleId 是否存在，所以我们把 articleId 字段建模为一个值对象，这样每次创建
ArticleId 时，构造方法中都会进行非空判断，这样把判断逻辑封装起来，想知道 articleId 有什么业务约束只需要看 ArticleId 的代码即可。

```java
public class ArticleId implements EntityId<String> {

    private String value;

    public ArticleId() {
    }

    public ArticleId(String value) {
        this.check(value);
        this.value = value;
    }

    public void setValue(String value) {
        //有值的情况下不允许修改
        if (this.value != null) {
            throw new UnsupportedOperationException();
        }
        this.check(value);
        this.value = value;
    }

    private void check(String value) {
        Objects.requireNonNull(value);
        if ("".equals(value)) {
            throw new IllegalArgumentException();
        }
    }

    @Override
    public String getValue() {
        return this.value;
    }
}
```

领域驱动设计不推荐在 Application 层使用 set 方法直接赋值，但是有时候我们使用的框架需要进行 set/get，所以我们提供了 set 方法，同时我们要注意在关键属性的 set 方法中也需要进行业务校验；另外，要在团队内部形成开发指南，在开发者的层面达成共识，避免在
Application 层使用没有业务含义的 set 方法。

接下来， title 和 content 这两个字段，自身可能包含了非空、长度限制等逻辑，并且其生命周期与聚合根的生命周期相同，也不具备自己的唯一标识，所以可以将其建模为值对象。假设 title 字段不允许长度超过 64，可以得到以下的值对象。

```java
//标题字段建模为值对象（Value Object）
public class ArticleTitle implements ValueObject<String> {

    private String value;

    public ArticleTitle() {
    }

    public ArticleTitle(String value) {
        this.check(value);
        this.value = value;
    }

    @Override
    public String getValue() {
        return this.value;
    }

    public void setValue(String value) {
        if (this.value != null) {
            throw new UnsupportedOperationException();
        }
        this.check(value);
        this.value = value;
    }

    //未来通过抽取业务规则做进一步优化
    private void check(String value) {
        Objects.requireNonNull(value, "title不能为空");
        if ("".equals(value) || value.length() > 64) {
            throw new IllegalArgumentException();
        }
    }
}

//正文内容字段建模为值对象（Value Object）
public class ArticleContent implements ValueObject<String> {

    private String value;

    public ArticleContent() {
    }

    public ArticleContent(String value) {
        this.check(value);
        this.value = value;
    }

    public void setValue(String value) {
        if (this.value != null) {
            //有值的情况下不允许修改
            throw new UnsupportedOperationException();
        }
        this.check(value);
        this.value = value;
    }

    //未来通过规约模式做进一步优化
    private void check(String value) {
        Objects.requireNonNull(value);
        if ("".equals(value)) {
            throw new IllegalArgumentException();
        }
    }

    @Override
    public String getValue() {
        return this.value;
    }
}
```

到这里，我们的领域模型 Article 变成：

```java
public class Article {

    private ArticleId articleId;
    private ArticleTitle title;
    private ArticleContent content;
    private Integer state;

    public void createDraft() {
    }

    public void modifyTitle() {
    }

    public void modifyContent() {
    }

    public void publishArticle() {
    }

}
```

当然，`state`也可以改用枚举进行表达，在此则直接用 Integer 类型。

## 4. 领域模型与数据模型阻抗不匹配

领域模型的建模是不关心持久化的，只关心聚合根内领域知识是否完整，但是我们在基础设施层实现 Repository 时，就需要考虑如何建模数据库表结构了。

考虑 ArticleContent（文章正文）这个值对象，它的值一般是富文本，文本比较长而且长度不定。这类文本有可能使用对象存储，在此处我们进行简化直接用
text，Blob 之类的类型在数据库中进行存储，一般情况下为了考虑性能还要单独一张表，通过 articleId 提供查找。

所以，聚合根 Article 在数据库层面要存成两张表。

再者，由于公司数据库开发的规范，要求每张表必须有 deleted、created_by、created_time、modified_by、modified_time 这几个字段。

最后，还要求每张表都有一个自增 id 字段，并且自增 id 不能用于业务操作。

这个时候，我们得到了文章 Article 在数据存储层的表结构，如下：

- Article 的基本属性由 cms_article 表进行存储

```sql
CREATE TABLE `cms_article` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `article_id` varchar(64) NULL COMMENT 'article业务主键',
  `title` varchar(64) NULL COMMENT '标题',
  `publish_state` int NOT NULL DEFAULT 0 COMMENT '发布状态，默认为0,0未发布，1已发布',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '逻辑删除标记[0-正常；1-已删除]',
  `created_by` VARCHAR(100) COMMENT '创建人',
  `created_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_by` VARCHAR(100) COMMENT '更新人',
  `modified_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `version` bigint DEFAULT 1 COMMENT '乐观锁',
  PRIMARY KEY (`id`),
  INDEX `idx_articleId`(`article_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE utf8mb4_bin COMMENT 'article主表';
```

- Article 的正文属性由 cms_article_content 表进行存储

```sql
CREATE TABLE `cms_article_content` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `article_id` varchar(64) NULL COMMENT 'article业务主键',
  `content` text NOT NULL COMMENT '正文内容',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '逻辑删除标记[0-正常；1-已删除]',
  `created_by` VARCHAR(100) COMMENT '创建人',
  `created_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_by` VARCHAR(100) COMMENT '更新人',
  `modified_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `version` bigint DEFAULT 1 COMMENT '乐观锁',
  PRIMARY KEY (`id`),
  INDEX `idx_articleId`(`article_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE utf8mb4_bin COMMENT 'article正文内容表';
```

现在 Article、ArticleContent 都要记录很多数据库层面的信息，例如 deleted、created_by、created_time、modified_by、modified_time
这几个字段。

如果我们直接把这些字段放到值对象中会造成误解，因为这些不是值对象的领域知识，但是为了持久化我们不得不做适当的妥协。我们通过层超类型（Layer
Supertype）的模式，把这些额外的字段抽取封装到一个抽象类中，在项目中我将之命名为
AbstractDomainMask，可以理解为领域模型掩码或者领域模型面具，主要是为了掩盖这些数据库层面的字段。

AbstractDomainMask 的代码如下：

```java

@Data
public abstract class AbstractDomainMask {

    /**
     * 自增主键
     */
    private Long id;
    /**
     * 逻辑删除标记[0-正常；1-已删除]
     */
    private Integer deleted;
    /**
     * 创建人
     */
    private String createdBy;
    /**
     * 创建时间
     */
    private Date createdTime;
    /**
     * 更新人
     */
    private String modifiedBy;
    /**
     * 更新时间
     */
    private Date modifiedTime;
    /**
     * 乐观锁
     */
    private Long version;
}
```

需要进行持久化的实体和值对象，都会继承该抽象类。

ArticleContent 还提供了工厂方法用于从旧的 ArticleContent 对象中生成新的对象，生成的过程中仅把 AbstractDomainMask 中的字段带过去。

ArticleContent 代码如下：

```java
//正文内容字段建模为值对象（Value Object）,并继承了层超类型AbstractDomainMask
public class ArticleContent extends AbstractDomainMask implements ValueObject<String> {

    private String value;

    public ArticleContent() {
    }

    public ArticleContent(String value) {
        this.check(value);
        this.value = value;
    }

    public void setValue(String value) {
        this.check(value);
        this.value = value;
    }

    private void check(String value) {
        Objects.requireNonNull(value);
        if ("".equals(value)) {
            throw new IllegalArgumentException();
        }
    }

    @Override
    public String getValue() {
        return this.value;
    }

    /**
     * 从一个旧的ArticleContent中得到一个新的ArticleContent
     * @param old
     * @param value
     * @return
     */
    public static ArticleContent newInstanceFrom(AbstractDomainMask old, String value) {
        ArticleContent newContent = new ArticleContent();

        newContent.setDeleted(old.getDeleted());
        newContent.setCreatedBy(old.getCreatedBy());
        newContent.setCreatedTime(old.getCreatedTime());
        newContent.setModifiedBy(old.getModifiedBy());
        newContent.setModifiedTime(old.getModifiedTime());
        newContent.setVersion(old.getVersion());
        newContent.setId(old.getId());

        newContent.setValue(value);
        return newContent;
    }

}
```

此时 Article 的代码如下:

```java
public class Article extends AbstractDomainMask implements Entity {

    private ArticleId articleId;
    private ArticleTitle title;
    private ArticleContent content;
    private Integer state;

    public void createDraft(ArticleCreateCmd cmd) {
    }

    public void modifyTitle(ArticleModifyTitleCmd cmd) {
    }

    public void modifyContent(ArticleModifyContentCmd) {
    }

    public void publishArticle(ArticlePublishCmd cmd) {
    }
}
```

ArticleContent 是一个值对象，content 变更时会重新创建一个新的对象去替换旧的，但是创建新的 ArticleContent 时，需要把旧对象中
AbstractDomainMask 里面的字段带过去。

以下是 content 变更时的示例代码：

```java
//Application层
public class ArticleApplicationService {

    //……其他代码省略
    @Retryable(value = OptimisticLockingFailureException.class, maxAttempts = 2)
    public void modifyContent(ArticleModifyContentCmd cmd) {
        ArticleEntity entity = domainRepository.load(new ArticleId(cmd.getArticleId()));
        entity.modifyContent(ArticleContent.newInstanceFrom(entity.getContent(),
                cmd.getContent()));
        domainRepository.save(entity);
    }

}


//领域层实体
public class ArticleEntity extends AbstractDomainMask implements Entity {

    //……其他代码省略

    //修改内容
    public void modifyContent(ArticleContent articleContent) {
        this.content = articleContent;
    }

    //……其他代码省略
}
```

## 5. load 和 save 方法的实现

以下是 Repository 中 load 和 save 方法的实现。

```java
@Repository
@Slf4j
public class ArticleDomainRepositoryImpl implements ArticleDomainRepository {

    @Override
    public ArticleEntity load(ArticleId articleId) {

        CmsArticle article = articleMapperEx.findOneByBizId(articleId.getValue());
        if (article == null) {
            log.error("查询不到article,articleId={}", articleId.getValue());
            throw new NotFoundDomainException();
        }

        ArticleEntity entity = new ArticleEntity();
        entity.setArticleTitle(new ArticleTitle(article.getTitle()));
        entity.setPublishState(PublishState.getByCode(article.getPublishState()).getCode());
        entity.setArticleId(articleId);

        entity.setVersion(article.getVersion());
        entity.setId(article.getId());
        entity.setCreatedBy(article.getCreatedBy());
        entity.setCreatedTime(article.getCreatedTime());
        entity.setModifiedTime(article.getModifiedTime());
        entity.setModifiedBy(article.getModifiedBy());
        entity.setDeleted(article.getDeleted());

        CmsArticleContent content = contentMapperEx.findOneByBizId(articleId.getValue());

        ArticleContent articleContent = new ArticleContent();
        articleContent.setValue(content.getContent());

        articleContent.setVersion(content.getVersion());
        articleContent.setId(content.getId());
        articleContent.setCreatedBy(content.getCreatedBy());
        articleContent.setCreatedTime(content.getCreatedTime());
        articleContent.setModifiedTime(content.getModifiedTime());
        articleContent.setModifiedBy(content.getModifiedBy());
        articleContent.setDeleted(content.getDeleted());

        entity.setContent(articleContent);

        return entity;
    }


    @Override
    @Transactional
    public void save(ArticleEntity entity) {

        CmsArticle cmsArticle = new CmsArticle();
        cmsArticle.setTitle(entity.getArticleTitle().getValue());
        //region
        cmsArticle.setArticleId(entity.getArticleId().getValue());
        cmsArticle.setPublishState(entity.getPublishState());

        cmsArticle.setId(entity.getId());
        cmsArticle.setCreatedBy(entity.getCreatedBy());
        cmsArticle.setCreatedTime(entity.getCreatedTime());
        cmsArticle.setModifiedBy(entity.getModifiedBy());
        cmsArticle.setModifiedTime(entity.getModifiedTime());
        cmsArticle.setVersion(entity.getVersion());
        cmsArticle.setDeleted(entity.getDeleted());
        //endregion
        ArticleContent content = entity.getContent();
        CmsArticleContent cmsArticleContent = new CmsArticleContent();
        cmsArticleContent.setContent(content.getValue());
        //region
        cmsArticleContent.setArticleId(entity.getArticleId().getValue());

        cmsArticleContent.setId(content.getId());
        cmsArticleContent.setVersion(content.getVersion());
        cmsArticleContent.setDeleted(content.getDeleted());
        cmsArticleContent.setCreatedBy(content.getCreatedBy());
        cmsArticleContent.setCreatedTime(content.getCreatedTime());
        cmsArticleContent.setModifiedBy(content.getModifiedBy());
        cmsArticleContent.setModifiedTime(content.getModifiedTime());
        //endregion
        cmsArticleRepository.save(cmsArticle);
        cmsArticleContentRepository.save(cmsArticleContent);
    }
}
```

<!--@include: ../footer.md-->
