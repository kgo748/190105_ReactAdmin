/**
 * 后台管理的路由组件
 * 更改一下导入的自定义组件路径，即可把测试组件应用上；
 */
import React, {Component} from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { Layout } from 'antd';

import memoryUtils from "../../utils/memoryUtils";//使用这个页面刷新就久回到了登陆页面

/*这里引入到文件夹即可，注意子组件的文件夹和组件名的命名方式*/
//引入
import LeftNav from "../../components/left-nav/";
import Header from "../../components/header/";
/*引入到具体的文件 .js 后缀可以省略*/
//引入侧栏导航路由
import Home from "../home/home";
import Category from "../category/category";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import Bar from "../charts/Bar";
import Line from "../charts/Line";
import Pie from "../charts/pie";
import Order from "../order/order";
//AntV L7-高德地图
import Gaode from "../gaode/gaode";


/*必须写在import下面*/
const { Footer, Sider, Content } = Layout;//不用它的Header

export default class Admin extends Component {

    render() {
        const user=memoryUtils.user;
        //如果内存中没有存储user===>当前没有登陆
        if(!user || !user._id) {
            //自动跳转到登陆界面(在render() 中实现跳转)，注意Redirect尾部的斜杠 /
            return <Redirect to="/login" />;
        }

        /*注意这里的Switch外面是否可以省略掉 BrowserRouter
        Route 导航的内容放在 Content 容器内
        默认路由： <Redirect to="/home"/>
        minHeight: "100%": 防止富文本编辑器组件里的尾部被挤掉不见了
        */
        return (
            <Layout style={{minHeight: "100%"}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header/>
                    <Content style={{backgroundColor: "#fff", margin: "20px"}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Route path='/order' component={Order}/>
                            <Route path='/gaode' component={Gaode}/>
                            <Redirect to="/home"/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign:"center", color: "green"}}>推荐使用谷歌浏览器，以获得更佳的页面操作体验...</Footer>
                </Layout>
            </Layout>
        );
    }

};

