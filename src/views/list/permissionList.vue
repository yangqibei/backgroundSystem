<template>
  <div>
    <div class="header">
      <Breadcrumb list="权限列表" manage="权限管理"></Breadcrumb>
    </div>
    <div class="main">
      <template>
        <el-table :data="tableData" stripe border="">
          <el-table-column type="index" label="#" min-width="50px">
          </el-table-column>
          <el-table-column prop="authName" label="权限名称" min-width="80px">
          </el-table-column>
          <el-table-column prop="path" label="路径" min-width="80px">
          </el-table-column>
          <el-table-column prop="level" label="权限等级" min-width="80px">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">等级一</el-tag>
              <el-tag v-else-if="scope.row.level === '1'" type="success"
                >等级二</el-tag
              >
              <el-tag v-else type="warning">等级三</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
import { getLIst } from '@/api/user'
export default {
  created () { this.getLIst() },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    async getLIst () {
      const res = await getLIst()
      console.log(res)
      this.tableData = res.data.data
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.main {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
}
</style>
