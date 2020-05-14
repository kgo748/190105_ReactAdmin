/**
 * Product 组件的详情子路由组件
 */
import React,{Component} from "react";
import {Card,List} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";

import LinkButton from "../../components/link-button";
import {BASE_IMG_URL} from "../../utils/constants";
import {reqCategory} from "../../api/index";

const Item=List.Item;

export default class ProductDetail extends Component {
    state={
        cName1: "",//一级分类名称
        cName2: "",//二级分类名称
    };

    async componentDidMount() {
        //pCategoryId: 当前商品的分类的父id,categoryId：当前商品的分类id
        const {pCategoryId,categoryId}=this.props.location.state.product;
        if(pCategoryId==="0"){  //一级分类下的商品
            const result=await reqCategory(pCategoryId);
            const cName1=result.data.name;
            this.setState({cName1});
        }else {  //二级分类下的商品
            /*推荐传递单个参数，查询接口是一个单参 categoryId，传递对象麻烦，查询父分类时得这样写：
            const result1=await reqCategory({categoryId: pCategoryId});相应的接口里参数的形式也得修改为对象的形式
            */
            /*const result1=await reqCategory(pCategoryId);
            const result2=await reqCategory(categoryId);
            //console.log(pCategoryId,categoryId,result1,result2);
            const cName1=result1.data.name;
            const cName2=result2.data.name;
            this.setState({cName1,cName2});*/

            // 一次性发送多个请求, 只有都成功了, 才正常处理
            const results=await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)]);
            const cName1 = results[0].data.name;
            const cName2 = results[1].data.name;
            this.setState({
                cName1,
                cName2
            });
        }
    }

    render() {
        /*读取携带过来的state数据*/
        const {name,desc,price,detail,imgs}=this.props.location.state.product;//***父组件传递的是对象，解构取值
        const {cName1,cName2}=this.state;

        const title=(
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        style={{color: "green", marginRight: 15, fontSize: 20}}
                        onClick={()=>{this.props.history.goBack()}}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        );

        /*<span dangerouslySetInnerHTML={{__html: "<h1>哈哈，标签里面不能有内容哦...</h1>"}}></span> 可以解析标签
        */
        return(
            <Card title={title} className='product-detail'>
                <List
                    bordered
                    //dataSource={data}
                >
                    <Item>
                        <span className="left">商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格：</span>
                        <span>{price}</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类：</span>
                        <span>{cName1}--{cName2}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片：</span>
                        <span>
                            <img
                                className="product-img"
                                src="http://img12.360buyimg.com/n7/jfs/t1/121499/19/1089/85373/5eb95795E3b707fe2/a86a96c17f6e7d42.jpg"
                                alt="img"
                                style={{width: 110, height:110}}
                            />
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        src={BASE_IMG_URL}
                                        className="product-img"
                                        alt="img"
                                    />
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
