# 上下文映射

## 1. 上下文映射的概念

上下文映射是描述不同上下文之间的交互和关系的过程。

上下文映射可以分为两种类型：共享内核与非共享内核。

共享内核则是将两个上下文之间的共同部分提取出来形成一个通用的内核。

适配器用于将两个上下文之间的交互进行转换，使得它们可以相互通信。

2. 适配器

适配器是一种用于连接两个不同上下文之间的交互的模式。它可以将一个上下文的数据格式转换为另一个上下文可以理解的格式。适配器通常包括两个部分：输入适配器和输出适配器。

输入适配器将外部数据转换为内部上下文可以理解的格式。例如，一个电商网站可能需要与多个支付网关进行交互，每个支付网关都有自己的数据格式。为了将这些数据转换为电商网站可以理解的格式，可以编写一个输入适配器来进行转换。

输出适配器则将内部数据转换为外部上下文可以理解的格式。例如，一个电商网站可能需要将订单数据发送给物流公司，但是物流公司可能需要使用不同的数据格式。为了将订单数据转换为物流公司可以理解的格式，可以编写一个输出适配器来进行转换。

以下是一个简单的示例代码，演示如何使用适配器模式将两个上下文之间的交互进行转换：

```java
// 输入适配器
public class PaymentGatewayAdapter {
    public PaymentData convertToInternalFormat(String externalData) {
        // 将外部数据转换为内部数据
        PaymentData paymentData = new PaymentData();
        // ...
        return paymentData;
    }
}

// 输出适配器
public class LogisticsAdapter {
    public String convertToExternalFormat(OrderData orderData) {
        // 将内部数据转换为外部数据
        String externalData = "";
        // ...
        return externalData;
    }
}
```

3. 共享内核

共享内核是一种用于处理两个或多个上下文之间共同部分的模式。它可以将共同部分提取出来形成一个通用的内核，以便在不同上下文之间共享。

共享内核通常包括三个部分：领域模型、基础设施和应用服务。领域模型是业务规则和流程的表示，基础设施提供与外部系统的交互，应用服务则是将领域模型和基础设施连接起来的服务。

以下是一个简单的示例代码，演示如何使用共享内核模式处理两个上下文之间的共同部分：

```java
// 领域模型
public class Product {
    private String name;
    private double price;
    // ...

    public void changePrice(double newPrice) {
        // 更新价格
        this.price = newPrice;
    }
}

// 基础设施
public class ProductRepository {
    public Product getProductById(int id) {
        // 查询数据库获取产品信息
        Product product = new Product();
        // ...
        return product;
    }

    public void saveProduct(Product product) {
        // 将产品信息保存到数据库
        // ...
    }
}

// 应用服务
public class ProductService {
    private ProductRepository productRepository;

    public void changeProductPrice(int productId, double newPrice) {
        // 获取产品信息
        Product product = productRepository.getProductById(productId);
        // 更新价格
        product.changePrice(newPrice);
        // 保存产品信息
        productRepository.saveProduct(product);
    }
}
```

4. 总结

上下文映射是领域驱动设计中重要的概念，用于描述不同上下文之间的交互和关系。适配器模式用于将两个不同上下文之间的交互进行转换，共享内核模式用于处理两个或多个上下文之间共同部分。在实际应用中，可以根据具体情况选择适合的模式来实现上下文映射。