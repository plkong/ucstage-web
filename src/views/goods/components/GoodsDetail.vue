<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="filter-container">
        <el-select v-model="listQuery.oneLevel" :placeholder="$t('category.oneLevel')" clearable @change="selectCategory" style="width: 150px" class="filter-item">
          <el-option v-for="item in datas" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
        <el-select v-model="listQuery.twoLevel" :placeholder="$t('category.twoLevel')" clearable class="filter-item" style="width: 180px">
          <el-option v-for="item in subDatas.children" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </div>

      <div class="createPost-main-container">
        <el-form-item prop="title" style="margin-bottom: 40px;" label-width="80px" :label="$t('goods.title')">
          <el-input v-model="postForm.title" :rows="1" type="textarea" class="article-textarea" autosize :placeholder="$t('goods.inputTitle')" />
        </el-form-item>

        <el-form-item prop="stars" style="margin-bottom: 40px;" label-width="80px" :label="$t('goods.rates')">
          <el-rate
            v-model="postForm.stars"
            :max="5"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :low-threshold="1"
            :high-threshold="5"
            style="margin-top:8px;"
          />
        </el-form-item>

        <el-form-item prop="detail" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.detail" :height="400" />
        </el-form-item>
        <el-form-item>
          <el-upload
            class=""
            name="productImg"
            ref="upload"
            action="img/upload/img"
            multiple
            :data="upLoadData"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :auto-upload="false"
            :file-list="fileList2"
            :on-success="uploadImgSuccess"
            list-type="picture-card">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </div>
      <sticky :class-name="sub-navbar">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">提交</el-button>
        <el-button v-loading="loading" type="warning" @click="cancelForm">取消</el-button>
      </sticky>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { validURL } from '@/utils/validate'
import Sticky from '@/components/Sticky' // 粘性header组件

const defaultForm = {
  title: '', // 文章题目
  detail: '', // 文章内容
  images: '',
  id: undefined
}

export default {
  name: 'GoodsDetail',
  components: { Tinymce, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        title: [{ validator: validateRequire }],
        detail: [{ validator: validateRequire }],
      },
      listQuery: {
        oneLevel: '',
        tewLevel: ''
      },
      upLoadData: {},
      fileList2: [],
      datas: [],
      subDatas: [],
      tempRoute: {}
    }
  },
  computed: {
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.initData()
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    // 编辑数据前，需要先获取产品种类信息
    async fetchData(id) {
      this.datas = await this.loadData()
      const idurl = "/api/goods/" + id
      let self = this
      this.$axios
        .get(idurl)
        .then(function(response) {
          self.postForm = response.data
          let images = response.data.images;
          images.split(';').forEach(image => {
            let index = image.lastIndexOf('/')
            let name = image.substring(index + 1)
            //[{name: 'food.jpg', url: 'upload-dir/2/SQ-U14-0.3-3M/SQ-U14-0.3-3m.jpg'}],
            let imageObj = {}
            imageObj.name = name
            imageObj.url = image
            self.fileList2.push(imageObj)
          })


          let category = self.postForm.category
          self.listQuery.oneLevel = category.pId
          console.log("images--------------:" + self.postForm.images)
          self.subDatas = self.datas.filter(data => data.id === category.pId)[0]
          self.listQuery.twoLevel = category.id
        })
        .catch(function(response) {
          console.log(response)
        })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm() {
      let form = this.postForm
      let self = this;
      const id = this.$route.params && this.$route.params.id
      this.$refs.postForm.validate(valid => {
        let apiURL = 'api/goods/add'
        if (this.isEdit) { 
          apiURL = 'api/goods/update'
        }
        if (valid) {
          this.loading = true
          console.log(form.title);
          this.$axios.post(apiURL, {
            id: id,
            category: {
              id: self.listQuery.twoLevel
            },
            title: form.title,
            detail: form.detail,
            size: form.size,
            color: form.color,
            stars: form.stars,
            images: form.images
          })
          .then(function(response) {
              self.$notify({
                title: '成功',
                message: '添加产品成功',
                type: 'success',
                duration: 2000
              })
              form.title = ""
              form.detail = ""
              form.size = ""
              form.color = ""
              form.star = ""
              form.images = ""
              form.fileList2 = []
          })
          .catch(function(error) {
            console.log(error)
          })
          
          self.postForm.status = 'published'
          self.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelForm() {
      this.$router.push({path:'/goods/list'});
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    },
    initData() {
      let cur = this;
      this.$axios
        .get("api/category/categorys/0")
        .then(response => {
          cur.datas = response.data;
          console.log("initdata")
        })
        .catch(function(response) {
          console.log(response);
        })
    },
    // 同步加载数据的方法
    loadData() {
      let cur = this;
      return new Promise((resolve, reject) => {
        cur.$axios
          .get("api/category/categorys/0")
          .then(response => {
            cur.datas = response.data;
            resolve(response.data)
            console.log("loaddata")
          })
          .catch(function(response) {
            reject(response)
            console.log(response);
          })
      })
    },
    selectCategory() {
      this.subDatas = this.datas.filter(data => data.id === this.listQuery.oneLevel)[0]
      console.log(this.subDatas)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      console.log(file)
    },
    submitUpload() {
      this.upLoadData.title = this.postForm.title
      this.upLoadData.categoryId = this.listQuery.twoLevel
  
      console.log(this.upLoadData.title)
      console.log(this.upLoadData.categoryId)
      this.$refs.upload.submit()
    },
    uploadImgSuccess(response, file, fileList) {
      let uploadImages = this.postForm.images
      if (uploadImages == undefined || uploadImages.length == 0) {
        this.postForm.images = response
      } else if (uploadImages.indexOf(response) < 0){
        this.postForm.images += ";" + response
      }

      console.log('images:' + this.postForm.images)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
