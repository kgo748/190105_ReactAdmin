/*
添加分类的form组件，版本较旧，有些方法官方都不支持了；
项目使用插件都是最新的，此与此项目不搭
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

export default class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        categories: PropTypes.array.isRequired, // 一级分类的数组
        parentId: PropTypes.string.isRequired, // 父分类的ID
    };

    componentWillMount () {
        this.props.setForm(this.addForm);
    }

    test=()=>{
        console.log(this.addForm);
        console.log(this.addForm.getFieldValue("categoryName"));
    };

    render() {
        const {categories, parentId, setForm} = this.props;
        //console.log(typeof setForm);//function

        return (
            <Form
                name="addForm"
                initialValues={{ categoryName: ""}}
                ref={Form=>this.addForm=Form}
            >
                <Item>
                    <Select  defaultValue={parentId}>
                        <Option value='0'>一级分类</Option>
                        {
                            categories.map(c => <Option key={c._id} value={c._id}>--{c.name}</Option>)
                        }
                    </Select>
                </Item>
                <Item
                    name="categoryName"
                    rules={[
                        { required: true, message: '分类名称必须输入！' },
                    ]}
                >
                    <Input placeholder='请输入分类名称'/>
                </Item>
                <p onClick={this.test}>点击</p>
            </Form>
        )
    }
}

