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
        title: "一、R型（现实型能力）",
        subTitle: "你擅长做或胜任下列事情吗?",
        name: "QAG_R",
        options: [
            { value: "R_1", title: "使用锯子、钳子、车床、砂轮等工具。" },
            { value: "R_2", title: "使用万能电表。" },
            { value: "R_3", title: "给自行车或机器加油使它们正常运转。" },
            { value: "R_4", title: "使用钻床、研磨机、缝纫机等。" },
            { value: "R_5", title: "修整木器家具表面。" },
            { value: "R_6", title: "看机械、建筑设计图纸。" },
            { value: "R_7", title: "修理结构简单的家用电器。" },
            { value: "R_8", title: "制作简单的家具。" },
            { value: "R_9", title: "绘制机械设计图纸。" },
            { value: "R_10", title: "修理收录音机的简单部件。" },
            { value: "R_11", title: "疏通、修理自来水管或下水道。" },
        ]
    }, {
        title: "二、I型（调研型能力）",
        subTitle: "你擅长做或胜任下列事情吗?",
        name: "QAG_I",
        options: [
            { value: "I_1", title: "了解真空管的工作原理。" },
            { value: "I_2", title: "知道三种以上蛋白质含量高的食物。" },
            { value: "I_3", title: "知道一种放射性元素的“半衰期”。" },
            { value: "I_4", title: "使用对数表。" },
            { value: "I_5", title: "使用计算器或计算尺。" },
            { value: "I_6", title: "使用显微镜。" },
            { value: "I_7", title: "辨认3个星座。" },
            { value: "I_8", title: "说明白血球的功能。" },
            { value: "I_9", title: "解释简单的化学分子式。" },
            { value: "I_10", title: "理解人造卫星不会落地的道理。" },
            { value: "I_11", title: "参加科技竞赛或科研成果交流会。" },
        ]
    },{
        title: "三、A型（艺术型能力）",
        subTitle: "你擅长做或胜任下列事情吗？",
        name: "QAG_A",
        options: [
            { value: "A_1", title: "演奏一种乐器。" },
            { value: "A_2", title: "参加二重唱或四重唱表演。" },
            { value: "A_3", title: "独奏或独唱。" },
            { value: "A_4", title: "扮演剧中角色。" },
            { value: "A_5", title: "说书或讲故事。" },
            { value: "A_6", title: "表演现代舞或芭蕾舞。" },
            { value: "A_7", title: "人物素描。" },
            { value: "A_8", title: "油画或雕塑。" },
            { value: "A_9", title: "制造陶器、捏泥塑或剪纸。" },
            { value: "A_10", title: "设计服装、海报或家具。" },
            { value: "A_11", title: "写得一手好文章。" },
        ]
    },{
        title: "四、S型（社会型能力）",
        subTitle: "你擅长做或胜任下列事情吗？",
        name: "QAG_S",
        options: [
            { value: "S_1", title: "善于向别人解释问题。" },
            { value: "S_2", title: "参加慰问或救济活动。" },
            { value: "S_3", title: "善与人合作、配合默契。" },
            { value: "S_4", title: "殷勤待客。" },
            { value: "S_5", title: "能深入浅出地教育儿童。" },
            { value: "S_6", title: "为一次宴会安排娱乐活动。" },
            { value: "S_7", title: "帮助他人解决困难。" },
            { value: "S_8", title: "帮助护理病人或伤员。" },
            { value: "S_9", title: "安排学校或社团组织的各种集体事务。" },
            { value: "S_10", title: "善察人心或善于判断人的性格。" },
            { value: "S_11", title: "善与年长者相处。" },
        ]
    },{
        title: "五、E型（企业型能力）",
        subTitle: "你擅长做或胜任下列事情吗?",
        name: "QAG_E",
        options: [
            { value: "E_1", title: "学校里当过班干部并且干得不错。" },
            { value: "E_2", title: "善于督促他人工作。" },
            { value: "E_3", title: "善于使他人按你的习惯做事。" },
            { value: "E_4", title: "做事具有超常的经历和热情。" },
            { value: "E_5", title: "能做一个称职的推销员。" },
            { value: "E_6", title: "代表某个团体向有关部门提出建议或反映意见。" },
            { value: "E_7", title: "担任某种领导职务期间获过奖或受表扬。" },
            { value: "E_8", title: "说服别人加入你所在的团体(俱乐部、运动队、工作或研究组等)。" },
            { value: "E_9", title: "创办一家商店或企业。" },
            { value: "E_10", title: "知道如何做一位成功的领导人。" },
            { value: "E_11", title: "有很好的口才。" },
        ]
    },{
        title: "六、C型（常规型能力）",
        subTitle: "你擅长做或胜任下列事情吗?",
        name: "QAG_C",
        options: [
            { value: "C_1", title: "一天能誉抄近一万字。" },
            { value: "C_2", title: "能熟练地使用算盘或计算器。" },
            { value: "C_3", title: "能够熟练地使用中文打字机。" },
            { value: "C_4", title: "善于将书信、文件迅速归档。" },
            { value: "C_5", title: "做过办公室职员工作且干得不错。" },
            { value: "C_6", title: "核对数据或文章时既快又准确。" },
            { value: "C_7", title: "会使用外文打字机或复印机。" },
            { value: "C_8", title: "善于在短时间内分类和处理大量文件。" },
            { value: "C_9", title: "记账或开发票时既快又准确。" },
            { value: "C_10", title: "善于为自己或集体作财务预算(表)。" },
            { value: "C_11", title: "能迅速誊清贷方和借方的账目。" },
        ]
    }
];
type TypeQA = {
    name: string;
    options: Object
};
type TypeQAValidate = {
    QAG_R: TypeQA,
    QAG_I: TypeQA,
    QAG_A: TypeQA,
    QAG_S: TypeQA,
    QAG_E: TypeQA,
    QAG_C: TypeQA
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

export const Step3 = withStep()(({ api }) => {
    const [ QuestionListData ] = useState(QuestionData);
    const storeObj = useStore();
    const [validateObj] = useState(() => createValidator<TypeQAValidate>({
        properties: {
            QAG_R: QAValidateSchema,
            QAG_I: QAValidateSchema,
            QAG_A: QAValidateSchema,
            QAG_S: QAValidateSchema,
            QAG_E: QAValidateSchema,
            QAG_C: QAValidateSchema
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
            <p>下面从6个方面分别列举一些十分具体的活动，以确定你具备哪一方面的工作特长。回答时，只须考虑你过去或现在对所列活动是否擅长、胜任，不必考虑你是否喜欢这种活动。如果你认为你擅长从事某一活动，就请在答题卷的相应题号上的“是”一栏的方框口内划“√”，如果不擅长，就请在“否”一栏的方框口内划“√”。</p>
            <i className="note">注意：你如果从未从事过某一活动，那就请考虑你将来是否会擅长从事该项活动。请你务必做完每一个题目。</i>
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