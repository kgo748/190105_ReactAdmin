/**
 * 要求：能根据接口文档定义接口请求
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 *
 * 基本要求：能根据接口文档定义接口函数
 */
/*export default {
    xxx () {

    },
    yyy () {

    },
}*/
import jsonp from "jsonp";
import {message} from "antd";

/*引入自定义模块*/
import ajax from "./ajax";
/*跨域的问题先在package.json配置代理 "proxy": "http://localhost:5000"*/
//const BASE = 'http://localhost:5000';
const BASE = '';

/*登陆*/
/*export function reqLogin (username, password) {
    return ajax("./login", {username, password}, "POST");
}*/
//箭头函数有返回作用？？？
export const reqLogin = (username, password) => ajax(BASE+'/login', {username, password}, 'POST');
//添加用户
export const reqAddUser=(user)=>ajax(BASE+"/manage/user/add", user, "POST");

/*category*/
/*获取一级/二级分类列表接口，封装的函数默认是get请求，这里就省略掉呗*/
export const reqCategories=(parentId)=>ajax(BASE+"/manage/category/list",{parentId});
/*添加分类*/
export const reqAddCategory=(categoryName, parentId)=>ajax(BASE+"/manage/category/add",{categoryName, parentId},"POST");
/*更新分类*/
export const reqUpdateCategory=({categoryId,categoryName})=>ajax(BASE+"/manage/category/update",{categoryId,categoryName},"POST");
/*获取一个分类信息,只能根据pCategoryId或categoryId查询所属信息*/
export const reqCategory=(categoryId)=>ajax(BASE+"/manage/category/info",{categoryId});


/*product*/
/*获取商品分页列表数据，参数为 单个变量*/
export const reqProducts=(pageNum,pageSize)=>ajax(BASE+"/manage/product/list",{pageNum,pageSize});

/*搜索商品分页列表，参数为对象(根据商品名称/商品描述 合并搜索)
searchType: 搜索的类型，productName/productDesc
*/
export const reqSearchProducts=({pageNum,pageSize,searchName,searchType})=>ajax(BASE+"/manage/product/list",{
    pageNum,
    pageSize,
    [searchType]: searchName,//变量名作为属性名的时候需用中括号[],且searchType的值因为接口的原因只能为 productName/productDesc
});
/*搜索商品分页列表，参数为对象(根据商品描述)*/
/*export const reqSearchProducts2=({pageNum,pageSize,searchName})=>ajax(BASE+"/manage/product/list",{
    pageNum,
    pageSize,
    productDesc: searchName,
});*/
/*更新商品的状态(上架或下架操作)，1-在售，2-下架*/
export const reqUpdateStatus=(productId, status)=>ajax(BASE+"/manage/product/updateStatus",{productId, status},"POST");
/*添加/修改商品，通过商品 product对象 是否有 _id来判断进行的是update还是add操作，接口里的判断注意用小括号()括起来*/
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST');

/*删除图片*/
export const reqDeleteImg=(name)=>ajax(BASE + '/manage/img/delete', {name}, "POST");

/*jsonp请求的接口请求函数*/
export const reqWeather=(city)=>{
    //返回promise对象
    return new Promise((resolve,reject)=>{
        //`` 可以解析变量
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        // 发送jsonp请求
        jsonp(url,{},(err,data)=>{
            //console.log(err,data);
            if(!err&&data.status==="success"){
                //取出需要的数据
                const {dayPictureUrl, weather}=data.results[0].weather_data[0];
                resolve({dayPictureUrl, weather});
            }else { //如果失败了
                message.error("获取天气信息失败");
            }
        });
    });
};

