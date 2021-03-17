<template>
  <el-container>
    <el-header>
    </el-header>
    <el-main>
      <el-tabs v-model="tabs">
        <el-tab-pane label="设备指令" name="设备指令">
          <mqtt-order v-if="tabs==='设备指令'"/>
        </el-tab-pane>
        <el-tab-pane label="设备类型" name="设备类型">
          <device-type v-if="tabs==='设备类型'"/>
        </el-tab-pane>
        <el-tab-pane label="设备属性" name="设备属性">
          <attributes v-if="tabs==='设备属性'"/>
        </el-tab-pane>
        <el-tab-pane label="异常条件" name="异常条件">
          <silence-exception v-if="tabs==='异常条件'"/>
        </el-tab-pane>

      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import req from "../assets/js/req";
import {exists} from "../assets/js/utils";
import MqttOrder from "./mainTab/manage/device/mqttOrder";
import deviceType from "./mainTab/manage/device/deviceType";
import Attributes from "./mainTab/manage/device/attributes";
import silenceException from "./mainTab/manage/device/silenceException";

export default {
  name: "device",
  components: {Attributes, MqttOrder, deviceType, silenceException},
  data() {
    return {
      tabs: "设备指令",
      param: {
        status: ['9CA5258B82E6'],
      },
    }
  },
  methods: {
    success(res) {
      this.$message(res.message)
      if (res.code !== 2000 && exists(res.data)) {
        this.$message(res.data.join(" & "))
      }
    },
    getStatus() {
      req({
        url: "/device/message/status",
        data: this.param.status,
        success: this.success,
      })
    },
  },
  mounted() {
    this.getStatus()
  }
}
</script>

<style scoped>

</style>
