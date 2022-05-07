import React, { createContext, useContext } from "react";

type TypeApi = {
    nextStep(): void;
    onConfirm(fn: Function): Function;
};
type TypeWithStepProps = {
    api: TypeApi;
};

export type TypeStepInfo = {
    confirmText?: string;
    title?: string;
    subTitle?: string;
    component: React.ComponentType<any>
};

export type TypeTestContext = {
    stepData: TypeStepInfo[];
    confirmText: string;
    onConfirm?: Function;
    toNextStep(): void;
};

export const TestContext = createContext<TypeTestContext>({
    stepData: [],
    confirmText: "下一步",
    toNextStep: () => {}
});

export const useTest = () => useContext(TestContext);

export const withStep = () => {
    return (Target: React.ComponentType<TypeWithStepProps>):React.ComponentType<TypeWithStepProps> => {
        return ({ api }) => {
            const testObj = useTest();
            return <Target api={{
                ...api,
                nextStep: () => testObj.toNextStep()
            }}/>
        };
    }
};