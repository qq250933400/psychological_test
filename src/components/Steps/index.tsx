import React from "react";
import { useMemo } from "react";
import { utils } from "elmer-common";
import styles from "../style.module.scss";

type TypeStepsProps = {
    children: any;
    activeIndex?: number;
};

type TypeStepProps = {
    title?: string;
    index?: string;
    active?: boolean;
    focus?: boolean;
};

export const Steps = (props: TypeStepsProps) => {
    const children = useMemo((): any[]=>{
        const vChildren: any[] = [];
        const fChildren = props.children ? (utils.isArray(props.children) ? props.children : [props.children]) : [];
        const activeIndex = props.activeIndex || 1;
        let index = 0;
        fChildren.forEach((child) => {
            if(child.type?.flag === "StepItem") {
                index += 1;
                vChildren.push(React.cloneElement(child, {
                    active: index <= activeIndex,
                    focus: index === activeIndex,
                    key: "Step_" + index
                }));
            }
        });
        return vChildren;
    },[props.children, props.activeIndex]);
    const itemWidth = useMemo(()=> (
        children.length > 0 ? (100 / (children.length + 1)).toFixed(2) + "%" : "100%"
    ), [children]);
    return (
        <ul className={styles.steps}>
            {children.map((vItem, index) => {
                return <li key={"vItem_" + index} style={{width: itemWidth}} className={vItem.props.active ? "active" : ""}>{vItem}</li>
            })}
        </ul>
    );
};

export const Step = (props: TypeStepProps) => {
    return (
        <span className={[styles.stepIndex, props.focus ? "focus" : null].join(" ")}>{props.index}</span>
    );
};

Step.flag = "StepItem"