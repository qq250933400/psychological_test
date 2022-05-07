import React from "react";
import styles from "./style.module.scss";

type TypeHeaderProps = {
    title: string;
    subTitle: string;
};

export const Header = (props: TypeHeaderProps) => {
    return (
        <section className={styles.header}>
            <h1>{props.title}</h1>
            <h2>{props.subTitle}</h2>
        </section>
    );
};