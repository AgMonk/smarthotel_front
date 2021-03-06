<template>
  <div>
    <el-container>
      <el-row>
        <el-col :span="3">
          <el-input v-model="param.pageData.type" clearable placeholder="类型"/>
        </el-col>
        <el-col :span="3">
          <el-input v-model="param.pageData.keyword" clearable placeholder="关键字"/>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="findPage(param.pageData)">查询</el-button>
        </el-col>
        <el-col :span="2">
          <!--          <el-button @click="param.permissions=[];dialogFormVisible.create=true;">添加</el-button>-->
        </el-col>

      </el-row>
      <el-main>
        <el-table :data="data">
          <el-table-column prop="id" label="ID" width="80px"/>
          <el-table-column prop="username" label="用户名"/>
          <el-table-column prop="name" label="昵称"/>
          <el-table-column label="角色">
            <template slot-scope="scope">
              <el-tag v-for="(item,i) in scope.row.roles" :key="i">{{ item.remark }}</el-tag>
            </template>
          </el-table-column>
          <!--          <el-table-column prop="tel" label="电话"/>-->
          <!--          <el-table-column prop="email" label="邮箱"/>-->
          <!--          <el-table-column prop="createDatetime" label="注册时间"/>-->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary"
                         @click="dialogFormVisible.edit=true;param.edit = JSON.parse(JSON.stringify(scope.row));">修改
              </el-button>
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


    <el-dialog title="修改角色" :visible.sync="dialogFormVisible.edit" width="90%">
      <el-form ref="form" :model="param.edit" label-width="120px">
        <el-form-item>
          <el-row>
            <el-col :span="12">
              <el-table :data="param.edit.roles">
                <el-table-column label="持有角色" prop="remark"/>
                <el-table-column label="移除">
                  <el-button slot-scope="scope" @click="param.edit.roles.splice(scope.$index,1)" type="danger">移除
                  </el-button>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12">
              <el-table :data="roles">
                <el-table-column label="角色" prop="remark" :filters="filters.roles"
                                 :filter-method="filters.rolesFilter"/>
                <el-table-column label="添加">
                  <el-button slot-scope="scope" @click="param.edit.roles.push(scope.row)" type="primary">添加</el-button>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form-item>


        <el-form-item>
          <el-button @click="edit(param.edit)" type="success">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
import {exists} from "../../../../assets/js/utils";
import getData from "../../../../assets/js/getData";
import req from "../../../../assets/js/req";

export default {
  name: "userManage",
  data() {
    return {
      dialogFormVisible: {
        create: false,
        edit: false,
      },
      param: {
        edit: {roles: []},
        pageData: {
          page: 1,
          pageSize: 10,
          type: undefined,
          keyword: undefined,
        },
      },
      roles: [],
      data: [{id: 1, name: "name", remark: "备注"}],
      total: 50,
      keyPrefix: "user",
      filters: {
        roles: [
          {text: '权限管理', value: '权限管理'},
        ],
        rolesFilter: (value, row, column) => row.remark.includes(value),
      },

    }
  },
  methods: {
    test(e) {
      console.log(e)
    },
    success: function (res) {
      this.$message(res.message)
      if (res.code !== 2000 && exists(res.data)) {
        this.$message(res.data.join(" & "))
      }
    },
    findAllRoles() {
      getData(false, "roles", 60, req, {url: "/authority/role/findAll"}).then(res => {
        if (res.code === 2000) {
          let data = res.data;
          data.forEach(item => {
          })
          this.roles = data;
        }
      })
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
    del(id) {
      if (!confirm("确认删除角色？")) {
        return;
      }
      let key = JSON.stringify(this.param.pageData);
      req({
        url: "/authority/{prefix}/del".format({prefix: this.keyPrefix}),
        data: {id: id},
        success: this.success
      }).then(res => {
        if (res.code === 2000) {
          sessionStorage.removeItem(this.keyPrefix + " " + key);
          this.dialogFormVisible.edit = false;
          this.findPage(this.param.pageData);
        }
      })
    },
    edit({id, roles}) {
      if (!confirm("确认修改角色信息？")) {
        return;
      }
      let arg = {};
      arg.id = id;
      arg.hasRoles = roles.map(item => item.id);
      delete arg.permissions;
      let key = JSON.stringify(this.param.pageData);
      req({
        url: "/authority/{prefix}/edit".format({prefix: this.keyPrefix}),
        data: arg,
        success: this.success
      }).then(res => {
        if (res.code === 2000) {
          sessionStorage.removeItem(this.keyPrefix + " " + key);
          this.dialogFormVisible.edit = false;
          this.findPage(this.param.pageData);
        }
      })
    }
  },
  mounted() {
    this.findPage(this.param.pageData);
    this.findAllRoles();
  },
}
</script>

<style scoped>

</style>
