/**
 * 角色添加组件
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input, message
} from 'antd'

const Item = Form.Item;

export default class AddForm extends Component {
    state={
        roleName: "",//角色名称
    };

    /*实时健康input框的变化*/
    inputChange=(event)=>{
        // console.log("product...AddForm...", event, event.target.value);
        this.setState({roleName: event.target.value});
    };

    /*err,使用自定义验证器时在看你个纸条提示报错，input框下并没有提示错误的信息；角色名称的自定义验证器*/
    /*validateRoleName=(rule, value)=>{
        console.log('validateRoleName()', rule, value);
        if (!value) {
            return Promise.reject('角色名称必须输入');
        }else {
            return Promise.resolve(); //resolve 验证通过
        }
    };*/

    /*供父组件调用的方法*/
    getRoleName=()=>{
        const roleName=this.state.roleName;
        return roleName;
    };

    /*此处不用 rules 验证，因为input为空时提示的错误在 再次进入时还会显示上一次提示的错误
    */
    render() {
        return (
            <Form
                name="addForm"
                initialValues={{ roleName: ""}}
            >
                <Item
                    name="roleName"
                    label="角色名称"
                    /*rules={[
                        {required: true, message: "角色名称必须输入"}
                    ]}*/
                >
                    <Input placeholder='请输入角色名称' onChange={this.inputChange}/>
                </Item>
            </Form>
        )
    }
}

