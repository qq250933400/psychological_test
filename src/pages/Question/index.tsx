import React, { useCallback, useEffect, useMemo, useState } from "react";
import { utils } from "elmer-common";
import { useLocation } from "react-router-dom";
import withFrame from "../../HOC/withFrame";
import withContext from "../../HOC/withContext";
import withService, { TypeService } from "../../HOC/withService";
import styles from "./style.module.scss";
import Radio from "antd-mobile/es/components/radio";
import Input from "antd-mobile/es/components/input";

type TypeQuestionItemProps = {
    data: {
        title: string;
        id: number;
        questionId: number;
    };
    type?: "radio" | "checkbox" | "input",
    onClick: Function;
    index: number;
};
type TypeQuestionDetailProps = {
    index: number;
    total: number;
    data: any;
    onChange: Function;
}
type TypeQuestionTitleProps = {
    title: string;
    type: "input"|"radio"|"checkbox";
    onChange: Function;
};

const QuestionItem = (props: TypeQuestionItemProps) => {
    const [ type, setType ] = useState(props.type || "radio");
    const [ index, setIndex ] = useState(props.index);
    const [ data, setData ] = useState(props.data);
    useEffect(()=>{
        setType(props.type || "radio");
        setIndex(props.index);
        setData(props.data);
    }, [props.type, props.index, props.data]);
    return (
        <li className={type} onClick={() => { props.onClick({
            index,
            data
        })}}>
            {
                type === "radio" && (
                    <label>
                        <Radio value={data.id as any} id={data.id as any}/>
                        <span>{data.title}</span>
                    </label>
                )
            }
        </li>
    );
};
const QuestionTitle = (props: TypeQuestionTitleProps) => {
    const [ title ] = useState(props.title);
    const [ inputData, setInputData ] = useState<any>({});
    const inputNodes = useMemo(() => {
        const nodes: any[] = [];
        const text = props.title || "";
        const inputKeys: string[] = [];
        let matchs = text.match(/\$\{\s*[a-z0-9_\-.]{1,}\s*\}/ig);
        if(matchs && matchs.length > 0) {
            let matchStartIndex = 0;
            matchs.forEach((item: string) => {
                const name = item.replace(/^\$\{/,"").replace(/\}$/,"");
                const startIndex = text.indexOf(item);
                const endIndex = startIndex + item.length;
                const prevText = text.substring(matchStartIndex, startIndex);
                nodes.push({
                    type: "text",
                    value: prevText
                });
                nodes.push({
                    type: "input",
                    name,
                    value: inputData[name] || {}
                });
                inputKeys.push(name);
                matchStartIndex = endIndex;
            });
            if(matchStartIndex < text.length) {
                nodes.push({
                    type: "text",
                    value: text.substring(matchStartIndex)
                });
            }
        } else {
            nodes.push({
                type: "text",
                value: text
            });
        }
        return {
            nodes,
            inputKeys
        };
    }, [props.title, inputData]);
    const onInputChange = useCallback((name: string, value: string) => {
        const newData = { ...inputData };
        const inputKeys = inputNodes.inputKeys || [];
        const questionData:any = {};
        newData[name] = value;
        inputKeys.forEach((vname) => {
            questionData[vname] = newData[vname];
        });
        setInputData(newData);
        props.onChange(questionData);
    }, [inputData, props, inputNodes.inputKeys]);
    if(props.type === "input") {
        return <div className={styles.questionInput}>
            {
                inputNodes.nodes.map((node, index):any => {
                    if(node.type === "text") {
                        return <span key={`node_${index}`}>{node.value}</span>
                    } else {
                        return <Input key={`node_${index}`} value={node.value} type="number" id={node.name} onChange={(value) => onInputChange(node.name, value)}/>
                    }
                })
            }
        </div>
    } else {
        return <span>{title}</span>
    }
}; 
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
                data.type !== "input" && (<ul>
                    <Radio.Group value={(selectedItem as any)?.value}>
                        {
                            data.items.map((item: any, indexKey: number) => {
                                return <QuestionItem onClick={onItemClick} index={index} key={indexKey} data={item}/>;
                            })
                        }
                    </Radio.Group>
                </ul>)
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
                value: item.value
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
        if(answerList[currentIndex]) {
            return {};
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
                        { answerList.length < total && <button onClick={onNext} className={styles.btnNext} {...nextProps}>下一题</button> }
                        { answerList.length === total && <button onClick={onSubmit} className={styles.btnNext}>提交并查看测试结果</button> }
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