# 领域服务

## 1. 什么是领域服务

通过对实体和值对象的建模，我们将领域中绝大部分的过程和操作清晰地归属到对应的实体和值对象上。

然而，当领域中的某个重要的过程或转换操作不是实体和值对象的自然职责时，如果强加到实体或者值对象上，会显得非常的突兀并且不合理。

这种情况下，应该定义一个独立的接口，在接口中声明这样的操作，这样的接口就是领域服务（Domain Service）。

## 2. 领域服务的特点

第一点，领域服务与领域相关，但是领域服务的操作无法归属于实体和值对象。

第二点，接口是根据操作命名定义的。

第三点，领域服务是无状态的，更多类似工具类一样的角色。

## 3. 领域服务实践

创建领域服务时要经过慎重考虑，确认领域服务的操作不能归属于实体和值对象，否则会造成领域服务的滥用，形成新的贫血模型。

领域服务通常根据其实现的功能进行进行命名，例如导出数据到Excel的领域服务可命名为DomainExportService。

领域服务通常以多个领域对象作为入参，以值对象作为出参。

以上面说的DomainExportService为例。

```java
public interface DomainExportService{

    /**
    * 多个领域对象作为入参，以值对象作为出参
     */
    ExcelData export(List<DomainObject> list); 
}
```

而在Application Service中我们这样使用：

```java
public class ApplicationService{

    @Resource
    private DomainExportService domainExportService;

    public Excel exportToExcel(Params params){
        
        //TODO 加载领域模型

        //将领域模型转为输出
        ExcelData excelData = domainExportService.export(list);

        //TODO 根据ExcelData生成Excel文件并返回

        return excel;
    }
}
```
## 4. 领域服务与应用服务的区别

领域服务（Domain Service）是领域知识的一部分，领域服务可以理解领域模型内部的逻辑。

应用服务（Application Service）不是领域知识，应用服务也不应该去理解领域模型，不会做业务逻辑处理。

