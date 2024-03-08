<div style="text-align: center;"><img src="https://s1.ax1x.com/2023/02/27/pp9zsgg.png"/></div>

# 悟道领域驱动设计（Thinking in Domain Driven Design）

## 1. 项目介绍

### 1.1 内容介绍

本书是作者领域驱动设计实战的总结，目前已交由**博文视点**进行出版，敬请期待。

全书章节如下：

|章节|标题|内容介绍|
|-----|---------------|--|
| 1 | 初步了解领域驱动设计 | 提供完整的DDD学习路线 |
| 2 | 应用架构 |理解DDD的应用架构、生命周期、类型变化|
| 3 | 实体和值对象 |战术设计理解|
| 4 | 聚合与聚合根 |战术设计理解|
| 5 | 工厂、仓储和领域服务 |战术设计理解|
| 6 | 设计模式 |实现复杂业务场景|
| 7 | 防腐层 |实现复杂业务场景|
| 8 | 领域事件 |领域事件建模、生成、发布、订阅|
| 9 | CQRS |CQRS实际应用|
| 10 | 事件溯源 |介绍3种事件溯源实现方案|
| 11 | 一致性 |聚合内一致性、跨聚合一致性、分布式事务|
| 12 | 战略设计 |战略设计理解|
| 13 | 领域建模 |事件风暴建模|
| 14 | 研发效能 |为DDD提效加速|
| 15 | 测试驱动开发 |TDD|
| 16 | 敏捷开发 |DDD如何结合敏捷开发|
| 17 | C4架构模型 |架构可视化|
| 18 | 使用DDD进行系统重构 |系统重构的实战经验|
| 19 | 团队领域驱动设计 |推广DDD、研发规范|
| 20 | 使用DDD开发直播服务 |使用DDD开发视频直播产品|
| 21 | 使用DDD开发AIGC产品 |使用DDD开发基于ChatGPT的产品|

### 1.2 本书特点

本书主要有以下特点：

- 与开发语言和技术框架无关

领域驱动设计是与技术无关的，因此本书中没有选择某些特殊的语言、特殊的框架作为案例，理论上看完本书可以使用任何语言实践 DDD。

- 语言平实易于理解

作者始终坚信大道至简，好的东西应该能把事情简化，而不是把事情搞得更复杂，更不是为了讲解一个概念去提出一个新的概念，因此用最简单的语言去讲解领域驱动设计，力求每一位读者都能有所收获。

- 实战与理论相结合

本书大部分领域驱动设计的概念，都给出了对应的示例代码，帮助读者在将理论应用于实际项目中。

欢迎读者提出宝贵意见。

## 2. 阅读方法

### 2.1 在线阅读

本项目已部署到 Github Pages，并使用 CDN 进行加速，请点击[在线阅读](https://ddd.feiniaojin.com/)。

![](https://s1.ax1x.com/2023/06/27/pCa5cm6.png)

### 2.2 PDF下载

- 夸克网盘

```text
链接：https://pan.quark.cn/s/119c3f52e167
提取码：mFvL
```

- 阿里云盘

```text
链接：https://www.aliyundrive.com/s/V6eCVRJMxm1
提取码: i26i
```

- 百度网盘

```text
链接: https://pan.baidu.com/s/1SAh5yJ2_xFAWuZoRsNpP-g
提取码: 7t9n 
```

### 2.3 本地运行

本文档是由[VitePress](https://github.com/vuejs/vitepress)驱动的，可以通过克隆本工程进行本地编译构建运行。过程如下：

```shell
# 克隆获取源码
$ git clone https://github.com/feiniaojin/Thinking-in-DDD.git

# 进入项目文件夹
$ cd Thinking-in-DDD

# 安装依赖
$ yarn add all

# 启动工程
$ yarn docs:dev
```

工程启动后，访问链接为:

```shell
http://localhost:5173/Thinking-in-DDD/
```

## 3. 案例代码

本书提供随书示例代码，目前已整理到[示例代码](https://ddd.feiniaojin.com/samples.html)。

## 4. DDD学习交流群

### 4.1 微信交流群

欢迎加入 DDD 交流群。微信扫以下二维码添加作者微信，标注“DDD”，好友申请通过后拉您进群。

<div><img src="./assets/qr.jpg" width="50%" height="50%" alt="pi1rmB6.jpg" border="0"/></div>

### 4.2 公众号

本书专属公众号“悟道领域驱动设计”，对于读者提出的问题，作者解答后将发布在该公众号上。敬请关注。

<div><img src="./assets/gzh.jpg" width="50%" height="50%" alt="pi1rmB6.jpg" border="0"/></div>

## 5. 版权声明

### 本作品代码部分

采用 [Apache 2.0 协议](https://www.apache.org/licenses/LICENSE-2.0)进行许可。

遵循许可的前提下，你可以自由地对代码进行修改，再发布，可以将代码用作商业用途。但要求你：

**署名**：在原有代码和衍生代码中，保留原作者署名及代码来源信息。

> 必须提供作者的署名以及本作品的链接（https://ddd.feiniaojin.com/）

**保留许可证**：在原有代码和衍生代码中，保留 Apache 2.0 协议文件。

### 本作品文档、图片等内容部分

采用[署名-非商业性使用-禁止演绎 4.0 国际 (CC BY-NC-ND 4.0 DEED)](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-hans)
进行许可。

在遵守以下条件的前提下：

**署名**： 您必须给出 适当的署名 ，提供指向本许可协议的链接，同时 标明是否（对原始作品）作了修改
。您可以用任何合理的方式来署名，但是不得以任何方式暗示许可人为您或您的使用背书。

> 引用本作品任何内容时，必须提供作者的署名以及本作品的链接（ https://ddd.feiniaojin.com/ ）

**非商业性使用**： 您不得将本作品用于 商业目的 。

> 在媒体、自媒体平台（包括但不限于微信公众号、头条号等）转载、二次创作、发表等行为将被视为商业应用，必须取得作者的授权。

**禁止演绎**： 如果您 再混合、转换、或者基于该作品创作 ，您不可以分发修改作品。

> 基于本作品任何内容，进行任何形式（包括但不限于文章、视频、语音、有声书等）的二次创作（包括翻译为其他语言），必须取得作者的授权。

**没有附加限制**： 您不得适用法律术语或者 技术措施 从而限制其他人做许可协议允许的事情。

您可以自由地：

**共享**： 在任何媒介以任何形式复制、发行本作品。

只要你遵守许可协议条款，许可人就无法收回你的这些权利。

