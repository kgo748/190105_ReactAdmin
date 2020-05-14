/**
 * 外形像链接的按钮
 */
import React from "react";

import "./index.css";

//函数定义组件的方式
export default function LinkButton(props) {
    //{...props} 接收的属性传给button，文本由使用的标签体确定
    return <button {...props} className="link-button"></button>;
}
