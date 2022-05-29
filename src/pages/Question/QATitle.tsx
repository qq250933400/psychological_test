import Input from "antd-mobile/es/components/input";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./style.module.scss";

type TypeQuestionTitleProps = {
    title: string;
    type: "input"|"radio"|"checkbox";
    onChange: Function;
};

export const QuestionTitle = (props: TypeQuestionTitleProps) => {
    const [ title, setTitle ] = useState(props.title);
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
    useEffect(() => setTitle(props.title), [props.title]);
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