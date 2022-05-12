import { useStore } from "@components/DataStore";
import React, { useState } from "react";
import { useCallback } from "react";
import { QACheckBox, TypeCheckBoxData } from "./QACheckBox";
import { withStep } from "./Context";
import { useEffect } from "react";
import { createValidator } from "../../..//utils/Validate";
import { Dialog } from "antd-mobile";

const QuestionData: TypeCheckBoxData[] = [
    {
        title: "一、R型（现实性活动）",
        subTitle: "你喜欢做下列事情吗？",
        name: "QA_R",
        options: [
            { value: "R_1", title: "装配修理电器。" },
            { value: "R_2", title: "修理自行车。" },
            { value: "R_3", title: "装修机器或机器零件。" },
            { value: "R_4", title: "做木工活。" },
            { value: "R_5", title: "驾驶卡车或拖拉机。" },
            { value: "R_6", title: "开机床。" },
            { value: "R_7", title: "开摩托车。" },
            { value: "R_8", title: "上金属工艺课。" },
            { value: "R_9", title: "上机械制图课。" },
            { value: "R_10", title: "上木工手艺课。" },
            { value: "R_11", title: "上电气自动化技术课。" },
        ]
    }, {
        title: "二、I型（调查型活动）",
        subTitle: "你喜欢做下列事情吗？",
        name: "QA_I",
        options: [
            { value: "I_1", title: "阅读科技书刊。" },
            { value: "I_2", title: "在实验室工作。" },
            { value: "I_3", title: "研究某个科研项目。" },
            { value: "I_4", title: "制作飞机、汽车模型。" },
            { value: "I_5", title: "做化学实验。" },
            { value: "I_6", title: "阅读专业性论文。" },
            { value: "I_7", title: "解一道数学或棋艺难题。" },
            { value: "I_8", title: "上物理课。" },
            { value: "I_9", title: "上化学课。" },
            { value: "I_10", title: "上几何课。" },
            { value: "I_11", title: "上生物课。" },
        ]
    },{
        title: "三、A型（艺术性活动）",
        subTitle: "你喜欢做下列事情吗？",
        name: "QA_A",
        options: [
            { value: "A_1", title: "素描、制图或绘画。" },
            { value: "A_2", title: "表演戏剧、小品或相声节目。" },
            { value: "A_3", title: "设计家具或房屋。" },
            { value: "A_4", title: "在舞台上演唱或跳舞。" },
            { value: "A_5", title: "演奏一种乐器。" },
            { value: "A_6", title: "阅读流行小说。" },
            { value: "A_7", title: "听音乐会。" },
            { value: "A_8", title: "从事摄影创作。" },
            { value: "A_9", title: "阅读电影、电视剧本。" },
            { value: "A_10", title: "读诗写诗。" },
            { value: "A_11", title: "上书法美术课。" },
        ]
    },{
        title: "四、S型（社会型活动）",
        subTitle: "你喜欢做下列事情吗？",
        name: "QA_S",
        options: [
            { value: "S_1", title: "给朋友们写信。" },
            { value: "S_2", title: "参加学校、单位组织的正式活动。" },
            { value: "S_3", title: "加入某个社会团体或俱乐部。" },
            { value: "S_4", title: "帮助别人解决困难。" },
            { value: "S_5", title: "照看小孩。" },
            { value: "S_6", title: "参加宴会、茶话会或联欢晚会。" },
            { value: "S_7", title: "跳交谊舞。" },
            { value: "S_8", title: "参加讨论会或辩论会。" },
            { value: "S_9", title: "观看运动会或体育比赛。" },
            { value: "S_10", title: "寻亲访友。" },
            { value: "S_11", title: "阅读与人际交往有关的书刊。" },
        ]
    },{
        title: "五、E型（企/事业型活动）",
        subTitle: "你喜欢做下列事情吗？",
        name: "QA_E",
        options: [
            { value: "E_1", title: "对他人做劝说工作。" },
            { value: "E_2", title: "买东西与人讨价还价。" },
            { value: "E_3", title: "讨论政治问题。" },
            { value: "E_4", title: "从事个体或独立的经营活动。" },
            { value: "E_5", title: "出席正式会议。" },
            { value: "E_6", title: "做演讲。" },
            { value: "E_7", title: "在社会团体中做一名理事。" },
            { value: "E_8", title: "检查与评价别人的工作。" },
            { value: "E_9", title: "结识名流。" },
            { value: "E_10", title: "带领一群人去完成某项任务。" },
            { value: "E_11", title: "参与政治活动。" },
        ]
    },{
        title: "六、C型（常规型（传统型）活动）",
        subTitle: "你喜欢做下列事情吗？",
        name: "QA_C",
        options: [
            { value: "C_1", title: "保持桌子和房间整洁" },
            { value: "C_2", title: "抄写文章或信件。" },
            { value: "C_3", title: "开发票、写收据或打回条。" },
            { value: "C_4", title: "打算盘或用计算机计算。" },
            { value: "C_5", title: "记流水账或备忘录。" },
            { value: "C_6", title: "上打字课或学速记法。" },
            { value: "C_7", title: "上会计课。" },
            { value: "C_8", title: "上商业统计课。" },
            { value: "C_9", title: "将文件、报告、记录分类与归档。" },
            { value: "C_10", title: "为领导写公务信函与报告。" },
            { value: "C_11", title: "检查个人收支情况。" },
        ]
    }
];
type TypeQA = {
    name: string;
    options: Object
};
type TypeQAValidate = {
    QA_R: TypeQA,
    QA_I: TypeQA,
    QA_A: TypeQA,
    QA_S: TypeQA,
    QA_E: TypeQA,
    QA_C: TypeQA
};

const QAValidateSchema: any = {
    type: "Object",
    isRequired: false,
    properties: {
        name: {
            type: "String",
            isRequired: false
        },
        options: {
            type: "Object",
            isRequired: false
        }
    }
};

export const Step2 = withStep()(({ api }) => {
    const [ QuestionListData ] = useState(QuestionData);
    const storeObj = useStore();
    const [validateObj] = useState(() => createValidator<TypeQAValidate>({
        properties: {
            QA_R: QAValidateSchema,
            QA_I: QAValidateSchema,
            QA_A: QAValidateSchema,
            QA_S: QAValidateSchema,
            QA_E: QAValidateSchema,
            QA_C: QAValidateSchema
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
            <p>下面列举了一些十分具体的活动。这些活动无所谓好坏，如果你喜欢去参加(包括过去、现在或将来)，就请在答案前的方框口内划个“√”。</p>
            <i className="note">注意：这一部分测验主要想确定你的职业兴趣，而不是让你选择工作，你喜欢某种活动并不意味着你一定要从事这种活动。答题时不必考虑过去是否干过和是否擅长这种活动，只根据你的兴趣直接判断即可。请务必做完每一题目。</i>
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