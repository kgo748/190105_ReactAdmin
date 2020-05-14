/**
 * 进行local数据存储管理的工具模块
 * 原生方式
 * store方式
 */
import store from "store";
//定义常量
const USER_KEY="user_key";
//暴露一个对象
export default {
    /*保存user*/
    saveUser (user) {
        //存储json字符串
        //localStorage.setItem(USER_KEY, JSON.stringify(user));
        store.set(USER_KEY, user);
    },

    /*读取user*/
    getUser () {
       //return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
        return store.get(USER_KEY);
    },

    /*删除user*/
    removeUser () {
        //localStorage.removeItem(USER_KEY);
        store.remove(USER_KEY);
    }

}