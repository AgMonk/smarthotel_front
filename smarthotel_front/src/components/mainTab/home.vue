<template>
<div>
  主页
</div>
</template>

<script>
import req from "../../assets/js/req";

export default {
  name: "home",
  mounted() {
    req({url:"/hotelEntity/building/findAll",data:{number:1,name:"一栋"}})
  },
}
</script>

<style scoped>

</style>
