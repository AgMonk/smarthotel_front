<template>
  <div>
    <el-container>
      <el-header>
        <el-row>
          <el-button type="primary" @click="visible.create=true">添加</el-button>
        </el-row>
        <el-row>
          <el-pagination
          layout="prev, pager, next"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @current-change="currentChange"
        >
        </el-pagination>
        </el-row>
      </el-header>
      <el-main>
        <el-table :data="dataShow">
          <el-table-column prop="id" label="ID"/>
          <el-table-column sortable prop="number" label="编号"/>
          <el-table-column prop="name" label="名称"/>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" v-if="prefix!=='room'" @click="openChild(scope.row.id)">进入</el-button>
              <el-button type="primary" @click="visible.edit=true;param.edit=copyObj(scope.row)">修改</el-button>
              <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination
          layout="prev, pager, next"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @current-change="currentChange"
        >
        </el-pagination>
      </el-footer>
    </el-container>
    <el-dialog title="详情" :visible.sync="visible.edit">
      <el-form :model="param.edit" label-width="80px">
        <el-form-item label="编号">
          <el-input v-model="param.edit.number"/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="param.edit.name"/>
        </el-form-item>
        <el-form-item label="mac" v-if="prefix==='room'">
          <el-input v-model="param.edit.mac"/>
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="edit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="添加" :visible.sync="visible.create">
      <el-form :model="param.create" label-width="80px">
        <el-form-item label="编号">
          <el-input v-model="param.create.number"/>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="param.create.name"/>
        </el-form-item>
        <el-form-item label="mac" v-if="prefix==='room'">
          <el-input v-model="param.create.mac"/>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="create">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-if="visible.child"  :visible.sync="visible.child" width="90%">
      <hotel-entity-table
        :prefix="child.prefix"
        :parent-id="child.parentId"
        :parent-data="child.parentData" />
    </el-dialog>

  </div>
</template>

<script>
import req from "../../../../assets/js/req";
import {copyObj, exists} from "../../../../assets/js/utils";
import axios from "axios";

export default {
  name: "HotelEntityTable",
  data() {
    return {
      visible: {
        create:false,
        edit:false,
        child:false,
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 50,
      },
      data: [],
      dataShow: [],
      param: {
        create:{},
        edit:{},
      },
      child:{
        prefix:"floor",
        parentId:1,
        parentData:[],
      }
    }
  },
  methods: {
    openChild(id){
      this.child.prefix = this.prefix==="building"?"floor":"room";
      this.child.parentId = id;
      this.visible.child=true;
      // req({
      //   url: "/hotelEntity/{prefix}/findPageData".format({prefix: this.prefix}),
      //   data: {
      //     page: 1,
      //     pageSize: 99999,
      //     parentId: this.parentId,
      //   },
      //   success: this.success
      // }).then(res => {
      //   if (res.code === 2000) {
      //     let data = res.data;
      //     this.child.parentData = data.data;
      //   }
      // })
    },
    create(){
      this.cudRequest('create',Object.assign({parentId:this.parentId},this.param.create));
    },
    edit(){
      this.cudRequest('edit',this.param.edit);
    },
    del(id){
      if (confirm("确认删除？")){
        this.cudRequest('del',{id:id});
      }
    },
    cudRequest(action,data){
      req({
        url: "/hotelEntity/{prefix}/{action}".format({prefix: this.prefix,action:action}),
        data:data,
        success: this.success
      }).then(res=>{
        if (res.code === 2000) {
          this.visible[action]=false;
          this.param[action] = {};
          this.data[this.pagination.currentPage] = undefined
          this.currentChange(this.pagination.currentPage)
        }
      })
    },
    copyObj: copyObj,
    success(res) {
      this.$message(res.message)
      if (res.code !== 2000 && exists(res.data)) {
        this.$message(res.data.join(" & "))
      }
    },
    currentChange(page) {
      this.pagination.currentPage = page;
      if (this.data[page]) {
        console.log(this.data)
        this.dataShow = this.data[page];
      } else {
        req({
          url: "/hotelEntity/{prefix}/findPage".format({prefix: this.prefix}),
          data: {
            page: page,
            pageSize: this.pagination.pageSize,
            parentId: this.parentId,
          },
          success: this.success
        }).then(res => {
          if (res.code === 2000) {
            let data = res.data;
            this.pagination.total = data.totalCount;
            data.data.sort((o1,o2)=>{
              return o1.number - o2.number
            })
            this.data[page] = data.data;
            this.dataShow = data.data;
          }
        })
      }
    },

  },
  mounted() {
    this.currentChange(1)
  },
  watch:{
    parentId:{
      handler(route){
        this.currentChange(this.pagination.currentPage)
      }
    }
  },
  props: [
    //本表格的实体类型 building floor room
    "prefix",
    //本表格实体类型的上级实体id
    "parentId",
    //本表格实体类型的上级实体列表
    "parentData",
  ]
}
</script>

<style scoped>

</style>
