import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 初始化css样式
import '@/styles/reset.less'
// 引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 注册面包屑组件
import Breadcrumb from '@/views/list/components/Breadcrumb.vue'
import * as obj from '@/filters'
Vue.use(ElementUI)
Vue.component('Breadcrumb', Breadcrumb)
Vue.config.productionTip = false
Object.keys(obj).forEach(key => {
  Vue.filter(key, obj[key])
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
