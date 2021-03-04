<template>
  <div>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="20">
            <el-form :inline="true">
              <el-form-item label="类型">
                <el-input v-model="param.pageData.type"/>
              </el-form-item>
              <el-form-item label="关键字">
                <el-input v-model="param.pageData.keyword"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @close="findPageData">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">添加</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table :data="data">
          <el-table-column prop="id" label="id"/>
          <el-table-column prop="number" label="编号"/>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <el-button type="primary" @click="$emit('change-id',{entity:prefix,id:scope.row.id})">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column v-if="parentPrefix!==undefined" prop="parent.name" label="上级ID"/>
        </el-table>
      </el-main>
      <el-footer>foot</el-footer>
    </el-container>
  </div>
</template>

<script>
import req from "../../../../assets/js/req";
import {copyObj, exists} from "../../../../assets/js/utils";
import getData from "../../../../assets/js/getData";
import axios from "axios";

let entityTemplate = {
  id: 0,
  number: 0,
  name: "",
  parentId: 0,
  parent: undefined,
}

export default {
  name: "hotelEntityManage",
  data() {
    return {
      param: {
        create: copyObj(entityTemplate),
        del: copyObj(entityTemplate),
        edit: copyObj(entityTemplate),
        pageData: {
          page: 1,
          pageSize: 10,
          type: undefined,
          keyword: undefined,
          parentId: 1,
        }
      },
      data: [],
      parentData: undefined,
    }
  },
  methods: {
    create() {
      this.cudRequest("create")
    },
    edit() {
      this.cudRequest("edit")
    },
    del() {
      this.cudRequest("del")
    },
    getParent() {
      if (this.parentPrefix === undefined || this.parentData === undefined || this.data === undefined) {
        return;
      }
      let t = this.data;
      t.forEach(item => {
        console.log(item)
        item.parent = this.parentData.filter(i => i.id === item.id)[0];
        console.log(item)
      })
      this.data = t;
      console.log(this.data)
    },
    findParentAll() {
      if (this.parentPrefix === undefined) {
        return;
      }
      getData(false, this.parentPrefix, 10, req,
        {
          url: "/hotelEntity/{prefix}/findAll".format({prefix: this.parentPrefix}),
          success: this.success
        }).then(res => {
        this.parentData = res.data;
        this.getParent();
      })
    },
    findPageData() {
      getData(false, this.getPageKey(), 10, req,
        {
          url: this.getUrl("findPageData"),
          success: this.success,
          data: this.param.pageData,
        }
      ).then(res => {
        this.data = res.data.data;
        this.getParent();
      })
    },
    //写操作请求
    cudRequest(key) {
      req({url: this.getUrl(key), data: this.param[key], success: this.success}).then(res => {
        this.param[key] = copyObj(entityTemplate)
        //清理缓存内的分页数据
        let sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach((key) => {
          if (key.startsWith(this.prefix + "->")) {
            sessionStorage.removeItem(key);
          }
        })
        //查询分页数据
        this.findPageData();
      })
    },
    getPageKey() {
      return this.prefix + "->" + JSON.stringify(this.param.pageData);
    },
    getUrl(suffix) {
      return "/hotelEntity/{prefix}/{suffix}".format({prefix: this.prefix, suffix: suffix})
    },
    success(res) {
      this.$message(res.message)
      if (res.code !== 2000 && exists(res.data)) {
        this.$message(res.data.join(" & "))
      }
    },
  },
  mounted() {
    this.findPageData()
    this.findParentAll()
  },
  watch :{
    parentId: {
      handler(e) {
        this.param.pageData.parentId = e;
        this.findPageData();
      }
    }
  },
  props: ["prefix", "parentPrefix","parentId"]
}
</script>

<style scoped>

</style>
