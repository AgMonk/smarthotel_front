import Vue from 'vue'
import Router from 'vue-router'
import me from "./me";
import home from "./home";

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect:"/home"},
    {path: '/me', component: me},
    {path: '/home', component: home},

  ]
})
