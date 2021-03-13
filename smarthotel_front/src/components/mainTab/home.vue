<template>
<div>
  <el-container>
    <el-main>
    <el-table
    :data="data"

    >
      <el-table-column type="expand" label="设备信息">
        <template slot-scope="scope">
          <el-table :data="scope.row.deviceStatus">
            <el-table-column prop="id" label="id" width="80px" />
            <el-table-column prop="datetime" label="最后活跃时间" />
            <el-table-column label="属性">
              <template slot-scope="sc">
                <el-tag v-for="(item,key,i) in sc.row.attributes" :key="i">{{key}}:{{item}}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
    <el-table-column prop="number" label="编号" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="mac" label="Mac" />

    </el-table>
    </el-main>
  </el-container>
</div>
</template>

<script>
import req from "../../assets/js/req";

export default {
  name: "home",
  data(){
    return {
      data:[],
    }
  },
  methods:{
     getStatus() {
       req({
         url:"/device/message/status",
         // data:{
         //   userId:2,
         //   entity:"BUILDING",
         //   entityId:[13],
         // }
       }).then(res=>{
         if (res.code === 2000) {
           this.data = res.data;
           console.log( this.data)
         }
       })
     }
  },
  mounted() {
    this.getStatus()
    setInterval(this.getStatus,30000);
  },
}
</script>

<style scoped>

</style>
