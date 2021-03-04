<template>
  <div>
    {{ prefix }}
  </div>
</template>

<script>
import req from "../../../../assets/js/req";
import {copyObj, exists} from "../../../../assets/js/utils";
import getData from "../../../../assets/js/getData";

let entityTemplate = {
  id: 0,
  number: 0,
  name: "",
  parentId: 0,
}

export default {
  name: "hotelEntityManage",
  data() {
    return {
      param: {
        create: copyObj(entityTemplate),
        del: copyObj(entityTemplate),
        edit: copyObj(entityTemplate),
        pageData: {
          page: 1,
          pageSize: 10,
          type: undefined,
          keyword: undefined,
        }
      },
      data: [],
      parentData: undefined,
    }
  },
  methods: {
    create() {
      this.cudRequest("create")
    },
    edit() {
      this.cudRequest("edit")
    },
    del() {
      this.cudRequest("del")
    },
    findParentAll() {
      if (this.parentPrefix === undefined) {
        return;
      }
      getData(false, this.parentPrefix, 10, req,
      {
        url: "/hotelEntity/{prefix}/findAll".format({prefix: this.parentPrefix}),
        success: this.success
      }).then(res => {
        this.parentData = res.data;
      })
    },
    findPageData() {
      getData(false, this.getPageKey(), 10, req,
        {
          url: this.getUrl("findPageData"),
          success: this.success,
          data:this.param.pageData,
        }
      ).then(res=>{
        this.data = res.data;
      })
    },
    //写操作请求
    cudRequest(key) {
      req({url: this.getUrl(key), data: this.param[key], success: this.success}).then(res => {
        this.param[key] = copyObj(entityTemplate)
        //清理缓存内的分页数据
        let sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach((key) => {
          if (key.startsWith(this.prefix + "->")) {
            sessionStorage.removeItem(key);
          }
        })
        //查询分页数据
        this.findPageData();
      })
    },
    getPageKey() {
      return this.prefix + "->" + JSON.stringify(this.param.pageData);
    },
    getUrl(suffix) {
      return "/hotelEntity/{prefix}/{suffix}".format({prefix: this.prefix, suffix: suffix})
    },
    success(res) {
      this.$message(res.message)
      if (res.code !== 2000 && exists(res.data)) {
        this.$message(res.data.join(" & "))
      }
    },
  },
  mounted() {
    this.findPageData()
    this.findParentAll()
  },
  props: ["prefix", "parentPrefix"]
}
</script>

<style scoped>

</style>
