export default {
  title: "Thinking in Domain Driven Design",
  description: "悟道领域驱动设计",
  base: "/",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    outline: 'deep',
    socialLinks: [
      { icon: "github", link: "https://github.com/feiniaojin/Thinking-in-DDD" },
    ],
    footer: {
      copyright: "京ICP备17012814号-1 Copyright © 2020-present Qin Yujie",
    },
    nav: [
      {
        text: "悟道领域驱动设计",
        link: "/0.0.md",
        activeMatch: "/",
      }
    ],
    sidebar: [
      {
        items: [
          {
            text: "README",
            link: "/0.0.md",
          },
        ],
      },
      {
        text: "前言",
        collapsible: true,
        items: [
          {
            text: "作者简介",
            link: "/author.md",
          },
          {
            text: "学习交流",
            link: "/0.1.md",
          }
        ],
      },
      {
        text: "正文",
        collapsible: true,
        items: [
          {
            text: "第1章 初步认识领域驱动设计",
            link: "/1.md",
          },
          {
            text: "第2章 应用架构",
            link: "/2.md",
          }
        ],
      }
    ],
  },
};
