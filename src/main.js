import Vue from 'vue'
import App from './App'

import store from './store'
import {ENVPARAM} from './utils/constant'
Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'
// #ifdef H5
/**
 * 当以移动浏览器调试时 开始辅助调试功能
 * 
 */
import eruda from 'eruda'
// import vConsole from 'vconsole'
let initConsole = function() {
  let el = document.createElement('div')
  document.body.appendChild(el)
  eruda.init({
    container: el,
    tool: ['console', 'elements', 'Network', 'Info'],
    useShadowDom: true
  })
}
switch (ENVPARAM) {
  case 'uat':
    initConsole();
    break
  default:
    break
}
// #endif
const app = new Vue({
	store,
	...App
})
app.$mount()
