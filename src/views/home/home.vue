<template>
  <div>
    <el-row style="padding-top: 10px">
      <el-col>
        <el-button type="success" @click="generateHtml()">生成静态网站</el-button>
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
        this.$axios
        .get("api/generate")
        .then(response => {
           console.log(response);
        })
        .catch(function(response) {
          console.log(response);
        });
      }
    }

  }
</script>
