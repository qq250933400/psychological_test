import React, { ChangeEvent, useCallback,useState, useMemo } from "react";
import styles from "../style.module.scss";
import utils from "../../utils";

type TypeLineInputProps = {
    label: string;
    btnSendText?: string;
    className?: string;
    type?: "text" | "number" | "mobile" | "password";
    onChange?: Function;
    onBeforeSend():Promise<any>;
    maxLength?: number;
};

const VerifyCodeInput = (props: TypeLineInputProps) => {
    const [ sendDisabled, setSendDisabled ] = useState(false);
    const [ timeoutText, setTimeoutText ] = useState("已发送");
    const onChange = useCallback((event: ChangeEvent) =>{
        const value = (event.target as HTMLInputElement).value;
        typeof props.onChange === "function" && props.onChange(value);
    },[props]);
    const timeTick = useCallback((timeCount: number) => {
        if(timeCount > 1) {
            setTimeoutText(`已发送(${timeCount}s)`);
            setTimeout(() => timeTick(timeCount - 1), 1000);
        } else {
            setSendDisabled(false);
        }
    }, [setTimeoutText, setSendDisabled]);
    const onSendClick = useCallback(()=> {
        if(!sendDisabled) {
            props.onBeforeSend().then(() => {
                console.log("send-success");
                setSendDisabled(true);
                timeTick(90);
            });
        }
    }, [sendDisabled, props, timeTick]);
    const sendProps = useMemo(() => {
        if(sendDisabled) {
            return {
                disabled: true
            };
        } else {
            return {};
        }
    }, [sendDisabled]);
    const sendButtonText = useMemo(() => {
        if(!sendDisabled) {
            return props.btnSendText || "发送验证码";
        } else {
            return timeoutText;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendDisabled, timeoutText]);
    return (
        <div className={utils.cn(styles.lineInput, props.className)}>
            <div>
                <label className={styles.lineInputLabel}>{props.label}</label>
                <div className={utils.cn(styles.lineInputBox, styles.verifyCodeInput)} >
                    <input maxLength={props.maxLength} type={props.type || "text"} onChange={onChange}/>
                    <button {...sendProps} onClick={onSendClick}>{ sendButtonText}</button>
                </div>
            </div>
        </div>
    );
};

export default VerifyCodeInput;
