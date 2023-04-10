# Factory

## 1. Factory 的定义

Factory 是设计模式的一种，用来完成对象的创建。在领域驱动设计中，对于复杂的领域对象，不管是实体还是值对象，我们都可以使用 Factory 进行创建。

使用 Factory 的原因，是领域对象的创建过于复杂，我们希望将领域对象的创建过程交由统一的对象进行管理，避免过多关注领域对象的创建过程。

## 2. Factory 的实践

对于实体来说，往往需要在创建时指定唯一主键，因此 Factory 可以交由 IOC 容器进行实例化管理，在创建的过程中注入某些依赖对象。

```java
@Component
public class EntityFactory{

    /**
    * id生成器
     */
    @Resource
    private IdGenerator idGenerator;

    public Entity newInstance(){

        Entity entity = new Entity();
        entity.setEntityId(new EntityId(idGenerator.newId()));
        //TODO 其他初始化过程
        return entity;
    }

}

```

对于值对象来说，可以直接使用静态的方法完成创建。

## 3. 不使用Repository创建的原因

Repository是面向聚合根的，更多的是作为仓储，保存或者加载聚合根。如果也由Repository进行领域对象创建，那么Repository就承担了过多的职责。

复杂的对象不只有聚合根，可能一些实体、值对象，也是需要封装创建过程的，因此，我们将单独使用Factory完成领域对象的创建。

要注意Repository加载聚合根和Factory创建实体两者过程的区别：Repository是已经存在了聚合根，只是将其从持久化的数据库（或者其他持久化存储）加载到内存中，并将其重新反序列化为聚合根；Factory是从无到有创建领域对象的过程。虽然两者在创建过程中都可能会先创建空对象，然后进行属性的set，但是两者的语意并不相同。

<!--@include: ../footer.md-->