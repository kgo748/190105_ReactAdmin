/**
 * 头部组件
 */
import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {formateDate} from "../../utils/dateUtils";
import {reqWeather} from "../../api/index";
import "./index.less";
import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../link-button";

const { confirm } = Modal;

class Header extends Component {

    state={
        currentTime: formateDate(Date.now()),//当前时间字符串
        dayPictureUrl: "",//天气图片地址URL
        weather: "晴",   //天气文本
    };

    /*获取当前时间*/
    getTime=()=>{
        //每隔1秒获取当前时间，并更新状态数据currentTime
        this.intervalId=setInterval(()=>{
            const currentTime=formateDate(Date.now());
            this.setState({currentTime});//更新state状态
        }, 1000);
    };
    /*获取天气信息*/
    getWeather=async ()=>{
        const {dayPictureUrl, weather}=await reqWeather("武汉");
        //console.log("header...", {dayPictureUrl, weather});
        this.setState({
            dayPictureUrl,
            weather,
        });
    };

    /*获取当前界面的导航名称*/
    getTitle=()=> {
        //得到当前请求路径
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item=>{
           if(item.key===path){
               // 如果当前item对象的key与path一样,item的title就是需要显示的title
               title=item.title;
           } else if(item.children){
               // 在所有子item中查找匹配的
               const cItem=item.children.find(cItem=>cItem.key===path);
               // 如果有值才说明有匹配的
               if(cItem){
                   title=cItem.title;
               }
           }
        });
        return title;
    };
    /*
      // 不能这么做: 不会更新显示
      componentWillMount () {
        this.title = this.getTitle()
      }*/

    /*退出登陆，使用模态框*/
    logout=()=>{
        //显示确认框
        confirm({
            //title: '确定退出吗？',
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗？',
            onOk: ()=> {
                //console.log("header--logout()...", this);
                //确定事件
                //删除保存的user数据
                storageUtils.removeUser();
                memoryUtils.user={};

                //跳转到login页面
                this.props.history.replace("/login");
            },
            /*onCancel() {
                //取消事件，没用
                //alert("err");
            },*/
        });
    };

    /*在第一次render()之后执行
    一般在此执行异步操作：发ajax请求，启动定时器*/
    componentDidMount() {
        //获取当前的时间
        this.getTime();
        //获取当前天气
        this.getWeather();
    }
    /*在当前组件写在之前调用*/
    componentWillUnmount() {
        //清除定时器，前面获取当前时间使用的定时器，不然退出后还在执行会报错
        clearInterval(this.intervalId);
    }

    render() {
        const { currentTime, dayPictureUrl, weather }=this.state;
        const username=memoryUtils.user.username;
        const title=this.getTitle();//得到当前需要显示的title

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎：{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                    <a href="#!" onClick={this.logout}>退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="图片" title="图片"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
//暴露包装后的组件
export default withRouter(Header);
