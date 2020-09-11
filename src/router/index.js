import Vue from 'vue'
import Router from 'vue-router'
import Cookies from "js-cookie";
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const index = ()=>import("@/page/index/index.vue")
const login = ()=>import("@/page/login/login.vue")
const richText = ()=>import("@/page/richText/richText.vue")
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: login,
      meta:{
        title:'物联网卡'
      }
    },
    {
      path: '/index',
      name: 'Index',
      component: index,
      meta:{
        title:'物联网卡'
      },
    },
    {
      path: '/richText',
      name: 'RichText',
      component: richText,
      meta:{
        title:'物联网卡'
      },
    },
    { path: '/', redirect: '/login' }
  ]
})

export default router
