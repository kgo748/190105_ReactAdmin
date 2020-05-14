/**
 * 添加分类的form组件，使用版本最新，
 * 非路由组件
 */
import React, {useImperativeHandle, useRef, forwardRef} from "react";
import {Form,Select,Input} from "antd";

const Item=Form.Item;//取出来了编码时就不用 Form.Item
const Option=Select.Option;

/*注：props, ref是子组件声明的时候传进来的*/
function AddForm02(props, ref) {
    /*接收父组件的参数*/
    const {categories, parentId}=props;
    console.log("add-from02...", categories,parentId);

    const change=()=>{

    };
    /**
     * useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。
     * 在大多数情况下，应当避免使用 ref 这样的命令式代码。useImperativeHandle 应当与 forwardRef 一起使用：
     * */
    /*1.*/
    const formRef = useRef(null);
    useImperativeHandle(ref, () => ({
        //focus 是子组件暴露的函数
        change: () => {
            formRef.current.change = function () {
                console.log("AddForm02...useImperativeHandle...change()...");
            };
        }
    }));



    const onFinish = values => {
        console.log('Received values of form: ', values);
    };

    /*
    Option的key不能掉;
    2.ref={formRef}
    <Option value='0'>一级分类</Option> 默认添加的一级分类，parentId默认为 0
    */
    return (
        <Form
            ref={formRef}
            name="normal_login"
            className="add-form"
            onFinish={onFinish}
            initialValues={{ firstCategoryId: parentId }}
        >
            <Item name="firstCategoryId">
                <Select>
                    <Option value='0'>一级分类</Option>
                    {
                        categories.map(c=>(
                            <Option key={c._id} value={c._id}>{c.name}</Option>
                        ))
                    }
                </Select>
            </Item>
            <Item
                name="categoryName"
                rules={[{ required: true, message: '请输入分类名称！' }]}
            >
                <Input placeholder="请输入分类名称..."/>
            </Item>
        </Form>
    );
}
/*3.最后要配合forwardRef*/
export default forwardRef(AddForm02);
