<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <Breadcrumb list="商品列表" manage="商品管理"></Breadcrumb>
    </div>
    <!-- 主体 -->
    <div class="main">
      <template>
        <el-alert
          title="添加商品信息"
          type="info"
          center
          show-icon
          :closable="false"
        >
        </el-alert>
      </template>
      <template>
        <el-steps :active="active - 0" finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </template>
      <template>
        <el-tabs tab-position="left" v-model="active" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form
              :model="form"
              label-width="80px"
              :rules="rules"
              ref="formRef"
            >
              <el-form-item prop="goods_name" label="商品名称">
                <el-input v-model="form.goods_name"></el-input>
              </el-form-item>
              <el-form-item prop="goods_price" label="商品价格">
                <el-input v-model="form.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item prop="goods_weight" label="商品重量">
                <el-input v-model="form.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item prop="goods_number" label="商品数量">
                <el-input v-model="form.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="分类名称" label-width="80px">
                <el-cascader
                  v-model="form.goods_cat"
                  :options="ManyList"
                  :props="prop"
                  @change="handleChange"
                  clearable
                ></el-cascader>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form>
              <el-form-item
                v-for="item in attr_list"
                :key="item.attr_id"
                :label="item.attr_name"
              >
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox
                    border
                    :label="item2"
                    v-for="(item2, i) in item.attr_vals"
                    :key="i"
                  ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form>
              <el-form-item
                v-for="item in only_list"
                :key="item.attr_id"
                :label="item.attr_name"
                label-width="100px"
              >
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :headers="headersObj"
              class="upload-demo"
              action="http://liufusong.top:8899/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
              <el-dialog title="图片预览" :visible.sync="dialogimgVisible">
                <img :src="previewPath" style="width=100%" />
                <div slot="footer" class="dialog-footer">
                  <el-button type="button" @click="dialogimgVisible = false"
                    >取 消</el-button
                  >
                  <el-button type="primary" @click="dialogimgVisible = false"
                    >确 定</el-button
                  >
                </div>
              </el-dialog>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4"
            ><quillEditor v-model="form.goods_introduce"></quillEditor>
            <el-button type="primary" @click="addfn">确认添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script>
// #region ==导入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { getcategoriesList, getCateAttributes } from '@/api/category'
import { AddGoodList } from '@/api/goods'
export default {
  created () { this.getcategoriesList() },
  data () {
    return {
      active: 0,
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        // 图片的数组
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      rules: {
        goods_name: [{ required: true, message: '商品名不能为空', trigger: 'blur' }],
        goods_price: [{ required: true, message: '商品价格不能为空', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '商品重量不能为空', trigger: 'blur' }],
        goods_number: [{ required: true, message: '商品数量不能为空', trigger: 'blur' }]
      },
      ManyList: [],
      prop: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        leaf: 'cat_level',
        checkStrictly: true// 父子结点互不关联
      },
      attr_list: [],
      only_list: [],
      fileList: [],
      headersObj: {
        Authorization: this.$store.state.user.token
      },
      dialogimgVisible: false,
      // 图片预览的路径
      previewPath: ''
    }
  },
  methods: {
    // 得到次联选择器的数据
    async getcategoriesList () {
      const res = await getcategoriesList(this.pageInfo)
      console.log(res)
      this.ManyList = res.data.data
    },
    // 次联选择器切换时
    handleChange () {
      if (this.form.goods_cat.length !== 3) {
        this.form.goods_cat = []
      }
    },
    // tab栏切换时
    async tabClick () {
      console.log(this.active)
      if (this.active === '1') {
        const res = await getCateAttributes({ id: this.form.goods_cat[2], sel: 'many' })
        console.log(res)
        res.data.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        console.log(res.data.data)
        this.attr_list = res.data.data
      } else if (this.active === '2') {
        const res = await getCateAttributes({ id: this.form.goods_cat[2], sel: 'only' })
        console.log(res)
        this.only_list = res.data.data
      }
    },
    // 图片删除
    handleRemove (file, fileList) {
      console.log(file, fileList)
      // 1.获得将要删除的图片路径
      const findPath = file.response.data.tmp_path
      // 2.从pics数组中，找到这个图片对应的索引值
      const index = this.form.pics.findIndex(item => item === findPath)
      this.form.pics.splice(index, 1)
      console.log(this.form)
    },
    // 图片预览
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.url
      this.dialogimgVisible = true
    },
    // 图片上传成功后
    uploadSuccess (response, file) {
      // 1拼接得到一个图片的信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2将图片的信息对象push到pic中
      this.form.pics.push(picInfo)
      console.log(this.form)
    },
    async addfn () {
      this.$refs.formRef.validate((bool) => {
        if (!bool) {
          return this.$message.error('请填写表单')
        }
      })
      // 把id的数组格式化
      const result = this.form.goods_cat.join(',')
      console.log(result)
      this.form.goods_cat = result
      // 把动态分类和静态分类的数组格式化
      // 动态
      const attrs = []
      this.attr_list.forEach(item => {
        const info = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
        attrs.push(info)
      })
      // 静态
      this.only_list.forEach(item => {
        const info = { attr_id: item.attr_id, attr_value: item.attr_vals }
        attrs.push(info)
      })
      this.form.attrs = attrs
      const res = await AddGoodList(this.form)
      console.log(res)
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { quillEditor }
}
</script>

<style scoped lang='less'>
.main {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
  .el-steps {
    padding: 30px;
  }
}
:deep(.ql-editor) {
  min-height: 300px;
}
</style>
