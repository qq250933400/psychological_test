import { useStore } from "@components/DataStore";
import React, { useState } from "react";
import { useCallback } from "react";
import { QACheckBox, TypeCheckBoxData } from "./QACheckBox";
import { withStep } from "./Context";
import { useEffect } from "react";
import { createValidator } from "../../../utils/Validate";
import { Dialog } from "antd-mobile";

const QuestionData: TypeCheckBoxData[] = [
    {
        title: "一、R型（现实型职业）",
        subTitle: "你喜欢做下列事情吗?",
        name: "QAF_R",
        options: [
            { value: "R_1", title: "飞行机械技术人员。" },
            { value: "R_2", title: "鱼类和野生动物专家。" },
            { value: "R_3", title: "自动化工程技术人员。" },
            { value: "R_4", title: "木工。" },
            { value: "R_5", title: "机床安装工或钳工。" },
            { value: "R_6", title: "电工。" },
            { value: "R_7", title: "无线电报务员。" },
            { value: "R_8", title: "长途汽车司机。" },
            { value: "R_9", title: "火车司机。" },
            { value: "R_10", title: "机械师。" },
            { value: "R_11", title: "测绘、水文技术人员。" },
        ]
    }, {
        title: "二、I型（调研型职业）",
        subTitle: "你喜欢做下列事情吗?",
        name: "QAF_I",
        options: [
            { value: "I_1", title: "气象研究人员。" },
            { value: "I_2", title: "生物学研究人员。" },
            { value: "I_3", title: "天文学研究人员。" },
            { value: "I_4", title: "药剂师。" },
            { value: "I_5", title: "人类学研究人员。" },
            { value: "I_6", title: "化学研究人员。" },
            { value: "I_7", title: "科学杂志编辑。" },
            { value: "I_8", title: "植物学研究人员。" },
            { value: "I_9", title: "物理学研究人员。" },
            { value: "I_10", title: "科普工作者。" },
            { value: "I_11", title: "地质学研究人员。" },
        ]
    },{
        title: "三、A型（艺术型职业）",
        subTitle: "你喜欢下列职业吗？",
        name: "QAF_A",
        options: [
            { value: "A_1", title: "诗人。" },
            { value: "A_2", title: "文学艺术评论家。" },
            { value: "A_3", title: "作家。" },
            { value: "A_4", title: "记者。" },
            { value: "A_5", title: "歌唱家或歌手。" },
            { value: "A_6", title: "作曲家。" },
            { value: "A_7", title: "剧本写作人员。" },
            { value: "A_8", title: "画家。" },
            { value: "A_9", title: "相声演员。" },
            { value: "A_10", title: "乐团指挥。" },
            { value: "A_11", title: "电影演员。" },
        ]
    },{
        title: "四、S型（社会型职业）",
        subTitle: "你喜欢下列职业吗？",
        name: "QAF_S",
        options: [
            { value: "S_1", title: "街道、工会或妇联负责人。" },
            { value: "S_2", title: "中学教师。" },
            { value: "S_3", title: "青少年犯罪问题专家。" },
            { value: "S_4", title: "中学校长。" },
            { value: "S_5", title: "心理咨询人员。" },
            { value: "S_6", title: "精神病医生。" },
            { value: "S_7", title: "职业介绍所工作人员。" },
            { value: "S_8", title: "导游。" },
            { value: "S_9", title: "青年团负责人。" },
            { value: "S_10", title: "福利机构负责人。" },
            { value: "S_11", title: "婚姻介绍所工作人员。" },
        ]
    },{
        title: "五、E型（企业型职业）",
        subTitle: "你喜欢下列职业吗?",
        name: "QAF_E",
        options: [
            { value: "E_1", title: "供销科长。" },
            { value: "E_2", title: "推销员。" },
            { value: "E_3", title: "旅馆经理。" },
            { value: "E_4", title: "商店管理费用人员。" },
            { value: "E_5", title: "厂长。" },
            { value: "E_6", title: "律师或法官。" },
            { value: "E_7", title: "电视剧制作人。" },
            { value: "E_8", title: "饭店或饮食店经理。" },
            { value: "E_9", title: "人民代表。" },
            { value: "E_10", title: "服装批发商。" },
            { value: "E_11", title: "企业管理咨询人员。" },
        ]
    },{
        title: "六、C型（常规型职业）",
        subTitle: "你喜欢下列职业吗?",
        name: "QAF_C",
        options: [
            { value: "C_1", title: "簿记员。" },
            { value: "C_2", title: "会计师。" },
            { value: "C_3", title: "银行出纳员。" },
            { value: "C_4", title: "法庭书记员。" },
            { value: "C_5", title: "人口普查登记员。" },
            { value: "C_6", title: "成本核算员。" },
            { value: "C_7", title: "税务工作者。" },
            { value: "C_8", title: "校对员。" },
            { value: "C_9", title: "打字员。" },
            { value: "C_10", title: "办公室秘书。" },
            { value: "C_11", title: "质量检查员。" },
        ]
    }
];
type TypeQA = {
    name: string;
    options: Object
};
type TypeQAValidate = {
    QAF_R: TypeQA,
    QAF_I: TypeQA,
    QAF_A: TypeQA,
    QAF_S: TypeQA,
    QAF_E: TypeQA,
    QAF_C: TypeQA
};
const QAValidateSchema: any = {
    type: "Object",
    isRequired: true,
    properties: {
        name: {
            type: "String",
            isRequired: true
        },
        options: {
            type: "Object",
            isRequired: true
        }
    }
};

export const Step4 = withStep()(({ api }) => {
    const [ QuestionListData ] = useState(QuestionData);
    const storeObj = useStore();
    const [validateObj] = useState(() => createValidator<TypeQAValidate>({
        properties: {
            QAF_R: QAValidateSchema,
            QAF_I: QAValidateSchema,
            QAF_A: QAValidateSchema,
            QAF_S: QAValidateSchema,
            QAF_E: QAValidateSchema,
            QAF_C: QAValidateSchema
        }
    }))
    const onQAChange = useCallback((QAData)=>{
        const updateData: any = {};
        updateData[QAData.name] = QAData;
        storeObj.save("test24", updateData);
    },[storeObj]);
    useEffect(()=>{
        return api.onConfirm(()=>{
            return new Promise((resolve, reject) => {
                const data = storeObj.get("test24");
                const vResult = validateObj.validate(data);
                if(!vResult.pass) {
                    Dialog.alert({
                        title: "错误",
                        content: "问题不能留空。"
                    });
                    reject({});
                } else {
                    resolve({});
                }
            });
        }) as any;
    },[api, validateObj, storeObj]);
    return <div>
        <section className="Context">
            <p>下面列举了许多职业，对这些职业的基本情况你或多或少都有所了解，并在此基础上形成了自己的评价态度。如果你对某项职业喜欢的话，请在答题卷的相应题号上的“是”一栏中打“√”，</p>
            <i className="note">请你务必做完每一个题目。</i>
        </section>
        <hr className="questionSplitLine"/>
        {
            QuestionListData.map((questionItem, index) => {
                return <React.Fragment key={`qItem_${index}`} >
                    <QACheckBox onChange={onQAChange} name={questionItem.name} title={questionItem.title} subTitle={questionItem.subTitle} options={questionItem.options}/>
                    <hr className="questionSplitLine"/>
                </React.Fragment>
            })
        }
    </div>
});