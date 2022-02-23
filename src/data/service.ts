import { createServiceConfig } from "../HOC/withService/ElmerService";
const host = window.location.host;
export default createServiceConfig({
    env: ENV,
    host: {
        "DEV": "http://localhost/api/public/index.php",
        "PROD": `http://${host}/proxy`
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
                },
                submitTest: {
                    url: "/wenjuan/question/submit/test",
                    method: "POST"
                },
                history: {
                    url: "/wenjuan/question/test/history",
                    method: "POST"
                },
                getReport: {
                    url: "/wenjuan/question/test/report",
                    method: "POST"
                },
                exitApp: {
                    url: "/wenjuan/user/logout",
                    method: "POST"
                }
            }
        }
    }
});