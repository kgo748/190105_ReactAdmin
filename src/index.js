/**
 * 项目的入口js
 * 此项目git设置的是 dev 分支；
 * config-overrides.js：实现按需打包的配置文件；
 * 文件夹：
 *  build：打包后的文件资源
 *  node_modules：下载的插件资源
 *  public：存放根页面
 *  src：
 *      pages：主要放路由组件，用这种 <Route path='/xxx' component={Xxx}/> 形式被引用的组件，也可放非路由组件比如但概念组件需要使用的小模块组件
 *      components：页面结构组件，非路由组件
 *      api：请求接口，请求方法封装
 *      assets：静态资源
 *      config：配置文件，左侧菜单导航数据
 *      utils：工具类文件
 *
 * "proxy": "http://localhost:5000" 实现跨域的代理，转发到这个地址
 *
 * 基于class类组件：
 * class里(class和render()之间的代码)的属性，方法直接定义，方法里定义变量使用 this.xxx;
 * render() 里获取变量需写 let,const, 直接用 this.xxx 调用class里的属性或方法, this.state.xxx 获取state里的属性值；
 * render() 里 return 的HTML结构体 调用class里的属性或方法用 {this.xxx},函数不写(), 调用render() 里的内容直接用 {xxx},xxx:定义好的变量名称;
 * render() 里 return 的HTML结构体的标签使用 行内样式方式： style={{backgroundColor: "#fff", margin: "20px"}}
 * 特殊：class里的组件里调用class里的方法写法，<LinkButton onClick={()=>this.showUpdate()}>修改分类</LinkButton>
 *
 * 解决 react 项目控制台对 a 标签 使用了 href 属性（设置了值：javascript:;或 javascript: void(0);）的 warning 问题
 * 解决办法：属性值使用#或者#!
 *
 * ***video67，video81 复习、总结 没看
 *
 *
 */
/*引入官方模块*/
import React from "react";//包名小写，引入的名称大写
import ReactDOM from "react-dom";

/*引入官方样式，会打包所有样式，所以使用按需加载，配置 config-overrides.js*/
//import "antd/dist/antd.css";

/*引入自定义模块，一定要添加 ./ */
import App from "./App";//可以不加 .js 后缀
import storageUtils from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";

/*一开始就读取local中保存的user，保存到内存中，这个得等登陆页写完后再加*/
const user=storageUtils.getUser();//读取
memoryUtils.user=user;//保存

/*将APP组件标签渲染到 index.html(public目录下的index.html页面) 页面的div里*/
ReactDOM.render(<App />, document.getElementById("root"));
