import { Toast } from "antd-mobile";
import { utils } from "elmer-common";

type TypeCommonHandlerOpt = {
    throwException?: boolean;
    returnValue?: any;
    onError?(err: {
        statusCode?: string;
        message?: string;
    }): void;
};

/**
 * 错误统一处理方法，遇到错误结果返回true,否则返回undefined或者true
 * @param resp 返回数据
 * @param errorResponse 检查数据是否是http错误数据, true， 查询不到错误信息，自定义默认数据
 */
export const commonHandler = (respData:any, errorResponse?: boolean, opt?: TypeCommonHandlerOpt): any => {
    const isEmpty = utils.isEmpty;
    const resp = respData.data || respData;
    if(resp.statusCode !== 200) {
        if(!isEmpty(resp.statusCode)) {
            let msg = resp.message || resp.info || resp.statusText || "请求失败";
            msg = `${msg} (${resp.statusCode})`
            !opt?.throwException && Toast.show({
                content: msg,
                icon: "fail",
                position: "center"
            });
            opt?.throwException && typeof opt.onError === "function" && opt.onError({
                statusCode: resp.statusCode,
                message: msg
            });
            if(opt) {
                opt.returnValue = {
                    statusCode: resp.statusCode,
                    message: msg
                };
            }
            return true;
        } else {
            if(!isEmpty(resp.success) && !resp.success) {
                const msg = resp.message || resp.info || resp.statusText || "请求失败";
                !opt?.throwException && Toast.show({
                    content: msg,
                    icon: "fail",
                    position: "center"
                });
                opt?.throwException && typeof opt.onError === "function" && opt.onError({
                    statusCode: "F_500",
                    message: msg
                });
                if(opt) {
                    opt.returnValue = {
                        statusCode: resp.statusCode,
                        message: msg
                    };
                }
                return true;
            }
        }
    } else {

    }
    if(errorResponse) {
        const msg = resp.message || resp.info || resp.statusText || "请求失败";
        !opt?.throwException && Toast.show({
            content: msg,
            icon: "fail",
            position: "center"
        });
        opt?.throwException && typeof opt.onError === "function" && opt.onError({
            statusCode: resp.statusCode || resp.status,
            message: msg
        });
        if(opt) {
            opt.returnValue = {
                statusCode: resp.statusCode,
                message: msg
            };
        }
        return true;
    }
};
