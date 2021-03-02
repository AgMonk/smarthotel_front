<template>
  <div :style="backgroundImg">
    <!--    未登录-->
    <el-container v-if="!authenticated">
      <el-main>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-tabs v-model="mode" type="border-card" @tab-click="">
              <el-tab-pane label="登陆" name="登陆">
                <el-row>
                  <el-col :span="6" :offset="3">
                    <el-button plain style="width: 100%">用户名</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="param.login.username" tabindex="1" clearable/>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6" :offset="3">
                    <el-button plain style="width: 100%">密码</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="param.login.password" type="password" show-password tabindex="2" clearable/>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20" :offset="2">
                    <el-button type="primary" tabindex="3" @click="login">登陆</el-button>
                    <el-button type="primary" @click="clearLoginParam">重置</el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-link type="primary">忘记密码</el-link>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="注册" name="注册">
                <el-row>
                  <el-col :span="6" :offset="3">
                    <el-button plain style="width: 100%">用户名</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="param.reg.username" tabindex="11" clearable/>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6" :offset="3">
                    <el-button plain style="width: 100%">密码</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-input v-model="param.reg.password" type="password" show-password tabindex="12" clearable/>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20" :offset="2">
                    <el-button type="primary" tabindex="3" @click="reg">注册</el-button>
                    <el-button type="primary" @click="clearRegParam">重置</el-button>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <!--    已登录-->
    <el-container v-if="authenticated" direction="vertical">
      <el-main>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form ref="form" :model="userInfo" label-width="80px" style="background-color: white">
              <el-form-item>
              </el-form-item>
              <el-form-item label="用户ID">
                {{ userInfo.id }}
              </el-form-item>
              <el-form-item label="用户名">
                {{ userInfo.username }}
              </el-form-item>
              <el-form-item label="昵称">
                <el-col :span="18" :offset="3">
                  <el-input v-model="userInfo.name" clearable/>
                </el-col>
              </el-form-item>
              <el-form-item label="注册时间">
                {{ userInfo.createDatetime }}
              </el-form-item>
              <el-form-item label="上次登录">
                {{ userInfo.lastLoginDatetime }}
              </el-form-item>
              <el-form-item label="角色">
                {{ userInfo.roles!==undefined?userInfo.roles.join(", "):undefined}}
              </el-form-item>
              <el-form-item label="电话">
                <el-col :span="18" :offset="3">
                  <el-input v-model="userInfo.tel" clearable/>
                </el-col>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-col :span="18" :offset="3">
                  <el-input v-model="userInfo.email" clearable/>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="edit">保存</el-button>
              </el-form-item>
              <el-form-item>
              </el-form-item>


            </el-form>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <el-button type="danger" @click="logout">登出</el-button>
        <el-button type="success" @click="dialogFormVisible.pwd = true">修改密码</el-button>
      </el-footer>
    </el-container>
    <!--    修改密码弹出框-->
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible.pwd" width="60%">
          <el-container>
            <el-main>
              <el-row>
                <el-col>
                  <el-input v-model="param.pwd.oldPwd" show-password clearable placeholder="旧密码"
                            autocomplete="off"
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-input v-model="param.pwd.newPwd" show-password clearable placeholder="新密码"
                            autocomplete="off"
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-button type="danger" @click="editPwd">修改密码</el-button>
                </el-col>
              </el-row>
            </el-main>
          </el-container>
        </el-dialog>
  </div>
</template>

<script>
import req from "../../assets/js/req";
import {exists} from "../../assets/js/utils";
import getData from "../../assets/js/getData";

let emptyLoginParam = {username: undefined, password: undefined,}
let emptyRegParam = {username: undefined, password: undefined}
let emptyPass = {oldPwd: undefined, newPwd: undefined}

export default {
  name: "me",
  data() {
    return {
      dialogFormVisible:{
        pwd:false,
      },
      mode: "登陆",
      param: {
        login: Object.assign({}, emptyLoginParam),
        reg: Object.assign({}, emptyRegParam),
        pwd: Object.assign({}, emptyPass),
      },
      //登陆状态
      authenticated: false,
      backgroundImg: {
        backgroundImage: "url(" + require("../../assets/img/bg.jpg") + ")",
      },
      userInfo: {},
    }
  },
  methods: {
    success: function (res) {
      this.$message(res.message)
      if (res.code !== 2000 && exists(res.data)) {
        this.$message(res.data.join(" & "))
      }
    },
    editPwd(){
      req({url:"/user/editPwd",params:this.param.pwd,success: this.success}).then(res=>{
        console.log(res)
        if (res.code === 2000) {
          this.param.pwd =Object.assign({}, emptyPass);
          this.dialogFormVisible.pwd = false
          this.status();
        }
      })
    },
    edit() {
      let data = {};
      data.tel = this.userInfo.tel;
      data.email = this.userInfo.email;
      data.name = this.userInfo.name;
      req({url: "/user/edit", data: data, success: this.success}).then(res => {
        console.log(res)
        sessionStorage.removeItem("userInfo")
      })
    },
    info() {
      getData(false, "userInfo", 10, req, {url: "/user/info", success: this.success})
        .then(res => {
          if (res.code === 2000) {
            this.userInfo = res.data;
          }
        })
    },
    reg() {
      req({
        url: "/user/reg", data: this.param.reg, success: this.success
      }).then(res => {
        if (res.code === 2000) {
        } else if (exists(res.data)) {
          this.$message(res.data.join(" & "))
        }
      })
    },
    logout() {
      req({
        url: "/user/logout", success: res => {
          this.$message(res.message)
          this.authenticated = false
          sessionStorage.clear();
          localStorage.clear();
        }
      })
    },
    login() {
      req({
        url: "/user/login", data: this.param.login, success: this.success
      }).then(res => {
        if (res.code === 2000) {
          this.info();
          this.authenticated = true;
        }
      })
    },
    clearRegParam() {
      this.param.reg = Object.assign({}, emptyRegParam);
    },
    clearLoginParam() {
      this.param.login = Object.assign({}, emptyLoginParam)
    },
    status(){
      req({
        url: "/user/status",
        success: res => {
          this.$message(res.message)

        }
      }).then(res => {
        if (res.code === 2000) {
          this.info();
          this.authenticated = true;
        }else{
          this.authenticated = false;
          sessionStorage.clear();
          localStorage.clear();
        }
      })
    }
  },
  mounted() {
    console.clear()
   this.status()
  }
}
</script>

<style scoped>

</style>
