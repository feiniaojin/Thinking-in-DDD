<center><img src="https://s1.ax1x.com/2023/02/27/pp9zsgg.png"/></center>

# 悟道领域驱动设计（Thinking in Domain Driven Design）

**各位朋友 clone 和 fork 之前，麻烦顺手帮忙 star 一下！**

## 1. 项目介绍

本项目是笔者领域驱动设计实践的总结，欢迎读者提出宝贵意见。

特点：

- 与开发语言无关、与框架无关，领域驱动设计是与技术无关的，因此本书中没有选择某些特殊的语言、特殊的框架作为案例，理论上看完本书可以使用任何语言实践 DDD。

- 作者始终坚信大道至简，好的东西应该能把事情简化，而不是把事情搞得更复杂，更不是为了讲解一个概念去提出一个新的概念，因此用最简单的语言去讲解领域驱动设计，力求每一位读者都能有所收获。

- 本书大部分架构图均采用 C4 架构模型，阅读本书的同时也将掌握 C4 架构模型。

## 2. 阅读方法

### 2.1 在线阅读

本项目已部署到 Github Pages，并使用 CDN 进行加速，请点击[在线阅读](http://ddd.feiniaojin.com/)。

![](https://s1.ax1x.com/2023/06/27/pCa5cm6.png)

### 本地阅读

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

## 2.2 案例代码

- DDD 基础类库

```text
https://github.com/feiniaojin/ddd
```

- 视频直播项目

```text
https://github.com/feiniaojin/ddd-live
```

[![pi1DckD.png](https://z1.ax1x.com/2023/11/08/pi1DckD.png)](https://imgse.com/i/pi1DckD)

- AIGC 项目

```text
https://github.com/feiniaojin/ddd-aigc
```

[![pinWL0f.png](https://z1.ax1x.com/2023/10/31/pinWL0f.png)](https://imgse.com/i/pinWL0f)

- CMS 项目

```text
https://github.com/feiniaojin/ddd-example-cms
```

## 2.3 版权声明

- 本作品代码部分

采用 [Apache 2.0 协议](https://www.apache.org/licenses/LICENSE-2.0)进行许可。

遵循许可的前提下，你可以自由地对代码进行修改，再发布，可以将代码用作商业用途。但要求你：

**署名**：在原有代码和衍生代码中，保留原作者署名及代码来源信息。

>必须提供作者的署名以及本作品的链接（http://ddd.feiniaojin.com/）

**保留许可证**：在原有代码和衍生代码中，保留 Apache 2.0 协议文件。

- 本作品文档、图片等内容部分

采用[署名-非商业性使用-禁止演绎 4.0 国际 (CC BY-NC-ND 4.0 DEED)](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-hans)进行许可。

在遵守以下条件的前提下：

**署名**： 您必须给出 适当的署名 ，提供指向本许可协议的链接，同时 标明是否（对原始作品）作了修改 。您可以用任何合理的方式来署名，但是不得以任何方式暗示许可人为您或您的使用背书。

>引用本作品任何内容时，必须提供作者的署名以及本作品的链接（http://ddd.feiniaojin.com/）

**非商业性使用**： 您不得将本作品用于 商业目的 。

>发表在自媒体平台（包括但不限于微信公众号、头条号等）将被视为商业应用，必须取得作者的授权。

**禁止演绎**： 如果您 再混合、转换、或者基于该作品创作 ，您不可以分发修改作品。

>基于本作品任何内容、任何形式（文章、视频、语音、有声书）的二次创作，都必须取得作者的授权。

**没有附加限制**： 您不得适用法律术语或者 技术措施 从而限制其他人做许可协议允许的事情。

您可以自由地：

**共享**： 在任何媒介以任何形式复制、发行本作品。

只要你遵守许可协议条款，许可人就无法收回你的这些权利。

# DDD 学习交流群

欢迎加入 DDD 交流群。微信扫以下二维码添加作者微信，标注“DDD”，好友申请通过后拉您进群。

<img src="qr.jpg" width="50%" height="50%" alt="qr.jpg" border="0"/>