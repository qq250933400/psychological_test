import { createServiceConfig } from "../HOC/withService/ElmerService";

export default createServiceConfig({
    env: "DEV",
    host: {
        "DEV": "http://localhost/api/public/index.php"
    },
    config: {
        wenjuan: {
            endPoints: {
                login: {
                    url: "/wenjuan/login/submit",
                    method: "POST"
                },
                smsOTP: {
                    url: "/api/aliyun/sendSMS",
                    method: "POST"
                },
                category: {
                    url: "/wenjuan/users/category/list",
                    method: "GET"
                },
                testByCategory: {
                    url: "/wenjuan/users/test/list",
                    method: "POST"
                },
                question: {
                    url: "/wenjuan/users/question",
                    method: "POST"
                }
            }
        }
    }
});