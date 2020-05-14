/**
 * Product 组件的添加和更新的子路由组件
 */
import React,{Component} from "react";
import {Form,Input,Cascader,Card,Button,message} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";

import LinkButton from "../../components/link-button/index";
import {reqCategories,reqAddOrUpdateProduct} from "../../api/index";
import PicturesWall from "./pictures-wall";

const {Item}=Form;
const { TextArea } = Input;

export default class ProductAddUpdate extends Component {
    /*options = [
        {
            value: 'zhejiang',
            label: 'Zhejiang',
            isLeaf: false,
        },
        {
            value: 'jiangsu',
            label: 'Jiangsu',
            isLeaf: false,
        },
    ];*/

    state = {
        options: [],
    };

    constructor (props) {
        super(props);

        // 父组件调用子组件的方法步骤1：创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef();
    }

    /*初始化 Cascader的options数组*/
    initOptions=async (categories)=>{
        //根据 categories 生成options数组
        const options=categories.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false,  //不是叶子
        }));

        //如果是一个二级分类商品的更新
        const {isUpdate,product}=this;
        const {pCategoryId}=product;
        if(isUpdate && pCategoryId!=="0"){  //说明是一个二级分类商品的更新
            //获取对应的二级分类列表
            const subCategories=await this.getCategories(pCategoryId);
            //生成二级下拉列表options
            const childOptions =subCategories.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true,  //是叶子
            }));

            //找到当前商品对应的一级options对象
            const targetOption=options.find(option => option.value===pCategoryId);
            //关联到对应的记忆options上
            targetOption.children=childOptions;
        }
        //console.log(options);

        //并更新options状态
        this.setState({options});
    };

    /*异步获取一级/二级分类列表, 并显示
      async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定*/
    getCategories=async (parentId)=>{
        const result=await reqCategories(parentId);//获取分类信息
        if(result.status===0){
            const categories=result.data;
            //如果是一级分类列表
            if(parentId==="0"){
                this.initOptions(categories);
            }else { //二级列表
                return categories;  // 返回二级列表数据 ==> 当前async函数返回的promsie就会成功且value为categorys
            }
        }
    };

    /*Cascader change事件，此处用不着*/
    onChange = (value, selectedOptions) => {
        //value: 选中的值以数组形式存放，selectedOptions：数组形式存放的option对象
        //console.log("add-update...", value, selectedOptions,selectedOptions[0].value,selectedOptions[0].label);
    };

    /*Cascader 级联选择 数据加载，选中时执行*/
    loadData = selectedOptions => {
        //console.log("add-update...selectedOptions: ", selectedOptions);//selectedOptions：数组形式存放的option对象
        // 得到选择的option对象
        //const targetOption = selectedOptions[selectedOptions.length - 1];
        const targetOption = selectedOptions[0];

        // 显示loading
        targetOption.loading = true;
        // 实现懒加载效果
        setTimeout(async ()=>{
            // 根据选中的分类, 请求获取二级分类列表
            const subCategories = await this.getCategories(targetOption.value);
            // 隐藏loading
            targetOption.loading = false;

            if(subCategories && subCategories.length>0){
                const childOptions =subCategories.map(c=>({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,  //是叶子
                }));
                // 关联到当前option上
                targetOption.children = childOptions;
            }else { //当前选中的分类没有二级分类
                targetOption.isLeaf=true;
            }

            //更新options状态
            this.setState({
                options: [...this.state.options],
            });
        },200);
    };

    /*表单数据提交*/
    onFinish = async values => {
        console.log('add-update...form...values: :', values);//表单所有的数据对象
        // 1. 收集数据, 并封装成product对象
        const {name, desc, price, categoryIds,detail} = values;
        let pCategoryId, categoryId;
        if (categoryIds.length===1) {
            pCategoryId = '0';
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0];
            categoryId = categoryIds[1];
        }
        /*父组件调用子组件的方法步骤3：读取子组件里的方法*/
        const imgs = this.pw.current.getImgs();

        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId};

        // 如果是更新, 需要添加_id
        if(this.isUpdate) {
            product._id = this.product._id;
        }
        console.log("add-update...product: ", product);

        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product);

        // 3. 根据结果提示
        if (result.status===0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`);
            this.props.history.goBack()
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`);
        }

    };

    /*验证价格的自定义验证器函数，自定义验证器建议写在render()外*/
    validatePrice=(rule, value)=>{
        //console.log(rule,value,typeof value);
        if (value*1 > 0) {
            return Promise.resolve(); //resolve 验证通过
        }else {
            return Promise.reject('价格必须大于0');// 验证没通过
        }
    };

    /*render()后执行*/
    componentDidMount() {
        this.getCategories("0");
    }

    /*render()之前执行依次*/
    componentWillMount() {
        //取出携带的state(接收父组件的传值)(如果是更新父组件就会传递一个商品product数据过来，添加父组件就没有值传递)
        const product=this.props.location.state;//如果是添加就没值，否则有值(更新)
        //保存是否更新的标识
        this.isUpdate=!!product;
        //***保存商品的值，如果没有就配置为 空对象{}
        this.product=product || {};
    }

    render() {
        //更新操作时的 取值
        const {isUpdate,product}=this;
        const {pCategoryId,categoryId,imgs}=product;
        //用来接收级联分类id的数组
        const categoryIds=[];
        if(isUpdate){
            //商品是一个一级分类的商品
            categoryIds.push(categoryId);
        }else {
            //商品是一个二级分类的商品
            categoryIds.push(pCategoryId);
            categoryIds.push(categoryId);
        }
        //console.log(pCategoryId,categoryId,categoryIds);

        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },// 左侧label的宽度
            wrapperCol: { span: 8 },// 右侧包裹的宽度
        };
        const tailLayout = {
            wrapperCol: { offset: 2, span: 8 },
        };

        /*Card*/
        const title=(
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        style={{color: "green", marginRight: 15, fontSize: 20}}
                        onClick={()=>{this.props.history.goBack()}}
                    />
                </LinkButton>
                <span>{isUpdate ? "修改商品" : "添加商品"}</span>
            </span>
        );

        /* input框的name属性不能掉，否则onFinish无法获取到值
        */
        return(
            <Card title={title}>
                <Form
                    {...formItemLayout}
                    onFinish={this.onFinish}
                    initialValues={{ //设置input框默认值
                        name: product.name,
                        desc: product.desc,
                        price: product.price,
                        imgs: product.imgs,
                        detail: product.detail,
                        categoryIds: categoryIds    /*注意属性是：categoryIds*/
                    }}
                >
                    <Item
                        name="name"
                        label="商品名称"
                        rules={[
                            { required: true, message: '商品名称必须输入' },
                            { min: 1, message: '商品名称至少1个字' },
                        ]}
                    >
                        <Input placeholder="请输入商品名称"/>
                    </Item>
                    <Item
                        name="desc"
                        label="商品描述"
                        rules={[
                            { required: true, message: '商品描述必须输入' },
                            { min: 2, message: '商品描述至少2个字' },
                        ]}
                    >
                        <TextArea rows={4} autoSize={{ minRows: 2, maxRows: 6 }} placeholder="请输入商品描述" />
                    </Item>
                    <Item
                        name="price"
                        label="商品价格"
                        rules={[
                            { required: true, message: '商品价格必须输入' },
                            { validator: this.validatePrice },   //自定义验证器
                        ]}
                    >
                        <Input type="number" placeholder="请输入商品价格" addonAfter="元"/>
                    </Item>
                    <Item
                        name="categoryIds"
                        label="商品分类"
                        rules={[
                            { required: true, message: '商品分类必须选择' },
                        ]}
                    >
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                            onChange={this.onChange}
                            changeOnSelect
                            placeholder="请选择分类"
                        />
                    </Item>
                    <Item
                        name="imgs"
                        label="商品图片"
                    >
                        {/*imgs={imgs}，更新时把imgs传递给子组件*/}
                        {/*父组件调用子组件的方法步骤2：ref={this.pw}*/}
                        <PicturesWall  ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item
                        name="detail"
                        label="商品详情"
                    >
                        <Input placeholder="请输入商品详情"/>
                    </Item>
                    <Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
父组件调用子组件的方法，使用ref：
1. 创建ref容器: this.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
 */
