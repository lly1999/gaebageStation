import { createRouter, createWebHashHistory,createWebHistory } from "vue-router";

//1.定义路由组件
import Login from '@/views/Login.vue'
import Home from '@/views/home/Home.vue'
import Content from '@/views/content/Content.vue'
import CarRecord from '@/views/content/components/CarRecord.vue'
import CarDetailInfo from '@/views/content/components/CarDetailInfo.vue'

//2.配置路由映射
const routes = [
    {
        path: '/', component: Login,
        meta: { requestAuth: false }
    },
    {
        path: '/login', component: Login,
        meta: { requestAuth: false }
    },
    {
        name: 'home', path: '/home', component: Home,
        meta: { requestAuth: false },
        children: [{
            name: 'map',
            path: 'map',//子组件的path不以/开头
            component: Home//() => import('@/views/home/components/MapView.vue')
        },
        ]
    },


    {
        name: 'content', path: '/content', component: Content,
        meta: { requestAuth: false },
        children: [
                    {
                name: 'carRecord', path: 'carRecord', component: CarRecord,
                meta: { requestAuth: false },
            },
            {

                name: 'jinniu',
                path: 'jinniu',//子组件的path不以/开头
                component: () => import('@/views/content/components/Jinniu.vue')
            },
            {

                name: 'hongxing',
                path: 'hongxing',//子组件的path不以/开头
                component: () => import('@/views/content/components/Hongxing.vue')
            },
            {
                name: 'xihua',
                path: 'xihua',//子组件的path不以/开头
                component: () => import('@/views/content/components/Xihua.vue')
            },
            {
                name: 'honghuayan',
                path: 'honghuayan',//子组件的path不以/开头
                component: () => import('@/views/content/components/Honghuayan.vue')
            },
            {
                name: 'wukuaishi',
                path: 'wukuaishi',//子组件的path不以/开头
                component: () => import('@/views/content/components/Wukuaishi.vue')
            }, {
                name: 'wulidun',
                path: 'wulidun',//子组件的path不以/开头
                component: () => import('@/views/content/components/Wulidun.vue')
            },{
                name: 'cardetailinfo',
                path: 'cardetailinfo',//子组件的path不以/开头
                component: CarDetailInfo
            },

        ]
    },


]

//3.创建路由实例
const router = createRouter({
    routes,
    // 没有#号
    // history: createWebHistory()
    // 有#号
    history: createWebHashHistory()
})

export default router;

