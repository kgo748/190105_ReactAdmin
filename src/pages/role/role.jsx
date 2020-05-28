/**
 * 角色路由
 * 类组件，提取 add-from，使用父组件调用子组件方法的形式实现需求
 */
import React,{ Component } from "react";
import {Card, Button,message,Table, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles} from "../../api";
import AddForm from "./add-form";

export default class Role extends Component {
    constructor (props) {
        super(props);

        //父组件调用子组件的方法
        this.addForm = React.createRef();
    }

    state={
        roles: [],//角色数组
        role: {}, // 选中的role
        loading: false, //是否显示加载动画
        isShowAdd: false,// 是否显示添加页面
    };

    initColumn=()=>{
        /*组件挂载前 保存到当前对象里*/
        this.columns=[
            {
                title: "角色名称",
                dataIndex: "name",
            },
            {
                title: "创建时间",
                dataIndex: "create_time",
            },
            {
                title: "授权时间",
                dataIndex: "auth_time",
            },
            {
                title: "授权人",
                dataIndex: "auth_name",
            },
        ];
    };

    /*Table 当前行的事件，注意函数IT用小括号()括起来了
    onRow={
        (role) => ({
            onClick: () => {
                this.setState({role});
                console.log(role);
            },
        })
    }*/
    onRow=(role)=>({ //role: 当前行数据对象
        //console.log("role...onRow()...role:", role);//err
        //当前行的可执行多个事件
        onClick: ()=>{ // 点击Table行事件
            //console.log("role...onRow()...role:", role);//ok
            //设置state的里role为当前行role对象，配合rowSelection的使用，点击当前行选中radio
            this.setState({role});
        },
        onDoubleClick: event => {},
        onContextMenu: event => {},
        onMouseEnter: event => {}, // 鼠标移入行
        onMouseLeave: event => {},
    });

    /*关闭Modal*/
    closeModal=()=>{
        this.setState({isShowAdd: false});
    };
    /*打开Modal*/
    openModal=()=>{
        this.setState({isShowAdd: true});
    };

    /*获取所有角色列表数据*/
    getRoles=async ()=>{
        const result=await reqRoles();
        if(result.status===0){
            const roles=result.data;
            //更新状态
            this.setState({
                roles,
            });
        }
    };

    /*添加角色，Modal底部确定按钮事件*/
    addRole=()=>{
        //调用子组件的方法
        const roleName=this.addForm.current.getRoleName();
        console.log("product...role...addRole()...roleName: ", roleName);
        //判断是否有值
        if(!roleName || roleName=="" || roleName==undefined){
            //没有值，进行提示
            message.error("请输入角色名称");
        }else {
            //有值，关闭Modal
            this.closeModal();
            //并发送请求

        }

        //进行添加操作

    };

    componentWillMount() {
        this.initColumn();
    }

    componentDidMount() {
        this.getRoles();
    }

    render() {
        //读取状态state里的数据
        const {roles,role,loading,isShowAdd}=this.state;

        const title=(
            <span>
                <Button
                    type="primary"
                    //style={{marginRight: 10}}
                    onClick={()=>{this.setState({isShowAdd: true})}}
                >
                    <PlusOutlined/>
                    创建角色
                </Button>&nbsp;&nbsp;
                {/*有 _id 可操作，true-不可操作，false-可操作*/}
                <Button type="primary" disabled={!role._id}>
                    设置角色授权
                </Button>
            </span>
        );

        return (
            <Card title={title}>
                <Table
                    bordered
                    columns={this.columns}
                    dataSource={roles}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                    rowSelection={{ //antd v4 单选框选择在函数组件里有全新的写法
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => { // 选择某个radio时回调
                            //console.log("role...render()...rowSelection()...onSelect()...role: ", role);
                            this.setState({
                                role
                            });
                        },
                    }}
                    onRow={this.onRow}
                />
                <Modal
                    title="创建角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={()=>{
                        this.setState({isShowAdd: false});//隐藏模态框
                    }} //*Modal 底部的确定和取消事件*/
                >
                    {/*传递数据到子组件，用子组件的方式收集数据，在antd4的类组件中不行*/}
                    <AddForm ref={this.addForm}/>
                </Modal>
            </Card>
        );
    }
}
