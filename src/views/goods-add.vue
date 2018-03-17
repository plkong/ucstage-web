<template>
  <el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="选择类别">
    <el-select v-model="categoryLeve1" filterable  placeholder="请选择" v-on:visible-change="selectPCategory()">
      <el-option
        v-for="item in categoryLeve1Data"
        :key="item.id"
        :label="item.label"
        :value="item.id">
      </el-option>
    </el-select>
    
    <el-select
      v-if='categoryLeve1'
      v-model="categoryLeve2"
      filterable 
      collapse-tags
      style="margin-left: 20px;"
      placeholder="请选择">
      <el-option
        v-for="item in categoryLeve2Data"
        :key="item.id"
        :label="item.label"
        :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="产品标题">
    <el-input v-model="form.title"></el-input>
  </el-form-item>
  <el-form-item label="产品描述">
    <!-- <el-input type="textarea" v-model="form.detail"></el-input> -->
    <quill-editor ref="myTextEditor"
                      v-model="form.detail"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)">
        </quill-editor>
  </el-form-item>
  <el-form-item label="产品规格">
    <el-input v-model="form.size"></el-input>
  </el-form-item>
  <el-form-item label="产品颜色">
    <el-input v-model="form.color"></el-input>
  </el-form-item>
  <el-form-item label="产品热度">
    <el-rate v-model="form.stars" :allow-half="false" :show-score="true"></el-rate>
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
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

export default {
  data() {
    return {
      form: {
        title: "",
        size: "",
        color: "",
        stars:"",
        detail: "",
        images: ""
      },
      dialogImageUrl: "",
      dialogVisible: false,
      value: null,
      upLoadData: {},
      fileList2: [],
      categoryLeve1: "",
      categoryLeve2: "",
      categoryLeve1Data: [],
      categoryLeve2Data: [],
      editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }]
            ],
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            }
          }
        }
    };
  },
  mounted: function() {
    let cur = this;
    this.$axios
      .get("api/category/categorys/0")
      .then(response => {
        cur.categoryLeve1Data = response.data;
      })
      .catch(function(response) {
        console.log(response);
      });
  },
  methods: {
    selectPCategory() {
      console.log(this.categoryLeve1);
      if (this.categoryLeve1 === "") {
        return;
      }
      this.categoryLeve2Data = [];
      this.categoryLeve2 = "";

      let cur = this;
      this.$axios
        .get("api/category/categorys/" + this.categoryLeve1)
        .then(response => {
          cur.categoryLeve2Data = response.data;
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    onSubmit() {
      let self = this;
      let id = this.categoryLeve2;
      if (this.categoryLeve2 === null || this.categoryLeve2 === undefined || this.categoryLeve2 === "") {
        id = this.categoryLeve1;
      }
      this.$axios
        .post("api/goods/add", {
          category: {
            id: id
          },
          title: self.form.title,
          detail: self.form.detail,
          size: self.form.size,
          color: self.form.color,
          stars: self.form.stars,
          images: self.form.images
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
      console.log("submit!");
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log(file);
    },
    submitUpload() {
      this.upLoadData.title = this.form.title;
      this.upLoadData.categoryId = this.categoryLeve2;
      if (this.categoryLeve2 === null || this.categoryLeve2 === undefined || this.categoryLeve2 === "") {
        this.upLoadData.categoryId = this.categoryLeve1;
      }
      
      console.log(this.upLoadData.categoryName);
      this.$refs.upload.submit();
    },
    uploadImgSuccess(response, file, fileList) {
      if (this.form.images === "") {
        this.form.images = response;
      } else {
        this.form.images += ";";
        this.form.images += response;
      }
    }
  }
};
</script>

