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

以 Role 这个聚合为例，当需要给角色添加资源时，我们时直接通过聚合根 Role 提供的 addResource 方法进行操作，并不是返回了 resourceIds，通过 resourceIds 进行添加。

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

示例如下，**getResourceIds**方法返回了一个新的 Set，调用方修改这个 Set，不会影响到聚合内部状态

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
    @Transationnal
    public void save(Role role) {
        //TODO 将领域模型转成数据模型

        //TODO 将数据模型保存到数据库中
    }
}

```

## 3. 聚合的拆分

聚合过大，包含的领域对象过多，容易影响性能；聚合过小，包含的领域对象过少，则不能体现出聚合封闭业务规则的特点。

聚合过大影响性能的原因，是由于聚合内的领域对象必须保持强一致，如果包含了非常多的领域对象，那么某个状态变更时，其他对象必须保持一致。

示例:

```java
public class Role0 {
    private RoleId roleId;
    private String roleName;
    private Set<Resource> resources;
}

```

对于 Role0 这个聚合，里面包含了非常多的 Resource 实体，假设只是改变了 roleName 这个属性，在 Role0 持久化之前，所有对 resources 的修改都是失效的。

聚合过小无法封闭聚合内的业务规则，这个很好理解，就不举例了。

聚合的拆分，目前没有统一的标准，笔者只在这里介绍自己的拆分经验。

- 第一次拆分

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

- 第二次拆分

Role1 中将 Resource 移出了聚合，但是留下了对 ResourceId 的引用。考虑到不仅需要根据 Role 查询到其关联的 Resource，有时候还需要清楚某个 Resource 被哪些 Role 引用。如果按照 Role1 的设计，那么在 Resource 中，明显也需要持有对 RoleId 的引用。例如：

```java
public class Resource {
    private ResourceId resourceId;
    private String resourceName;
    private Set<RoleId> roleIds;
}
```

这就造成了循环依赖的问题，假设 Role 中需要移除某个 ResourceId，不仅需要在 Role 中操作，还需要到 Resource 中将 RoleId 移除掉，明显这是不合理的。

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

## 4. 聚合根的配套设施

聚合的持久化、加载操作都是针对聚合根的，因此只有聚合根才拥有 Repository，其实现细节见[Repository](../4/Repository.md)

复杂聚合的创建需要依赖 Factory，因此聚合根也拥有自己的 Factory，其实现细节见[Factory](../4/Factory.md)。

<!--@include: ../footer.md-->
