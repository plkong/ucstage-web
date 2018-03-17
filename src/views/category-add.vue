<template>
  <el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="选择类别">
    <el-select v-model="form.pId" placeholder="请选择产品类别" filterable v-on:visible-change="selectPCategory">
      <el-option key="0" label="一级类别" value="0"></el-option>
      <el-option
        v-for="item in type_options"
        :key="item.id"
        :label="item.label"
        :value="item.id">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="类别标题">
    <el-input v-model="form.label"></el-input>
  </el-form-item>
  <el-form-item label="类别描述">
    <el-input type="textarea" v-model="form.remark"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit(form)">立即创建</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>
</template>

<style>

</style>
<script>
export default {
  data() {
    return {
      form: {
        pId: "",
        label: "",
        remark: ""
      },
      type_options: [],
      fileList2: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    selectPCategory(params) {
      if (params) {
        this.$axios
          .get("api/category/categorys/0")
          .then(response => {
            this.type_options = response.data;
            console.log(response.data);
          })
          .catch(function(response) {
            console.log(response);
          });
      }
    },
    onSubmit(formName) {
      let pId = formName.pId;
      let label = formName.label;
      let remark = formName.remark;
      this.$axios.post('api/category/add', {
            pId: pId,
            label: label,
            remark: remark
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>

