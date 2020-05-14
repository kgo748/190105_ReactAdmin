/**
 * 发送异步ajax请求的函数模块
 */
/*导入，在github查看使用方法*/
import axios from "axios";
import { message } from "antd";

/*默认暴露且值暴露一个的时候用 export default */
export default function ajax(url="", data={}, type="GET") {
    //优化错误处理
    //返回Promise对象
    return new Promise((resolve, reject) => {
        let promise;
        //1.执行异步ajax请求
        if(type==="GET") {  //发GET请求
            promise=axios.get(url, { //配置对象
                params: data    //指定请求参数
            });
        } else {  //发POST请求
            promise=axios.post(url, data);
        }

        promise.then(response=>{
            //2.如果成功了，调用resolve
            resolve(response.data);
        }).catch(error=>{
            //3.如果失败了，不调用reject(reason)，而是提示异常信息
            message.error("请求出错了："+error.message);
        });
    });

}