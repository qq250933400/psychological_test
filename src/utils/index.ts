import { utils } from "elmer-common/lib/utils";

const cn = (...args:any[]): string => {
    const strArr: any[] = [];
    for(const str of args) {
        if(!utils.isEmpty(str)) {
            strArr.push(str);
        }
    }
    return strArr.join(" ");
}


// eslint-disable-next-line import/no-anonymous-default-export
export default {
    cn
};
