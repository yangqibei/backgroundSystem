<template>
  <div>
    <div class="header">
      <Breadcrumb list="商品列表" manage="商品管理"></Breadcrumb>
    </div>
    <div class="main">
      <template>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加商品</el-button>
          </el-col>
        </el-row>
      </template>
      <template>
        <el-table :data="tableData" border="">
          <el-table-column type="index" label="#" min-width="50px">
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称" min-width="600px">
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格(元)"
            min-width="80px"
          >
          </el-table-column>
          <el-table-column
            prop="goods_weight"
            label="商品重量"
            min-width="80px"
          >
          </el-table-column>
          <el-table-column label="创建时间" width="120px">
            <template slot-scope="scope">
              {{ (scope.row.add_time * 1000) | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="190px">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="userDetial(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delopen(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <template>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="goods.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="goods.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { getGoodList } from '@/api/goods'
export default {
  created () { this.getGoodList() },
  data () {
    return {
      tableData: [],
      goods: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0
    }
  },
  methods: {
    async getGoodList () {
      const res = await getGoodList(this.goods)
      console.log(res)
      this.total = res.data.data.total
      this.tableData = res.data.data.goods
    },
    handleSizeChange (val) {
      this.goods.pagesize = val
      this.getGoodList()
    },
    handleCurrentChange (val) {
      this.goods.pagenum = val
      this.getGoodList()
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
