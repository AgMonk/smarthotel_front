<template>
  <div>
    <el-container>
      <el-main>
        <el-tabs v-model="tabs" >
          <el-tab-pane label="用户管理" name="用户管理">
            <user-manage/>
          </el-tab-pane>
          <el-tab-pane label="角色管理" name="角色管理">
            角色管理
          </el-tab-pane>
          <el-tab-pane label="权限管理" name="权限管理">
            <permission-manage/>
          </el-tab-pane>
        </el-tabs>
      </el-main>

    </el-container>
  </div>
</template>

<script>
import userManage from "./manage/userManage";
import permissionManage from "./manage/permissionManage";

export default {
  name: "authority",
  data() {
    return {
      tabs: "权限管理",
    }
  },
  methods: {
  },
  components: {
    userManage,
    permissionManage,
  },
  mounted() {
    console.clear()
  }
}
</script>

<style scoped>

</style>
