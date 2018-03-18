<template>
  <div>
    <el-row style="padding-top: 10px">
      <el-col>
        <el-button type="success" @click="generateHtml()">生成静态网站</el-button>
      
        <el-button type="success"><a href="http://localhost:8081/pages/goods/2.html" target="_blank">打开页面</a></el-button>
        
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import consoles from '../../components/Consoles.vue'
  export default {
    components: {
      consoles
    },
    methods: {
      generateHtml(){
        let self = this;
        this.$axios
        .get("api/generate")
        .then(response => {
           self.$message({
              showClose: true,
              message: "生成成功",
              type: "success"
            });
        })
        .catch(function(response) {
          self.$message({
              showClose: true,
              message: "生成失败",
              type: "error"
            });
        });
      }
    }

  }
</script>
