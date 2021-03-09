<template>
  <div>
    <el-button type="success" @click="visible.create=true">添加</el-button>
    <el-table :data="data">
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="action" label="指令"/>
      <el-table-column prop="param" label="参数"/>
      <el-table-column label="参数是否必须">
        <template slot-scope="scope">
          {{ scope.row.requireParam ? '√' : 'X' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="visible.edit=true;param.edit=Object.assign({},scope.row)">修改</el-button>
          <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog title="添加" :visible.sync="visible.create">
      <el-form :model="param.create" label-width="120px">
        <el-form-item label="指令名">
          <el-input v-model="param.create.name"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="param.create.remark"/>
        </el-form-item>
        <el-form-item label="指令">
          <el-input v-model="param.create.action"/>
        </el-form-item>
        <el-form-item label="参数">
          <el-input v-model="param.create.param"/>
        </el-form-item>
        <el-form-item label="参数是否必须">
          <el-select v-model="param.create.requireParam">
            <el-option value="1" label="必须" />
            <el-option :value="undefined" label="非必须"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="param.create={}">重置</el-button>
          <el-button type="success" @click="create">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="visible.edit">
      <el-form :model="param.edit" label-width="120px">
        <el-form-item label="id">
          {{param.edit.id}}
        </el-form-item>
        <el-form-item label="指令名">
          <el-input v-model="param.edit.name"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="param.edit.remark"/>
        </el-form-item>
        <el-form-item label="指令">
          <el-input v-model="param.edit.action"/>
        </el-form-item>
        <el-form-item label="参数">
          <el-input v-model="param.edit.param"/>
        </el-form-item>
        <el-form-item label="参数是否必须">
          <el-select v-model="param.edit.requireParam">
            <el-option value="1" label="必须" />
            <el-option :value="undefined" label="非必须"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="param.edit={}">重置</el-button>
          <el-button type="success" @click="edit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
import req from "../../../../assets/js/req";
import {exists} from "../../../../assets/js/utils";

export default {
  name: "mqttOrder",
  data() {
    return {
      data: [],
      visible:{
        create:false,
        edit:false,
      },
      param:{
        create: {},
        edit: {},
      },

    }
  },
  methods: {
    success(res) {
      this.$message(res.message)
      if (res.code !== 2000 && exists(res.data)) {
        this.$message(res.data.join(" & "))
      }
    },
    edit(){
      this.cudRequest("edit",this.param.edit)
    },
    del(id){
      if (confirm("确认删除?")){
        this.cudRequest("del", {id:id})
      }
    },
    create(){
      this.cudRequest("create",this.param.create)
    },
    cudRequest(action,data){
      req({
        url:"/device/order/"+action,
        data:data,
        success:this.success
      }).then(res=>{
        if (res.code === 2000) {
          this.findAll();
          this.visible.create = false;
          this.visible.edit = false;
          this.param.create = {};
          this.param.edit = {};
        }
      })
    },
    findAll() {
      req({url: "/device/order/findAll", success: this.success}).then(res => {
        console.log(res)
        if (res.code === 2000) {
          this.data = res.data;
        }
      })
    },
  },
  mounted() {
    this.findAll()
  }
}
</script>

<style scoped>

</style>
