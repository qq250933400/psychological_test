import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.scss";
import loginRes from "../../res/login_title.png";
import loginLogo from "../../res/login_logo.png";
import LineInput from "../../components/LineInput";
import VerifyCodeInput from "../../components/VerifyCodeInput";
import withService, { TypeService  } from "../../HOC/withService";


const Login = (props: any) => {
    const [ userName, setUserName ] = useState("18924290704");
    const [ verifyCode, setVerifyCode ] = useState("22111");

    const service: TypeService = props.service;

    const navigation = useNavigate();
    const onLogin = useCallback(() => {
        service.send({
            endPoint: "wenjuan.login",
            data: {
                mobile: userName,
                verifyCode
            }
        }).then((resp:any) => {
            const token = resp.data.token;
            sessionStorage.setItem("token", token);
            navigation("/profile");
        });
    }, [navigation, service, userName, verifyCode]);
    const onBeforeSendClick = useCallback(() => {
        return service.send({
            endPoint: "wenjuan.smsOTP",
            data: {
                phoneNum: userName
            }
        });
    }, [service, userName]);

    return (
        <div className={styles.login}>
            <img className={styles.loginTitle} src={loginRes} alt="Login"/>
            <img className={styles.loginLogo} src={loginLogo} alt="logo"/>
            <div className={styles.loginInputArea}>
                <LineInput label="手机号" maxLength={11} type="mobile" defaultValue={userName} onChange={(v: string) => setUserName(v)}/>
                <VerifyCodeInput onBeforeSend={onBeforeSendClick} defaultValue={verifyCode} maxLength={6} className={styles.verifyCode} label="验证码" type="text" onChange={(v: string) => setVerifyCode(v)}/>
            </div>
            <button onClick={onLogin} className={styles.loginButton}>登录</button>
            <label className={styles.loginCopyRight}>
                <span>江苏省科学传播中心</span>
                <span>江苏省心理学会</span>
            </label>
        </div>
    );
};

export default withService()(Login);
