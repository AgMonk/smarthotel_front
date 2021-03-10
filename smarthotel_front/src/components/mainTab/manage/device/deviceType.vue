<template>
  <div>
    <el-button type="success" @click="visible.create=true">添加</el-button>
    <el-table :data="data">
      <el-table-column prop="id" label="ID" width="60px" />
      <el-table-column prop="type" label="类型"/>
      <el-table-column label="包含设备ID">
        <template slot-scope="scope">
          {{scope.row.deviceIds.join(",")}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"/>
      <el-table-column label="包含指令">
        <template slot-scope="scope">
<!--          {{scope.row.hasOrders}}-->
<!--          <el-button size="mini" type="warning" v-for="(item,i) in orders.filter(o=>scope.row.hasOrders.includes(o.id))" :key="i"  @click="sendOrder(item)" >{{item.remark}}</el-button>-->
          <el-tag v-for="(item,i) in orders.filter(o=>scope.row.hasOrders.includes(o.id))" :key="i"  >{{item.remark}}</el-tag>
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
        <el-form-item label="设备类型">
          <el-input v-model="param.create.type"/>
        </el-form-item>
        <el-form-item label="包含设备ID">
          <el-input v-model="param.create.deviceIds"/>
        </el-form-item>
        <el-form-item label="中文名">
          <el-input v-model="param.create.name"/>
        </el-form-item>
        <el-form-item label="包含指令ID">
          <el-select v-model="param.create.hasOrders"  multiple placeholder="请选择" style="width:100%">
            <el-option v-for="(item,i) in orders"
                       :key="i"
                       :label="item.remark"
                       :value="item.id"
            />
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
          <el-form-item label="ID">
           {{param.edit.id}}
          </el-form-item>
           <el-form-item label="设备类型">
            <el-input v-model="param.edit.type"/>
          </el-form-item>
          <el-form-item label="包含设备ID">
            <el-input v-model="param.edit.deviceIds"/>
          </el-form-item>
          <el-form-item label="中文名">
            <el-input v-model="param.edit.name"/>
          </el-form-item>
          <el-form-item label="包含指令ID">
            <el-select v-model="param.edit.hasOrders"  multiple placeholder="请选择" style="width:100%">
              <el-option v-for="(item,i) in orders"
                         :key="i"
                         :label="item.remark"
                         :value="item.id"
              />
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
import {exists, getTypeOf} from "../../../../assets/js/utils";

export default {
  name: "mqttOrder",
  data() {
    return {
      data: [],
      orders: [],
      visible: {
        create: false,
        edit: false,
      },
      param: {
        create: {},
        edit: {},
      },

    }
  },
  methods: {
    success(res) {
      this.$message(res.message)

    },
    sendOrder(order){
      console.log(order)
    },
    parseId(param){
      let a = [];
      console.log(param)
      if (getTypeOf(param.deviceIds) === "Array") {
        return;
      }
      let id = param.deviceIds.split(" ");
      for (let i = 0; i < id.length; i++) {
        let item = id[i];
        if (item.includes("-")) {
          let start = parseInt(item.split("-")[0]);
          let end = parseInt(item.split("-")[1]);
          for (let j = start; j <=end ; j++) {
            a.push(j);
          }
        }else
        if (item.includes(",")) {
          item.split(",").forEach(num=>a.push(parseInt(num)));
        }else{
          a.push(parseInt(item))
        }
      }
      param.deviceIds = a;
    },
    edit() {
      this.parseId(this.param.edit);
      this.cudRequest("edit", this.param.edit)
    },
    del(id) {
      if (confirm("确认删除?")) {
        this.cudRequest("del", {type: id})
      }
    },
    create() {
      this.parseId(this.param.create);
      // console.log(this.param.create)
      this.cudRequest("create",this.param.create)
    },
    cudRequest(action, data) {
      req({
        url: "/device/type/" + action,
        data: data,
        success: this.success
      }).then(res => {
        if (res.code === 2000) {
          this.findAll();
          this.visible.create = false;
          this.visible.edit = false;
          this.param.create = {};
          this.param.edit = {};
        }else if (exists(res.data)) {
          this.$message(res.data.join(" & "))
        }
      })
    },
    findAll() {
      req({url: "/device/type/findAll", success: this.success}).then(res => {
        console.log(res)
        if (res.code === 2000) {
          this.data = res.data;
        }
      })
    },
    findAllOrders() {
      req({url: "/device/order/findAll", success: this.success}).then(res => {
        console.log(res)
        if (res.code === 2000) {
          this.orders = res.data;
        }
      })
    },
  },
  mounted() {
    this.findAll()
    this.findAllOrders();
  }
}
</script>

<style scoped>

</style>
