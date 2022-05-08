import React, { useCallback,useState } from "react";
import { utils } from "elmer-common";
import styles from "./style.module.scss";
type TypeCheckItem = {
    title: string;
    value: any;
};
export type TypeCheckBoxData = {
    title: string;
    subTitle?: string;
    name?: string;
    options: TypeCheckItem[];
};

type TypeCheckBoxProps = TypeCheckBoxData & {
    onChange?: Function;
}

export const QACheckBox = (props: TypeCheckBoxProps) => {
    const [ saveData ] = useState<any>({});
    const onChecked = useCallback((check: boolean, option: any) => {
        if(check) {
            saveData[option.value] = option;
        } else {
            delete saveData[option.value];
        }
        typeof props.onChange === "function" && props.onChange({
            title: props.title,
            subTitle: props.subTitle,
            name: props.name,
            options: saveData
        });
    },[saveData, props]);
    return (
        <div className={styles.questionOfCheckBoxs}>
            <h5>{props.title}</h5>
            {!utils.isEmpty(props.subTitle) && <label>{props.subTitle}</label>}
            <section>
                {
                    props.options.map((option, index) => {
                        return (
                            <label key={`check_${index}`} htmlFor={option.value}>
                                <input onChange={(evt) => { onChecked(evt.currentTarget.checked, option) }} type="checkbox" id={option.value} name={option.value}/>
                                <span>{option.title}</span>
                            </label>
                        );
                    })
                }
            </section>
        </div>
    );
};