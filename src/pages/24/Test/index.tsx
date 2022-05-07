import { useStore } from "@components/DataStore";
import { Steps, Step } from "@components/Steps";
import React from "react";
import { utils } from "elmer-common";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { withFrameFor24 } from "../withFrame";
import { TypeStepInfo, TypeTestContext, TestContext } from "./Context";
import styles from "../Login/style.module.scss";
import stepStyles from "./style.module.scss";
import { useMemo } from "react";
import { Header } from "./Header";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { Step5 } from "./Step5";
import { Step6 } from "./Step6";
import { Step7 } from "./Step7";
import { useCallback } from "react";

const StepListData:TypeStepInfo[] = [
    {
        title: "第一部分",
        subTitle: "你心目中的理想职业(专业)",
        component: Step1
    }, {
        title: "第二部分",
        subTitle: "你所感兴趣的活动",
        component: Step2
    }, {
        title: "第三部分",
        subTitle: "你所擅长或者胜任的活动",
        component: Step3
    }, {
        title: "第四部分",
        subTitle: "你所喜欢的职业",
        component: Step4,
    }, {
        title: "第五部分",
        subTitle: "你的能力类型简评",
        component: Step5
    }, {
        title: "第六部分",
        subTitle: "你所看重的东西--职业价值观",
        component: Step6
    }, {
        title: "第七部分",
        subTitle: "确定你的职业倾向",
        component: Step7,
        confirmText: "完成"
    }
];

export default withFrameFor24({
    title: "我适合做什么职业",
    onHome: (opt) => {
        opt.navigateTo("/testDesc");
    }
})(()=>{
    const storeObj = useStore();
    const [ activeStep, setActiveStep ] = useState(1);
    const [ testState ] = useState<TypeTestContext>({
        stepData: StepListData,
        confirmText: "下一步",
        toNextStep: () => {
            setActiveStep(activeStep + 1);
        }
    });
    const basicInfo = storeObj.get<any>("test24")?.basicInfo;
    const stepInfo = useMemo(()=>{
        const stepIndex = activeStep - 1;
        return stepIndex >= 0 && stepIndex < testState.stepData.length ? 
            testState.stepData[stepIndex] : 
            (stepIndex >= testState.stepData.length ? 
                testState.stepData[testState.stepData.length - 1] : testState.stepData[0]);
    }, [activeStep, testState]);
    const StepComponent = useMemo(() => stepInfo.component, [stepInfo]);
    const navigateTo = useNavigate();
    const [ stepApi ] = useState({
        onConfirm(fn: Function) {
            testState.onConfirm = fn;
            return () => testState.onConfirm = () => {};
        }
    });
    const onSubmitNext = useCallback(()=>{
        if(typeof testState.onConfirm === "function") {
            const confirmResult = testState.onConfirm();
            if(utils.isPromise(confirmResult)) {
                confirmResult.then(() => {
                    if(testState.stepData.length - 1 > activeStep + 1) {
                        setActiveStep(activeStep + 1);
                    } else {
                        console.log("goto history page");
                    }
                });
            }
        }
        
    },[activeStep, testState]);
    useEffect(()=>{
        if(!basicInfo) {
            // navigateTo("/testDesc");
        }
    },[basicInfo, navigateTo]);

   return (
       <TestContext.Provider value={testState}>
        <div style={{paddingTop: "1rem"}}>
            <Steps activeIndex={activeStep}>
                {
                    testState.stepData.map((step, index) => {
                        return <Step key={`stepItem_` + index} index={(index + 1).toString()}/>;
                    })
                }  
            </Steps>
            <Header title={stepInfo.title || ""} subTitle={stepInfo.subTitle || ""}/>
            <div className={stepStyles.stepContainer}>
                <StepComponent api={stepApi}/>
            </div>
            <button className={styles.testButton} onClick={onSubmitNext}>{stepInfo.confirmText || "下一步"}</button>
        </div>
       </TestContext.Provider>
   ); 
});
