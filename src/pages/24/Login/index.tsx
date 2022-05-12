import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.scss";
import loginRes from "../../../res/24/ocupation_test.png";
import LineInput from "../../../components/LineInput";
import VerifyCodeInput from "../../../components/VerifyCodeInput";
import withService, { TypeService  } from "../../../HOC/withService";
import testTitleRes from "../../../res/24/test_title.png";


const Login = (props: any) => {
    const [ userName, setUserName ] = useState("");
    const [ verifyCode, setVerifyCode ] = useState("");

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
            navigation("/testDesc");
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
            <div>
                <img className={styles.loginTitle} src={loginRes} alt="Login"/>
                <div className={styles.loginInputArea}>
                    <LineInput label="手机号" maxLength={11} type="mobile" defaultValue={userName} onChange={(v: string) => setUserName(v)}/>
                    <VerifyCodeInput onBeforeSend={onBeforeSendClick} defaultValue={verifyCode} maxLength={6} className={styles.verifyCode} label="验证码" type="text" onChange={(v: string) => setVerifyCode(v)}/>
                </div>
                <button onClick={onLogin} className={styles.loginButton}>
                    <img src={testTitleRes} alt="立刻测试"/>
                </button>
                <label className={styles.loginCopyRight}>
                    <span>江苏省科学传播中心</span>
                    <span>江苏省心理学会</span>
                </label>
            </div>
        </div>
    );
};

export default withService()(Login);