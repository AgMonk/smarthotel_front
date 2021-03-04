<template>
  <div>
    <el-menu class="el-menu-demo" mode="horizontal"
             :default-active="$route.path"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b"
             @select="select($event)"
    >
      <el-menu-item v-for="(item,i) in navi"
                    :index="i"
                    :key="'navi'+i"
      >
        <span class="tab">{{ item }}</span>
      </el-menu-item>
      <!--      <el-menu-item >-->
      <!--        <span @click="clear" class="tab">清除缓存</span>-->
      <!--      </el-menu-item>-->
    </el-menu>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "navi",
  methods: {
    clear() {
      if (confirm("清除缓存?")) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      }
    },
    select(e) {
      if (e !== undefined && e !== null) {
        window.location.href = "#" + e;
      }
    },
  },
  data() {
    return {
      activeIndex: 0,
      navi: {
        '/home': '主页',
        '/hotelEntity': '楼层管理',
        '/authority': '权限管理',
        '/me': '我的',
      },
      selected: '主页',
    }
  },
  mounted() {
  },
  watch:{
    "$route":{
      handler(route){
        console.clear();
        axios.post("/api/user/status").then(res => {
          if (res.data.code !== 2000) {
            window.location.href = "#/me";
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.tab {
  cursor: pointer;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
