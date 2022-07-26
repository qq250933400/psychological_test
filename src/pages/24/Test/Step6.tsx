import React, { useState, } from "react";
import { withStep } from "./Context";
import { useStore } from "@components/DataStore";
import { createValidator } from "../../../utils/Validate";
import { Dialog } from "antd-mobile";
import { Form, FormItem, useForm } from "@components/Form";
import LineInput from "@components/LineInput";
import styles from "./style.module.scss";
import { useEffect } from "react";

type TypeImportSchema = {
    import: string;
    import_ex: string;
    non_import: string;
    non_import_ex: string;
}

export const Step6 = withStep()(({ api }) => {
    const storeObj = useStore();
    const formObj = useForm();
    const [ validateObj ] = useState(()=>createValidator<TypeImportSchema>({
        properties: {
            import: {
                type: "String",
                isRequired: true
            },
            import_ex: {
                type: "String",
                isRequired: true
            },
            non_import: {
                type: "String",
                isRequired: true
            },
            non_import_ex: {
                type: "String",
                isRequired: true
            }
        }
    }));
    useEffect(()=>{
        return api.onConfirm(()=>{
            return new Promise((resolve, reject) => {
                const formData = formObj.get(undefined, "import");
                const vResult = validateObj.validate(formData);console.log(formData);
                if(!vResult.pass) {
                    Dialog.alert({
                        title: "错误",
                        content: "最重要和最不重要的因素不能留空。"
                    });
                    reject({});
                } else {
                    storeObj.save("test24", {
                        import: formData
                    });
                    resolve({});
                }
            });
        }) as any
    },[api, validateObj, storeObj, formObj]);
    return <div>
        <section className="Context">
            <p>这一部分测验列出了人们在选择工作时通常会考虑的9要素(见所附工作价值标准)。现在请你在其中选出对你最重要二项因素，以及最不重要的二项因素，并将序号填人下边相应空格上。</p>
        </section>
        <div className={styles.step6Input}>
            <Form name="import" className="InputFormArea">
                <div>
                    <FormItem name="import"><LineInput label="最重要：" /></FormItem>
                    <FormItem name="non_import"><LineInput label="最不重要 ：" /></FormItem>
                </div>
                <div>
                    <FormItem name="import_ex"><LineInput label="次重要：" /></FormItem>
                    <FormItem name="non_import_ex"><LineInput label="次不重要：" /></FormItem>
                </div>
            </Form>
        </div>
        <section className="Context">
            <p><b>附：工作价值标准</b></p>
            <p>1．工资高福利好。</p>
            <p>2．工作环境(物质方面)舒适。</p>
            <p>3．人际关系良好。</p>
            <p>4．工作稳定有保障。</p>
            <p>5．能提供较好的受教育机会。</p>
            <p>6．有较高的社会地位。</p>
            <p>7．工作不太紧张、外部压力少。</p>
            <p>8．能充分发挥自己的能力特长。</p>
            <p>9．社会需要与社会贡献较大。</p>
            <p>10．能从事自己感兴趣的工作。</p>
        </section>
    </div>
});