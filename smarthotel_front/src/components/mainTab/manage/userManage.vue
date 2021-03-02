<template>
  <div>用户管理</div>
</template>

<script>
import {exists} from "../../../assets/js/utils";
import getData from "../../../assets/js/getData";
import req from "../../../assets/js/req";

export default {
  name: "userManage",
  data() {
    return {
      data: {},
      keyPrefix: "user",
      pageParam: {
        page: 1,
        pageSize: 10,
        type: undefined,
        keyword: undefined,
      },
    }
  },
  methods: {
    success: function (res) {
      this.$message(res.message)
      if (res.code !== 2000 && exists(res.data)) {
        this.$message(res.data.join(" & "))
      }
    },
    findPage({page, pageSize, type, keyword}) {
      let arg = arguments[0];
      let key = JSON.stringify(arg);
      getData(false, this.keyPrefix + " " + key, 5
        , req, {url: "/authority/{prefix}/findPage".format({prefix: this.keyPrefix}), data: arg, success: this.success})
        .then(res => {
          if (res.code === 2000) {
            this.data = res.data;
          }
        })
    },
  },
  mounted() {
    this.findPage(this.pageParam);
  }
}
</script>

<style scoped>

</style>
