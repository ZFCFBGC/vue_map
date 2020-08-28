import Vue from 'vue';
import App from './App';
import router from './router';

/* 初始化CSS, 公共类样式*/
import "@/assets/css/base.css";

//工具类函数
import Tools from "@/assets/js/tools.js";
//console.log('工具',Tools)

//请求封装函数
import client from "@/assets/js/client.js";
Vue.prototype.$client = client;



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  beforeCreate() {
    window.Tools = Tools
  }
})
