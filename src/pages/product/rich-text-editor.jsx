/**
 * 指定商品详情的富文本编辑器组件；
 * 需使用第三方库：react-draft-wysiwyg, draftjs-to-html ,
 * github查找使用方法，安装执行：
 * npm install --save react-draft-wysiwyg draft-js ,
 * npm install --save draftjs-to-html ;
 *
 */
import React,{Component} from "react";
import PropTypes from "prop-types";
//react的富文本编辑器，依赖于 react
import { Editor } from 'react-draft-wysiwyg';
//引入 react-draft-wysiwyg 样式文件的2种方法，二选一即可：
//import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import {EditorState, convertToRaw, ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


export default class RichTextEditor extends Component {
    static propTypes={
        detail: PropTypes.string,
    };

    state = {
        editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
    };

    constructor(props) {
        super(props);

        const html = this.props.detail;//接收父组件的传值，detail={product.detail}
        if (html) { // 如果有值(更新操作), 根据html格式字符串创建一个对应的编辑对象
            const contentBlock = htmlToDraft(html);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            }
        } else {     // 如果没有值(添加操作)
            this.state = {
                editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
            }
        }
    }

    /*监听事件，文本框变化时被调用(输入过程中实时回调)*/
    onEditorStateChange = (editorState) => {
        //console.log("rich-text-editor...onEditorStateChange()...editorState: ", editorState);//对象{xxx}
        this.setState({
            editorState,
        });
    };

    /*返回输入数据对应的html格式的文本,供父组件 add-update 的调用*/
    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    };

    /*富文本编辑器 图片上传函数；标题一定要写，不然点击 add 会失败*/
    uploadImageCallBack = (file) => { //file:当前上传的图片文件对象
        console.log("rich-text-editor...uploadImageCallBack()...file: ", file);
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    const url = response.data.url; // 得到图片的url
                    resolve({data: {link: url}})
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        )
    };

    render() {
        const { editorState } = this.state;

        return (
            <div>
                <Editor
                    editorState={editorState}
                    // wrapperClassName="demo-wrapper" //通过类名的方式编写样式
                    // editorClassName="demo-editor"
                    editorStyle={{border: "1px solid black", minHeight: 200, paddingLeft: 10}}//直接写行内样式
                    onEditorStateChange={this.onEditorStateChange}  //绑定监听
                    toolbar={{      //图片上传
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
            </div>
        )
    }

}
