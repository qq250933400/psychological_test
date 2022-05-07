import React from "react";
import { useContext } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { utils } from "elmer-common";

type TypeStoreContext = {
    state: any;
    save(key: string, value?: any): void;
    get<T={}>(key: string):T;
    remove(Key: string): void;
};

const DataStoreContext = React.createContext<TypeStoreContext>({
    state: {},
    save(key: string, value?: any): void {},
    get<T={}>(key: string): T { return null as any },
    remove(key: string):void {}
});

export const DataStore = (props: any) => {
    const [ storeState, setStoreState ] = useState<any>({});
    const save = useCallback((key: string, value?: any)=>{
        if(typeof key === "string" && key.length > 0) {
            const newState:any = { ...storeState };
            const oldValue = newState[key];
            if(utils.isObject(oldValue)) {
                newState[key] = {
                    ...oldValue,
                    ...(value || {})
                };
            } else {
                newState[key] = value;
            }
            setStoreState(newState);
        } else {
            throw new Error("Key不能为空。");
        }
    },[storeState]);
    const get = useCallback((key?: string) => {
        if(typeof key === "string" && key.length > 0) {
            return storeState[key];
        } else {
            return { ...storeState };
        }
    }, [storeState]);
    const remove = useCallback((key: string) => {
        if(typeof key==="string" && key.length > 0) {
            const newState = { ...storeState };
            delete newState[key];
            setStoreState(newState);
        }
    }, [storeState]);
    return (
        <DataStoreContext.Provider value={{
            state: storeState,
            save,
            get,
            remove
        }}>
            {props.children}
        </DataStoreContext.Provider>
    );
};

export const useStore = () => useContext(DataStoreContext);
