/* eslint-disable no-new-func */
import { useStore } from "@components/DataStore";
import React, { useMemo, useState } from "react";
import { utils } from "elmer-common";

export const sumQACount = (data:any) => {
    return Object.keys(data?.options || {}).length;
};

export const useTotalScore = () => {
    const storeObj = useStore();
    return useMemo(() => {
        const storeData = storeObj.get<any>("test24") || {};
        const totalScoreR = [
            sumQACount(storeData["QA_R"]),
            sumQACount(storeData["QAG_R"]),
            sumQACount(storeData["QAF_R"]),
            utils.getValue(storeData, "testScoreA.R型.score", 0),
            utils.getValue(storeData, "testScoreB.R型.score", 0)
        ].join("+");
        const totalScoreI = [
            sumQACount(storeData["QA_I"]),
            sumQACount(storeData["QAG_I"]),
            sumQACount(storeData["QAF_I"]),
            utils.getValue(storeData, "testScoreA.I型.score", 0),
            utils.getValue(storeData, "testScoreB.I型.score", 0)
        ].join("+");
        const totalScoreA = [
            sumQACount(storeData["QA_A"]),
            sumQACount(storeData["QAG_A"]),
            sumQACount(storeData["QAF_A"]),
            utils.getValue(storeData, "testScoreA.A型.score", 0),
            utils.getValue(storeData, "testScoreB.A型.score", 0)
        ].join("+");
        const totalScoreS = [
            sumQACount(storeData["QA_S"]),
            sumQACount(storeData["QAG_S"]),
            sumQACount(storeData["QAF_S"]),
            utils.getValue(storeData, "testScoreA.S型.score", 0),
            utils.getValue(storeData, "testScoreB.S型.score", 0)
        ].join("+");
        const totalScoreE = [
            sumQACount(storeData["QA_E"]),
            sumQACount(storeData["QAG_E"]),
            sumQACount(storeData["QAF_E"]),
            utils.getValue(storeData, "testScoreA.E型.score", 0),
            utils.getValue(storeData, "testScoreB.E型.score", 0)
        ].join("+");
        const totalScoreC = [
            sumQACount(storeData["QA_C"]),
            sumQACount(storeData["QAG_C"]),
            sumQACount(storeData["QAF_C"]),
            utils.getValue(storeData, "testScoreA.C型.score", 0),
            utils.getValue(storeData, "testScoreB.C型.score", 0)
        ].join("+");
        const resultData = {
            R: (new Function(`return ${totalScoreR};`)()),
            I: (new Function(`return ${totalScoreI};`)()),
            A: (new Function(`return ${totalScoreA};`)()),
            S: (new Function(`return ${totalScoreS};`)()),
            E: (new Function(`return ${totalScoreE};`)()),
            C: (new Function(`return ${totalScoreC};`)())
        };
        return {
            ...resultData,
            listData: [
                { type: "R型", score: resultData.R },
                { type: "I型", score: resultData.I },
                { type: "A型", score: resultData.A },
                { type: "S型", score: resultData.S },
                { type: "E型", score: resultData.E },
                { type: "C型", score: resultData.C },
            ]
        }
    }, [storeObj]);
}

export const TestResultTable = () => {
    const [ layoutCol ] = useState({
        testWidth: "auto",
        colWidth: "12%"
    });
    const storeObj = useStore();
    const storeData = useMemo(()=> storeObj.get<any>("test24") || {},[ storeObj ]);
    const Step2Data = useMemo(()=> ({
        QA_R: storeData["QA_R"],
        QA_I: storeData["QA_I"],
        QA_A: storeData["QA_A"],
        QA_S: storeData["QA_S"],
        QA_E: storeData["QA_E"],
        QA_C: storeData["QA_C"],
    }),[ storeData ]);
    const Step3Data = useMemo(()=> ({
        QAG_R: storeData["QAG_R"],
        QAG_I: storeData["QAG_I"],
        QAG_A: storeData["QAG_A"],
        QAG_S: storeData["QAG_S"],
        QAG_E: storeData["QAG_E"],
        QAG_C: storeData["QAG_C"],
    }),[ storeData ]);
    const Step4Data = useMemo(()=> ({
        QAF_R: storeData["QAF_R"],
        QAF_I: storeData["QAF_I"],
        QAF_A: storeData["QAF_A"],
        QAF_S: storeData["QAF_S"],
        QAF_E: storeData["QAF_E"],
        QAF_C: storeData["QAF_C"],
    }),[ storeData ]);
    const Step5Data = useMemo(()=> (storeData.testScoreA || {}),[ storeData ]);
    const Step6Data = useMemo(()=> (storeData.testScoreB || {}),[ storeData ]);
    const totalScore = useTotalScore();
    return (
        <table className="TestResultTable" width="100%">
            <thead className="TestSummeryHeader">
                <tr>
                    <td width={layoutCol.testWidth}>测试</td>
                    <td width={layoutCol.colWidth}>R型</td>
                    <td width={layoutCol.colWidth}>I型</td>
                    <td width={layoutCol.colWidth}>A型</td>
                    <td width={layoutCol.colWidth}>S型</td>
                    <td width={layoutCol.colWidth}>E型</td>
                    <td width={layoutCol.colWidth}>C型</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>第二部分</td>
                    <td>{sumQACount(Step2Data.QA_R)}</td>
                    <td>{sumQACount(Step2Data.QA_I)}</td>
                    <td>{sumQACount(Step2Data.QA_A)}</td>
                    <td>{sumQACount(Step2Data.QA_S)}</td>
                    <td>{sumQACount(Step2Data.QA_E)}</td>
                    <td>{sumQACount(Step2Data.QA_C)}</td>
                </tr>
                <tr>
                    <td>第三部分</td>
                    <td>{sumQACount(Step3Data.QAG_R)}</td>
                    <td>{sumQACount(Step3Data.QAG_I)}</td>
                    <td>{sumQACount(Step3Data.QAG_A)}</td>
                    <td>{sumQACount(Step3Data.QAG_S)}</td>
                    <td>{sumQACount(Step3Data.QAG_E)}</td>
                    <td>{sumQACount(Step3Data.QAG_C)}</td>
                </tr>
                <tr>
                    <td>第四部分</td>
                    <td>{sumQACount(Step4Data.QAF_R)}</td>
                    <td>{sumQACount(Step4Data.QAF_I)}</td>
                    <td>{sumQACount(Step4Data.QAF_A)}</td>
                    <td>{sumQACount(Step4Data.QAF_S)}</td>
                    <td>{sumQACount(Step4Data.QAF_E)}</td>
                    <td>{sumQACount(Step4Data.QAF_C)}</td>
                </tr>
                <tr>
                    <td>第五部分（A)</td>
                    <td>{utils.getValue(Step5Data, "R型.score")}</td>
                    <td>{utils.getValue(Step5Data, "I型.score")}</td>
                    <td>{utils.getValue(Step5Data, "A型.score")}</td>
                    <td>{utils.getValue(Step5Data, "S型.score")}</td>
                    <td>{utils.getValue(Step5Data, "E型.score")}</td>
                    <td>{utils.getValue(Step5Data, "C型.score")}</td>
                </tr>
                <tr>
                    <td>第六部分（B)</td>
                    <td>{utils.getValue(Step6Data, "R型.score")}</td>
                    <td>{utils.getValue(Step6Data, "I型.score")}</td>
                    <td>{utils.getValue(Step6Data, "A型.score")}</td>
                    <td>{utils.getValue(Step6Data, "S型.score")}</td>
                    <td>{utils.getValue(Step6Data, "E型.score")}</td>
                    <td>{utils.getValue(Step6Data, "C型.score")}</td>
                </tr>
                <tr>
                    <td>总分</td>
                    <td>{totalScore.R}</td>
                    <td>{totalScore.I}</td>
                    <td>{totalScore.A}</td>
                    <td>{totalScore.S}</td>
                    <td>{totalScore.E}</td>
                    <td>{totalScore.C}</td>
                </tr>
            </tbody>
        </table>
    );
};
