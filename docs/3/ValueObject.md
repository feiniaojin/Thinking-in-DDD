# 值对象

## 1. 值对象的概念理解

值对象（Value Object）：对领域知识进行建模之后，对某些概念进行描述的对象，称之为值对象，值对象没有唯一标识。

实体（Entity）和值对象（Value Object）是对事物进行领域建模后的两种表现形式，两者在技术实现上的区别在于有没有业务唯一标识。

许多资料将技术上的区别当成实体和值对象的根本区别，但技术实现是一种表象，其根本原因是在一个限界上下文内是否关心某个对象在业务上的唯一性和连续性，关心则将其建模为实体，不关心则建模为值对象。

我们一般将值对象建模为不可变对象，一经创建，则值对象的属性不能修改，如果需要修改值对象的属性，必须重新生成值对象，使用新的值对象整体替换旧的值对象。有时候会直接把值对象的属性设置为 final，通过构造方法实例化对象之后，其属性就无法更改，这当然是非常好的实践。假如由于其他的原因不得不暴露了 set 方法，则可以通过形成开发团队内的研发规范，约定不通过 set 方法修改值对象的属性，而是通过无副作用函数产生新的值对象以满足修改值对象属性的需求。

## 2. 订单、配送服务对地址信息的建模

在[实体](./Entity.md)一文中，我们将地址服务的地址建模为实体，我们再看一下订单、配送服务中对地址的建模。

用户下单时，订单、配送服务通常会保存地址的快照，此时并不关心这个地址信息是否有唯一标识，也不关心是用户下单时录入的，还是用户从地址薄里选择的，它只是对订单的配送地址做了描述。

订单、配送服务的地址信息，其生命周期与订单、运单等实体的生命周期相同。通常我们不会单独关注这个地址信息，一般都是关注某个特定订单、运单的地址信息。这是因为地址信息这个领域对象，其描述的是对应聚合根的某个特征，只有在其聚合根的范围内才有意义。

在订单、配送服务中，有时候在数据库层面，有可能会将地址信息存储在单独的一张表中，通常称之为扩展表。此时虽然地址信息的数据库记录有 table 的自增主键，但是其并没有业务上的唯一标识，所以我们不要将其错误地认为此时地址信息被建模为实体了。关于这种单独扩展表存储的值对象在技术上该如何实现，读者可参考本系列文章[Repository](../4/Repository.md)，文中详细讲解了使用扩展表存储的数据模型该如何映射为领域模型。

我们从数据库读取某个订单的地址信息，一般都是通过其订单号进行查询的，脱离了订单的订单收货地址，即使强行为其赋予了唯一标识，业务上也没有意义。

## 3. 无副作用的值对象方法

值对象的属性一般要求不可变，值对象对外提供的方法，我们要求实现为无副作用函数。

无副作用函数的定义，请参考[无副作用函数](../5/5.4.md) 。

值对象的方法，如果返回类型也是值对象，我们要求创建新的值对象进行返回，而不是修改原有值对象的属性。

案例如下：

```java
public class CustomInt{

    private int a;

    public CustomInt(int a){
        this.a=a;
    }

    public CustomInt plus(int x){
        return new CustomInt(a+x);
    }
}
```

plus 这个方法需要返回 CustomInt 类型的结果，我们不是通过修改旧的值对象，而是通过创建新的值对象进行返回。

## 4. 值对象的创建

值对象创建完成时所有的属性都必须被正确初始化，创建过程结束之后不允许赋值或者修改，所有的属性修改需求都必须通过创建新的值对象来满足。

我们可以直接通过有入参的构造方法创建值对象，但更好的实践是提供 Factory 或者 Builder。

- 通过 Factory 创建

```java
public class ValueObjectFactory{

    public ValueObject newInstance(prop1,prop2,prop3……){

        //校验逻辑
        Objects.requireNonNull(prop1,"prop1不能为空");
        Objects.requireNonNull(prop2,"prop2不能为空");
        Objects.requireNonNull(prop3,"prop3不能为空");

        ValueObject valueObject = new ValueObject();
        valueObject.setProp1(prop1);
        //省略其余赋值语句
        return valueObject;
    }
}
```

- 通过 Builder 创建

如果值对象需要初始化的属性比较多，很容易导致工厂方法入参过多，我们可以采用建造者模式改善这种情况。

```java
public class CustomValue {

    private String prop1;
    private String prop2;
    private String prop3;

    public static class Builder {
        private String prop1;
        private String prop2;
        private String prop3;

        public Builder withProp1(String prop1) {
            this.prop1 = prop1;
            return this;
        }

        public Builder withProp2(String prop2) {
            this.prop2 = prop2;
            return this;
        }

        public Builder withProp3(String prop3) {
            this.prop3 = prop3;
            return this;
        }

        public CustomValue build() {

            Objects.requireNonNull(prop1,"prop1不能为空");
            Objects.requireNonNull(prop2,"prop2不能为空");
            Objects.requireNonNull(prop3,"prop3不能为空");

            CustomValue customValue = new CustomValue();
            customValue.setProp1(prop1);
            customValue.setProp2(prop2);
            customValue.setProp3(prop3);
            return customValue;
        }
    }

   //省略get/set方法
}
```

需要创建 CustomValue 实例时，通过其 Builder 进行实例化。

```java
CustomValue customValue = new Builder().withProp1("prop1")
                .withProp2("prop2")
                .withProp3("prop3").build();
```

## 5. Domain Primitive(DP)

Domain Primitive 即 DP，可以理解为领域内的基本类型。

我们把某些隐层的概念显式抽取出来建模成值对象，并提供自校验的逻辑，则形成了 DP。

举个大家耳熟能详的例子：

```java

public class Entity{

    //省略其他属性

    /**
     * 金额
     */
    private BigDecimal amount;

    /**
     * 货币
     */
    private String currency;

    //省略行为
}

```

金额和货币这两个属性联系非常紧密，而且需要一起配合才能完整表达金钱的概念，因此我们把把金额和火币抽取出来，建模成值对象 Money。

同时，由于这两个属性必须同时具备才能表达业务含义，因此我们在创建 Money 时就必须提供校验。

```java

public class Money{
     /**
     * 金额
     */
    private final BigDecimal amount;

    /**
     * 货币
     */
    private final String currency;

    public Money(BigDecimal amount,String currency){
        //业务规则校验，amount和currency任一个都不能为空
        if(Objects.isNull(amount)||Objects.isNull(currency)){
            throw new IllegalArgumentException();
        }
        this.amount=amount;
        this.currency=currency;
    }

}
```

在 Entity 中，我们可以使用 Money 替代原来的属性：

```java

public class Entity{

    //省略其他属性

    /**
     * 金钱
     */
    private Money money;

    //省略行为
}

```

在任意创建 Money 的地方，都会默认对 amount 和 currency 进行校验，避免了业务逻辑的泄漏，不需要每个用例都校验一遍，代码会更清晰可读。

<!--@include: ../footer.md-->
