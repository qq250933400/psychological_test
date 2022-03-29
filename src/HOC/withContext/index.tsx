import React, { createContext, useState, useCallback, useContext, useMemo } from "react";
import { utils } from "elmer-common";

type TypeWithContextDispatch = (dataKey: string, data: any) => void;

type TypeWithContextOptions = {
    dataKey?: string;
    mapDataToProps?(data: any, rootData: any): any;
    mapDispatchToProps?(dispatch: TypeWithContextDispatch): any;
};
type TypeWithHOCProviderProps = {
    localize?: boolean;
    children: any;
};
type TypeHOCContext = {
    data: any;
    setData(newData: any): void;
    getData(key?: string): any;
};

const HocContext = createContext<TypeHOCContext>({
    data: {},
    setData: (newData: any) => {},
    getData: (key?: string) => {}
});

const localKey: string = "HOC_c71e18cd492829dede9e5053d843";

export const WithHOCProvider = (props: TypeWithHOCProviderProps) => {
    const [ data ] = useState(()=> {
        let initData = {
            root: {}
        };
        if(props.localize) {
            const dataText = sessionStorage.getItem(localKey);
            initData.root = dataText && !utils.isEmpty(dataText) ? JSON.parse(dataText) : {};
        }
        return initData;
    });
    const getData = useCallback((key?: string) => {
        return key && !utils.isEmpty(key) ? utils.getValue(data.root, key) : { ...data.root };
    }, [ data ]);
    const setData = useCallback((newData: any) => {
        const newSaveData = {
            ...data.root,
            ...newData
        };
        data.root = newSaveData;
        if(props.localize) {
            sessionStorage.setItem(localKey, JSON.stringify(data.root));
        }
    }, [data, props]);

    return (
        <HocContext.Provider value={{
            getData,
            setData,
            data
        }}>
            {props.children}
        </HocContext.Provider>
    );
};

export const withContext = (options?: TypeWithContextOptions) => (ContextWrapper: any) => {
    if(typeof options?.mapDispatchToProps === "function") {
        if(utils.isEmpty(options.dataKey)) {
            throw new Error("当设置mapDispatchToProps时必须设置dataKey。");
        }
    }
    const withContextState = {
        dispatchs: null
    };
    return (props: any) => {
        const [ timestamp, setTimestamp ] = useState(Date.now());
        const [ dataKey ] = useState(options?.dataKey || "");
        const contextRef = useContext(HocContext);
        const [ mapState, setMapState ] = useState(() => {
            if(typeof options?.mapDataToProps === "function") {
                return options.mapDataToProps(contextRef.getData(dataKey), contextRef.getData());
            } else {
                return {};
            }
        });
        const dispatch = useCallback((hoc: TypeHOCContext) =>{
            return (subDataKey: string, newValue: any) => {
                const updateData = {
                    ...hoc.getData(dataKey) || {}
                };
                const updateRootData:any = {};
                updateData[subDataKey] = newValue;
                updateRootData[dataKey] = updateData;
                hoc.setData(updateRootData);
                if(typeof options?.mapDataToProps === "function") {
                    const mapStateData = options.mapDataToProps(contextRef.getData(dataKey),contextRef.getData());
                    setMapState(mapStateData);
                } else {
                    setMapState(updateData);
                }
                setTimestamp(Date.now());
            };
        },[dataKey, setMapState,setTimestamp, contextRef]);
        const createDispatch = useCallback((fn, data) => {
            const dispatchs = fn(dispatch(data), data);
            if(!dispatchs) {
                throw new Error("mapDispatchToProps必须返回绑定方法对象。");
            }
            withContextState.dispatchs = dispatchs;
            return dispatchs;
        },[dispatch]);
        const mapDispatch = useMemo(() =>{
            return !withContextState.dispatchs && options?.mapDispatchToProps ? createDispatch(options?.mapDispatchToProps, contextRef) : withContextState.dispatchs;
        }, [createDispatch, contextRef]);
        const formatMapData = useMemo(() => {
            return mapState || (options?.mapDataToProps && options.mapDataToProps(contextRef.getData(dataKey),contextRef.getData()));
        },[mapState, dataKey, contextRef]);
        return (
            <ContextWrapper timestamp={timestamp} {...props} {...mapDispatch} contextData={formatMapData} context={contextRef}/>
        );
    }
};

export default withContext;
