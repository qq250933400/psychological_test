import React, { useCallback, useEffect, useMemo, useState } from "react";
import { utils } from "elmer-common";
import { useLocation } from "react-router-dom";
import withFrame from "../../HOC/withFrame";
import withContext from "../../HOC/withContext";
import withService, { TypeService } from "../../HOC/withService";
import styles from "./style.module.scss";
import Radio from "antd-mobile/es/components/radio";
import { QuestionTitle } from "./QATitle";
import { QuestionItem } from "./QARadioItem";
import { QARadioGroup } from "./QARadioGroup";

type TypeQuestionDetailProps = {
    index: number;
    total: number;
    data: any;
    onChange: Function;
}

const formatIndex = (index: number, maxNumber: number) => {
    const maxLen = maxNumber.toString().length;
    const indexLen = index.toString().length;
    const formatLen = maxLen > indexLen ? maxLen - indexLen : 0;
    return "0".repeat(formatLen) + index.toString();
};
const QuestionDetail = (props: TypeQuestionDetailProps) => {
    const [ index, setIndex ] = useState(props.index);
    const [ total, setTotal ] = useState(props.total);
    const [ data, setData ] = useState(props.data || {});
    const [ selectedItem, setSelectedItem ] = useState();
    const onItemClick = useCallback((v) => {
        const testData = {
            questionId: data.id,
            type: v.data.type || data.type,
            value: v.data.id
        };
        if(data.type !== "radio") {
            testData.value = !utils.isEmpty((selectedItem as any)?.value) ? (selectedItem as any)?.value + "|" + v.data.id : v.data.id;
        }
        setSelectedItem(testData as any);
        props.onChange({
            index: v.index,
            data: testData
        });
    }, [props, data, selectedItem]);
    useEffect(()=>{
        setIndex(props.index);
        setTotal(props.total);
        setData(props.data);
        setSelectedItem(undefined);
    },[props.index, props.total, props.data]);
    return (
        <div className={styles.detail}>
            <h6>
                <b>
                    <QuestionTitle type={data.type} title={formatIndex(index + 1, total) + "、" + data.title} onChange={(inputData:any) => {
                        props.onChange({
                            index: index,
                            data: {
                                questionId: data.id,
                                type: data.type,
                                value: inputData
                            }
                        });
                    }}/>
                </b>
            </h6>
            {
                data.type === "radio" && (<ul>
                    <Radio.Group value={(selectedItem as any)?.value}>
                        {
                            data.items.map((item: any, indexKey: number) => {
                                return <QuestionItem onClick={onItemClick} index={index} key={indexKey} data={item}/>;
                            })
                        }
                    </Radio.Group>
                </ul>)
            }
            {
                data.type === "RadioGroup" && <QARadioGroup name="RadioGroup" onChange={(data:any) => {
                    props.onChange({
                        index,
                        data,
                        type: "RadioGroup"
                    });
                }}/>
            }
        </div>
    )
};

const Question = (props: any) => {
    const location = useLocation();
    const [ detail ] = useState(location.state?.questionData);
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [ answerList, setAnwserList ] = useState([]);
    const service: TypeService = props.service;
    const currentQuestion = useMemo(() => {
        return detail ? detail.items[currentIndex] : {};
    }, [currentIndex, detail]);
    const total = useMemo(() => {
        return detail ? detail.items.length : 0;
    }, [detail]);
    const onNext = useCallback(() => {
        if(currentIndex + 1 < total) {
            setCurrentIndex(currentIndex + 1);
        }
    }, [ currentIndex, total ]);
    const onChange = useCallback((v:any) => {
        if(v.data) {
            const newAnwserList: any[] = [...answerList];
            newAnwserList[v.index] = v.data;
            setAnwserList(newAnwserList as any);
        } else {
            console.error("No data", v);
        }
    }, [answerList, setAnwserList]);
    const onSubmit = useCallback(() =>{
        const newSubmitData = [];
        props.showLoading({
            title: "提交问卷，生成报告。",
            mount: true
        });
        for(const item of answerList as any[]) {
            newSubmitData.push({
                type: item.type || detail.type,
                questionId: item.questionId,
                answerId: item.id,
                value: item.value || item.data
            });
        }
        service.send({
            endPoint: "wenjuan.submitTest",
            data: {
                testId: detail.id,
                answer: newSubmitData
            }
        }).then((resp:any) => {
            props.hideLoading();
            props.navigateTo("/report", {
                state: {
                    report: resp.data,
                    testTitle: detail.testTitle || detail.title || ""
                }
            });
        }).catch(() => {
            props.hideLoading();
        });
    },[detail, answerList, service, props]);
    const nextProps = useMemo(()=>{
        const anws:any = answerList[currentIndex];
        if(anws) {
            return anws.name === "RadioGroup" ? (!anws.valide ? { disabled: true } : {}) : {};
        } else {
            return { disabled: true };
        }
    },[answerList, currentIndex]);
    useEffect(()=>{
        if(!detail) {
            props.showError({
                title: "拒绝访问",
                message: "测试数据错误或网络问题请点击取消按钮返回列表页重新选择问卷。"
            });
        }
    },[detail, props]);
    return (
        <div className={styles.question}>
            {
                detail && (
                    <>
                        <div className={styles.header}>
                            <label className={styles.header_title}><span>{detail.title}</span></label>
                            <label className={styles.header_count}><span>本问卷一共{detail.items.length}题，目前在第<b>{currentIndex + 1}</b>题.</span></label>
                        </div>
                        {
                            currentQuestion && <QuestionDetail onChange={onChange} data={currentQuestion} index={currentIndex} total={total}/>
                        }
                        { currentIndex + 1 < total && <button onClick={onNext} className={styles.btnNext} {...nextProps}>下一题</button> }
                        { currentIndex + 1 === total && <button onClick={onSubmit} className={styles.btnNext} {...nextProps}>提交并查看测试结果</button> }
                    </>
                )
            }
        </div>
    );
};

const Page = withFrame({
    title: (opt) => {
        const identityText = opt.contextData.identity === 1 ? "家长" : "学生";
        const title = opt.contextData.profile?.title || "心里测试";
        return [title, "(", identityText, ")"].join("");
    },
    onInit: (opt:any) => {
        opt.setData(opt.contextData);
        if(!opt.contextData?.profile) {
            opt.navigateTo("/profile");
            return ;
        }
    },
    onRetry: (opt) => {
        opt.init();
    },
    onCancel: (opt, props) => {
        props.saveAnswer([]);
        opt.navigateTo("/description");
    },
    onHome: (opt, props) => {
        props.saveAnswer([]);
        opt.navigateTo("/test");
    }
})(Question);

export default withContext({
    dataKey: "question",
    mapDataToProps: (data, rootData) => {
        return {
            ...data,
            profile: utils.getValue(rootData, "profile.profile"),
            test: utils.getValue(rootData, "test.test"),
        };
    },
    mapDispatchToProps: (dispatch) => ({
        saveCurrentIndex: (index: any) => {
            dispatch("currentIndex",index);
            console.error(index);
        },
        saveAnswer: (data: any) => dispatch("answer", data)
    })
})(
    withService()(Page)
);