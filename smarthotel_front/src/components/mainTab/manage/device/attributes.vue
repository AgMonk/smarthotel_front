<template>
  <div>
    <el-container>
      <el-header>
        <el-button type="primary" @click="visible.create=true;">添加</el-button>
      </el-header>
      <el-main>
        <el-table :data="data">
          <el-table-column  prop="id"  label="ID"  />
          <el-table-column  prop="name"  label="名称"  />
          <el-table-column  prop="remark"  label="备注(翻译)"  />
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="primary" @click="visible.edit=true;param.edit=Object.assign({},scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog :visible.sync="visible.create" title="创建属性">
      <el-form :model="param.create" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="param.create.name" />
        </el-form-item>
        <el-form-item label="备注(翻译)">
          <el-input v-model="param.create.remark" />
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="param.create={}">重置</el-button>
          <el-button type="success" @click="create">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="visible.edit" title="修改属性">
      <el-form :model="param.edit" label-width="120px">
        <el-form-item label="ID">{{param.edit.id}}
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="param.edit.name" />
        </el-form-item>
        <el-form-item label="备注(翻译)">
          <el-input v-model="param.edit.remark" />
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="param.edit={id:param.edit.id}">重置</el-button>
          <el-button type="success" @click="edit">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import req from "../../../../assets/js/req";

export default {
  name: "attributes",
  data() {
    return {
      prefix:"/device/attribute/",
      data:[],
      param:{
        create:{},
        edit:{},
      },
      visible:{
        create:false,
        edit:false,
      },

    }
  },
  methods: {
    findAll(){
      req({url:this.prefix +"findAll"}).then(res=>{
        if (res.code === 2000) {
          this.data = res.data;
        }
      })
    },
    create(){
      req({url:this.prefix +"create",data:this.param.create}).then(res=>{
        this.$message(res.message);
        this.param.create = {};
        this.visible.create = false;
        this.findAll();
      })
    },
    edit(){
      req({url:this.prefix +"edit",data:this.param.edit}).then(res=>{
        this.$message(res.message);
        this.param.edit = {};
        this.visible.edit = false;
        this.findAll();
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
