<template>
<div>
  <el-container>
    <el-main>
      <el-tabs v-model="tabs" >
        <el-tab-pane label="楼栋管理" name="楼栋管理">
          <hotel-entity-manage prefix="building"  />
        </el-tab-pane>
        <el-tab-pane label="楼层管理" name="楼层管理">
          <hotel-entity-manage prefix="floor" parent-prefix="building" />
        </el-tab-pane>
        <el-tab-pane label="房间管理" name="房间管理">
          <hotel-entity-manage prefix="room" parent-prefix="floor" />
        </el-tab-pane>
      </el-tabs>
    </el-main>

  </el-container>
</div>
</template>

<script>
import HotelEntityManage from "./manage/hotelEntity/hotelEntityManage";
export default {
  name: "hotelEntity",
  data() {
    return {
      tabs: "楼栋管理",
    }
  },
  components:{
    HotelEntityManage

  }
}
</script>

<style scoped>

</style>
