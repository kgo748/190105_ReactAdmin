/**
 * Product 组件的默认子路由组件
 */
import React,{Component} from "react";

import {Card, Select, Input, Button, Table, message} from "antd";
import {PlusOutlined} from '@ant-design/icons';

import LinkButton from "../../components/link-button/index";
import {reqProducts,reqSearchProducts,reqUpdateStatus} from "../../api/index";
import {PAGE_SIZE} from "../../utils/constants";

const Option=Select.Option;

export default class ProductHome extends Component {
    state={
        products: [],//商品的数组
        total: 0,//商品的总数量
        loading: false,//是否正在加载中
        searchName: "",//搜索的关键字
        searchType: "productName",//根据哪个字段搜索，默认根据商品名称来搜索
    };

    /*初始化表格数据的列的数组*/
    initColumns=()=>{
        //存入到this当前对象中
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const {status, _id} = product;
                    const newStatus = status===1 ? 2 : 1;//修改原来的状态
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >
                                {status===1 ? '下架' : '上架'}
                            </Button>
                            <span>{status===1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            {/*利用函数组件传值，是否只用于路由跳转呢？？？；将product对象使用state传递给目标路由组件，或直接向子组件传值*/}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    };

    /*更新指定商品的状态*/
    updateStatus=async (productId, status)=>{
        const result=await reqUpdateStatus(productId,status);
        if(result.status===0){
            message.success("更新商品的状态成功");//提示信息
            this.getProducts(this.pageNum);//重新渲染当前页码的数据
        }
    };

    /*获取指定页码的列表数据显示*/
    getProducts=async (pageNum)=>{
        this.pageNum=pageNum;//保存当前分页页码到当前对象，后面修改商品状态重新渲染页面时要用

        this.setState({loading: true});//显示loading
        const {searchName,searchType}=this.state;
        let result;
        if(searchName){ //如果搜索关键字有值，做搜索分页
            result=await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType});
        }else { //一般分页请求
            result=await reqProducts(pageNum, PAGE_SIZE);
        }
        this.setState({loading: false});//隐藏loading

        if(result.status===0){
            //去除分页数据，更新状态，显示列表
            const {total,list}=result.data;
            //更新状态
            this.setState({
                total,
                products: list,
            });
        }
    };

    componentWillMount() {
        this.initColumns();
    }
    componentDidMount() {
        this.getProducts(1);
    }

    render() {
        const {products,total,loading,searchType,searchName}=this.state;

        const title=(
            <span>
                <Select
                    style={{width: 120}}
                    defaultValue={searchType}
                    onChange={value=>this.setState({searchType: value})}/*根据文档来，这里传的value*/
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    placeholder="关键字"
                    value={searchName}
                    style={{width: "200px", margin: "0 15px"}}
                    onChange={event => this.setState({searchName: event.target.value})}/*根据文档来，这里传的event*/
                />
                {/*这里得包一层函数*/}
                <Button type="primary" onClick={()=>{this.getProducts(1)}}>搜索</Button>
            </span>
        );

        const extra=(
            //点击跳转到更新添加页面
            <Button type="primary" onClick={()=>this.props.history.push("./product/addupdate")}>
                <PlusOutlined/>
                添加商品
            </Button>
        );

        return(
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    columns={this.columns}
                    dataSource={products}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}
