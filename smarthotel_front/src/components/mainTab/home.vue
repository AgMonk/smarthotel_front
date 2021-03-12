<template>
<div>
  主页
</div>
</template>

<script>
import req from "../../assets/js/req";

export default {
  name: "home",
  data(){
    return {
    }
  },
  methods:{
     getStatus() {
       req({
         url:"/authority/user/findChildren",
         // data:{
         //   userId:2,
         //   entity:"BUILDING",
         //   entityId:[13],
         // }
       }).then(res=>{
         console.log(res)
       })
     }
  },
  mounted() {
    this.getStatus()
  },
}
</script>

<style scoped>

</style>
