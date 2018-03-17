<template>
<div>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      fixed
      prop="id"
      label="ID"
      width="120">
    </el-table-column>
    <el-table-column
      prop="name"
      label="类别名称"
      width="150">
    </el-table-column>
    <el-table-column
      prop="parentID"
      label="父类别ID"
      width="120">
    </el-table-column>
    <el-table-column
      prop="parentName"
      label="父类别名称"
      width="150">
    </el-table-column>
    <el-table-column
      prop="des"
      label="描述"
      width="300">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="Operations"
      width="150">
      <template slot-scope="scope">
        <el-button @click="handleClick" type="text" size="small">更新</el-button>
        <el-button @click="dialogVisible = true" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
 <el-dialog
  title="Tips"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>This is a message</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
  </span>
</el-dialog>
  
</div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

<script>
  export default {
    data() {
      return {
        tableData: [{
          id: '2016-05-03',
          name: 'Tom',
          parentID: 'California',
          parentName: 'Los Angeles',
          des: 'No. 189, Grove St, Los Angeles',
          tag: 'Home'
        }],
        dialogVisible: false
      }
    },
    props: ['dialogFormVisible', 'form'],
    methods: {
      handleClick() {
        console.log('click');
      }
    }
  }
</script>
