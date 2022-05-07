import React from "react";
import { utils } from "elmer-common";
import styles from "./style.module.scss";
type TypeCheckItem = {
    title: string;
    value: any;
};
type TypeCheckBoxProps = {
    title: string;
    subTitle?: string;
    options: TypeCheckItem[];
};

export const QACheckBox = (props: TypeCheckBoxProps) => {
    return (
        <div className={styles.questionOfCheckBoxs}>
            <h5>{props.title}</h5>
            {!utils.isEmpty(props.subTitle) && <label>{props.subTitle}</label>}
            <section>
                {
                    props.options.map((option, index) => {
                        return (
                            <label key={`check_${index}`} htmlFor={option.value}>
                                <input type="checkbox" id={option.value} name={option.value}/>
                                <span>{option.title}</span>
                            </label>
                        );
                    })
                }
            </section>
        </div>
    );
};