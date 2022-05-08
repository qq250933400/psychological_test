import React, { useState, useCallback, useMemo, useEffect } from "react";
import { withStep } from "./Context";
import { useStore } from "@components/DataStore";
import { createValidator } from "../../../utils/Validate";
import { Dialog } from "antd-mobile";

type TestTableScore = { value: number, label: string }
type TestTableData = {
    type: "R型" | "I型" | "A型" | "S型" | "E型" | "C型";
    title: string;
    data: TestTableScore[]
};
type TestTableProps = {
    data: TestTableData[];
    name: string;
    onChange?: Function;
}
const testScore:TestTableScore[] = [
    { label: "7", value: 7 },
    { label: "6", value: 6 },
    { label: "5", value: 5 },
    { label: "4", value: 4 },
    { label: "3", value: 3 },
    { label: "2", value: 2 },
    { label: "1", value: 1 }
];
const TestTable = (props: TestTableProps) => {
    const [ tableData ] = useState(props.data);
    const [ tableResult ] = useState<any>({});
    const colWidth = useMemo(()=> ((1/tableData.length)* 100).toFixed(2) + "%", [tableData]);
    const onChangeClick = useCallback((data) => {
        tableResult[data.type] = data;
        typeof props.onChange === "function" && props.onChange({
            name: props.name,
            data: tableResult
        });
    }, [tableResult, props]);
    return (
        <table className="TestResultTable">
            <thead>
                <tr>
                {
                    tableData.map((item, index) => {
                        return <td key={`thead_${index}`} width={colWidth}><h4>{item.type}</h4><label>{item.title}</label></td>
                    })
                }
                </tr>
            </thead>
            <tbody>
                {
                    testScore.map((_, index) => {
                        return (
                            <tr key={`tbody_${index}`} title={`tbody_${index}`}>
                                {
                                    tableData.map((item, optindex) => {
                                        const optId = `opt_${optindex}_${item.type}`;
                                        const optValue = 7 - index;
                                        return <td key={`option_${optId}`}>
                                            <label className="TestRadio" htmlFor={optId} onClick={() => {
                                                onChangeClick({
                                                    type: item.type,
                                                    title: item.title,
                                                    score: optValue
                                                });
                                            }}>
                                                <input id={optId} name={`tbody_${props.name}_${optindex}`} type="radio" />
                                                <span>{optValue}</span>
                                            </label>
                                        </td>
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
};
type TypeValidateType = {
    "R型": Object;
    "I型": Object;
    "A型": Object;
    "S型": Object;
    "E型": Object;
    "C型": Object;
};
type TypeValidateSchema = {
    testScoreA: TypeValidateType;
    testScoreB: TypeValidateType;
};

const validateSchema:any = {
    "R型": {
        type: "Object",
        isRequired: true
    },
    "I型": {
        type: "Object",
        isRequired: true
    },
    "A型": {
        type: "Object",
        isRequired: true
    },
    "S型": {
        type: "Object",
        isRequired: true
    },
    "E型": {
        type: "Object",
        isRequired: true
    },
    "C型": {
        type: "Object",
        isRequired: true
    }
};

export const Step5 = withStep()(({ api }) => {
    const storeObj = useStore();
    const [validateObj] = useState(() => createValidator<TypeValidateSchema>({
        properties: {
            testScoreA: {
                type: "Object",
                properties: validateSchema
            },
            testScoreB: {
                type: "Object",
                properties: validateSchema
            }
        }
    }));
    const [ testTypeA ] = useState<TestTableData[]>([
        {
            type: "R型",
            title: "机械操作能力",
            data: testScore
        },
        {
            type: "I型",
            title: "科学研究能力",
            data: testScore
        },
        {
            type: "A型",
            title: "艺术创造能力",
            data: testScore
        },
        {
            type: "S型",
            title: "解释表达能力",
            data: testScore
        },
        {
            type: "E型",
            title: "商务洽谈能力",
            data: testScore
        },
        {
            type: "C型",
            title: "事务执行能力",
            data: testScore
        }
    ]);
    const [ testTypeB ] = useState<TestTableData[]>([
        {
            type: "R型",
            title: "体力技能",
            data: testScore
        },
        {
            type: "I型",
            title: "数学技能",
            data: testScore
        },
        {
            type: "A型",
            title: "音乐技能",
            data: testScore
        },
        {
            type: "S型",
            title: "交际技能",
            data: testScore
        },
        {
            type: "E型",
            title: "领导技能",
            data: testScore
        },
        {
            type: "C型",
            title: "办公技能",
            data: testScore
        }
    ]);
    useEffect(()=>{
        return api.onConfirm(()=>{
            return new Promise((resolve, reject) => {
                const data = storeObj.get("test24");
                const vResult = validateObj.validate(data);
                if(!vResult.pass) {
                    Dialog.alert({
                        title: "错误",
                        content: "测试能力不能留空。"
                    });
                    reject({});
                } else {
                    resolve({});
                }
            });
        }) as any;
    },[storeObj, validateObj, api]);
    return <div>
         <section className="Context">
            <p>下面两张表是你在6个职业能力方面的自我评分表。你可以先与同龄人比较一下自己在每一方面的能力，然后经斟酌以后对自己的能力作一个评价。评分时请在表中将适当的数字选中。数字越大表示你的能力越强。</p>
            <i className="note">注意，请勿全部点选同样的数字，因为人的每项能力不可能完全一样。</i>
        </section>
        <h4 className="TestResultTableTitle">表A</h4>
        <TestTable name="testScoreA" data={testTypeA} onChange={(evt:any)=>{
            storeObj.save("test24", {
                testScoreA: evt.data
            })
        }}/>
        <h4 className="TestResultTableTitle">表B</h4>
        <TestTable name="testScoreB" data={testTypeB} onChange={(evt:any)=>{
            storeObj.save("test24", {
                testScoreB: evt.data
            });
        }}/>
    </div>
});