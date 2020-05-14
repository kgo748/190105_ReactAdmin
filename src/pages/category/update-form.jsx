/**
 * 更新分类的form组件，使用版本最新，
 * 非路由组件
 */
import React, {Component} from "react";
import {Form,Input} from "antd";
import PropTypes from "prop-types";

const Item=Form.Item;//取出来了编码时就不用 Form.Item

export default class UpdateForm extends Component{
    /*接收父组件的传值*/
    static propTypes={
        categoryName: PropTypes.string.isRequired,
    };

    render() {
        //读取
        const {categoryName}=this.props;
        console.log("update-from...", categoryName);

        const onFinish = values => {
            console.log('Received values of form: ', values);
        };

        return (
            <Form
                initialValues={{ categoryName: categoryName }}
                className="add-form"
                onFinish={onFinish}
            >
                <Item
                    name="categoryName"
                    rules={[{ required: true, message: '请输入分类名称！' }]}
                >
                    <Input/>
                </Item>
            </Form>
        );
    }
}

