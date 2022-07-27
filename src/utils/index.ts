import { utils } from "elmer-common/lib/utils";

export const cn = (...args:any[]): string => {
    const strArr: any[] = [];
    for(const str of args) {
        if(!utils.isEmpty(str)) {
            strArr.push(str);
        }
    }
    return strArr.join(" ");
}
export const identity = () => {
    const identity = sessionStorage.getItem("identity") || "";
    return /^1$/.test(identity) ? "家长" : "学生";
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    cn,
    identity
};
