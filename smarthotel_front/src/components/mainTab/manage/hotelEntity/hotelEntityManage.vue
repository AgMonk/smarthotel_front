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
                <el-select v-model="param.pageData.parentId" v-if="parentPrefix!==undefined">
                  <el-option
                    v-for="(item,i) in parentData"
                    :key="i"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           @click="parentPrefix===undefined?findPageData($event)
                           :$emit('change-id',Object.assign({entity:parentPrefix},parentData.filter(item=>item.id===param.pageData.parentId)[0]))">
                  查询
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="dialogFormVisible.create=true">添加</el-button>
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
              <el-button type="primary" @click="$emit('change-id',Object.assign({entity:prefix},scope.row))">
                {{ scope.row.parent ? scope.row.parent.name + "_" : "" }}{{ scope.row.name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column v-if="parentPrefix!==undefined" prop="parent.name" label="所属"/>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="primary" @click="param.edit = scope.row;dialogFormVisible.edit=true">修改</el-button>
              <el-button type="danger" @click="param.del = scope.row;del()">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>foot</el-footer>
    </el-container>

    <el-dialog title="添加" :visible.sync="dialogFormVisible.create">
      <el-form :model="param.create" label-width="120px">
        <el-form-item label="编号">
          <el-input v-model="param.create.number"/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="param.create.name"/>
        </el-form-item>
        <el-form-item label="上级" v-if="parentPrefix!==undefined">
          <el-select v-model="param.create.parentId">
            <el-option
              v-for="(item,i) in parentData"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="create">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="dialogFormVisible.edit">
      <el-form :model="param.edit" label-width="120px">
        <el-form-item label="id">{{ param.edit.id }}</el-form-item>
        <el-form-item label="编号">
          <el-input v-model="param.edit.number"/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="param.edit.name"/>
        </el-form-item>
        <el-form-item label="上级" v-if="parentPrefix!==undefined">
          <el-select v-model="param.edit.parentId">
            <el-option
              v-for="(item,i) in parentData"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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
  parentId: 1,
  parent: undefined,
}

export default {
  name: "hotelEntityManage",
  data() {
    return {
      dialogFormVisible: {
        create: false,
        edit: false,
      },
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
      parent: {},
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
      if (confirm("确认删除？")) {
        this.cudRequest("del")
      }
    },
    getParent() {
      if (this.parentPrefix === undefined || this.parentData === undefined || this.data === undefined) {
        return;
      }
      let t = this.data;
      t.forEach(item => {
        item.parent = this.parentData.filter(i => i.id === item.parentId)[0];
      })
      this.data = t;
      console.log(t)
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
        if (res.code === 2000) {
          this.param[key] = copyObj(entityTemplate)
          //清理缓存内的分页数据
          let sessionKeys = Object.keys(sessionStorage);
          sessionKeys.forEach((key) => {
            if (key.startsWith(this.prefix + "->")) {
              sessionStorage.removeItem(key);
            }
          })
          this.dialogFormVisible[key] = false
          //查询分页数据
          this.findPageData();
        }
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
  watch: {
    parentId: {
      handler(e) {
        this.parent = this.parentData.filter(item => item.id === e)[0];
        this.param.pageData.parentId = e;
        this.findPageData();
      }
    }
  },
  props: ["prefix", "parentPrefix", "parentId"]
}
</script>

<style scoped>

</style>
