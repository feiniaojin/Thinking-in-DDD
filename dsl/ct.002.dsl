workspace {

    model {
        group "" {
            user = person "User"
            sysA = softwareSystem "Software System A" {
                webappA = container "Web Application" {
                    Controller = component "Controller" "接受用户请求" "WEB"
                    Service = component "Service" "协调Model和DAO完成业务逻辑" ""
                    Dao = component "DAO" "封装数据库操作" "ORM"
                    Model = component "Model" "包含业务逻辑" "充血模型"
                    Controller -> Service "1.调用Service完成业务操作"
                    Service -> Model "2.业务逻辑处理"

                    Service -> Dao "3.数据持久化"
                }
            }


            user -> webappA "Uses"


        }
    }


    views {
        component webappA {
            title "三层架构抽取业务模型后的架构图"
            include *
        }
        theme default
    }

}