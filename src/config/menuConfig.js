/**
 * 菜单导航数据
 */
import {PieChartOutlined} from "@ant-design/icons";
import React from "react";
const menuList = [
    {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的path
        icon: <PieChartOutlined />, // 图标名称
        isPublic: true, // 公开的
    },
    {
        title: '商品',
        key: '/products',
        icon: <PieChartOutlined />,
        children: [ // 子菜单列表
            {
                title: '品类管理',
                key: '/category',
                icon: <PieChartOutlined />,
            },
            {
                title: '商品管理',
                key: '/product',
                icon: <PieChartOutlined />,
            },
        ]
    },

    {
        title: '用户管理',
        key: '/user',
        icon: <PieChartOutlined />,
    },
    {
        title: '角色管理',
        key: '/role',
        icon: <PieChartOutlined />,
    },

    {
        title: '图形图表',
        key: '/charts',
        icon: <PieChartOutlined />,
        children: [
            {
                title: '柱形图',
                key: '/charts/bar',
                icon: <PieChartOutlined />,
            },
            {
                title: '折线图',
                key: '/charts/line',
                icon: <PieChartOutlined />,
            },
            {
                title: '饼图',
                key: '/charts/pie',
                icon: <PieChartOutlined />,
            },
        ]
    },

    {
        title: '订单管理',
        key: '/order',
        icon: <PieChartOutlined />,
    },
];
export default menuList;
