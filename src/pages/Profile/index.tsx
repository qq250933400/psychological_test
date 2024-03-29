import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MathAnimationApi, utils } from "elmer-common";
import styles from "./style.module.scss";
import withFrame from "../../HOC/withFrame";
import withService, { TypeService } from "../../HOC/withService";
import withContext from "../../HOC/withContext";
import ImgJunior from "../../res/junior.png";
import ImgPrimary from "../../res/primary.png";
import ImgSenior from "../../res/senior.jpg";
import { identity } from "@/utils";

type TypeProfileInfo = {
    title: string;
    value: string;
    name: string;
};
type TypeProfileProps = {
    data: TypeProfileInfo;
    onClick?: Function;
}
type TypeScrollAnimation = {
    changeOffsetX: number;
    startOffsetX: number;
    totalTime?: number;
    complete?: Function;
}

const imgState:any = {
    primary: ImgPrimary,
    junior: ImgJunior,
    senior: ImgSenior
};

const ProfileCard = (props: TypeProfileProps) => {
    const imgData = useMemo(() => {
        return imgState[props.data.name] || ImgJunior;
    }, [props.data]);
    return (
        <div className={styles.profileCard}>
            <div>
                <img src={imgData} alt={props.data.title}/>
            </div>
            <label><span>{props.data.title}</span></label>
        </div>
    )
};

const Profile = (props: any) => {
    const [ profileList, setProfileList ] = useState(props.categoryList || []);
    const [ selectedProfile, setSelectedProfile ] = useState(profileList[0]);
    const [ mouseEvent ] = useState({
        stateData: {
            startOffsetX: 0,
            offsetX: 0,
            offsetIndex: 0,
            scrollX: 0,
            isPressed: false,
            isTransformEvent: false,
            width: 0,
            positionOffset: 20
        }
    });
    const cards = useRef(null);
    const cardsWrapper = useRef(null);
    const navigateTo = useNavigate();
    const scrollCards = useCallback((offsetX: string|number) => {
        const newOffsetX = /px$/.test(offsetX.toString()) ? offsetX.toString() : offsetX + "px";
        if(cardsWrapper.current) {
            (cardsWrapper.current as HTMLDivElement).style.transform = `translate3d(${newOffsetX},0,0)`;
        }
    }, [cardsWrapper]);
    const doScrollAction = useCallback((data: TypeScrollAnimation) => {
        const { changeOffsetX,startOffsetX = 0, totalTime, complete } = data;
        const durationTime = totalTime && totalTime > 10 ? totalTime : 60;
        let currentTime = 0;
        if(!mouseEvent.stateData.isTransformEvent) {
            mouseEvent.stateData.isTransformEvent = true;
            const timer = setInterval(() => {
                if(currentTime + 1 <= durationTime) {
                    const transformOffsetX = MathAnimationApi.Cubic.easeOut(currentTime, startOffsetX,changeOffsetX, durationTime);
                    // const scrollX = changeOffsetX - transformOffsetX;
                    currentTime += 1;
                    mouseEvent.stateData.scrollX = -transformOffsetX;
                    scrollCards(transformOffsetX);
                } else {
                    mouseEvent.stateData.isTransformEvent = false;
                    currentTime = 0;
                    clearInterval(timer);
                    typeof complete === "function" && complete();
                }
            }, 10);
        }
    },[scrollCards, mouseEvent]);
    const doSlideAction = useCallback((toLeft: boolean) => {
        if(!mouseEvent.stateData.isTransformEvent) {
            const itemWidth = mouseEvent.stateData.width;
            const lastOffsetX = -mouseEvent.stateData.scrollX;
            if(lastOffsetX > 0) {
                doScrollAction({
                    changeOffsetX: -lastOffsetX,
                    startOffsetX: lastOffsetX
                });
            } else {
                if(toLeft) {
                    const nextIndex = mouseEvent.stateData.offsetIndex + 1;
                    if(nextIndex < profileList.length) {
                        const scrollToX = itemWidth * nextIndex + nextIndex * mouseEvent.stateData.positionOffset;
                        const scrollOffsetX = scrollToX - Math.abs(mouseEvent.stateData.scrollX);
                        doScrollAction({
                            changeOffsetX: -scrollOffsetX,
                            startOffsetX: -mouseEvent.stateData.scrollX,
                            complete: () => {
                                setSelectedProfile(profileList[nextIndex]);
                            }
                        });
                        mouseEvent.stateData.offsetIndex = nextIndex;
                    } else {
                        const scrollToX = itemWidth * mouseEvent.stateData.offsetIndex;
                        const scrollOffsetX = Math.abs(Math.abs(lastOffsetX) - scrollToX) - (profileList.length - 1) * mouseEvent.stateData.positionOffset;
                        doScrollAction({
                            changeOffsetX: scrollOffsetX,
                            startOffsetX:lastOffsetX
                        });
                    }
                } else {
                    const nextIndex = mouseEvent.stateData.offsetIndex - 1;
                    if(nextIndex >= 0) {
                        const scrollToX = itemWidth * nextIndex;
                        const scrollOffsetX = scrollToX - Math.abs(mouseEvent.stateData.scrollX) + nextIndex * mouseEvent.stateData.positionOffset;
                        doScrollAction({
                            changeOffsetX: Math.abs(scrollOffsetX),
                            startOffsetX: lastOffsetX,
                            complete: () => {
                                setSelectedProfile(profileList[nextIndex]);
                            }
                        });
                        mouseEvent.stateData.offsetIndex = nextIndex;
                    }
                }
            }
        }
    }, [mouseEvent, doScrollAction, profileList]);
    const onMouseDown = useCallback(({ nativeEvent }):any => {
        const event: MouseEvent|TouchEvent = nativeEvent;
        let offsetX = 0;
        if(event instanceof MouseEvent) {
            offsetX = event.clientX;
        } else if(event instanceof TouchEvent) {
            offsetX = event.touches[0].clientX;
        }
        mouseEvent.stateData.offsetX = offsetX;
        mouseEvent.stateData.isPressed = true;
        mouseEvent.stateData.startOffsetX = offsetX;
    }, [ mouseEvent ])
    const onMouseMove = useCallback(({ nativeEvent }) => {
        const event: MouseEvent|TouchEvent = nativeEvent;
        if(mouseEvent.stateData.isPressed && !mouseEvent.stateData.isTransformEvent) {
            let offsetX = 0;
            if(event instanceof MouseEvent) {
                offsetX = event.clientX;
            } else if(event instanceof TouchEvent) {
                offsetX = event.touches[0].clientX;
            }
            const newOffset = offsetX - mouseEvent.stateData.offsetX ;
            const newScrollX = mouseEvent.stateData.scrollX - newOffset;
            if(cards.current) {
                mouseEvent.stateData.scrollX = newScrollX;
                scrollCards(-newScrollX);
            }
            mouseEvent.stateData.offsetX = offsetX;
        }
    }, [mouseEvent, cards, scrollCards]);
    const onMouseUp = useCallback(({ nativeEvent }): any => {
        if(mouseEvent.stateData.isPressed) {
            const event: MouseEvent = nativeEvent;
            const directionToLeft = mouseEvent.stateData.offsetX - mouseEvent.stateData.startOffsetX > 0 ? false : true;
            mouseEvent.stateData.isPressed = false;
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.returnValue = false;
            // console.log(mouseEvent.stateData.offsetX - mouseEvent.stateData.startOffsetX);
            doSlideAction(directionToLeft);
            return false;
        }
    }, [doSlideAction, mouseEvent]);
    const onStartApplication = useCallback(() => {
        props.saveProfile(selectedProfile);
        navigateTo("/test", {
            state: selectedProfile
        });
    }, [ navigateTo, props, selectedProfile ]);
    useEffect(() => {
        var lastTouchEnd = 0;
        const gesturestart = (event: any) => {
            event.preventDefault();
        };
        const onBodyTouchStart = (event: any) => {
            if (event.touches.length > 1) {
              event.preventDefault();
            }
        };
        const onBodyTouchEnd = (event:any) => {
            var now = Date.now();
            if (now - lastTouchEnd <= 300) {
              event.preventDefault();
            }
            lastTouchEnd = now;
        };
        document.addEventListener('gesturestart', gesturestart);
        document.documentElement.addEventListener('touchstart', onBodyTouchStart, false); 
        document.documentElement.addEventListener('touchend', onBodyTouchEnd, false);
        if(cardsWrapper.current && cards.current) {
            (cardsWrapper.current as HTMLDivElement).style.width = ((cards.current as HTMLDivElement).clientWidth * profileList.length) + "px";
            mouseEvent.stateData.width = (cards.current as HTMLDivElement).clientWidth;
        }
        return () => {
            document.removeEventListener('gesturestart', gesturestart);
            document.documentElement.removeEventListener('touchstart', onBodyTouchStart, false);
            document.documentElement.removeEventListener('touchend', onBodyTouchEnd, false);
        };
    },[cardsWrapper, cards, mouseEvent, profileList]);
    useEffect(()=>{
        setProfileList(props.categoryList ||[]);
    },[props.categoryList]);
    return <div className={styles.profilePage}  onMouseUp={onMouseUp} onTouchEnd={onMouseUp}>
        <div
            onMouseDown={onMouseDown as any}
            onTouchStart={onMouseDown as any}
            onMouseMove={onMouseMove}
            onTouchMove={onMouseMove}
            onMouseUp={onMouseUp}
            onTouchEnd={onMouseUp}
            className={styles.cards}
            ref={cards}
        >
            <div ref={cardsWrapper}>
                {
                    profileList.map((item: any,index: number) => {
                        return <ProfileCard data={item} key={index}/>
                    })
                }
            </div>
        </div>
        <button className={styles.btnStart} onClick={onStartApplication}>进入</button>
    </div>
};

const withFramePage =  withService()(withFrame({
    title: (opt) => {
        const identityText = identity();
        return ["选择身份", "(", identityText, ")"].join("");
    },
    showLoading: true,
    onCancel: (opt) => {
        opt.navigateTo("/login");
    },
    onRetry: (opt) => {
        opt.init();
    },
    onInit: (opt: any) => {
        const serviceObj: TypeService = opt.service;
        opt.setData(opt.contextData);
        if(utils.isEmpty(opt.contextData?.identity)) {
            opt.navigateTo("/identity");
            return;
        }
        if(!opt.categoryList) {
            opt.showLoading();
            serviceObj.send({
                endPoint: "wenjuan.category"
            },{
                throwException: true
            }).then((resp: any) => {
                const listData: any[] = resp.data || [];
                const newListData = [];
                for(const item of listData) {
                    newListData.push({
                        ...item,
                        value: item.name
                    });
                }
                opt.saveCategory(newListData || []);
                opt.setData({
                    categoryList: newListData || []
                });
                opt.hideLoading()
                if(newListData.length <= 0) {
                    opt.showError({
                        title: "加载失败",
                        message: "获取分组信息失败，点击右上角按钮重试。"
                    });
                } else {
                    opt.hideError();
                }
            }).catch((err) => {
                console.error(err);
                opt.hideLoading();
                opt.showError({
                    title: "加载失败",
                    message: "获取分组信息失败，点击右上角按钮重试。"
                });
            });
        } else {
            opt.hideLoading();
        }
    },
    onHome: (opt) => {
        opt.navigateTo("/identity");
    }
})(Profile));

export default withContext({
    dataKey: "profile",
    mapDataToProps: (data, rootData: any) => {
        return {
            ...(data || {}),
            identity: rootData.identity?.value
        };
    },
    mapDispatchToProps: (dispatch) => {
        return {
            saveCategory: (data:any) => dispatch("categoryList", data),
            saveProfile: (data: any) => dispatch("profile", data)
        };
    }
})(withFramePage);

