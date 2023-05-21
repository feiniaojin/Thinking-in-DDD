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
        text: "架构方法论",
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
        text: "前言",
        collapsible: true,
        items: [
          {
            text: "作者简介",
            link: "/0/author",
          },
          {
            text: "全文导读",
            link: "/0/0.3",
          },
        ],
      },
      {
        text: "初步认识领域驱动设计",
        collapsible: true,
        items: [
          {
            text: "整体理解领域驱动设计",
            link: "/1/1.1",
          },
          {
            text: "如何学习DDD",
            link: "/1/1.2",
          },
          {
            text: "DDD落地答疑",
            link: "/1/1.3",
          },
        ],
      },
      {
        text: "DDD应用架构",
        collapsible: true,
        items: [
          { text: "现有应用架构存在的问题", link: "/2/2.1" },
          { text: "贫血模型和充血模型", link: "/2/2.2" },
          { text: "应用架构演化", link: "/2/2.3" },
          { text: "应用架构各层实现细节", link: "/2/2.4" },
          { text: "Domain层实现细节", link: "/2/DomainLayer" },
          { text: "Infrastructure层实现细节", link: "/2/InfrastructureLayer" },
          { text: "Application层实现细节", link: "/2/ApplicationLayer" },
          { text: "UserInterface层实现细节", link: "/2/UserInterfaceLayer" },
          { text: "领域对象的生命周期", link: "/2/2.5" },
          { text: "应用架构各层间数据流转", link: "/2/2.6" },
        ],
      },
      {
        text: "DDD核心概念",
        collapsible: true,
        items: [
          { text: "实体", link: "/3/Entity" },
          { text: "值对象", link: "/3/ValueObject" },
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
        text: "复杂业务逻辑实现",
        collapsible: true,
        items: [
          { text: "GoF设计模式", link: "/5/GoFDesignPattern" },
          { text: "无副作用函数", link: "/5/Side-Effect-FreeFunction" }
        ],
      },
      {
        text: "领域事件",
        collapsible: true,
        items: [
          { text: "幂等设计", link: "/6/Idempotent" },
          { text: "领域事件1——领域事件的建模", link: "/6/DomainEvent1" },
          { text: "领域事件2——领域事件的生成", link: "/6/DomainEvent2" },
          { text: "领域事件3——领域事件的发布", link: "/6/DomainEvent3" },
          { text: "领域事件4——领域事件的订阅", link: "/6/DomainEvent4" },
        ],
      },
      {
        text: "CQRS与事件溯源",
        collapsible: true,
        items: [
          { text: "CQRS", link: "/7/CQRS" },
          { text: "事件溯源", link: "/7/EventSourcing" },
        ],
      },
      {
        text: "一致性",
        collapsible: true,
        items: [
          { text: "聚合内事务实现", link: "/8/ConsistencyInAggregate" },
          { text: "跨聚合事务处理", link: "/8/ConsistencyBetweenAggregate" },
        ],
      },
      {
        text: "战略设计",
        collapsible: true,
        items: [
          { text: "战略设计概述", link: "StrategicDesign/StrategicDesign" },
          { text: "通用语言", link: "/StrategicDesign/UbiquitousLanguage" },
          { text: "限界上下文", link: "StrategicDesign/BoundContext" },
          { text: "上下文映射", link: "StrategicDesign/ContextMap" },
          { text: "子域", link: "/StrategicDesign/SubDomain" },
          { text: "防腐层", link: "/StrategicDesign/ACL" },
        ],
      },
      {
        text: "生态建设",
        collapsible: true,
        items: [
          { text: "Maven Archetype", link: "10/MavenArchetype" },
          { text: "代码生成器", link: "10/CodeGenerator" },
        ],
      },
      {
        text: "代码质量",
        collapsible: true,
        items: [
          { text: "测试驱动开发", link: "9/TDD" },
          { text: "静态分析", link: "9/StaticAnalysis" },
          { text: "编码指南", link: "9/CodingGuidelines" },
        ],
      },
    ],
  },
};
