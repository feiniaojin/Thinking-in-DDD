# 实体

## 1. 实体的概念理解

实体（Entity）：对领域知识进行建模之后，在业务上具备唯一性和连续性的领域对象。

实体具有唯一标识。

## 2. 实体的建模

我们在电商网站购物下单时需要提供收货地址信息（一般包括省、市、区、街道、门牌号、收件人、收件人手机号等），这些信息联系非常紧密，而且需要形成一个整体才会有意义，我们应该把这些关系非常密切的信息建模成领域模型。

电商 APP 中一般都会有地址管理这个功能，也就是用户收货地址服务。通过地址管理功能，用户可以预先录入地址信息，并将某个地址设置为默认地址，在用户下单的时候可以直接选择已录入的地址信息，避免多次重复输入，提升用户体验。

//TODO 提供收货地址的截图

注意，“将某个地址设置为默认地址”这句话体现了两个逻辑：

第一，用户可以录入自己的收货地址，并且在后续可以对其进行业务操作，例如设置为默认地址、取消设置默认地址，这体现了连续性；

第二，用户可以将某个地址信息设置为默认地址，而不是将其他的地址设置为默认，也就意味着这些地址信息之间是需要区分的，这体现了唯一性。省、市、区、街道、门牌号、收货人、收货人手机号等每个字段都一模一样的 A 和 B 两个地址，但是用户选择将 A 设置为常用地址，可以看出其属性（省、市、区、街道、门牌号等）并不是其核心特征，只要确定了"A"这个地址，甚至其属性可以是任意的，"A"这个唯一标识，才是区分"A"和"B"的关键。

有读者会问，地址信息不一样的两个地址，例如一个是朝阳的地址，一个是海淀的地址，我们将朝阳的地址设置为默认地址，是不是地址信息的属性起了决定作用？其实这种情况我们看起来是根据属性做的选择，本质上是根据属性筛选出某个唯一标识，然后将这个唯一标识对应的地址信息设置为默认地址。

在用户地址服务中并不关心地址信息的各个属性：某个被设置为默认的收货地址，我们通过唯一标识获取到其对应的属性后，完全有可能把省、市、区、街道、门牌号等信息全部都修改为新的值，但这个地址依旧被标记为默认地址，虽然可能已经和原来代表的地理位置相差了十万八千里。

因此，在用户地址服务中，我们自然而然地把地址对象建模成实体，并且在用户添加地址时赋予一个业务上的唯一标识。

> 注意，这个唯一标识是业务上的，通常不会使用数据库中 table 的自增主键作为业务的唯一标识，而是通过分布式 ID 服务申请一个唯一标识。

## 3. 实体的创建

在领域对象的生命周期中，实体会涉及到创建和重建。

我们要求领域对象的创建过程是原子的：不管是通过构造方法，还是通过 Factory/Builder 进行创建，创建完成的领域对象必须包含其必须的属性，且创建完成的对象必须满足业务规则，在创建过程中，任意必须的业务规则得不到满足，都必须终止创建过程。

实体的创建指从无到有生成一个实体，并为其赋予唯一标识，创建的过程一般是通过 Factory 进行的。

创建实体时需要为其授予唯一标识。在《实现领域驱动设计》一书中，有多种方式生成唯一标识：用户提供唯一标识、应用程序生成唯一标识、持久化机制生成唯一标识、另一个限界上下文提供唯一标识等。

在此不对这几种方式进行展开，笔者一般在 Factory 创建实体时请求分布式 ID 服务申请一个唯一标识。

## 4. 实体的重建

实体的重建是指实体已经存在了，只不过暂时不在内存中，需要通过其唯一标识重新加载到内存，这个重新加载到内存的过程就是重建，重建的过程往往通过 Repository 进行。

> 注意，重建的过程是面向聚合根的，因为只有聚合根才会拥有自己的 Repository，才会通过 Repository 持久化自己。聚合根内部的实体不会拥有自己的 Repository，聚合根内的实体的重建，只是聚合根重建的一个环节。

关于聚合、聚合根相关的知识，相信见[聚合与聚合根](./Aggregate.md)。

聚合根通过 Repository 被持久化时，这个过程中先 Repository 把领域模型翻译成数据库对应的数据模型，再由对应的 ORM 组件将数据模型持久化到数据库；聚合根通过 Repository 被加载时，Repository 先通过 ORM 组件将数据库记录读取为数据模型，再由 Repository 将数据模型翻译为聚合根。

非常不建议直接将领域模型映射到数据库的表，许多框架都提供了将领域模型中的实体或者值对象映射到表的实现，但我认为这不是一个好的实践，一方面使得领域模型承担的职责不再单一，一方面使得领域模型被数据库设计绑架。

有的资料把聚合根的创建和重建统一放到 Factory 中，这并不是好的实践，因为实体的重建和创建是不同的概念：创建实体时 Factory 不需要通过数据模型获取数据，直接操作领域模型（实体和值对象）即可，创建的过程需要为实体生成唯一标识；重建实体一般发生在持久化层，Repository 需要了解如何将数据模型映射为领域模型，由于已经拥有唯一标识，因此并不需要生成唯一标识。

可以从现实生活去理解这两个过程：汽车通过工厂（Factory）从无到有被生产出来，我们将汽车停到车库（Repository）后，我们并不关心车库是怎么存这辆车的，可能车库将车一个个零件拆下来存（例如将实体翻译为数据模型，再存到数据库中），也可能整体地存（例如直接转成 JSON 字符串存入缓存），只要我们根据车牌号（即唯一标识）去车库取车的时候，车库能正常把车提供给我们即可。

<!--@include: ../footer.md-->