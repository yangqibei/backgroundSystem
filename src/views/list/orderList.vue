<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <Breadcrumb list="订单列表" manage="订单管理"></Breadcrumb>
    </div>
    <!-- 主体 -->
    <!-- 搜索框 -->
    <div class="main">
      <template>
        <el-row :gutter="20" type="flex">
          <el-col :span="8">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-table :data="tableData" border="">
          <el-table-column type="index" label="#" min-width="50px">
          </el-table-column>
          <el-table-column
            prop="order_number"
            label="订单编号"
            min-width="100px"
          >
          </el-table-column>
          <el-table-column
            prop="order_price"
            label="订单价格(元)"
            min-width="100px"
          >
          </el-table-column>
          <el-table-column label="是否付款" min-width="60px">
            <template slot-scope="scope">
              <el-tag
                type="danger"
                v-if="scope.row.pay_status === '0'"
                effect="dark"
                >未支付</el-tag
              >
              <el-tag v-else effect="dark" type="success">已支付</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" min-width="60px">
          </el-table-column>
          <el-table-column label="下单时间" width="200px">
            <template slot-scope="scope">
              {{ (scope.row.create_time * 1000) | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200px">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editlocation(scope.row)"
                >更换地址</el-button
              >
              <el-button
                icon="el-icon-edit"
                size="mini"
                @click="getlogistics(scope.row)"
                >查看物流</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <template>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="orders.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="orders.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </template>
        <!-- 修改收货地址 -->
        <el-dialog
          title="修改收货地址"
          :visible.sync="editLocation"
          @close="handleAddClose"
          width="50%"
        >
          <el-form :model="locationform" :rules="rules" ref="locationFormRef">
            <el-form-item label="省市区/县" prop="addressFirst">
              <el-cascader
                v-model="locationform.addressFirst"
                :options="cityData"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="addressSecond">
              <el-input v-model="locationform.addressSecond"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editLocation = false">取 消</el-button>
            <el-button type="primary" @click="editLocation = false"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <!-- 获取物流信息 -->
        <el-dialog title="物流信息" :visible.sync="getlogisticsMsg" width="50%">
          <span>{{ logisticsMsg }}</span>
          <div slot="footer" class="dialog-footer">
            <el-button @click="getlogisticsMsg = false">取 消</el-button>
            <el-button type="primary" @click="getlogisticsMsg = false"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <!-- <el-dialog
          title="修改用户对话框"
          :visible.sync="emitDialog"
          ref="editform"
        >
          <el-form :model="orderList">
            <el-form-item label="订单id" label-width="80px" prop="order_id">
              <el-input v-model="orderList.order_id" disabled> </el-input>
            </el-form-item>
            <el-form-item label="是否发货" label-width="80px" prop="is_send">
              <el-input v-model="orderList.is_send"></el-input>
            </el-form-item>
            <el-form-item label="支付方式" label-width="80px" prop="order_pay">
              <el-input v-model="orderList.order_pay"></el-input>
            </el-form-item>
            <el-form-item label="价格" label-width="80px" prop="order_price">
              <el-input v-model="orderList.order_price"></el-input>
            </el-form-item>
            <el-form-item label="数量" label-width="80px" prop="order_number">
              <el-input v-model="orderList.order_number"></el-input>
            </el-form-item>
            <el-form-item label="支付状态" label-width="80px" prop="pay_status">
              <el-input v-model="orderList.pay_status"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="emitDialog = false">取 消</el-button>
            <el-button type="primary" @click="editchange">确 定</el-button>
          </div>
        </el-dialog> -->
      </template>
    </div>
  </div>
</template>

<script>
import cityData from './components/city_data2017_element'
import { getOrdersList, getlogistics } from '@/api/order'
export default {
  name: 'orderList',
  created () { this.getOrdersList() },
  data () {
    return {
      tableData: [],
      orders: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      locationform: {
        addressFirst: [],
        addressSecond: ''
      },
      rules: {
        addressFirst: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        addressSecond: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      total: 0,
      // emitDialog: false
      editLocation: false,
      cityData: cityData,
      getlogisticsMsg: false,
      logisticsMsg: '这是物流信息'
    }
  },
  methods: {
    // 根据条数刷新数据
    handleSizeChange (val) {
      this.goods.pagesize = val
      this.getOrdersList()
    },
    // 根据页码刷新数据
    handleCurrentChange (val) {
      this.goods.pagenum = val
      this.getOrdersList()
    },
    async getOrdersList () {
      const res = await getOrdersList(this.orders)
      console.log(res)
      this.tableData = res.data.data.goods
      this.total = res.data.data.total
    },
    // editgoods (obj) {
    //   this.emitDialog = true
    //   this.orderList = { ...obj }
    // },
    // async editchange () {
    //   this.orderList.id = this.orderList.order_id
    //   const res = await editOrder(this.orderList)
    //   console.log(res)
    //   if (res.data.data.meta.status === 201) {
    //     this.emitDialog = false
    //     this.$message.success(res.data.data.meta.msg)
    //   }
    // }
    // 修改地址
    editlocation () {
      this.editLocation = true
    },
    // 重置添加角色表单数据
    handleAddClose () {
      this.$refs.locationFormRef.resetFields()
    },
    // 获得物流信息
    async getlogistics () {
      this.getlogisticsMsg = true
      const res = await getlogistics(1106975712662)
      console.log(res)
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
  .el-table {
    margin-top: 20px;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>
