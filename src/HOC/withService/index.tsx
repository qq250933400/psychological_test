import React, { createContext, useCallback, useState } from 'react';
import { TypeServiceConfig, createServiceConfig, ElmerService, TypeServiceSendOptions } from "./ElmerService";
import { getServiceObj } from "elmer-common/lib/decorators/Autowired";
import { commonHandler } from "./ErrorHandle";
import { useNavigate } from "react-router-dom";

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

const withService = () => {
    return (SerivceWrapper:React.ElementType) => {
        return (props:any) => {
            const [ serviceObj ] = useState(() => {
                return getServiceObj(ElmerService) as ElmerService;
            });
            const navigateTo = useNavigate();
            const sendRequest = useCallback((option: TypeServiceSendOptions, opt?: TypeServiceRequestOptions) =>{
                return new Promise((resolve, reject) => {
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
            },[serviceObj]);
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

export default withService;
