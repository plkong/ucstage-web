import Main from '../views/index.vue'
import Abstract from '../views/layout/abstract.vue'
import Home from '../views/home/home.vue'
import Login from '../views/login.vue'
import CategoryAdd from '../views/category-add.vue'
import CategoryMgr from '../views/category-mgr.vue'
import GoodsAdd from '../views/goods-add.vue'
import GoodsMgr from '../views/goods-mgr.vue'
import Table from '../views/table/table.vue'

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: Login
}

export const categoryAddRouter = {
    path: '/category-add',
    name: 'category-add',
    meta: {
        title: '新增种类'
    },
    component: CategoryAdd
}

export const categoryMgrRouter = {
    path: '/category-mgr',
    name: 'category-mgr',
    meta: {
        title: '新增种类'
    },
    component: CategoryMgr
}

export const goodsAddRouter = {
    path: '/goods-add',
    name: 'goods-add',
    meta: {
        title: '新增种类'
    },
    component: GoodsAdd
}

export const goodsMgrRouter = {
    path: '/goods-mgr',
    name: 'goods-mgr',
    meta: {
        title: '新增种类'
    },
    component: GoodsMgr
}

export const appRouter = [{
        title: '首页',
        path: '/home',
        name: 'home',
        icon: 'fa fa-home fa-lg',
        component: Home
    },
    {
        title: '分类管理',
        path: '/content',
        name: 'content',
        icon: 'fa fa-home fa-lg',
        component: Abstract,
        children: [{
                title: '新增',
                name: 'categoryAdd',
                path: 'categoryAdd',
                icon: 'ios-paper',
                component: CategoryAdd
            },
            {
                title: '管理',
                name: 'categoryMgr',
                path: 'categoryMgr',
                icon: 'images',
                component: CategoryMgr
            }
        ]

    },
    {
        title: '产品管理',
        path: '/user',
        name: 'user',
        icon: 'fa fa-home fa-lg',
        component: Abstract,
        children: [{
                title: '新增产品',
                name: 'goodsAdd',
                path: 'goodsAdd',
                icon: 'fa fa-home fa-lg',
                component: GoodsAdd
            },
            {
                title: '查看产品',
                name: 'goodsMgr',
                path: 'goodsMgr',
                icon: 'fa fa-home fa-lg',
                component: GoodsMgr
            }
        ]
    },
    {
        title: '统计分析',
        path: '/statistics',
        name: 'statistics',
        icon: 'fa fa-home fa-lg',
        component: Abstract,
        children: [{
                title: '新增和启动',
                name: 'stats_new',
                path: 'new',
                icon: 'fa fa-home fa-lg',
                component: Login
            },
            {
                title: '活跃分析',
                name: 'stats_activated',
                path: 'activated',
                icon: 'fa fa-home fa-lg',
                component: Table
            },
            {
                title: '时段分析',
                name: 'stats_time',
                path: 'time',
                icon: 'fa fa-home fa-lg',
                component: Table
            },
            {
                title: '用户留存',
                name: 'retention',
                path: 'retention',
                icon: 'fa fa-home fa-lg',
                component: Table
            },
            {
                title: '流失用户',
                name: 'churn',
                path: 'churn',
                icon: 'fa fa-home fa-lg',
                component: Table
            }
        ]

    }

]

export const mainRouter = {
    path: '/',
    redirect: '/home',
    name: 'index',
    component: Main,
    children: appRouter
}

export const routers = [
    loginRouter,
    mainRouter,
    categoryAddRouter,
    categoryMgrRouter,
    goodsAddRouter,
    goodsMgrRouter,
    // catch all redirect
    { path: '*', redirect: '/home' }

]