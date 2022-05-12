import React, { useMemo, useEffect,useState } from "react";
import { utils } from "elmer-common";
import { withFrameFor24 } from "../withFrame";
import LineInput from "../../../components/LineInput";
import { Form, useForm, FormItem } from "../../../components/Form";
import testDesc from "../../../res/24/test_desc.png";
import style from "./style.module.scss";
import loginStyles from "../Login/style.module.scss";
import { useStore } from "@components/DataStore";
import { useNavigate } from "react-router-dom";
import { useService } from "@HOC/withService";

const InfoForm = () => {
    const formObj = useForm();
    const storeObj = useStore();
    const navigateTo = useNavigate();
    const [defaultValue, setDefaultValue] = useState<any>({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const baseInfo = formObj.get<any>() || {};
    const nextBtnStatus = useMemo(()=>{
        const btnProps:any = {};
        if(utils.isEmpty(baseInfo.name)) {
            btnProps.disabled = true;
        }
        if(utils.isEmpty(baseInfo.gender)) {
            btnProps.disabled = true;
        }
        if(utils.isEmpty(baseInfo.age)) {
            btnProps.disabled = true;
        }
        if(utils.isEmpty(baseInfo.school)) {
            btnProps.disabled = true;
        }
        return btnProps;
    }, [baseInfo]);
    const serviceObj = useService({
        navigateTo: () => { navigateTo("/loginFor24") }
    });
    useEffect(() => {
        serviceObj.send({
            endPoint: "wenjuan.getBasicInfo"
        }).then((resp:any) => {
            setDefaultValue(resp.data || {});
        }).catch((err) => console.error(err));
    }, [ serviceObj ])
    return (
        <div className={loginStyles.loginInputArea}>
            <FormItem name="name"><LineInput defaultValue={defaultValue.name} label="姓 名：" /></FormItem>
            <FormItem name="gender"><LineInput defaultValue={defaultValue.gender} label="性 别：" /></FormItem>
            <FormItem name="age"><LineInput defaultValue={defaultValue.age} label="年 龄：" type="number" /></FormItem>
            <FormItem name="school"><LineInput defaultValue={defaultValue.school} label="学 校：" /></FormItem>

        <button {...nextBtnStatus} className={loginStyles.loginButton} type="button" onClick={()=>{
            storeObj.save("test24", {
                basicInfo: formObj.get()
            });
            serviceObj.send({
                endPoint: "wenjuan.updateBasicInfo",
                data: formObj.get()
            }).then(() => {
                navigateTo("/testFor24");
            }).catch((err) => console.error(err));
            
        }}>
            下一步
        </button>
        </div>
    );
};

export default withFrameFor24({
    title: "我适合做什么职业?"
})(()=>{
    
    return <div className={style.descriptonLayout}>
        <div className={style.descriptionTitle}>
            <img src={testDesc} alt="测试说明"/>
        </div>
        <div className={style.description}>
            <p>你是否在职业选择或者升学志愿填报时有很多困惑？你是否在面临自己未来的职业规划时束手无策？要想确定自己适合哪些专业或者职业是一件复杂的事情，不过你不用担心。心理学家已经开发了一套测试，可以帮助你找到适合的方向。下面是量表的介绍，请你仔细阅读。</p>
            <p>本测验量表将帮助你发现和确定自己的职业兴趣和能力特长，从而更好地做出求职择业的决策。如果你已经考虑好或选择好了自己的职业，本测验将拓展你的视野，向你展示其他可能合适的职业；如果你至今尚未确定职业方向，本测验将帮助你根据自己的情况选择一些恰当的职业目标。</p>
            <p>本测验共有七个部分，每部分测验都没有时间限制，但请你尽快按要求完成。</p>
        </div>
        <Form>
            <InfoForm />
        </Form>
    </div>
});
