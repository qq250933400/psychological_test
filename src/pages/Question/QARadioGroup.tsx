import Radio from "antd-mobile/es/components/radio";
import React, { useCallback, useState } from "react";
import { QuestionItem } from "./QARadioItem";
import styles from "./style.module.scss";
import { utils } from "elmer-common";

type TypeQuestion = {
    title: string;
    value: string;
};
type TypeQuestionItem = TypeQuestion & {
    items: TypeQuestion[];
};
const sourceItem: TypeQuestion[] = [{
    title: "无",
    value: "0"
}, {
    title: "一周少于1次",
    value: "1"
}, {
    title: "一周1-2次",
    value: "2"
}, {
    title: "一周大于3次",
    value: "3"
}];
const sourceData: TypeQuestionItem[] = [
    {
        title: "入睡困难（30分钟内不能入睡）",
        value: "QA_a",
        items: sourceItem
    },
    {
        title: "夜间易醒或早醒",
        value: "QA_b",
        items: sourceItem
    },
    {
        title: "夜间去厕所",
        value: "QA_c",
        items: sourceItem
    },
    {
        title: "呼吸不畅",
        value: "QA_d",
        items: sourceItem
    },
    {
        title: "咳嗽或鼾声高",
        value: "QA_e",
        items: sourceItem
    },
    {
        title: "感觉冷",
        value: "QA_f",
        items: sourceItem
    },
    {
        title: "感觉热",
        value: "QA_g",
        items: sourceItem
    },
    {
        title: "做恶梦",
        value: "QA_h",
        items: sourceItem
    },
    {
        title: "疼痛不适",
        value: "QA_i",
        items: sourceItem
    },
    {
        title: "其它影响睡眠的事情",
        value: "QA_j",
        items: sourceItem
    }
];
type TypeQARadioGroupProps = {
    onChange?: Function;
    name?: string;
};
export const QARadioGroup = (props: TypeQARadioGroupProps) => {
    const [GroupState, setGroupState] = useState<any>({});
    const onItemClick = useCallback(( value, item ) => {
        const newGroupState = { ...GroupState };
        let complete = true;
        newGroupState[item.QA] = value.data.id;
        for(const item of sourceData) {
            if(!newGroupState[item.value]) {
                complete = false;
                break;
            }
        }
        setGroupState(newGroupState);
        typeof props.onChange === "function" && props.onChange({
            valide: complete,
            name: props.name,
            data: newGroupState
        });
    }, [GroupState, setGroupState, props]);
    return (
        <section className={styles.radioGroupQA}>
            {
                sourceData.map((subItem, index) => {
                    return <React.Fragment key={index}>
                        <label>{subItem.value.substring(subItem.value.length - 1)}、{subItem.title}</label>
                        <ul>
                            <Radio.Group value={utils.getValue(GroupState, subItem.value)}>
                                {
                                    subItem.items.map((item: any, indexKey: number) => {
                                        return <QuestionItem onClick={onItemClick} index={index} key={indexKey} data={{
                                            ...item,
                                            id: [subItem.value, item.value].join("_"),
                                            QA: subItem.value
                                        }}/>;
                                    })
                                }
                            </Radio.Group>
                        </ul>
                    </React.Fragment>
                })
            }
        </section>
    );
};
