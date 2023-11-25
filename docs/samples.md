# 示例代码

## 第10章 事件溯源

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


