import Vue from 'vue'
import Router from 'vue-router'
import me from "../components/mainTab/me";
import home from "../components/mainTab/home";
import authority from "../components/mainTab/authority";
import hotelEntity from "../components/mainTab/hotelEntity";
import hotelEntity2 from "../components/mainTab/hotelEntity2";
import device from "../components/device";

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect:"/home"},
    {path: '/me', component: me},
    {path: '/home', component: home},
    {path: '/authority', component: authority},
    {path: '/hotelEntity', component: hotelEntity},
    {path: '/hotelEntity2', component: hotelEntity2},
    {path: '/device', component: device},
  ]
})
