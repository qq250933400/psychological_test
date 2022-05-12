import React, { useState, useCallback } from "react";
import { useContext } from "react";
import { utils } from "elmer-common";
import { useEffect } from "react";

type TypeFormProps = {
    children: any;
    className?: string;
    name?: string;
    initData?: any;
    onSubmit?: Function;
    url?: string;
    method?: "GET" | "POST" | "PUT";
};

type TypeFormItemProps = {
    name: string;
    onChange?: Function;
    children: any;
};

type TypeFormContext = {
    state: any;
    name?: string;
    save(name: string, value: any): void;
    get<T={}>(name?: string, formName?: string): T;
    submit(): void;
};

const FormContext = React.createContext<TypeFormContext>({
    state: {},
    save: (name: string, value: any) => {},
    submit: () => {},
    get: (name: string, formName?: string) => {
        if(formName && !utils.isEmpty(formName) && formStore[formName]) {
            const srcFormData: any = formStore[formName];
            if(typeof name === "string" && name.length > 0) {
                return srcFormData[name as any];
            } else {
                return srcFormData as any;
            }
        }
    }
} as any);

const formStore: any = {};

export const useForm = () => useContext(FormContext);

export const Form = (props: TypeFormProps) => {
    const [frmContext, setFrmContext] = useState<any>(props.initData || {});
    const save = useCallback((name: string, value: any) => {
        const newState = { ...frmContext };
        newState[name] = value;
        setFrmContext(newState);
    }, [frmContext]);
    const getValue = useCallback(<T extends {}>(name?: string, formName?: string):T => {
        if(formName && !utils.isEmpty(formName) && formStore[formName]) {
            const srcFormData: any = formStore[formName];
            if(typeof name === "string" && name.length > 0) {
                return srcFormData[name as any];
            } else {
                return srcFormData as any;
            }
        } else {
            if(typeof name === "string" && name.length > 0) {
                return frmContext[name as any];
            } else {
                return frmContext as any;
            }
        }
    }, [frmContext]);
    const submit = useCallback(() => {
        typeof props.onSubmit === "function" && props.onSubmit(frmContext)
    },[props, frmContext]);
    useEffect(()=>{
        if(props.name && !utils.isEmpty(props.name) && props.initData) {
            (formStore as any)[props.name] = props.initData
        }
    },[props.initData, props.name]);
    return (
        <FormContext.Provider value={{
            state: frmContext,
            name: props.name,
            save,
            get: getValue,
            submit
        }}>
            <form className={props.className} name={props.name} method={props.method} action={props.url} onSubmit={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }}>{props.children}</form>
        </FormContext.Provider>
    );
};

export const FormItem = (props: TypeFormItemProps) => {
    const formObj = useForm();
    const onChange = useCallback((value: any) => {
        const name = formObj.name;
        if(name && !utils.isEmpty(name)) {
            const saveFormData = formStore[name] || {};
            saveFormData[props.name] = value;
            formStore[name] = saveFormData;
        }
        formObj.save(props.name, value);
        typeof props.onChange === "function" && props.onChange({value});
    }, [props, formObj]);
    return React.cloneElement(props.children, {
        name: props.name,
        onChange
    });
};