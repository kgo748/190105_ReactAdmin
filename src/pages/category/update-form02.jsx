/**
 * 更新分类的form组件，使用版本最新，
 * 非路由组件
 * 因为 useForm 是 React Hooks 的实现，只能用于函数组件，所以这是一个函数组件
 */
import React,{useState, useEffect} from "react";
import {Form,Input} from "antd";

const Item=Form.Item;//取出来了编码时就不用 Form.Item

/*函数组件*/
const UpdateForm02=(props)=>{
    //console.log(props);//props 父组件传递过来的数据(对象)
    //读取组件传递给子组件的值
    const {categoryName, updateCategoryValue, setForm}=props;
    //console.log("update-from02...categoryName: ", categoryName, updateCategoryValue);
    //console.log("update-from02...setForm: ", setForm);

    /**一个点，自己研究
     * Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。
     * 在函数组件中，我们没有 this，所以我们不能分配或读取 this.state。
     * 我们直接在组件中调用 useState Hook：
     */
    //返回一个 state(useState里放的什么形式的就返回什么形式的数据)，以及更新 state 的函数。
    const [categoryNameState, setCategoryNameState] = useState({"categoryName": categoryName?categoryName:""});//不能写在回调函数里
    //console.log("update-form02...categoryNameState1: ", categoryNameState);


    /**
     * antd v3->v4
     * 通过 Form.useForm 对表单数据域进行交互。
     * 注意 useForm 是 React Hooks 的实现，只能用于函数组件
     */
    //回显默认值
    const [form] = Form.useForm();
    //console.log("update-from02...from: ", form);
    /*相当于 componentDidMount 和 componentDidUpdate:*/
    useEffect(() => {
        //设置表单属性的值
        form.setFieldsValue({
            categoryName: categoryName,
        });
    }, [categoryName, form]);//一定要注意中括号的传值

    const onFinish = values => {
        console.log('Received values of form: ', values);

    };

    /*input框的change事件*/
    const inputChange=(ev)=>{
        //console.log("update-form02...value: ", ev, ev.target.value);
        //input框的值发生改变更新state状态
        let value=ev.target.value;
        //console.log(typeof value, ev.target.name, categoryNameState.categoryName);//string 上一个categoryNameState里的categoryName的值
        setCategoryNameState({
            "categoryName": value
        });
        /****状态更新后会重新渲染render()，导致这里输出的还是上一次的值，但setXXX不支持回调函数，所以在useEffect里解决*/
        //console.log("update-form02...categoryNameState2: ", categoryNameState);
        //updateCategoryValue(value);//方式1：可直接把input框的值传给父组件，不必使用useState的形式
    };
    useEffect(()=>{
        //console.log("update-form02...categoryNameState2: ", categoryNameState);//当前input框状态的值
        console.log("update-form02...props: ", props, props.setForm);
        //方式2：使用useState的形式，？？？？？陷入死循环了
        //报：index.js:1 Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
        props.updateCategoryValue(categoryNameState.categoryName);

        //props.setForm(props.setForm);
    }, [updateCategoryValue, props]);

    return (
        <Form
            form={form}
            //name="control-hooks"
            className="update-form"
            onFinish={onFinish}
        >
            <Item
                name="categoryName"
                rules={[{ required: true, message: '请输入分类名称！' }]}
            >
                <Input onChange={inputChange}/>
            </Item>
            <Item
                name="testName"
                rules={[{ required: true, message: '请输入测试数据！' }]}
            >
                <Input placeholder="测试值"/>
            </Item>
            <p>{categoryNameState.categoryName}</p>
        </Form>
    );
};
export default UpdateForm02;
