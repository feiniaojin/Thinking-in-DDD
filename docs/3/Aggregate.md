# 聚合与聚合根

## 1. 聚合与聚合根的定义

实体和值对象是对领域知识的建模，而聚合与聚合根则是对领域模型一致性的建模。

采用面向对象的方式对领域知识进行建模之后，得到了实体和值对象两类领域模型。这些模型不会孤立地存在，往往存在引用关系，形成一棵对象树。

这颗对象树，就是一个聚合(Aggregate)。

聚合根则是指这棵对象树的根（Root），聚合根必须是一个实体（Entity）。

举个例子，下面 Role 类就是一个聚合，并且聚合根就是 Role 这个类，可以它遍历访问到聚合内所有的状态。

```java

public class Role {
    private RoleId roleId;
    private String roleName;
    private Set<ResourceId> resourceIds;

    public void modifyRoleName(String roleName) {
        this.roleName = roleName;
    }

    public void addResource(ResourceId resourceId) {
        this.resourceIds.add(resourceId);
    }
}
```

## 2. 聚合与聚合根的作用

聚合用来表示一致性的范围，聚合内的领域对象都必需接受一致性约束，聚合内的对象状态强一致，聚合之间最终一致。

以 Role 为例，修改角色名称时，只是修改了 roleName 的值，并没有修改角色对应的资源，所以保存 Role 时，不能造成 resourceIdList 值的变化。

```java
public class RoleApplicationService {
    private RoleRepository roleRepository;

    public void modifyRoleName(Long roleId, String roleName) {
        Role role = roleRepository.load(roleId);
        role.modifyRoleName(roleName);
        roleRepository.save(role);
    }
}
```

同时，聚合内的对象都必需满足固定的业务规则，可以起到维护业务规则的作用。

聚合根可以控制外部对聚合内对象的访问，外部对象只能引用聚合根，不能直接引用聚合内的对象，避免了外部对象绕开聚合根来修改内部对象的状态，确保任何状态变化都满足聚合的固定规则。

以 Role 这个聚合为例，当需要给角色添加资源时，我们必须通过聚合根 Role 提供的 addResource 方法进行操作，而不是某个方法返回了 resourceIds，通过 resourceIds 进行添加。

```java
/**
 * 以下是正例，通过聚合根操作内部状态
 */
public class RoleApplicationService {
    private RoleRepository roleRepository;

    public void addResource(Long roleId, Long resourceId) {
        Role role = roleRepository.load(roleId);
        role.addResource(new ResourceId(resourceId));
        roleRepository.save(role);
    }
}
```

```java
/**
 * 以下是反例，暴露聚合内的状态，直接绕开聚合根进行操作
 */
public class RoleApplicationService {
    private RoleRepository roleRepository;

    public void addResource(Long roleId, Long resourceId) {
        Role role = roleRepository.load(roleId);
        //错误！对外暴露了聚合内部的状态
        Set<ResourceId> resourceIds = role.getResourceIds();
        //错误！绕开聚合根操作聚合内部状态
        resourceIds.add(new ResourceId(resourceId));
        roleRepository.save(role);
    }
}
```

相应的，聚合根内部的对象也只能持有其他对象聚合根的引用，而且往往只会持有聚合根实体的 ID。

外部对象如果需要获取聚合的内部状态，可以通过返回一个副本，避免了外部私自修改的风险。

示例如下，**getResourceIds**方法返回了一个新的 ResourceId Set，调用方修改这个 Set，不会影响到聚合内部状态。

```java
public class Role {
    private RoleId roleId;
    private String roleName;
    private Set<ResourceId> resourceIds;

    //省略其他方法

    /**
     * 当需要暴露聚合内部状态时，不能直接返回内部状态的引用，而是应当返回一个副本
     * @return resourceIds副本
     */
    public Set<ResourceId> getResourceIds() {
        return new HashSet<>(resourceIds);
    }
}
```

只有聚合根才能直接通过数据库查询获取，因此只有聚合根拥有 Repository。

聚合根的 Repository 只有两个方法：load 和 save。

load：通过聚合根实体 ID 加载聚合根。

save：保存聚合根，注意要加事务。

示例：

```java
public class RoleRepository {
    public Role load(RoleId roleId) {
        //TODO 从数据库查询Role相关的数据对象

        //TODO 将数据对象转成领域对象，返回
    }

    /**
     * 保存领域对象，事务操作
     * @param role 领域对象
     */
    @Transactional
    public void save(Role role) {
        //TODO 将领域模型转成数据模型

        //TODO 将数据模型保存到数据库中
    }
}

```

## 3. 聚合设计的原则

在《实现领域驱动设计》一书中，列举了一些聚合的原则，我们直接拿过来进行讲解。

### 3.1 原则一、设计小而全的聚合

聚合设计得过大，则每次更新时维护聚合内一致性的成本会很高。举个例子，某个比较大的聚合具有 100 个属性，拆分成 2 个聚合之后，可能一个是 40 个属性，一个是 60 个属性，100 个属性的聚合肯定会比 40 或者 60 个属性的聚合被更新的几率高。用极端的思维去考虑，如果把系统建模成只有一个聚合，那么系统就变成串行的了，因为每个事务只能更新一个聚合，所有的操作必须逐个进行执行。

聚合设计得过小，就没有办法完整地表达领域概念，这也是要避免的。这里也举个极端的例子，把某个聚合的所有的属性一一单独拆分为聚合，那么我们就发现领域的业务概念无法正确地表达出来。

因此我们推荐将聚合设计的尽可能地小，小到刚好包含某个完整的领域概念，最理想的情况下当然是一个实体（Entity）作为一个聚合，但达不到的时候也不必苛求，只需要尽可能满足小而全即可。

不要苛求一次性把聚合设计得很完美，导致研发流程迟迟卡在战略设计阶段，这是不可取的。我们应该先大致设计出来之后，在实践中不断调整，由于领域概念已经被建模为值对象或者实体，业务逻辑高度内聚在领域对象内，调整聚合的大小是轻而易举。

### 3.2 原则二、通过唯一标识引用其他聚合根

聚合是代表着领域概念的边界，直接引用其他聚合根会破坏这个边界，而通过唯一标识引用其他聚合根，可以保证聚合内部的一致性，提高系统的可扩展性，降低系统的耦合度。

保证聚合内部的一致性：在一个聚合内部所有的对象都有着紧密的关联。如果一个对象需要引用另一个聚合根对象，那么就会破坏聚合的完整性和一致性，会导致对象之间的耦合度过高，一旦其中一个对象发生变化，也会影响到其他对象的状态。通过唯一标识引用其他聚合，我们可以保证每个聚合内部都是独立的，聚合根之间没有过多的依赖关系。

提高系统的可扩展性：如果一个聚合需要引用另一个聚合内的对象，会导致这两个聚合之间存在过多的依赖关系，这样做会使得代码变得非常复杂，难以扩展和维护。通过唯一标识引用其他聚合，可以将系统分解成更小、更独立的部分，每个部分都可以独立地进行扩展和维护，从而提高了系统的可扩展性。

降低系统的耦合度：通过唯一标识引用其他聚合，则可以将系统分解成更小、更独立的部分，从而降低了模块之间的耦合度，使得系统更加稳定。

### 3.3 原则三、一个事务只更新单个聚合

聚合的是一个完整的单元。聚合内部的对象之间具有强关联性，它们的状态必须保持一致，如果一个事务同时更新了多个聚合，那么就可能会破坏聚合的完整性。一次事务只更新单个聚合会使聚合的概念更为明显，并且变更收敛在一个事务中会更容易实现。

一个事务只更新单个聚合可以使得并发控制更加简单。在多个事务同时对同一个聚合进行更新时，如果每个事务只更新单个聚合，那么就可以避免死锁等并发问题的发生。如果每个事务都要同时更新多个聚合，那么就需要对所有的聚合进行锁定，这样就会导致并发性能的下降。如果一次事务更新多个聚合，如何确保事务机制会成为比较大的问题，尤其是在分库分表的场景下将上升为分布式事务。

一个事务只更新单个聚合还可以使得代码更加清晰和易于维护。如果每个事务都要同时更新多个聚合，那么就需要编写更加复杂的代码来处理这些操作。而且，当业务逻辑变得更加复杂时，这些代码也会变得越来越难以维护。因此，将每个事务限制为只更新单个聚合可以使得代码更加简洁和易于维护。

一个事务只更新单个聚合还可以使得性能更加优化。如果每个事务都要同时更新多个聚合，那么就需要执行更多的数据库操作，这样就会导致性能下降。而且，在分布式系统中，跨多个节点同时更新多个聚合也会导致网络开销增加，从而影响系统性能。因此，将每个事务限制为只更新单个聚合可以使得性能更加优化。

聚合内事务的控制，详细见[聚合内事务实现](../8/ConsistencyInAggregate.md)

### 3.4 原则四、跨聚合采用最终一致性

最终一致性是指在分布式系统中，如果没有新的更新操作发生，那么最终所有节点都会达到一致的状态。与强一致性不同的是，最终一致性不会要求每个节点都立即获得最新的数据。这是因为在分布式系统中，各节点之间的网络延迟、故障等因素可能导致数据同步的不及时，因此最终一致性是一种更加灵活的数据一致性模型。

那么为什么跨聚合需要采用最终一致性呢？这是因为在分布式系统中，跨聚合的操作可能会涉及到多个聚合之间的数据交互。除了“一个事务只更新单个聚合”的原因之外，如果采用强一致性模型，每个聚合都需要立即获得最新的数据，这将导致大量的网络流量和延迟，严重影响系统的性能。而最终一致性则可以在保证数据一致性的同时，尽可能地减少网络流量和延迟，提高系统的可扩展性和可用性。

我们可以通过领域事件的方式实现跨聚合的最终一致性：某个聚合完成事务之后，对外发布领域事件，其他聚合通过监听感兴趣的领域事件，完成自身的状态更新。

跨聚合最终一致性的实现，详细见[跨聚合事务处理](../8/ConsistencyBetweenAggregate.md)

## 4. 聚合的拆分

聚合过大，包含的领域对象过多，容易影响性能；聚合过小，包含的领域对象过少，则不能体现出聚合封闭业务规则的特点。

聚合过大影响性能的原因，是由于聚合内的领域对象必须保持强一致，如果包含了非常多的领域对象，那么某个状态变更时，其他对象必须保持一致。

例如:

```java
public class Role0 {
    private RoleId roleId;
    private String roleName;
    private Set<Resource> resources;
}

```

对于 Role0 这个聚合，里面包含了非常多的 Resource 实体，假设只是改变了 roleName 这个属性，在某个 Role0 实例 A 持久化之前，如果其他的 Role0 实例 B 对某个 Resource 进行了修改，那么 A 实例对 resources 的修改是失效的，必须进行重试。

聚合过小无法封闭聚合内的业务规则，这个很好理解，就不举例了。

聚合的拆分，目前没有统一的标准，笔者只在这里介绍自己的拆分经验。

### 4.1 第一次拆分

首先根据聚合的定义，将一些外部聚合根移出聚合，通过聚合根的 ID 进行引用。

如何判断一个实体是不是外部聚合呢？一般某个实体被多个聚合根引用，这个实体就可以提升为聚合根。例如上面的 Resource，一般会被多个 Role 进行引用，那么就可以判断 Resource 可以提升为聚合根。

以下是第一次拆分后的 Role1 聚合根：

```java
public class Role1 {
    private RoleId roleId;
    private String roleName;
    private Set<ResourceId> resourceIds;
}
```

### 4.2 第二次拆分

Role1 中将 Resource 移出了聚合，但是留下了对 ResourceId 的引用。考虑到不仅需要根据 Role 查询到其关联的 Resource，有时候还需要清楚某个 Resource 被哪些 Role 引用。如果按照 Role1 的设计，那么在 Resource 中，明显也需要持有对 RoleId 的引用。例如：

```java
public class Resource {
    private ResourceId resourceId;
    private String resourceName;
    private Set<RoleId> roleIds;
}
```

这会造成循环依赖的问题，假设 Role 中需要移除某个 ResourceId，不仅需要在 Role 中操作，还需要到 Resource 中将 RoleId 移除掉，明显这是不合理的。

因此，我们开始第二次拆分。我们将 resourceIds 也移出 Role 聚合，并将 Role 与 Resource 的关联关系提升为一个聚合，将其命名为 RoleResourceBinding。

```java
/**
 * 角色聚合
 */
public class Role2 {
    private RoleId roleId;
    private String roleName;
}

/**
 * 角色与资源绑定聚合根
 */
public class RoleResourceBinding {
    private BindingId bindingId;
    private RoleId roleId;
    private ResourceId resourceId;
    private Integer active;
    private Date bindTime;
}
```

这两次拆分，我们总结出以下经验：

重点关注容易被多个聚合根持有的公共实体，这些实体可能被提升为聚合根移出聚合。

重点关注 1:N 的集合属性，这些属性有可能因为业务需要，需要提升为聚合根。

## 5. 聚合根的配套设施

聚合的持久化、加载操作都是针对聚合根的，因此只有聚合根才拥有 Repository，其实现细节见[Repository](../4/Repository.md)

复杂聚合的创建需要依赖 Factory，因此聚合根也拥有自己的 Factory，其实现细节见[Factory](../4/Factory.md)。

<!--@include: ../footer.md-->
