import React, { useState } from "react";
import { QACheckBox } from "./QACheckBox";

export const Step2 = () => {
    const [ QuestionOfR ] = useState({
        title: "一、R型（现实性活动）",
        subTitle: "你喜欢做下列事情吗？",
        options: [
            { value: "R_1", title: "装配修理电器。" },
            { value: "R_2", title: "修理自行车。" },
            { value: "R_3", title: "装修机器或机器零件。" },
            { value: "R_4", title: "做木工活。" },
            { value: "R_5", title: "驾驶卡车或拖拉机。" },
            { value: "R_6", title: "开机床。" },
            { value: "R_7", title: "开摩托车。" },
            { value: "R_8", title: "上金属工艺课。" },
            { value: "R_9", title: "上机械制图课。" },
            { value: "R_10", title: "上木工手艺课。" },
            { value: "R_11", title: "上电气自动化技术课。" },
        ]
    })
    return <div>
        <section className="Context">
            <p>下面列举了一些十分具体的活动。这些活动无所谓好坏，如果你喜欢去参加(包括过去、现在或将来)，就请在答案前的方框口内划个“√”。</p>
            <i className="note">注意：这一部分测验主要想确定你的职业兴趣，而不是让你选择工作，你喜欢某种活动并不意味着你一定要从事这种活动。答题时不必考虑过去是否干过和是否擅长这种活动，只根据你的兴趣直接判断即可。请务必做完每一题目。</i>
        </section>
        <hr className="questionSplitLine"/>
        <QACheckBox title={QuestionOfR.title} subTitle={QuestionOfR.subTitle} options={QuestionOfR.options}/>
    </div>
};