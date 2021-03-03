<template>
  <div>
    <el-container>
      <el-row>
        <el-col :span="3">
          <el-input v-model="param.pageData.type" clearable placeholder="类型" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="param.pageData.keyword" clearable placeholder="关键字" />
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="findPage(param.pageData)">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="dialogFormVisible.create=true">添加</el-button>
        </el-col>

      </el-row>
      <el-main>
        <el-table :data="data" >
          <el-table-column prop="id" label="ID" width="80px" />
          <el-table-column prop="username" label="用户名"/>
          <el-table-column prop="name" label="名称"/>
          <el-table-column prop="tel" label="电话"/>
          <el-table-column prop="email" label="邮箱"/>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="dialogFormVisible.editRoles=true;param.editRoles = scope.row;">修改角色</el-button>
              <!--              <el-button type="danger">删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="param.pageData.pageSize"
          :current-page="param.pageData.page"
          @current-change="param.pageData.page=$event;findPage(param.pageData)"
        >
        </el-pagination>
      </el-footer>
    </el-container>

    <el-dialog title="修改角色" :visible.sync="dialogFormVisible.editRoles">
      <el-form ref="form" :model="param.editRoles" label-width="120px">
        <el-form-item label="ID">{{param.editRoles.id}}</el-form-item>
        <el-form-item label="名称">
          <el-input v-model="param.editRoles.name"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="param.editRoles.remark"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="edit(param.editRoles)" type="success">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
import {exists} from "../../../assets/js/utils";
import getData from "../../../assets/js/getData";
import req from "../../../assets/js/req";

export default {
  name: "userManage",
  data() {
    return {
      dialogFormVisible: {
        create: false,
        editRoles: false,
      },
      param: {
        create: {},
        editRoles: {},
        pageData: {
          page: 1,
          pageSize: 10,
          type: undefined,
          keyword: undefined,
        },
      },
      permissions:[],
      data: [{id: 1,  name: "name", remark: "备注"}],
      total:50,
      keyPrefix: "user",
    }
  },
  methods: {
    success: function (res) {
      this.$message(res.message)
      if (res.code !== 2000 && exists(res.data)) {
        this.$message(res.data.join(" & "))
      }
    },
    findPage({page, pageSize, type, keyword}) {
      let arg = arguments[0];
      let key = JSON.stringify(arg);
      getData(false, this.keyPrefix + " " + key, 5
        , req, {url: "/authority/{prefix}/findPage".format({prefix: this.keyPrefix}), data: arg, success: this.success})
        .then(res => {
          if (res.code === 2000) {
            this.data = res.data.data;
            this.total = res.data.totalCount;
          }
        })
    },
    create({permString, remark}) {
      let arg = arguments[0];
      req({
        url: "/authority/{prefix}/create".format({prefix: this.keyPrefix}),
        data: arg,
        success: this.success
      }).then(res => {
        if (res.code === 2000) {
          sessionStorage.clear()
          this.param.create = {};
          this.dialogFormVisible.create = false;
          this.findPage(this.param.pageData);
        }
      })
    },
    edit({id,permString, remark}){
      let arg = arguments[0];
      let key = JSON.stringify(this.param.pageData);
      req({
        url: "/authority/{prefix}/edit".format({prefix: this.keyPrefix}),
        data: arg,
        success: this.success
      }).then(res => {
        if (res.code === 2000) {
          sessionStorage.removeItem(this.keyPrefix + " " + key);
          this.dialogFormVisible.editRoles = false;
          this.findPage(this.param.pageData);
        }
      })
    }
  },
  mounted() {
    this.findPage(this.param.pageData);
    this.findAllPermission();
  },
}
</script>

<style scoped>

</style>
