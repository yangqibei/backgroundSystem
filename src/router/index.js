import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 解决重复点击路由时，会报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/views/login') },
  {
    path: '/home',
    redirect: '/home/homeindex',
    component: () => import('@/views/home'),
    children: [
      {
        path: '/home/homeindex', name: 'homeindex', component: () => import('@/views/list/homeindex.vue')
      },
      {
        path: '/home/userList', name: 'userList', component: () => import('@/views/list/userList.vue')
      },
      {
        path: '/home/nameList', name: 'nameList', component: () => import('@/views/list/nameList.vue')
      },
      {
        path: '/home/permissionList', name: 'permissionList', component: () => import('@/views/list/permissionList.vue')
      },
      {
        path: '/home/goodsList', name: 'goodsList', component: () => import('@/views/list/goodsList.vue')
      },
      {
        path: '/home/sortingParameter', name: 'sortingParameter', component: () => import('@/views/list/sortingParameter.vue')
      },
      {
        path: '/home/goodsCategory', name: 'goodsCategory', component: () => import('@/views/list/goodsCategory.vue')
      },
      {
        path: '/home/orderList', name: 'orderList', component: () => import('@/views/list/orderList.vue')
      }
    ]
  },
  { path: '/dataReport', name: 'dataReport', component: () => import('@/views/list/dataReport.vue') }
]

const router = new VueRouter({
  routes
})

export default router
