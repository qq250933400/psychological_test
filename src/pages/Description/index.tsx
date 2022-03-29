import React, { useCallback, useEffect, useState } from "react";
import withFrame from "../../HOC/withFrame";
import withContext from "../../HOC/withContext";
import { utils } from "elmer-common";
import withService from "../../HOC/withService";
import styles from "./style.module.scss";

const Description = (props: any) => {
    const [ detail, setDetail ] = useState(props.detail || {});
    const startTest = useCallback(() =>{
        props.navigateTo("/question", {
            state: {
                questionData: {
                    id: detail.id,
                    title: detail.title,
                    type: detail.type,
                    category: detail.category,
                    items: detail.items
                }
            }
        });
    },[detail, props]);
    useEffect(()=>{
        setDetail(props.detail || {});
    },[props.detail]);
    return (
        <div className={styles.desc_page}>
            <div className={styles.description}>
                <div>
                    <h5 className={styles.description_title}>{detail.title}</h5>
                    <div className={styles.description_text}>
                        <b>测试说明：</b>
                        <p className="text" dangerouslySetInnerHTML={{__html: detail.description}} />
                    </div>
                </div>
            </div>
            <button onClick={startTest} className={styles.btnStart}>开始测试</button>
            <div className={styles.useDoc}><p dangerouslySetInnerHTML={{__html: detail.useDoc}} /></div>
        </div>
    );
};

const Page = withFrame({
    title: (opt) => {
        const identityText = opt.contextData.identity === 1 ? "家长" : "学生";
        const title = opt.contextData.profile?.title || "心里测试";
        return [title, "(", identityText, ")"].join("");
    },
    onInit: (opt:any) => {
        if(!opt.contextData?.profile) {
            opt.navigateTo("/profile");
            return ;
        }
        opt.setData(opt.contextData);
        opt.showLoading();
        opt.service.send({
            endPoint: "wenjuan.question",
            data: {
                testId: opt.contextData.test.id
            }
        }, {
            throwException: true
        }).then((resp: any) => {
            const detailData = resp.data;
            opt.hideLoading();
            if(detailData) {
                opt.setData({
                    detail: detailData
                });
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
})(Description);

export default withContext({
    dataKey: "description",
    mapDataToProps: (data, rootData) => {
        return {
            ...data,
            profile: utils.getValue(rootData, "profile.profile"),
            test: utils.getValue(rootData, "test.test"),
        };
    },
    mapDispatchToProps: (dispatch) => ({
        saveDetail: (data: any[]) => dispatch("detail", data),
    })
})(
    withService()(Page)
);