import React,{ Component } from "react";
import {Button, Card, message, Table, Modal, Pagination} from "antd";
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';


import {reqCategories,reqAddCategory,reqUpdateCategory} from "../../api/index";
import LinkButton from "../../components/link-button/index";
import AddForm from "./add-form";
import UpdateForm from "./update-form";

/*分类路由，更新添加from是使用的组件*/
export default class Category extends Component {

    state={
        loading: false, //是否正在请求中
        categories: [],//一级分类列表数据
        subCategories: [],//二级分类列表数据
        parentId: "0",//当前需要显示的分类列表数据的parentId
        parentName: "",//当前需要显示的分类列表的父分类名称
        showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
        updateCategoryValue: "", //要修改的分类的名称
    };

    /*初始化table所有列的数组*/
    initColumns=()=>{
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',// 显示数据对应的属性名
                key: 'name',
            },
            {
                title: '操作',
                key: 'action',
                width: 300,
                render: (category) => ( // 返回需要显示的界面标签，category 每行的数据对象
                    <span>
                        <LinkButton>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数: 先定义一个匿名函数 ()=>{this.getCaegories(category)}, 在函数调用处理的函数并传入数据*/}
                        <LinkButton onClick={() => this.showSubCategories(category)}>查看子分类</LinkButton>
                    </span>
                )
            },
        ];
    };
    /*异步获取分类列表数据(一级，二级)*/
    getCategories=async ()=>{
        //在请求数据前，显示loading
        this.setState({loading: true});

        //发送异步ajax请求获取数据
        const parentId=this.state.parentId;//默认是一级分类id为 "0"
        const result=await reqCategories(parentId);
        //请求结束后，隐藏loading
        this.setState({loading: false});

        if(result.status===0){  //请求成功
            //取出分类数组数据(可能是一级的，也可能是二级的)
            const categories=result.data;
            //console.log("category...getCaegories()...", categories);
            //更新状态
            if(parentId==="0"){ //更新一级分类数据的状态
                this.setState({
                    categories,
                });
            }else { //更新二级分类数据的状态
                this.setState({
                    subCategories: categories,
                });
            }
        }else {
            message.error("获取分类列表失败");
        }
    };
    /*显示的是 指定一级分类对象的二级分类列表数据(查询一级分类的子分类)*/
    showSubCategories=(category)=>{
        //console.log("category...getCategories()...category...", category);//category对象，表格一行数据的属性对象

        //先更新状态，它是异步的，后面使用时它还没改过来呢，所以使用回调函数解决
        this.setState({
            parentId: category._id,//将 parentId 该为当前父对象的 _id
            parentName: category.name,//父对象名称
        }, ()=>{
            //console.log("category...getCategories()...parentId...", this.state.parentId);//
            //回调函数会在状态更新且重新render()后执行
            //获取二级分类列表数据
            this.getCategories();
        });
        //此时在setState()不能立即获取最新的状态，因为setState()是异步更新状态的
        //console.log("category...getCategories()...parentId...", this.state.parentId);//"0"
    };
    /*显示指定的一级分类数据列表*/
    showCategories=()=>{
        //更新为显示一级列表数据时的状态
        this.setState({
            parentId: "0",
            parentName: "",
            subCategories: [],
        });
    };


    /*响应点击取消, x号， 模态框: 就隐藏Modal框*/
    handleCancel = () => {
        // 清除输入数据

        this.setState({
            showStatus: 0,
        });
    };
    /*展示添加界面Modal*/
    showAdd=()=>{
        this.setState({
            showStatus: 1,
        });
    };
    /*添加分类确定事件*/
    addCategory=()=>{
        //console.log("addCategory");
        //隐藏确认框
        this.setState({
           showStatus: 0,
        });
        //收集数据，并提交添加分类的请求
        //const {}=this.form;
        console.log("category...addCategory():", this.form);
        //清除表单的输入数据

        //重新获取分类数据列表并显示

    };
    /*展示更新界面Modal*/
    showUpdate=(category)=>{
        //保存要修改的分类对象，直接保存为当前组件对象的 category 属性，后面直接this.category使用
        this.category=category;
        //console.log("category...showUpdate()...category: ", category);
        //更新状态
        this.setState({
            showStatus: 2,
        });
    };
    /*更新分类事件*/
    updateCategory=()=>{
        //console.log("updateCategory");
        //1.隐藏确定框
        this.setState({
            showStatus: 0,
        });

        //准备数据，前面的showUpdate()方法里已经保存了category
        const categoryId=this.category._id;//当前修改的分类对象的id
        console.log("category...", categoryId, this.state.updateCategoryValue);
        console.log("category...", categoryId, this.props.form);

        //2.发请求更新分类
        /*const result=reqUpdateCategory({categoryId,categoryName});
        if(result.status===0) {
            //3.重新显示列表

        }*/
    };
    /*修改分类名称，传递给子组件的函数*/
    updateCategoryValue=(value)=>{
        //console.log("category...updateCategoryValue...", value);
        this.setState({
            updateCategoryValue: value
        });
    };

    /*为第一次render()准备数据，没初始化好啊？？？
    * componentWillMount(){} 报：componentWillMount has been renamed，因为版本的原因，改为：
    */
    //err???
    /*componentWillMount() {
        this.initColumns();
    }*/
    /*默认第一个执行的就是你；执行异步任务: 发异步ajax请求*/
    componentDidMount() {
        // 获取一级分类列表显示
        this.getCategories();
    }

    //ok
    columnsTest = [
        {
            title: '分类的名称',
            dataIndex: 'name',// 显示数据对应的属性名
            key: 'name',
        },
        {
            title: '操作',
            key: 'action',
            width: 300,
            render: (category) => ( // 返回需要显示的界面标签，category 每行的数据对象
                <span>
                    <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
                    {/*如何向事件回调函数传递参数: 先定义一个匿名函数 ()=>{this.getCaegories(category)}, 在函数调用处理的函数并传入数据*/}
                    {this.state.parentId==="0" ?
                        <LinkButton onClick={() => this.showSubCategories(category)}>查看子分类...</LinkButton> : null}
                </span>
            )
        },
    ];



    render() {
        const {loading,categories,subCategories,parentId,parentName,showStatus}=this.state;
        //console.log(this.state);
        //读取指定的分类
        //如果还没有就指定一个空对象，不然html结构里读取会报错
        const category=this.category || {};

        const columnsTest=this.columnsTest;

        //Card的左侧，注意比较多时用了括号()包起来
        const title=parentId==="0" ? "一级分类列表" : (
            <span>
                <LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight: 5}} />
                <span>{parentName}</span>
            </span>
        );
        //Card的右侧，按钮和图标的组合
        const extra=(
            <Button type="primary" onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        );


        /*
        visible={showStatus===1} 判断，结果为true就显示
        setForm={(form) => {this.form = form}} 小括号form为子组件传递过来的from对象，赋值给当前对象
        */
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    dataSource={parentId==="0" ? categories : subCategories}
                    columns={columnsTest}
                    rowKey="_id"
                    loading={loading}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    {/*传递数据*/}
                    <AddForm
                        categories={categories}
                        parentId={parentId}
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    getContainer={false}
                >
                    {/*组件间通信父组件传递数据 category.name 到子组件 update-form02.jsx*/}
                    {/*<UpdateForm
                        categoryName={category.name}
                        setForm={(form)=>{this.form=form}}
                        updateCategoryValue={this.updateCategoryValue}
                    />*/}
                </Modal>
            </Card>
        );
    }
}
