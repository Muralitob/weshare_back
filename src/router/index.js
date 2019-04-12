import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/user'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/user',
                    component: resolve => require(['../components/page/User.vue'], resolve),
                    meta: { title: '用户列表' }
                },
                {
                    path: '/article',
                    component: resolve => require(['../components/page/Article.vue'], resolve),
                    meta: { title: '文章管理' }
                },
                {
                    path: '/news/list',
                    name: 'articlelist',
                    component: resolve => require(['../components/page/NewsList.vue'], resolve),
                    meta: { title: '新闻资讯列表' }
                },
                {
                    path: '/news/create',
                    component: resolve => require(['../components/page/WriteArticle.vue'], resolve),
                    meta: { title: '新闻资讯创建' }
                },
                {
                    path: '/news/edit/:article_id',
                    name: 'editarticle',
                    component: resolve => require(['../components/page/EditArticle.vue'], resolve),
                    meta: { title: '编辑资讯' }
                },
                {
                    path: '/goods',
                    name: 'goodlist',
                    component: resolve => require(['../components/page/Goods.vue'], resolve),
                    meta: { title: '货物管理' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
