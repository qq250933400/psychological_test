import React, { useCallback, useEffect, useState } from "react";
import withFrame from "../../HOC/withFrame";
import PullToRefresh from "antd-mobile/es/components/pull-to-refresh";
import dialog from "antd-mobile/es/components/dialog";
import withService, { TypeService } from "../../HOC/withService";
import styles from "./style.module.scss";

const History = (props: any) => {
    const [ listData, setListData ] = useState(props.listData || []);
    const [ page, setPage ] = useState(props.page || 0);
    const [ pageSize ] = useState(props.pageSize || 10);
    const service: TypeService = props.service;
    const refreshList = useCallback(()=>{
        return new Promise((resolve, reject) => {
            service.send({
                endPoint: "wenjuan.history",
                data: {
                    page: page + 1,
                    pageSize
                }
            }).then((resp: any)=>{
                const newListData = resp.data.listData || [];
                setTimeout(() => {
                    if(newListData.length > 0) {
                        setPage(page + 1);
                        setListData([...listData, ...newListData]);
                    }
                    resolve({});
                }, 3000);
            }).catch((err)=>{
                reject(err.message);
            });
        });
    },[page,pageSize,listData,service, setPage,setListData]);
    const onQuitApp = useCallback(() => {
        service.send({
            endPoint: "wenjuan.exitApp"
        }).then(() => {
            sessionStorage.removeItem("token");
            props.navigateTo("/login");
        });
    },[]);
    useEffect(() => {
        setListData(props.listData);
    },[props.listData]);
    return (
        <div className={styles.history}>
            <label className={styles.title}><span>测试记录</span></label>
            <PullToRefresh onRefresh={()=>refreshList()}>
                <ul className={styles.list}>
                    {
                        listData && listData.map((item: any, index: number) => {
                            return <li key={index}>
                                <span>{item.testTitle}</span>
                                <i>
                                    <span>{item.createTime}</span>
                                    <b onClick={() => props.navigateTo("/report", { state: item })}>查看结果</b>
                                </i>
                            </li>
                        })
                    }
                </ul>
            </PullToRefresh>
            <button onClick={onQuitApp} className={styles.quitApplication}>退出</button>
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
