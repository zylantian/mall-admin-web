import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router/routers'
import store from './store'
import dict from './components/Dict'
import vRegion from 'v-region'
import './router/index' // permission control


import '@/icons' // icon


Vue.use(ElementUI, { locale })
Vue.use(VCharts)
Vue.use(dict)
Vue.use(vRegion)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
