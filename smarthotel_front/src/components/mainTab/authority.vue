<template>
  <div>
    <el-container>
      <el-main>
        <el-tabs v-model="tabs" >
          <el-tab-pane label="用户管理" name="用户管理">
            <user-manage/>
          </el-tab-pane>
          <el-tab-pane label="角色管理" name="角色管理">
            <role-manage/>
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
import roleManage from "./manage/roleManage";

export default {
  name: "authority",
  data() {
    return {
      tabs: "角色管理",
    }
  },
  methods: {
  },
  components: {
    userManage,
    permissionManage,
    roleManage,
  },
  mounted() {
    console.clear()
  }
}
</script>

<style scoped>

</style>
