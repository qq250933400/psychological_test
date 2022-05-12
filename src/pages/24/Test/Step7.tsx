/* eslint-disable no-new-func */
import React from "react";
import { useState,useMemo } from "react";
import style from "./style.module.scss";
import { useStore } from "@components/DataStore";
import { SortHelper } from "elmer-common";
import ocupationData from "./Ocuatpion.json";
import { useEffect } from "react";
import { withStep } from "./Context";
import withService, { TypeWithServiceApi } from "@HOC/withService";
import { TestResultTable, useTotalScore } from "./Step7Com";

type TestType = "R型" | "I型" | "A型" | "S型" | "E型" | "C型";
type TestScore = { type: TestType, score: number };

export const Step7 = withService()(
    (withStep()(
        (props) => {
            const api = props.api;
            const service: TypeWithServiceApi = (props as any).service;
            const totalScoreData = useTotalScore();
            const storeObj = useStore();
            const [ listScoreData ] = useState<TestScore[]>(() => {
                const sortObj = new SortHelper();
                const newListData = [...totalScoreData.listData];
                sortObj.selectionSort(newListData, {
                    compareValueKey: "score",
                    compareFn: (a: number, b: number) => {
                        return a > b;
                    }
                });
                return newListData as TestScore[];
            });
            const inputOcupation = useMemo(() => storeObj.get<any>("test24")?.ocupations || {}, [storeObj]);
            const maxScoreType = useMemo(()=>{
                let maxScore = 0;
                let maxInfo = totalScoreData.listData[0];
                for(const scoreInfo of totalScoreData.listData) {
                    if(scoreInfo.score > maxScore) {
                        maxScore = scoreInfo.score;
                        maxInfo = scoreInfo;
                    }
                }
                return maxInfo;
            },[totalScoreData]);
            const minScoreType = useMemo(()=>{
                let minScore = 0;
                let minInfo = totalScoreData.listData[0];
                for(const scoreInfo of totalScoreData.listData) {
                    if(scoreInfo.score < minScore) {
                        minScore = scoreInfo.score;
                        minInfo = scoreInfo;
                    }
                }
                return minInfo;
            },[totalScoreData]);
            const ocupationResult = useMemo(() => {
                return (ocupationData as any)[maxScoreType.type] || {};
            }, [maxScoreType]);
            useEffect(()=>{
                return api.onConfirm(()=> {
                    const storeData = storeObj.get<any>("test24") || {};
                    const submitData = {
                        suggestOcuaption: ocupationResult,
                        maxScoreOcupation: maxScoreType,
                        minScoreOcupation: minScoreType,
                        inputOcupation,
                        sortOcupationType: listScoreData,
                        totalScoreData,
                        step2: {
                            QA_R: storeData["QA_R"],
                            QA_I: storeData["QA_I"],
                            QA_A: storeData["QA_A"],
                            QA_S: storeData["QA_S"],
                            QA_E: storeData["QA_E"],
                            QA_C: storeData["QA_C"],
                        },
                        step3: {
                            QAG_R: storeData["QAG_R"],
                            QAG_I: storeData["QAG_I"],
                            QAG_A: storeData["QAG_A"],
                            QAG_S: storeData["QAG_S"],
                            QAG_E: storeData["QAG_E"],
                            QAG_C: storeData["QAG_C"],
                        },
                        step4: {
                            QAF_R: storeData["QAF_R"],
                            QAF_I: storeData["QAF_I"],
                            QAF_A: storeData["QAF_A"],
                            QAF_S: storeData["QAF_S"],
                            QAF_E: storeData["QAF_E"],
                            QAF_C: storeData["QAF_C"],
                        },
                        step5A: storeData.testScoreA || {},
                        step5B: storeData.testScoreB || {},
                        import: storeData.import,
                        basicInfo: storeData.basicInfo
                    };
                    api.showLoading({
                        mount: true
                    });
                    service.send({
                        endPoint: "wenjuan.submitTestFor24",
                        data: submitData
                    }).then((resp) => {
                        api.hideLoading();
                        console.log(resp);
                    }).catch((err) => {
                        api.hideLoading();
                        console.error(err);
                    });
                    console.log(submitData);
                    return Promise.reject();
                }) as any
            },[api,service, storeObj, totalScoreData,inputOcupation, ocupationResult, maxScoreType, minScoreType, listScoreData]);
            return <div>
                <h5 className={style.subTitle}>第2部分—第5部分的全部测验分数</h5>
                <TestResultTable />
                <div style={{width: "85%", margin: "0 auto", padding: "1rem 0"}}>
                    <h5 className={style.subTitle} style={{margin: "1rem 0", fontSize: ".8rem"}}>6种职业倾向总分按大小顺序依次从左到右重新排列</h5>
                    <ul className={style.scoreTypeList}>
                        {
                            listScoreData.map((score, index) => {
                                return <li key={`score_${index}`}>{score.type}</li>
                            })
                        }
                    </ul>
                    <h4>你的职业倾向得分：</h4>
                    <label className={style.finalScore}>
                        <span>最高分：<i>&nbsp;{maxScoreType.type}&nbsp;</i></span>
                        <span>最低分：<i>&nbsp;{minScoreType.type}&nbsp;</i></span>
                    </label>
                </div>
                <div className={style.ocupationResult}>
                    <h3>意味着最适合你的职业：</h3>
                    <label><i>{ocupationResult.type}：</i>{ocupationResult.detail}</label>
                    <h3>你在第1部分所写的理想工作：</h3>
                    <label>
                        <span>1.&nbsp;{inputOcupation.ocupation1}&nbsp;&nbsp;</span>
                        <span>2.&nbsp;{inputOcupation.ocupation2}&nbsp;&nbsp;</span>
                        <span>3.&nbsp;{inputOcupation.ocupation3}&nbsp;&nbsp;</span>
                    </label>
                </div>
                <section className="Context lastStepTip">
                    <p>如果最适合你的工作和你在第1部分所写的理想工作之间不太一致，或者在各种类型的职业上你的能力和兴趣不相匹配，那么请你参照第6部分——你的职业价值观来作出最佳选择</p>
                </section>
            </div>
        }
    )) as any
);