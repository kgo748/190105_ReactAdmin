/**
 * 项目根目录新建此文件，实现按需打包
 */
const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(
    /*针对antd实现按需打包，根据import来打包(使用babel-plugin-import)，只打包已使用的样式*/
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true, //自动打包相关样式
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {'@primary-color': '#1DA57A'},//定制主题
    }),
);