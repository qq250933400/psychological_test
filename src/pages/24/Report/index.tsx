import { Header } from "../Test/Header";
import styles from "../Test/style.module.scss";
import loginStyles from "../Login/style.module.scss";
import { useMemo } from "react";
import { useStore } from "@components/DataStore";
import { withFrameFor24 } from "../withFrame";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import withService, { TypeWithServiceApi } from "@HOC/withService";
import { TestResultTable, useTotalScore } from "../Test/Step7Com";
import { SortHelper } from "elmer-common";
import ocupationData from "../Test/Ocuatpion.json";

type TestType = "R型" | "I型" | "A型" | "S型" | "E型" | "C型";
type TestScore = { type: TestType, score: number };

export default withService()(withFrameFor24({
    title: "我适合做什么职业",
    onHome: (opt) => {
        opt.navigateTo("/testDesc")
    },
    onHistory: (opt) => {
        opt.navigateTo("/historyFor24")
    }
})((props:any)=>{
    const location = useLocation();
    const service: TypeWithServiceApi = (props as any).service;
    const navigateTo = useNavigate();
    const totalScoreData = useTotalScore();
    const storeObj = useStore();
    const listScoreData = useMemo<TestScore[]>(() => {
        const sortObj = new SortHelper();
        const newListData = [...totalScoreData.listData];
        sortObj.selectionSort(newListData, {
            compareValueKey: "score",
            compareFn: (a: number, b: number) => {
                return a > b;
            }
        });
        return newListData as TestScore[];
    },[totalScoreData]);
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
    const inputOcupation = useMemo(() => storeObj.get<any>("test24")?.ocupations || {}, [storeObj]);
    useEffect(() => {
        if(!location.state) {
            navigateTo("/historyFor24");
        } else {
            props.showLoading({
                mount: true
            })
            service.send({
                endPoint: "wenjuan.reportFor24",
                data: {
                    path: location.state.reportPath
                }
            }).then((resp: any)=>{
                props.hideLoading();
                const data = resp.data || {};
                storeObj.save("test24", {
                    ...(data.step2),
                    ...(data.step3),
                    ...(data.step4)
                });
            }).catch((err) => {
                props.hideLoading();
                console.log(err);
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
   return (
        <div style={{paddingTop: "1rem", paddingBottom: "3rem"}}>
            <Header title={""} subTitle={"确定你的职业倾向"}/>
            <div className={styles.stepContainer}>
                <div>
                    <h5 className={styles.subTitle}>第2部分—第5部分的全部测验分数</h5>
                    <TestResultTable />
                    <div style={{width: "85%", margin: "0 auto", padding: "1rem 0"}}>
                        <h5 className={styles.subTitle} style={{margin: "1rem 0", fontSize: ".8rem"}}>6种职业倾向总分按大小顺序依次从左到右重新排列</h5>
                        <ul className={styles.scoreTypeList}>
                            {
                                listScoreData.map((score, index) => {
                                    return <li key={`score_${index}`}>{score.type}</li>
                                })
                            }
                        </ul>
                        <h4>你的职业倾向得分：</h4>
                        <label className={styles.finalScore}>
                            <span>最高分：<i>&nbsp;{maxScoreType.type}&nbsp;</i></span>
                            <span>最低分：<i>&nbsp;{minScoreType.type}&nbsp;</i></span>
                        </label>
                    </div>
                    <div className={styles.ocupationResult}>
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
            </div>
            <button className={loginStyles.testButton} onClick={()=>navigateTo("/historyFor24")}>返回</button>
        </div>
   ); 
}));
