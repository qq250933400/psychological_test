import React, { useCallback, useEffect, useState } from "react";
import withFrame from "../../HOC/withFrame";
import withContext from "../../HOC/withContext";
import { utils } from "elmer-common";
import withService from "../../HOC/withService";
import styles from "./style.module.scss";

const History = (props: any) => {
    const [ listData, setListData ] = useState(props.listData || []);
    const [ page, setPage ] = useState(props.page || 0);
    const [ pageSize ] = useState(props.pageSize || 10);
    useEffect(() => {
        setListData(props.listData);
    },[props.listData]);
    console.log(listData);
    return (
        <div className={styles.history}>
            <label className={styles.title}><span>测试记录</span></label>
            <ul className={styles.list}>
                {
                    listData && listData.map((item: any, index: number) => {
                        return <li key={index}>
                            <span>{item.testTitle}</span>
                            <i>
                                <span>{item.createTime}</span>
                                <b>查看结果</b>
                            </i>
                        </li>
                    })
                }
            </ul>
        </div>
    );
};

const Page = withFrame({
    title: "测试记录",
    onInit: (opt:any) => {
        opt.showLoading();
        opt.service.send({
            endPoint: "wenjuan.history",
            data: {
                page: 0,
                pageSize: 10
            }
        }, {
            throwException: true
        }).then((resp: any) => {
            const detailData = resp.data;
            opt.hideLoading();
            if(detailData) {
                opt.setData(detailData);
            } else {
                opt.showError({
                    title: "暂无调查问卷",
                    message: "暂无调查问卷，请耐心等待系统更新。"
                });
            }
        }).catch((err:any) => {
            opt.hideLoading();
            opt.showError({
                message: err.message || "位置错误"
            });
        });
    },
    onRetry: (opt) => {
        opt.init();
    },
    onCancel: (opt) => {
        opt.navigateTo("/profile");
    },
    onHome: (opt) => {
        opt.navigateTo("/test");
    }
})(History);

export default withService()(Page);

// export default withContext({
//     dataKey: "history",
//     mapDataToProps: (data) => {
//         return {
//             ...data
//         };
//     },
//     mapDispatchToProps: (dispatch) => ({
//         saveHistory: (data: any[]) => dispatch("detail", data),
//     })
// })(
//     withService()(Page)
// );