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
          <el-table-column prop="type" label="类型" width="80px" />
          <el-table-column prop="permString" label="权限字符串"/>
          <el-table-column prop="remark" label="备注"/>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="dialogFormVisible.edit=true;param.edit = scope.row;">修改</el-button>
              <el-button type="danger" @click="del(scope.row.id);">删除</el-button>
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

    <el-dialog title="添加权限" :visible.sync="dialogFormVisible.create">
      <el-form ref="form" :model="param.create" label-width="120px">
        <el-form-item label="权限字符串">
          <el-input v-model="param.create.permString"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="param.create.remark"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="param.create = {}" type="danger">重置</el-button>
          <el-button @click="create(param.create)" type="success">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="修改权限" :visible.sync="dialogFormVisible.edit">
      <el-form ref="form" :model="param.edit" label-width="120px">
        <el-form-item label="ID">{{param.edit.id}}</el-form-item>
        <el-form-item label="权限字符串">
          <el-input v-model="param.edit.permString"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="param.edit.remark"/>
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
  name: "permissionManage",
  data() {
    return {
      dialogFormVisible: {
        create: false,
        edit: false,
      },
      param: {
        create: {},
        edit: {},
        pageData: {
          page: 1,
          pageSize: 10,
          type: undefined,
          keyword: undefined,
        },
      },
      data: [{id: 1, type: "2", permString: "permString", remark: "备注"}],
      total:50,
      keyPrefix: "permission",
    }
  },
  methods: {
    success: function (res) {
      this.$message(res.message)
      if (res.code !== 2000 && exists(res.data)) {
        this.$message(res.data.join(" & "))
      }
    },
    del(id){
      if (!confirm("确认删除权限？")) {
        return ;
      }
      let key = JSON.stringify(this.param.pageData);
      req({url: "/authority/{prefix}/del".format({prefix: this.keyPrefix}), data: {id:id}, success: this.success}).then(res =>{
        if (res.code === 2000) {
          sessionStorage.removeItem(this.keyPrefix + " " + key);
          this.dialogFormVisible.edit = false;
          this.findPage(this.param.pageData);
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
    create({permString, remark}) {
      let arg = arguments[0];
      let key = JSON.stringify(this.param.pageData);
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
          this.dialogFormVisible.edit = false;
          this.findPage(this.param.pageData);
        }
      })
    }
  },
  mounted() {
    this.findPage(this.param.pageData);
  },
}
</script>

<style scoped>

</style>
