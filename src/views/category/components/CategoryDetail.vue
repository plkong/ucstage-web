<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="filter-container">
        <el-select v-model="postForm.pId" :placeholder="$t('category.oneLevel')" clearable  style="width: 150px" class="filter-item">
          <el-option label="一级类别" value="0" />
          <el-option v-for="item in datas" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
      </div>

      <div class="createPost-main-container">
        <el-form-item prop="label" style="margin-bottom: 40px;" label-width="80px" :label="$t('category.title')">
          <el-input v-model="postForm.label" :rows="1" type="textarea" class="article-textarea" autosize :placeholder="$t('category.inputTitle')" />
        </el-form-item>

        <el-form-item prop="remark" style="margin-bottom: 30px;" label-width="80px" :label="$t('category.remark')">
          <el-input v-model="postForm.remark" :rows="1" type="textarea" class="article-textarea" autosize :placeholder="$t('category.inputRemark')" />
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
  label: '', // 文章题目
  remark: '', // 文章内容
  id: undefined
}

export default {
  name: 'CategoryDetail',
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
        label: [{ validator: validateRequire }],
        remakr: [{ validator: validateRequire }],
      },
      pId: null,
      datas: [],
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
      const idurl = "/api/category/" + id
      let self = this
      this.$axios
        .get(idurl)
        .then(function(response) {
          self.postForm = response.data

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
        let apiURL = 'api/category/add'
        if (this.isEdit) { 
          apiURL = 'api/category/update'
        }
        if (valid) {
          this.loading = true
          console.log(form.title);
          this.$axios.post(apiURL, {
            id: id,
            pId: form.pId,
            label: form.label,
            remark: form.remark
          })
          .then(function(response) {
              self.$notify({
                title: '成功',
                message: '添加种类成功',
                type: 'success',
                duration: 2000
              })
              form.label = ""
              form.remark = ""
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
