workspace {

    model {
        group "" {
            user = person "User"
            sysA = softwareSystem "Software System A" {
                webappA = container "Web Application" {
                    ui_web = component "ui-web" "接受用户请求" "WEB"
                    ui_provider = component "ui-provider" "RPC服务提供者" "RPC"
                    ui_worker = component "ui-worker" "定时任务" "定时任务"
                    ui_subscriber = component "ui-subscriber" "订阅消费领域事件" "领域事件订阅者"
                    ApplicationService = component "Appllcation Service" "协调Domain和基础设施层完成业务逻辑" ""
                    infrastructure_persistence = component "infrastructure-persistence" "加载、持久化领域模型" "基础设施层"
                    infrastructure_cache = component "infrastructure-cache" "缓存" "基础设施层"
                    infrastructure_publisher = component "infrastructure-publisher" "发布领域事件" "基础设施层"
                    infrastructure_gateway = component "infrastructure-gateway" "调用外部系统或者资源" "基础设施层"
                    Domain = component "Domain" "包含业务逻辑" "充血模型"
                    ui_web -> ApplicationService "1.调用Service完成业务操作"
                    ui_provider -> ApplicationService "1.调用Service完成业务操作"
                    ui_worker -> ApplicationService "1.调用Service完成业务操作"
                    ui_subscriber -> ApplicationService "1.调用Service完成业务操作"
                    ApplicationService -> Domain "2.业务逻辑处理"
                    ApplicationService -> infrastructure_persistence "3.领域模型持久化"
                    ApplicationService -> infrastructure_cache "3.缓存操作"
                    ApplicationService -> infrastructure_publisher "3.发布领域事件"
                    ApplicationService -> infrastructure_gateway "3.调用外部服务"


                }
            }


            user -> webappA "Uses"


        }
    }


    views {
        component webappA {
            title "三层架构演化第四步的架构图"
            include *
        }
        theme default
    }

}