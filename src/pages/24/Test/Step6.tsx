import React from "react";
import { withStep } from "./Context";
import { useStore } from "@components/DataStore";
import { createValidator } from "../../../utils/Validate";
import { Dialog } from "antd-mobile";
import { Form, FormItem } from "@components/Form";
import LineInput from "@components/LineInput";

export const Step6 = withStep()(() => {
    return <div>
        <section className="Context">
            <p>这一部分测验列出了人们在选择工作时通常会考虑的9要素(见所附工作价值标准)。观在请你在其中选出对你最重要二项因素，以及最不重要的二项因素，并将序号填人下边相应空格上。</p>
        </section>
        <div>
            <Form name="Step1" className="InputFormArea LabelAlignRight">
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
    </div>
});