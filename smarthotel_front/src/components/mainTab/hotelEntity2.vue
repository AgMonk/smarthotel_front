<template>
<div>
  <el-container>
    <el-main>
      <hotel-entity-table prefix="building" />
<!--      <hotel-entity-table prefix="floor" parent-id="1" :parent-data="[{id:1,name: '一栋'}]"/>-->
    </el-main>

  </el-container>

</div>
</template>

<script>
import HotelEntityTable from "./manage/hotelEntity/hotelEntityTable";
export default {
  name: "hotelEntity",
  components: {HotelEntityTable},
  data() {
    return {
    }
  },
  methods:{
  },
}
</script>

<style scoped>

</style>
