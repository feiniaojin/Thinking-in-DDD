workspace {

    model {
        group "" {
            user = person "User"
            sysA = softwareSystem "Software System A" {
                webappA = container "Web Application" {
                    Controller = component "Controller" "接受用户请求" "WEB"
                    Service = component "Service" "处理业务逻辑" ""
                    Dao = component "Dao" "封装数据库操作" "ORM"
                    Model = component "Model" "不包含业务逻辑，不视为单独的层" "贫血模型"
                    Controller -> Service
                    Service -> Dao
                    Dao -> Model
                }
            }
            user -> webappA "Uses"
        }
    }
    views {
        component webappA {
            title "三层架构"
            include *
            autolayout lr
        }
        theme default
    }
}