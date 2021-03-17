<template>
  <div>
    <el-container>
      <el-header>
        <el-button type="primary" @click="visible.create=true;">添加</el-button>
      </el-header>
      <el-main>
        <el-table :data="data">
          <el-table-column prop="id" label="ID"/>
          <el-table-column prop="deviceType" label="设备类型"/>
          <el-table-column label="排除字段">
            <template slot-scope="scope">
              <el-tag v-for="(item,i) in scope.row.excludedFields" :key="i">{{ item }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="超时时长（小时）">
            <template slot-scope="scope">
              {{ (scope.row.duration / 60 / 60).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="visible.edit=true;param.edit=Object.assign({},scope.row)">修改</el-button>
              <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog :visible.sync="visible.create" title="创建属性">
      <el-form :model="param.create" label-width="120px">
        <el-form-item label="设备类型">
          <el-select v-model="param.create.deviceType">
            <el-option v-for="(item,i) in deviceType" :key="i" :label="item.name" :value="item.type"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排除字段">
          <el-select v-model="param.create.excludedFields" multiple>
            <el-option v-for="(item,i) in attributes" :key="i" :label="item.remark" :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="时长(秒)">
          <el-input v-model="param.create.duration"/>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="param.create={}">重置</el-button>
          <el-button type="success" @click="create">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="visible.edit" title="修改属性">
      <el-form :model="param.edit" label-width="120px">
        <el-form-item label="ID">{{ param.edit.id }}
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="param.edit.deviceType">
            <el-option v-for="(item,i) in deviceType" :key="i" :label="item.name" :value="item.type"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排除字段">
          <el-select v-model="param.edit.excludedFields" multiple>
            <el-option v-for="(item,i) in attributes" :key="i" :label="item.remark" :value="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="时长(秒)">
          <el-input v-model="param.edit.duration"/>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="param.edit={}">重置</el-button>
          <el-button type="success" @click="edit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import req from "../../../../assets/js/req";

export default {
  name: "attributes",
  data() {
    return {
      prefix: "/device/silenceException/",
      data: [],
      attributes: [],
      deviceType: [],
      param: {
        create: {},
        edit: {},
      },
      visible: {
        create: false,
        edit: false,
      },

    }
  },
  methods: {
    findAll() {
      req({url: this.prefix + "findAll"}).then(res => {
        if (res.code === 2000) {
          this.data = res.data;
        }
      })
    },
    findAllAttributes() {
      req({url: "/device/attribute/" + "findAll"}).then(res => {
        if (res.code === 2000) {
          this.attributes = res.data;
        }
      })
    },
    findAllDeviceType() {
      req({url: "/device/type/" + "findAll"}).then(res => {
        if (res.code === 2000) {
          this.deviceType = res.data;
        }
      })
    },

    create() {
      req({url: this.prefix + "create", data: this.param.create}).then(res => {
        this.$message(res.message);
        this.param.create = {};
        this.visible.create = false;
        this.findAll();
      })
    },
    edit() {
      req({url: this.prefix + "edit", data: this.param.edit}).then(res => {
        this.$message(res.message);
        this.param.edit = {};
        this.visible.edit = false;
        this.findAll();
      })
    },
    del(id) {
      req({url: this.prefix + "del", data: {id: id}}).then(res => {
        this.$message(res.message);
        this.findAll();
      })
    },

  },
  mounted() {
    this.findAll()
    this.findAllAttributes()
    this.findAllDeviceType()
  }
}
</script>

<style scoped>

</style>
