export default {
    title: "Thinking in Domain Driven Design",
    description: "悟道领域驱动设计",
    base: "/",
    head: [
        ['link', {rel: 'icon', href: '/favicon.ico'}]
    ],
    themeConfig: {
        outline: 'deep',
        socialLinks: [
            {icon: "github", link: "https://github.com/feiniaojin/Thinking-in-DDD"},
        ],
        footer: {
            copyright: "京ICP备17012814号-1 Copyright © 2020-present Qin Yujie",
        },
        nav: [
            {
                text: "主页",
                link: "/0.0.md",
                activeMatch: "/",
            },
            {
                text: "开源项目",
                link: "https://doc.feiniaojin.com",
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
                    },
                    {
                        text: "知识答疑",
                        link: "/0.2.md",
                    }
                ],
            },
            {
                text: "附录",
                collapsible: true,
                items: [
                    {
                        text: "随书示例代码",
                        link: "/samples.md",
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
                    },
                    {
                        text: "第3章 实体和值对象",
                        link: "/3.md",
                    },
                    {
                        text: "第4章 聚合与聚合根",
                        link: "/4.md",
                    },
                    {
                        text: "第5章 工厂、仓储和领域服务",
                        link: "/5.md",
                    },
                    {
                        text: "第6章 设计模式",
                        link: "/6.md",
                    },
                    {
                        text: "第7章 防腐层",
                        link: "/7.md",
                    },
                    {
                        text: "第8章 领域事件",
                        link: "/8.md",
                    },
                    {
                        text: "第9章 CQRS",
                        link: "/9.md",
                    },
                    {
                        text: "第10章 事件溯源",
                        link: "/10.md",
                    },
                    {
                        text: "第11章 一致性",
                        link: "/11.md",
                    },
                    {
                        text: "第12章 战略设计",
                        link: "/12.md",
                    },
                    {
                        text: "第13章 领域建模",
                        link: "/13.md",
                    },
                    {
                        text: "第14章 研发效能",
                        link: "/14.md",
                    },
                    {
                        text: "第15章 测试驱动开发",
                        link: "/15.md",
                    },
                    {
                        text: "第16章 敏捷开发",
                        link: "/16.md",
                    },
                    {
                        text: "第17章 C4架构模型",
                        link: "/17.md",
                    },
                    {
                        text: "第18章 使用DDD进行系统重构",
                        link: "/18.md",
                    },
                    {
                        text: "第19章 团队领域驱动设计",
                        link: "/19.md",
                    },
                    {
                        text: "第20章 使用DDD开发直播服务",
                        link: "/20.md",
                    },
                    {
                        text: "第21章 使用DDD开发AIGC产品",
                        link: "/21.md",
                    }
                ],
            }
        ],
    },
};
