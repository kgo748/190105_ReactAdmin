import React,{ Component, useRef, useState, useEffect, forwardRef } from "react";
import {Button, Card, message, Table, Modal, Pagination} from "antd";
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';


import {reqCategories,reqAddCategory,reqUpdateCategory} from "../../api/index";
import LinkButton from "../../components/link-button/index";
import AddForm02 from "./add-form02";
import UpdateForm02 from "./update-form02";

/*分类路由，更新添加from是使用的  函数组件*/
const Category02=()=>{
    /*定义状态*/
    const [state, setState]=useState({
        loading: false, //是否正在请求中
        categories: [],//一级分类列表数据
        subCategories: [],//二级分类列表数据
        parentId: "0",//当前需要显示的分类列表数据的parentId
        parentName: "",//当前需要显示的分类列表的父分类名称
        showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
        updateCategoryValue: "", //要修改的分类的名称
        category: {},//参数，每行记录对象
        columns: [],//表格列项
    });

    /*初始化table所有列的数组*/
    //ok
    const intiColumnsTest=(parentId)=>{
        const columnsTest = [
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
                    <LinkButton onClick={()=>showUpdate(category)}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数: 先定义一个匿名函数 ()=>{getCaegories(category)}, 在函数调用处理的函数并传入数据*/}
                        {parentId==="0" ?
                            <LinkButton onClick={() => showSubCategories(category)}>查看子分类...</LinkButton> : null}
                </span>
                )
            },
        ];
        return columnsTest;
    };

    /*异步获取分类列表数据(一级，二级)*/
    const getCategories=async (parentId)=>{
        //在请求数据前，显示loading
        setState({...state, loading: true});

        //发送异步ajax请求获取数据
        //默认是一级分类id为 "0"
        const result=await reqCategories(parentId);
        //请求结束后，隐藏loading
        setState({...state, loading: false});

        if(result.status===0){  //请求成功
            //取出分类数组数据(可能是一级的，也可能是二级的)
            const categories=result.data;
            //console.log("category...getCategories()...", categories);

            //更新状态
            if(parentId==="0"){ //更新一级分类数据的状态
                setState({
                    ...state,
                    categories,
                });
            }else { //更新二级分类数据的状态
                setState({
                    ...state,
                    subCategories: categories,
                });
            }
        }else {
            message.error("获取分类列表失败");
        }
    };

    /*有时候，我们只想在 React 更新 DOM 之后运行一些额外的代码。
    比如发送网络请求，手动变更 DOM，记录日志，这些都是常见的无需清除的操作。
    因为我们在执行完这些操作之后，就可以忽略他们了。
    */
    useEffect(() => {
        let parentId=state.parentId;
        //调用函数
        (async ()=>{
            await getCategories(parentId);
        })();
    }, []);//使用的参数在中括号中必不可少
    useEffect(()=>{
        let parentId=state.parentId;
        const columnsTest=intiColumnsTest(parentId);
        //console.log(columnsTest);
        setState({...state, columns: columnsTest});
    },[]);

    /*显示的是 指定一级分类对象的二级分类列表数据(查询一级分类的子分类)*/
    const showSubCategories=(category)=>{
        //console.log("category...getCategories()...category...", category);//category对象，表格一行数据的属性对象

        //先更新状态，它是异步的，后面使用时它还没改过来呢，所以使用回调函数解决
        setState({
            ...state,
            parentId: category._id,//将 parentId 改为当前父对象的 _id
            parentName: category.name,//父对象名称
        }, async ()=>{
            //console.log("category...getCategories()...parentId...", this.state.parentId);//
            //回调函数会在状态更新且重新render()后执行
            //获取二级分类列表数据
            await getCategories();
        });
        //此时在setState()不能立即获取最新的状态，因为setState()是异步更新状态的
        //console.log("category...getCategories()...parentId...", this.state.parentId);//"0"
    };


    /*显示指定的一级分类数据列表*/
    const showCategories=()=>{
        //更新为显示一级列表数据时的状态
        setState({
            ...state,
            parentId: "0",
            parentName: "",
            subCategories: [],
        });
    };

    /*响应点击取消, x号， 模态框: 就隐藏Modal框*/
    const handleCancel = () => {
        setState({
            ...state,
            showStatus: 0,
        });
    };
    /*展示添加界面Modal*/
    const showAdd=()=>{
        setState({
            ...state,
            showStatus: 1,
        });
    };
    /*添加分类确定事件*/
    const addCategory=()=>{
        //console.log("addCategory");
        //隐藏确认框
        setState({
            ...state,
            showStatus: 0,
        });
        //收集数据，并提交添加分类的请求
        //const {}=this.form;
        console.log("category...addCategory():",);
        //清除表单的输入数据

        //添加的分类就是当前分类列表下的分类
        //重新获取分类数据列表并显示

    };

    /*展示更新界面Modal*/
    const showUpdate=(category)=>{
        //保存要修改的分类对象，直接保存为当前组件对象的 category 属性，后面直接this.category使用
        this.category=category;
        //console.log("category...showUpdate()...category: ", category);
        //更新状态
        setState({
            ...state,
            showStatus: 2,
        });
    };

    /*更新分类事件*/
    const updateCategory=()=>{
        //console.log("updateCategory");
        //1.隐藏确定框
        setState({
            ...state,
            showStatus: 0,
        });

        //准备数据，前面的showUpdate()方法里已经保存了category
        const categoryId=this.category._id;//当前修改的分类对象的id
        console.log("category...", categoryId, this.state.updateCategoryValue);
        //console.log("category...", categoryId, this.props.form);

        //2.发请求更新分类
        /*const result=reqUpdateCategory({categoryId,categoryName});
        if(result.status===0) {
            //3.重新显示列表

        }*/
    };

    /*修改分类名称，传递给子组件的函数*/
    const updateCategoryValue=(value)=>{
        //console.log("category...updateCategoryValue...", value);
        setState({
            ...state,
            updateCategoryValue: value
        });
    };

    //Card的左侧，注意比较多时用了括号()包起来
    const title=state.parentId==="0" ? "一级分类列表" : (
        <span>
            <LinkButton onClick={showCategories}>一级分类列表</LinkButton>
            <ArrowRightOutlined style={{marginRight: 5}} />
            <span>{state.parentName}</span>
        </span>
    );
    //Card的右侧，按钮和图标的组合
    const extra=(
        <Button type="primary" onClick={showAdd}>
            <PlusOutlined />
            添加
        </Button>
    );

    console.log(state);

    /*
    visible={showStatus===1} 判断，结果为true就显示
    */
    return (
        <Card title={title} extra={extra}>
            <Table
                bordered
                dataSource={state.categories}
                columns={state.columns}
                rowKey="_id"
                loading={state.loading}
            />
            <Modal
                title="添加分类"
                visible={state.showStatus===1}
                onOk={addCategory}
                onCancel={handleCancel}
            >
                {/*传递数据*/}
                {/*<AddForm02
                    categories={categories}
                    parentId={parentId}
                    //setForm={(form) => {this.form = form}}
                />*/}

            </Modal>
            <Modal
                title="更新分类"
                visible={state.showStatus===2}
                onOk={updateCategory}
                onCancel={handleCancel}
                getContainer={false}
            >
                {/*组件间通信父组件传递数据 category.name 到子组件 update-form02.jsx*/}
                {/*<UpdateForm02
                    categoryName={category.name}
                    //setForm={(form)=>{this.form=form}}
                    //updateCategoryValue={this.updateCategoryValue}
                />*/}
            </Modal>
        </Card>
    );

};
export default forwardRef(Category02);
