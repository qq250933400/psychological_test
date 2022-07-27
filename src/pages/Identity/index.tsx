import React, { useCallback } from "react";
import withFrame, { WithFrameProps } from "../../HOC/withFrame";
import { Dialog } from "antd-mobile";
import withService, { TypeService } from "../../HOC/withService";
import imgParent from "../../res/parent.png";
import imgStudent from "../../res/student.png";
import styles from "./style.module.scss";
import withContext from "../../HOC/withContext";
import { useNavigate } from "react-router-dom";

type TypeOnInitProps = {
    service: TypeService;
};

const Identity = (props: any) => {
    const naviagteTo = useNavigate();
    const onSaveIdentity = useCallback((identity: number) => {
        sessionStorage.setItem("identity", identity as any);
        props.setIdentity(identity);
        naviagteTo("/profile");
    }, [props, naviagteTo]);
    return (<div className={styles.identity}>
        <button className="student" onClick={()=> onSaveIdentity(0)}>
            <img src={imgStudent} alt="学生"/>
            <span>我是学生</span>
        </button>
        <button className="parent">
            <img src={imgParent} alt="家长" onClick={()=> onSaveIdentity(1)}/>
            <span>我是家长</span>
        </button>
    </div>);
};

const IdentityFrame = withService()(withFrame({
    title: "选择身份",
    onHome: (opt) => {
        Dialog.confirm({
            title: "询问？",
            content: "未选择身份将退出登录，是否继续？",
            confirmText: "确定",
            cancelText: "取消",
            onConfirm: () => {
                opt.navigateTo("/login");
            }
        });
    },
    onHistory: (opt) => {
        opt.navigateTo("/history");
    },
    onInit: ((opt: WithFrameProps & TypeOnInitProps) => {
        opt.showLoading({
            title: "加载数据"
        });
        opt.service.send({
            endPoint: "wenjuan.identity"
        }).then((data:any) => {
            opt.setData({
                identity: data?.data || []
            });
            opt.hideLoading();
        }).catch((err) => {
            console.error(err);
            opt.hideLoading();
        })
    }) as any,
})(Identity));

export default withContext({
    dataKey: "identity",
    mapDispatchToProps: (dispatch) => {
        return {
            setIdentity: (identity: number) => dispatch("value", identity)
        };
    }
})(IdentityFrame);