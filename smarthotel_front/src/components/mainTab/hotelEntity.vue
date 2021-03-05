<template>
<div>
  <el-container>
    <el-header>
      <h2>{{buildingName}} {{floorName}}</h2>
    </el-header>
    <el-main>
      <el-tabs v-model="tabs" >
        <el-tab-pane label="楼栋管理" name="楼栋管理">
          <hotel-entity-manage v-if="tabs==='楼栋管理'" prefix="building" @change-id="change" />
        </el-tab-pane>
        <el-tab-pane label="楼层管理" name="楼层管理">
          <hotel-entity-manage v-if="tabs==='楼层管理'"  prefix="floor" @change-id="change" parent-prefix="building" :parent-id="buildingId" />
        </el-tab-pane>
        <el-tab-pane label="房间管理" name="房间管理">
          <hotel-entity-manage  v-if="tabs==='房间管理'"  prefix="room" parent-prefix="floor" :parent-id="floorId" />
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
      buildingId:undefined,
      buildingName:undefined,
      floorId:undefined,
      floorName:undefined,
    }
  },
  methods:{
    change(e){
      this[e.entity+"Id"] = e.id;
      if (e.entity === 'building') {
        this.tabs = "楼层管理"
        this.buildingName = e.name;
      }
      if (e.entity === 'floor') {
        this.tabs = "房间管理"
        this.floorName = e.name;
      }

    }
  },
  components:{
    HotelEntityManage

  }
}
</script>

<style scoped>

</style>
