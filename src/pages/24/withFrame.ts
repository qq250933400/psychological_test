import withFrame, { WithFrameOptions } from "@HOC/withFrame";
import style from "./style.module.scss";

type TypeWithFrameKeys = Exclude<keyof WithFrameOptions, "className"|"homeIcon"|"historyIcon">;
type TypeWithFrameFor24 = {[P in TypeWithFrameKeys]?: WithFrameOptions[P]};

export const withFrameFor24 = (options: TypeWithFrameFor24) => {
    return withFrame({
        ...options,
        className: style.frameFor24,
        homeIcon: style.icon_home,
        historyIcon: style.icon_history
    });
}