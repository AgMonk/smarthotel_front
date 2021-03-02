import Vue from 'vue'
import Router from 'vue-router'
import me from "../components/mainTab/me";
import home from "../components/mainTab/home";
import authority from "../components/mainTab/authority";

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect:"/home"},
    {path: '/me', component: me},
    {path: '/home', component: home},
    {path: '/authority', component: authority},

  ]
})
