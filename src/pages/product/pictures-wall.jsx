/**
 * 照片墙，用于图片上传的组件
 */
import React from "react";
import { Upload, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";

import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL2} from "../../utils/constants";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {

    static propTypes={
        imgs: PropTypes.array,  //imgs 不一定有值，比如添加操作
    };

    state = {
        previewVisible: false, //标识是否显示大图预览Modal
        previewImage: '',   //大图的url
        previewTitle: '',   //标题
        fileList: [
            /*{
                uid: '-1',          //每个file都有自己唯一的id
                name: 'image.png',  //图片文件名
                status: 'done',     //图片状态，done：已上传，uploading:正在上传中，removed：已删除
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },*/
        ],
    };

    /*imgs 不一定有值，比如添加操作，所以推荐在constructor里写，可以进行一些操作*/
    constructor(props){
        super(props);

        //默认给一个空数组
        let fileList = [];
        // 如果传入了imgs属性(接收父组件 add-update(<PicturesWall imgs={imgs}/>) 的传值)
        const {imgs} = this.props;
        if (imgs && imgs.length>0) {
            //根据 imgs 生成一个 fileList
            fileList = imgs.map((img, index) => ({
                uid: -index, // 每个file都有自己唯一的id
                name: img, // 图片文件名
                status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
                url: BASE_IMG_URL2 + img
            }));
        }

        // 初始化状态
        this.state = {
            previewVisible: false, // 标识是否显示大图预览Modal
            previewImage: '', // 大图的url
            fileList // 所有已上传图片的数组
        };
    }

    /*获取所有已上传图片文件名的数组,constructor方法里有设置state的状态；供父组件 add-update 的调用*/
    getImgs  = () => {
        return this.state.fileList.map(file => file.name);
    };

    /*隐藏Modal*/
    handleCancel = () => this.setState({ previewVisible: false });

    /*图片预览*/
    handlePreview = async file => {
        //显示指定file对应的图片的大图预览
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        //在操作过程(上传，删除)中更新fileList的状态
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    /*file: 当前操作的图片文件(上传/删除),fileList: 所有已上传图片文件对象的数组*/
    handleChange = async ({ file,fileList }) => {
        //console.log("PicturesWall...handleChange()...", file,file.status,fileList,fileList.length);
        /*通过 file.status 来判断用户所进行的操作*/
        // 一旦上传成功, 将当前上传的file的信息修正(name, url)
        if(file.status==='done') {
            const result = file.response;  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
            if(result.status===0) {
                message.success('上传图片成功!');
                const {name, url} = result.data;
                file = fileList[fileList.length-1];
                file.name = name;
                file.url = url;
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status==='removed') { // 删除图片
            const result = await reqDeleteImg(file.name);
            if (result.status===0) {
                message.success('删除图片成功!');
            } else {
                message.error('删除图片失败!');
            }
        }

        this.setState({ fileList });
    };

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"     /*上传图片的接口地址*/
                    accept="image/*"        /*只接收图片格式*/
                    name="image"
                    listType="picture-card" /*卡片样式*/
                    fileList={fileList}     /*已上传文件的列表*/
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                {/*图片放大预览*/}
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

