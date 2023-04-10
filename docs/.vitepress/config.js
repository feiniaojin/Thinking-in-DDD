export default {
  title: "Thinking in DDD",
  description: "悟道DDD",
  base: "/",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    socialLinks: [
      { icon: "github", link: "https://github.com/feiniaojin/Thinking-in-DDD" },
    ],
    footer: {
      copyright: "Copyright © 2020-present Qin Yujie",
    },
    nav: [
      {
        text: "悟道DDD",
        link: "/0/0.0.md",
        activeMatch: "/",
      },
      {
        text: "企业信息架构",
        link: "https://github.com/feiniaojin/architecture-framework",
      },
      {
        text: "悟道项目管理",
        link: "https://github.com/feiniaojin/project-management",
      },
      {
        text: "悟道产品经理",
        link: "https://github.com/feiniaojin/product-manager",
      },
    ],
    sidebar: [
      {
        items: [
          {
            text: "README",
            link: "/0/0.0",
          },
        ],
      },
      {
        text: "0. 前言",
        collapsible: true,
        items: [
          {
            text: "目录",
            link: "/0/0.1",
          },
          {
            text: "作者简介",
            link: "/0/0.2",
          },
          {
            text: "全文导读",
            link: "/0/0.3",
          },
        ],
      },
      {
        text: "1. 初步认识领域驱动设计",
        collapsible: true,
        items: [
          {
            text: "1.1 整体理解领域驱动设计",
            link: "/1/1.1",
          },
          {
            text: "1.2 如何学习DDD",
            link: "/1/1.2",
          },
          {
            text: "1.3 DDD落地答疑",
            link: "/1/1.3",
          },
        ],
      },
      {
        text: "2. DDD应用架构",
        collapsible: true,
        items: [
          { text: "2.1 现有应用架构存在的问题", link: "/2/2.1" },
          { text: "2.2 贫血模型和充血模型", link: "/2/2.2" },
          { text: "2.3 应用架构演化", link: "/2/2.3" },
          { text: "2.4 应用架构各层实现细节", link: "/2/2.4" },
          { text: "2.5 领域对象的生命周期", link: "/2/2.5" },
          { text: "2.6 应用架构各层间数据流转", link: "/2/2.6" },
        ],
      },
      {
        text: "DDD核心概念",
        collapsible: true,
        items: [
          { text: "实体和值对象", link: "/3/EntityAndValueObject" },
          { text: "聚合与聚合根", link: "/3/Aggregate" },
          { text: "领域服务", link: "/3/DomainService" },
        ],
      },

      {
        text: "DDD核心组件",
        collapsible: true,
        items: [
          { text: "Repository", link: "/4/Repository" },
          { text: "Factory", link: "/4/Factory" },
        ],
      },
      {
        text: "5. 复杂业务逻辑实现",
        collapsible: true,
        items: [
          { text: "5.1 GoF设计模式", link: "/5/5.1" },
          { text: "5.3 防腐层", link: "/5/5.3" },
          { text: "5.4 无副作用函数", link: "/5/5.4" },
        ],
      },
      {
        text: "领域事件",
        collapsible: true,
        items: [
          { text: "幂等设计", link: "/6/Idempotent" },
          { text: "领域事件", link: "/6/DomainEvent" },
        ],
      },
      {
        text: "7. CQRS",
        collapsible: true,
        items: [
          { text: "7.1 CQRS", link: "/7/7.1" },
          { text: "7.2 事件溯源", link: "/7/7.2" },
        ],
      },
      {
        text: "8.一致性",
        collapsible: true,
        items: [
          { text: "8.1 聚合内事务实现", link: "/8/8.1" },
          { text: "8.2 跨聚合事务处理", link: "/8/8.2" },
        ],
      },
      {
        text: "战略设计",
        collapsible: true,
        items: [
          { text: "战略设计", link: "StrategicDesign/StrategicDesign" },
          { text: "限界上下文", link: "StrategicDesign/BoundContext" },
          { text: "上下文映射", link: "StrategicDesign/ContextMap" },
          { text: "子域", link: "/3/3.3" }
        ],
      },
    ],
  },
};
