import React, { useCallback, useEffect, useState } from "react";
import withFrame from "../../HOC/withFrame";
import PullToRefresh from "antd-mobile/es/components/pull-to-refresh";
import { utils } from "elmer-common";
import withService, { TypeService } from "../../HOC/withService";
import styles from "./style.module.scss";
import staticObj from "../../utils";
import { useLocation } from "react-router-dom";
import imgTestReport from "../../res/test_report_title.png";

type TypeSectionProps = {
    title: string;
    className?: string;
    children?: any;
};

const Section = (props: TypeSectionProps) => {
    return (
        <section className={staticObj.cn(styles.section, props.className)}>
            <header className={styles.section_header}>
                <span className={staticObj.cn(styles.section_title, "title")}>{props.title || <i>&nbsp;</i>}</span>
            </header>
            <div className={styles.section_context}>
                {props.children}
            </div>
        </section>
    );
};

const SectionHeader = (props: any) => {
    return <label className={staticObj.cn(styles.section_title, styles.section_subtitle, props.className)}>{props.title}{props.children}</label>
};

const Report = (props: any) => {
    const service: TypeService = props.service;
    const location = useLocation();
    const [ testData ] = useState(location.state || {});
    const [ reportData, setReportData ] = useState((location.state?.report || {}) as any);
    const refreshList = useCallback(()=>{
        props.showLoading({
            mount: true
        });
        service.send({
            endPoint: "wenjuan.getReport",
            data: {
                testId: testData.testId,
                resultId: testData.resultId,
                calcFunc: testData.calcFunc
            }
        }).then((resp: any)=>{
            setReportData(resp.data || {});
            props.hideLoading();
        }).catch((err)=>{
            props.hideLoading();
        });
    },[testData ,service, props]);
    useEffect(() => {
        if(location.state && !location.state.report) {
            refreshList();
        } else {
            !location.state?.report && setTimeout(() => {
                props.navigateTo("/history");
            }, 1000);
        }
    },[]);
    return (
        <div className={styles.report}>
            <label className={styles.title}>
                <img src={imgTestReport} style={{width: "135px"}} alt="测试报告" />
            </label>
            <Section title={testData.testTitle }>
                <div>
                    <SectionHeader className={styles.iconResult} title="测试结果"/>
                    <p className={styles.report_context} dangerouslySetInnerHTML={{__html: reportData.result}}/>
                    {
                        !utils.isEmpty(reportData.analysisTable) && (
                            <>
                                <div className={styles.line}/>
                                <SectionHeader className={styles.iconResult} title="分量表分析"/>
                                <p className={styles.report_context} dangerouslySetInnerHTML={{__html: reportData.analysisTable}} />
                            </>
                        )
                    }
                </div>
            </Section>
            {
                !utils.isEmpty(reportData.recommendations) && (
                    <Section className={styles.recommendation} title="综合性建议">
                        <div className={styles.report_context} dangerouslySetInnerHTML={{__html: reportData.recommendations}}/>
                    </Section>
                )
            }
            {
                reportData.docs && reportData.docs.length > 0 && (
                    <>
                        <label className={styles.docTitle}><span>学习资料</span></label>
                        <ul className={styles.docList}>
                            {
                                reportData.docs && reportData.docs.map((doc:any, index: number) => {
                                    return <li key={index}>
                                        <a href={doc.url}>
                                            <span>{index + 1}. {doc.title}</span>
                                        </a>
                                    </li>
                                })
                            }
                        </ul>
                    </>
                )
            }
        </div>
    );
};

const Page = withFrame({
    title: "测试报告",
    onRetry: (opt) => {
        opt.init();
    },
    onCancel: (opt) => {
        opt.navigateTo("/profile");
    },
    onHome: (opt) => {
        opt.navigateTo("/profile");
    }
})(Report);

export default withService()(Page);
