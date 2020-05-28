/**
 * 应用的根组件
 * 决定默认进入哪一个页面；
 */
/*导入官方组件*/
import React, {Component} from "react";//引入React组件
/*引入antd插件的Button组件，用大括号是因为antd定义了很多组件，只需引入自己需要的即可*/
//import { Button, message } from "antd";//test 引入要使用的antd的组件
import { BrowserRouter, Route, Switch } from "react-router-dom";//引入路由

/*导入自定义的组件*/
import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";

export default class App extends Component {
    /*react所有组件的组件名首字母都是大写的*/

    /*自定义的点击事件*/
    /*handleClick = () => {
        message.success(' 成功啦...');
    };
    render() {
        return <Button type="primary" onClick={this.handleClick}>Primary</Button>
    };*/

    /*<Route path='/login' component={Login}/> 前面是路径，后面是组件名*/
    /***<Switch></Switch>只匹配其中一个，默认进入没写路径的组件*/
    /*也可用 HashRouter 路由，不过路径加#号*/
    //浏览器URL路由导航
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={Login}/>
                    <Route path='/' component={Admin}/>
                </Switch>
            </BrowserRouter>
        )
    }

}
