import React, { createContext, useCallback, useState, useContext } from 'react';
import { TypeServiceConfig, createServiceConfig, ElmerService, TypeServiceSendOptions } from "./ElmerService";
import { getServiceObj } from "elmer-common/lib/decorators/Autowired";
import { commonHandler } from "./ErrorHandle";
import { useNavigate } from "react-router-dom";
import { useMemo } from 'react';

type TypeServiceProviderProps = {
    env: string,
    data: TypeServiceConfig;
    children: any;
};
type TypeServiceRequestOptions = {
    throwException?: boolean;
};
export type TypeService = {
    send<T={}>(option: TypeServiceSendOptions, opt?: TypeServiceRequestOptions):Promise<T>;
};

export const createConfig = createServiceConfig;

export const ServiceContext = createContext({
    config: {},
    env: "DEV"
});

export const ServiceProvider = (props: TypeServiceProviderProps) => {
    return (
        <ServiceContext.Provider value={{
            config: props.data,
            env: props.env
        }}>
            {props.children}
        </ServiceContext.Provider>
    );
};

export type TypeWithServiceApi = {
    send: <T={}>(option: TypeServiceSendOptions, opt?: TypeServiceRequestOptions) => Promise<T>;
};
type TypeWithServiceProps = {
    service: TypeWithServiceApi;
};

const doAjax = (option: TypeServiceSendOptions,  navigateTo: Function, opt?: TypeServiceRequestOptions) =>{
    return new Promise((resolve, reject) => {
        const serviceObj = getServiceObj(ElmerService) as ElmerService;
        const token = sessionStorage.getItem("token");
        const handleEvent:any = {
            throwException: opt?.throwException
        };
        serviceObj.send({
            ...option,
            cookie: {
                ...(option.cookie || {}),
                token
            }
        }).then((resp: any) => {
                handleEvent.onError = (err:any) => {
                    reject({
                        ...resp,
                        statusCode: err.statusCode,
                        message: err.message
                    });
                }
                if(!commonHandler(resp, false, handleEvent)) {
                    resolve(resp.data);
                } else {
                    reject({
                        ...resp,
                        statusCode: resp.data?.statusCode,
                        message: resp.data?.message
                    });
                }
                if(handleEvent.returnValue?.statusCode === "NoLogin") {
                    navigateTo("/login");
                }
            }).catch((err) => {
                handleEvent.onError = (errx:any) => {
                    reject({
                        ...err,
                        statusCode: errx.statusCode,
                        message: errx.message
                    });
                };
                commonHandler(err, true, handleEvent);
                if(handleEvent.returnValue?.statusCode === "NoLogin") {
                    navigateTo("/login");
                }
                reject(err);
            });
    });
}

const withService = () => {
    return (SerivceWrapper: React.ElementType<TypeWithServiceProps>) => {
        return (props:any) => {
            const [ serviceObj ] = useState(() => {
                return getServiceObj(ElmerService) as ElmerService;
            });
            const navigateTo = useNavigate();
            const sendRequest = useCallback((option: TypeServiceSendOptions, opt?: TypeServiceRequestOptions) =>{
                return doAjax(option, navigateTo, opt);
            },[navigateTo]);
            return (
                <ServiceContext.Consumer>
                    {
                        data => {
                            serviceObj.setENV(data.env);
                            serviceObj.setConfig(data.config as any);
                            return <SerivceWrapper {...props} serviceConfig={data} service={{
                                send: sendRequest
                            }}/>
                        }
                    }
                </ServiceContext.Consumer>
            );
        }
    }
};
type TypeUserServiceOption = {
    navigateTo?: Function;
};
export const useService = (options?: TypeUserServiceOption) => {
    const navigateTo = useNavigate();
    const [ serviceObj ] = useState(() => {
        return getServiceObj(ElmerService) as ElmerService;
    });
    const contextObj = useContext(ServiceContext);
    return useMemo(() => {
        serviceObj.setConfig(contextObj.config as any);
        return {
            send: (option: TypeServiceSendOptions, opt?: TypeServiceRequestOptions) => doAjax(option, options?.navigateTo || navigateTo, opt)
        }
    },[ navigateTo,serviceObj, contextObj, options]);
}

export default withService;
