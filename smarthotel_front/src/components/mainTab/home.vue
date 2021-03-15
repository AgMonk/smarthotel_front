<template>
  <div>
    <el-container>
      <el-header>
        <el-button @click="getStatus">刷新</el-button>
      </el-header>
      <el-main>
        <el-table
          :data="data"

        >
          <el-table-column type="expand" label="设备信息">
            <template slot-scope="scope">
              <el-table :data="scope.row.deviceStatus">
                <el-table-column prop="id" label="id" width="80px"/>
                <el-table-column prop="type" width="150px" label="类型"/>
                <el-table-column prop="datetime" width="150px" label="最后活跃时间"/>
                <el-table-column label="属性">
                  <template slot-scope="sc">
                    <el-tag v-for="(item,key,i) in sc.row.attributes" :key="i">{{ key }}:{{ item }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="控制">
                  <template slot-scope="sc">
                    <el-button type="success" size="small" v-for="(item,i) in sc.row.orders" :key="i"
                               @click="sendOrder(sc.row.type,sc.row.id,sc.row.mac,item.name,null)"
                    >{{ item.remark }}
                    </el-button>
                  </template>
                </el-table-column>

              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="编号"/>
          <el-table-column prop="name" label="名称"/>
          <el-table-column prop="mac" label="Mac"/>

        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import req from "../../assets/js/req";

export default {
  name: "home",
  data() {
    return {
      data: [],
      types: [],
      orders: [],
    }
  },
  methods: {
    sendOrder(type, id, mac, orderName, param) {
      req({
        url: "/device/order/send",
        data: {
          type: type,
          id: id,
          mac: mac,
          orderName: orderName,
          param: param,
        }
      }).then(res => {
        console.log(res)
      })
    },
    getStatus() {
      if (this.types && this.orders && this.types.length > 0 && this.orders.length > 0) {
        req({
          url: "/device/message/status",
          // data:{
          //   userId:2,
          //   entity:"BUILDING",
          //   entityId:[13],
          // }
        }).then(res => {
          if (res.code === 2000) {
            this.data = res.data;
            let rooms = res.data;
            for (let i = 0; i < rooms.length; i++) {
              let room = rooms[i];
              for (let j = 0; j < room.deviceStatus.length; j++) {
                let deviceStatus = room.deviceStatus[j];
                let type = this.types.filter(item => item.deviceIds.includes(deviceStatus.id));
                if (type.length > 0) {
                  let ordersId = type[0].hasOrders;
                  deviceStatus.type = type[0].type;
                  deviceStatus.typeName = type[0].name;
                  console.log(deviceStatus)
                  deviceStatus.orders = this.orders.filter(item => ordersId.includes(item.id));
                }
              }
              room.deviceStatus.sort((o1, o2) => o1.id - o2.id);
            }
            console.log(this.data)
          }
        })
      }
    },
    findAllTypes() {
      req({url: "/device/type/findAll", success: this.success}).then(res => {
        console.log(res)
        if (res.code === 2000) {
          this.types = res.data;
        }
      })
    },
    findAllOrders() {
      req({url: "/device/order/findAll", success: this.success}).then(res => {
        console.log(res)
        if (res.code === 2000) {
          this.orders = res.data;
        }
      })
    },
  },
  mounted() {
    this.findAllTypes();
    this.findAllOrders();
    this.getStatus()

    let end = (new Date().getTime())/1000;
    req({
      url:"/device/message/findPage",
      data:{
        mac:"9CA5258B82E6",
        deviceType:"LIGHT",
        start:end - 60*60*24,
        end:end,
        type:'status',
      }
    })
  },
}
</script>

<style scoped>

</style>
