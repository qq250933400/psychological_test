import { Form, FormItem, useForm } from "@components/Form";
import LineInput from "@components/LineInput";
import React, { useEffect, useState } from "react";
import { createValidator } from "../../../utils/Validate";
import { withStep } from "./Context";
import { Dialog } from "antd-mobile";
import { useStore } from "@components/DataStore";

type formSchema = {
    ocupation1: string;
    ocupation2: string;
    ocupation3: string;
}

export const Step1 = withStep()(({ api }) => {
    const [ formName ] = useState("Step1");
    const formObj = useForm();
    const storeObj = useStore();
    const [ validateObj ] = useState(() => createValidator<formSchema>({
        properties: {
            ocupation1: {
                type: "String",
                isRequired: true
            },
            ocupation2: {
                type: "String",
                isRequired: true
            },
            ocupation3: {
                type: "String",
                isRequired: true
            }
        }
    }))
    useEffect(()=>{
        return api.onConfirm(()=>{
            return new Promise((resolve, reject) => {
                const formData = formObj.get(undefined, formName);
                const vResult = validateObj.validate(formData);
                if(!vResult.pass) {
                    Dialog.alert({
                        title: "错误",
                        content: vResult.message || "请填写3种你未来想做的职业。"
                    });
                    reject("Validate Failed");
                } else {
                    storeObj.save("test24", {
                        ocupations: formData
                    });
                    resolve({});
                }
            });
        }) as any;
    },[ api, formObj, storeObj, formName, validateObj]);
    return <div>
        <section className="Context">
            <p>
                对于未来的职业(或升学进修的专业)你也许早有考虑，它可能很抽象、很朦胧，也可能很具体、很清晰。不管是哪种情况，现在都请你把你最想干的3种工作或最想读的3种专业，按顺序写下来。
            </p>
        </section>
        <Form name="Step1" className="InputFormArea LabelAlignRight">
            <FormItem name="ocupation1"><LineInput label="1 ：" /></FormItem>
            <FormItem name="ocupation2"><LineInput label="2 ：" /></FormItem>
            <FormItem name="ocupation3"><LineInput label="3 ：" /></FormItem>
        </Form>
    </div>
});