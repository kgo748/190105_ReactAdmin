/**
 * 左侧导航的组件
 */
import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";

import { Menu, Button } from 'antd';
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

import "./index.less";// .less不能省略 引入当前样式
import logo from "../../assets/images/logo.png";
import menuList from "../../config/menuConfig";

const { SubMenu } = Menu;

class LeftNav extends Component {
    state = {
        collapsed: false,
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,//取反
        });
    };

    /*
    <Menu.Item key="home">
        <Link to="/home">
            <PieChartOutlined />
            <span>首页</span>
        </Link>
    </Menu.Item>
    <SubMenu
        key="sub2"
        title={
            <span>
                <AppstoreOutlined />
                <span>商品</span>
            </span>
        }
    >
    </SubMenu>
    */
    /*根据menuList数组生成对应的导航标签*/
    //方式1：map, 递归调用, 方法写render() 外面了？？？
    getMenuNodes_map=(menuList)=>{
        return menuList.map(item=>{
            if(!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else {
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <AppstoreOutlined />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes_map(item.children)}
                    </SubMenu>
                )
            }
        })
    };
    /*方式2：
    根据menu的数据数组生成对应的标签数组，
    使用reduce()+递归调用
    */
    getMenuNodes=(menuList)=>{
        // 得到当前请求的路由路径
        const path = this.props.location.pathname;

        return menuList.reduce((pre, item)=>{
            // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
            //向pre添加 <Menu.Item>
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ));
            }else {
                // 查找一个与当前请求路径匹配的子Item，cItem-{}对象，path.indexOf(cItem.key)：不存在返回 -1，存在就返回字符串查找的第一个索引位置，可字符串查字符串
                const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0);
                // 如果存在, 说明当前item的子列表需要打开
                if(cItem){
                    this.openKey=item.key;//需要展开显示的子项的直接父项的key值
                    //console.log("getMenuNodes()...", this.openKey);
                }

                // 向pre添加<SubMenu>
                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <AppstoreOutlined />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ));
            }

            return pre;
        }, []);
    };

    /*在第一次render()之前执行一次，
     * 为第一个render()准备数据(必须同步的)
     */
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList);
    }

    render() {
        /*得到当前请求的路由路径，/home /role /charts/bar...
        this.props.location.pathname 直接使用报错，用 withRouter 包裹类后使用
        */
        let path=this.props.location.pathname;
        if(path.indexOf("/product")===0){   //说明当前请求的是商品或它的子路由，商品的子路由路径也匹配，导航高亮显示
            path="/product";    //解决product子路由导航菜单的高亮显示问题
        }

        // 得到需要打开菜单项的key
        const openKey=this.openKey;
        //console.log("left-nav...render()...", openKey);

        /*保证key唯一，就用路由名称吧
        Link to="/category" 的路由名称要和 admin.jsx-Switch-Route的path值对应
        渲染导航菜单两种方式：注释的为写死的导航，不利于添加，应该用动态生成的方法
        defaultOpenKeys={['sub1']} 默认展开项(有子项的key值)，可以多个,
        selectedKeys={[path]} 当前选中项高亮
        */
        return (
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>后台管理</h1>
                </Link>

                <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                </Button>
                <Menu
                    defaultSelectedKeys={['1']}
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                    /*inlineCollapsed={this.state.collapsed}*/
                >

                    {/*<Menu.Item key="home">
                        <Link to="/home">
                            <PieChartOutlined />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>

                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                                <AppstoreOutlined />
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="category">
                            <Link to="/category">
                                <AppstoreOutlined />
                                <span>品类管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="product">
                            <Link to="/product">
                                <AppstoreOutlined />
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>

                        <SubMenu
                            key="sub3"
                            title={
                                <span>
                                    <AppstoreOutlined />
                                    <span>图形管理</span>
                                </span>
                            }
                        >
                            <Menu.Item key="bar">
                                <Link to="/bar">
                                    <AppstoreOutlined />
                                    <span>柱状图</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="line">
                                <Link to="/line">
                                    <AppstoreOutlined />
                                    <span>折线图</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="pie">
                                <Link to="/pie">
                                    <AppstoreOutlined />
                                    <span>饼图</span>
                                </Link>
                            </Menu.Item>
                        </SubMenu>

                    </SubMenu>

                    <Menu.Item key="user">
                        <Link to="/user">
                            <AppstoreOutlined />
                            <span>用户管理</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="role">
                        <Link to="/role">
                            <AppstoreOutlined />
                            <span>角色管理</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="order">
                        <Link to="/order">
                            <AppstoreOutlined />
                            <span>订单管理</span>
                        </Link>
                    </Menu.Item>*/}

                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        );
    };
}
/**
 * WithRouter 高阶组件：
 * 包装非路由组件, 返回一个新的组件，获得一个类似路由组件的组件
 * 新的组件向非路由组件传递3个属性: history/location/match
 * 这样新的组件就可以使用这3个属性了
 */
export default withRouter(LeftNav)
