workspace {

    model {
        group "" {
            user = person "User"
            sysA = softwareSystem "Software System A" {
                webappA = container "Web Application"{
                    Controller = component "Controller" "接受用户请求" "WEB"
                    Service = component "Service" "协调Model和DAO完成业务逻辑" ""
                    Repository = component "Repository" "加载、持久化领域模型" "基础设施层"
                    Domain = component "Domain" "包含业务逻辑" "充血模型"
                    DataModel = component "DataModel" "无业务逻辑的数据模型，数据库逆向生成"
                    Controller -> Service "1.调用Service完成业务操作"
                    Service -> Domain "2.业务逻辑处理"
                    Service -> Repository "3.数据持久化"
                    Repository -> DataModel "4.领域模型/数据模型互相转化"
                }
            }


            user -> webappA "Uses"


        }
    }


    views {
        component webappA {
            title "三层架构演化第三步的架构图"
            include *
        }
        theme default
    }

}