/**
 * 角色路由,
 * 类组件，不提取 add-from，没有子组件; ok
 */
import React,{ Component } from "react";
import {Card, Button, Form, Input, Table, Modal,message} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import {PAGE_SIZE} from "../../utils/constants";
import {reqRoles,reqAddRole} from "../../api";


export default class Role extends Component {
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
            console.log("role...onRow()...role:", role);//ok
            //设置state的里role为当前行role对象，配合rowSelection的使用，点击当前行选中radio
            this.setState({role});
        },
        onDoubleClick: event => {},
        onContextMenu: event => {},
        onMouseEnter: event => {}, // 鼠标移入行
        onMouseLeave: event => {},
    });

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

    /*关闭Modal*/
    closeModal=()=>{
        this.setState({isShowAdd: false});
    };
    /*打开Modal*/
    openModal=()=>{
        this.setState({isShowAdd: true});
    };

    formRef = React.createRef();
    //清空Modal的Input框
    clearModalInput=()=>{
        this.formRef.current.resetFields();
    };

    /*提交表单，即添加角色*/
    onFinish = async values => {
        // console.log(values);
        this.clearModalInput();
        this.closeModal();
        const result=await reqAddRole(values.roleName);
        if(result.status===0){
            message.success("创建角色成功");
            //重新加载Table数据
            this.getRoles();
        }else {
            message.error("创建角色失败");
        }
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

        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        const tailLayout = {
            wrapperCol: { offset: 4, span: 16 },
        };

        const title=(
            <span>
                <Button
                    type="primary"
                    //style={{marginRight: 10}}
                    //onClick={()=>{this.setState({isShowAdd: true})}}  //直接在行内定义方法打开
                    onClick={this.openModal}   /*调用方法打开*/
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
                    rowSelection={{ //antd v4 单选框选择在函数组件里有全新的写法
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        /*onSelect: (role) => { // 选择某个radio时回调
                            this.setState({
                                role
                            });
                        },*/
                    }}
                    onRow={this.onRow}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />
                <Modal
                    title="创建角色"
                    visible={isShowAdd}
                    footer={null}  /*去掉Modal的底部*/
                >
                    <Form
                        {...layout}
                        ref={this.formRef}
                        onFinish={this.onFinish}
                    >
                        <Form.Item name="roleName" label="角色名称" rules={[{ required: true, message: "角色名称必须输入" }]}>
                            <Input placeholder="请输入角色名称" />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit" style={{marginRight: 30}}>
                                提交
                            </Button>
                            <Button onClick={()=>{this.setState({isShowAdd: false})}}>
                                取消
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        );
    }
}
