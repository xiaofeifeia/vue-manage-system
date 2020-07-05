import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../page/403.vue'),
                    meta: { title: '403' }
                }, {
                    path: '/user',
                    component: () => import('../page/User.vue'),
                    meta: { title: '用户管理' }
                }, {
                    path: '/brand',
                    component: () => import('../page/goods/Brand.vue'),
                    meta: { title: '品牌管理' }
                }, {
                    path: '/category1',
                    component: () => import('../page/category/Category1.vue'),
                    meta: { title: '一级分类' }
                }, {
                    path: '/category2',
                    component: () => import('../page/category/Category2.vue'),
                    meta: { title: '二级分类' }
                }, {
                    path: '/category3',
                    component: () => import('../page/category/Category3.vue'),
                    meta: { title: '三级分类' }
                }, {
                    path: '/template',
                    component: () => import('../page/goods/Template.vue'),
                    meta: {
                        title: '模板管理'
                    }
                }, {
                    path: '/spec',
                    component: () => import('../page/goods/Spec.vue'),
                    meta: {
                        title: '规格列表'
                    }
                }, {
                    path: '/para',
                    component: () => import('../page/goods/Para.vue'),
                    meta: {
                        title: '参数列表'
                    }
                }, {
                    path: '/addGoodsCategory',
                    component: () => import('../page/goods/AddGoodsCategory.vue'),
                    meta: {
                        title: '添加商品分类'
                    }
                }, {
                    path: '/addGoodsInfo',
                    component: () => import('../page/goods/AddGoodsInfo.vue'),
                    meta: {
                        title: '添加商品信息'
                    }
                }, {
                    path: '/addGoodsAttr',
                    component: () => import('../page/goods/AddGoodsAttr.vue'),
                    meta: {
                        title: '添加商品属性'
                    }
                }, {
                    path: '/goods',
                    component: () => import('../page/goods/Goods.vue'),
                    meta: {
                        title: '商品列表'
                    }
                }, {
                    path: '/goodsAudit',
                    component: () => import('../page/goods/GoodsAudit.vue'),
                    meta: {
                        title: '商品审核'
                    }
                }, {
                    path: '/goodView',
                    component: () => import('../page/goods/GoodsView.vue'),
                    meta: {
                        title: '商品查看'
                    }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
