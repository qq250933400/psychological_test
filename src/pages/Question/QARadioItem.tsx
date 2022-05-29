import Radio from "antd-mobile/es/components/radio";
import { useEffect, useState } from "react";

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

export const QuestionItem = (props: TypeQuestionItemProps) => {
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
        }, props.data)}}>
            {
                type === "radio" && (<Radio value={data.id as any} id={data.id as any}>{data.title}</Radio>)
            }
        </li>
    );
};
