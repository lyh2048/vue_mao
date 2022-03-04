import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'


Vue.config.productionTip = false
Vue.use(ElementUI)
axios.defaults.baseURL = 'https://service-m70yiwj0-1302758757.gz.apigw.tencentcs.com/release';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
