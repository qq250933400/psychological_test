import React, { useEffect, useState, useCallback } from "react";
import withFrame from "../../HOC/withFrame";
import withContext from "../../HOC/withContext";
import { utils } from "elmer-common";
import withService from "../../HOC/withService";
import styles from "./style.module.scss";

const Test = (props: any) => {
    const [ testList, setTestList ] = useState(props.testList || []);
    const onClick = useCallback((test: any) => {
        props.saveTest(test);
        props.navigateTo("/description");
    }, [props]);
    useEffect(()=>{
        setTestList(props.testList || []);
    },[props.testList]);
    return (
        <div className={styles.test}>
            <ul>
                {
                    testList.map((item: any, index: number) => {
                        return <li key={index} onClick={() => onClick(item)}><span>{item.title}</span></li>
                    })
                }
            </ul>
        </div>
    );
};

const Page = withFrame({
    title: (opt) => {
        return opt.contextData.profile?.title || "心里测试";
    },
    onInit: (opt:any) => {
        const contextData = opt.contextData || {};
        if(!opt.contextData?.profile) {
            opt.navigateTo("/profile");
            return ;
        }
        opt.setData(opt.contextData);
        opt.showLoading();
        opt.service.send({
            endPoint: "wenjuan.testByCategory",
            data: {
                categoryId: contextData.profile.id
            }
        }, {
            throwException: true
        }).then((resp: any) => {
            const listData = resp.data || [];
            
            if(listData.length > 0) {
                opt.hideLoading();
                opt.saveTestList(listData);
                opt.setData({
                    testList: listData
                });
            } else {
                opt.hideLoading();
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
    }
})(Test);

export default withContext({
    dataKey: "test",
    mapDataToProps: (data, rootData) => {
        return {
            ...data,
            profile: utils.getValue(rootData, "profile.profile")
        };
    },
    mapDispatchToProps: (dispatch) => ({
        saveTestList: (data: any[]) => dispatch("testList", data),
        saveTest: (data: any) => dispatch("test", data)
    })
})(
    withService()(Page)
);