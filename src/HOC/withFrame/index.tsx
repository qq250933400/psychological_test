import React, { useState, useEffect, useMemo } from "react";
import styles from "./style.module.scss";
import Loading from "antd-mobile/es/components/loading";
import Result from "antd-mobile/es/components/result";
import UndoOutline from "antd-mobile-icons/es/UndoOutline";
import LeftOutline from "antd-mobile-icons/es/LeftOutline";
import { useNavigate, To, NavigateOptions, useLocation } from "react-router-dom";
import { utils } from "elmer-common";

type WithFrameExceptionInfo = {
    title?: string,
    message: string;
};
type WithFrameTitleCallback = (props: any) => string;

type WithFrameProps = {
    showLoading():void;
    hideLoading():void;
    setData(newData: any): void;
    showError(info: WithFrameExceptionInfo): void,
    hideError(): void,
    navigateTo(to: To, options?: NavigateOptions): void;
    init(): void;
};

type WithFrameOptions = {
    title?: string | WithFrameTitleCallback;
    showLoading?: boolean;
    loadingText?: string;
    onInit?(opt: WithFrameProps): void;
    onCancel?(opt: WithFrameProps): void;
    onRetry?(opt: WithFrameProps): void;
    onHome?(opt: WithFrameProps): void;
    onHistory?(opt: WithFrameProps): void;
};


const withFrame = (options: WithFrameOptions) => {
    const withFrameState = {
        isInit: false
    };
    return (WrapperComponent: any):any => {
        if(!options.onHome) {
            options.onHome = (opt) => {
                opt.navigateTo("/profile");
            };
        }
        if(!options.onHistory) {
            options.onHistory = (opt) => {
                opt.navigateTo("/history");
            };
        }
        return (props: any) => {
            const location = useLocation();
            const [ loading, setLoading ] = useState(options.showLoading);
            const [ loadingText ] = useState(options.loadingText || "加载数据");
            const [ optData, setOptData ] = useState({});
            const [ title ] = useState(() => {
                return typeof options.title === "function" ? options.title(props) : options.title;
            });
            const [ errInfo, setErrInfo ] = useState({
                show: false,
                title: "无法完成操作",
                message: "未知错误信息，请联系客服。",
            });
            const navigateTo = useNavigate();
            const exProps = useMemo(() => ({
                showLoading: () => setLoading(true),
                hideLoading: () => setLoading(false),
                setData: (newData: any) => setOptData(newData || {}),
                showError: (info: WithFrameExceptionInfo) => setErrInfo({
                    show: true,
                    title: info.title || "操作失败",
                    message: info.message
                }),
                hideError: () => setErrInfo({
                    show: false,
                    title: "",
                    message: ""
                }),
                navigateTo: (to: To, options?: NavigateOptions) => navigateTo(to, options)
            }),[navigateTo]);
            const apiProps = useMemo(() => ({
                ...exProps,
                init:()=>{
                    typeof options.onInit === "function" && options.onInit({
                        ...props,
                        ...exProps
                    });
                }
            }), [props, exProps]);
            useEffect(() => {
                !withFrameState.isInit && typeof options.onInit === "function" && options.onInit({
                    ...props,
                    ...exProps
                });
                withFrameState.isInit = true;
            }, [props, exProps]);
            useEffect(() => {
                const oldLocation = sessionStorage.getItem("location");
                if(!utils.isEmpty(oldLocation) && oldLocation !== location.pathname) {
                    // 此处主要为防止withFrame这个component不被销毁重建，和React选择逻辑有关
                    typeof options.onInit === "function" && options.onInit({
                        ...props,
                        ...exProps
                    });
                }
                sessionStorage.setItem("location", location.pathname);
            }, [location,props,exProps]);
            return <div className={styles.withFramePage}>
                <header>
                    { !errInfo.show && <button className={styles.btnHome} onClick={()=> { typeof options.onHome === "function" && options.onHome(apiProps) }}/>}
                    { errInfo.show && (
                        <button
                            className={styles.btnCancel}
                            onClick={()=> {
                                apiProps.hideError();
                                typeof options.onCancel === "function" && options.onCancel(apiProps);
                            }}
                        >
                            <LeftOutline /><span>取消</span>
                        </button>
                    )}
                    <span>{title || ""}</span>
                    { !errInfo.show && <button className={styles.btnHistory} onClick={()=> { typeof options.onHistory === "function" && options.onHistory(apiProps) }}/> }
                    { errInfo.show && (
                        <button
                            className={styles.btnRetry}
                            onClick={()=> {
                                apiProps.hideError();
                                typeof options.onRetry === "function" && options.onRetry(apiProps);
                            }}
                        >
                            <UndoOutline /><span>重试</span>
                        </button>
                    )}
                </header>
                <div className={styles.withFramePageContent}>
                    {
                        loading && !errInfo.show && (
                            <div className={styles.fullLoading}>
                                <Loading color='white' />
                                <span>{loadingText}</span>
                            </div>
                        )
                    }
                    {
                        errInfo.show && (
                            <Result
                                status='error'
                                title={errInfo.title}
                                description={errInfo.message}
                                className={styles.exception}
                            />
                        )
                    }
                    {
                        !loading && !errInfo.show && <WrapperComponent
                            {...props}
                            {...optData}
                            {...exProps}
                            onInit={()=>{
                                console.log("do--Init--");
                                typeof options.onInit === "function" && options.onInit({
                                    ...props,
                                    ...exProps
                                });
                            }}
                        />
                    }
                </div>
            </div>
        }
    }
};

export default withFrame;
