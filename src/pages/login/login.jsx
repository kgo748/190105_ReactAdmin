/**
 * pages 存放路由组件
 * 登陆的路由组件
 * 目录。文件首字母小写，类名首字母大写
 */
import React, {Component} from "react";
import {Redirect} from "react-router-dom";
/*引入antd的官方组件*/
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

/*引入自定义组件*/
//import Form from "../unitcomponents/form";

/*引入自定义的资源*/
import "./login.less";//自定义样式
import logo from "../../assets/images/logo.png";//引入图片
import { reqLogin } from "../../api";//解构写法
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

export default class Login extends Component {
    render() {
        /*如果用户已经登陆，自动跳转到管理界面*/
        const user=memoryUtils.user;
        if(user && user._id){
            return <Redirect to="/" />;
        }

        /*表单提交事件*/
        //await和async总是配对使用，await写在请求函数前面，async，async写在最近包裹请求函数的前面
        //箭头函数一个参数可以不写小括号
        const onFinish =async (values) => {
            //console.log('Received values of form: ', values);//values 包含表单输入值的对象
            const { username, password } = values;//解构取值
            /*try...catch 解决请求如果出错问题，这里封装请求时已经处理*/
            //注意传参的形式，对象或值
            const result=await reqLogin(username, password);
            //console.log(result);
            //console.log(this);//当前组件对象，登陆组件 Login
            if(result.status===0){ //登陆成功
                //提示登陆成功
                message.success("登陆成功...");
                const user=result.data;//用户信息
                memoryUtils.user=user;//当前登陆对象保存在内存中
                storageUtils.saveUser(user);//保存在local中

                //跳转到管理界面(不需要回退到登陆界面用replace，需要用push)
                this.props.history.replace("/");//用在事件回调函数里面，做操作的时候用
            }else { //登陆失败
                //提示登陆错误信息
                message.error(result.msg);
            }
        };

        /*得到具强大功能的from对象*/
        //const form=this.props.form;

        /*密码验证，自定义验证方式，如果官方定义的不合适可自定义验证方式*/
        const validatePwd = (rule, value) => {
            //console.log('validatePwd()', rule, value);
            if (!value) {
                return Promise.reject('密码必须输入');
            }else if (value.length<4) {
                return Promise.reject('密码长度不能小于4位');
            }else if (value.length>12) {
                return Promise.reject('密码长度不能大于12位');
            }else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                return Promise.reject('密码必须是英文、数字或下划线组成'); //reject 验证失败, 并指定提示的文本
            }else {
                return Promise.resolve(); //resolve 验证通过
            }
        };

        return (
          <div className="login">
              <header className="login-header">
                  <img src={logo} alt="logo"/>
                  <h1>React项目：后台管理系统</h1>
              </header>
              <section className="login-content">
                  <h2>用户登陆</h2>
                  <Form
                      name="normal_login"
                      className="login-form"
                      initialValues={{  //设置input框默认值
                          remember: true,
                          //username: "admin",
                          //password: "admin",
                      }}
                      onFinish={onFinish}
                  >
                      <Form.Item
                          name="username"
                          rules={[  // 声明式验证: 直接使用别人定义好的验证规则进行验证
                              { required: true, message: 'Please input your Username!' },
                              { min: 4, message: '用户名至少4位' },
                              { max: 12, message: '用户名最多12位' },
                              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                          ]}
                      >
                          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                      </Form.Item>

                      <Form.Item
                          name="password"
                          rules={[
                              {validator: validatePwd}, //使用自定义验证器，函数定义在class()内用 this.xxx调用
                          ]}
                      >
                          <Input
                              prefix={<LockOutlined className="site-form-item-icon" />}
                              type="password"
                              placeholder="Password"
                          />
                      </Form.Item>

                      <Form.Item>
                          <Form.Item name="remember" valuePropName="checked" noStyle>
                              <Checkbox>Remember me</Checkbox>
                          </Form.Item>

                          <a className="login-form-forgot" href="#!">
                              Forgot password
                          </a>
                      </Form.Item>

                      <Form.Item>
                          <Button type="primary" htmlType="submit" className="login-form-button">
                              Log in
                          </Button>
                          Or <a href="#!">register now!</a>
                      </Form.Item>
                  </Form>
              </section>
          </div>
        );
    }

};
/**
 * 1.前台表单验证
 * 2.收集表单输入数据
 */
/**
 * 高阶函数
 * 高阶组价
 */
/*
包装From组件，生成一个新的组件：From(Login)

*/
//const WrapLogin=Form.create()(Login);
//export default WrapLogin;


