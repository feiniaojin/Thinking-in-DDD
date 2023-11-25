# 随书示例代码

本书随书代码整理如下，目前正在持续整理中。

## 依赖库

随书案例中可能依赖了以下的Java库，欢迎star！

### Graceful Response

Graceful Response是一个Spring Boot体系下的优雅响应处理器，提供一站式统一返回值封装、全局异常处理、自定义异常错误码、JSR303参数校验增强等功能，使用Graceful Response进行web接口开发不仅可以节省大量的时间，还可以提高代码质量，使代码逻辑更清晰。

零学习门槛，十秒钟上手！

GitHub仓库地址：https://github.com/feiniaojin/graceful-response

详细使用文档见[文档中心](https://doc.feiniaojin.com)。

### pie

pie是一个可快速上手的责任链框架，开发者只需要专注业务，开发相应的handler，即可完成业务的责任链落地。pie的核心代码均来自Netty，绝大部分的API与Netty是一致的。

一分钟学会、三分钟上手、五分钟应用，欢迎star。

pie源码地址：https://github.com/feiniaojin/pie.git

pie案例工程源码地址：https://github.com/feiniaojin/pie-example.git

详细使用文档见[文档中心](https://doc.feiniaojin.com)。

### ddd-archetype
ddd-archetype是一个Maven Archetype的原型工程，是基于本书《第2章 应用架构》的应用架构。我们将其克隆到本地之后，可以安装为Maven Archetype，帮助我们快速创建DDD项目脚手架。

本书所有案例均使用ddd-archetype创建，架构简单容易理解，成功案例众多，欢迎在实际工作中使用。

详细使用文档见[文档中心](https://doc.feiniaojin.com)。

### ddd

DDD的实现与技术无关，但本书部分案例代码为了开发效率，因此依赖了该类库。

该类库在ddd-live、ddd-aigc等多个项目中有引用。

GitHub地址：https://github.com/feiniaojin/ddd


## 第10章 事件溯源

### 第一个实现方案——基础版本

这是书中介绍的第一种实现方案——基于领域事件完成聚合根重建，每次执行Command操作时都需要加载所有领域事件并重建聚合根。

仓库地址：
```text
https://github.com/feiniaojin/ddd-event-sourcing
```
### 第二个实现方案——快照版本

这是书中介绍的第一种实现方案——引入快照，加速聚合根重建的实现溯源方案。每次执行Command操作时，先加载快照，在快照的基础上回放领域事件并重建聚合根。

仓库地址：

```text
https://github.com/feiniaojin/ddd-event-sourcing-snapshot
```

### 第三个实现方案——待整理

//TODO

## 第20章 使用DDD实现直播服务

### 项目基本信息

DDD-LIVE，基于DDD实现的直播服务，提供了可运行的前端和后端服务。

### 前端工程地址

```text
https://github.com/feiniaojin/ddd-live-front
```
### 后端工程地址
```text
https://github.com/feiniaojin/ddd-live
```
### 后端技术栈

- SpringBoot
- MyBatis、Spring Data JDBC
- Graceful-Response
```text
https://github.com/feiniaojin/graceful-response
```
- ddd-archetype
```text
https://github.com/feiniaojin/ddd-archetype
```
- MySQL
- 阿里云视频直播服务

### 项目运行截图

- 直播间管理
  [![piZkLm6.png](https://z1.ax1x.com/2023/10/26/piZkLm6.png)](https://imgse.com/i/piZkLm6)
- 主播管理
  [![piZA91A.png](https://z1.ax1x.com/2023/10/26/piZA91A.png)](https://imgse.com/i/piZA91A)
- 直播管理
  [![piZAC6I.png](https://z1.ax1x.com/2023/10/26/piZAC6I.png)](https://imgse.com/i/piZAC6I)
- 开播推拉流
  首先从直播管理页面复制推流地址，将其配置到OBS，并开始推流。
  [![piZAVAS.png](https://z1.ax1x.com/2023/10/26/piZAVAS.png)](https://imgse.com/i/piZAVAS)
  [![piZAu1s.png](https://z1.ax1x.com/2023/10/26/piZAu1s.png)](https://imgse.com/i/piZAu1s)
  [![piZAU39.png](https://z1.ax1x.com/2023/10/26/piZAU39.png)](https://imgse.com/i/piZAU39)

接下来可以从直播管理页面，点击直播预览观看正在推流的直播。
[![piZAdj1.png](https://z1.ax1x.com/2023/10/26/piZAdj1.png)](https://imgse.com/i/piZAdj1)

注意，此处仅演示了观看直播的功能，在实际中会为观众提供直播观看落地页面或者客户端，如下图。
[![pi1DckD.png](https://z1.ax1x.com/2023/11/08/pi1DckD.png)](https://imgse.com/i/pi1DckD)

## 第21章 使用DDD开发AIGC产品

### 项目基本信息 

DDD-AIGC，本项目是《悟道领域驱动设计》（英文名：Thinking in Domain Driven Design）第21章的随书案例代码。

本项目实现了一个贴纸日记的AIGC应用。 当用户需要记日记时，在一张贴纸上写下事情和参与者，系统会用ChatGPT生成日记正文。

原型图如下：

[![pinW76I.png](https://z1.ax1x.com/2023/10/31/pinW76I.png)](https://imgse.com/i/pinW76I)

### 后端工程地址

```text
https://github.com/feiniaojin/ddd-aigc
```

### 后端技术栈

- SpringBoot
- MyBatis、Spring Data JDBC
- Graceful-Response
```text
https://github.com/feiniaojin/graceful-response
```
- ddd-archetype
```text
https://github.com/feiniaojin/ddd-archetype
```
- MySQL
- ChatGPT

### 项目运行截图

[![pinWL0f.png](https://z1.ax1x.com/2023/10/31/pinWL0f.png)](https://imgse.com/i/pinWL0f)


