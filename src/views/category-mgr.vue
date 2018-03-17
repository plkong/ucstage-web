<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="选择类别">
                <el-select v-model="categoryLeve1" filterable  placeholder="请选择" v-on:visible-change="selectPCategory()" @change="onChange()">
                    <el-option
                        v-for="item in categoryLeve1Data"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                border
                style="width: 100%"
                class="table">
            <el-table-column
                    fixed
                    prop="id"
                    label="类别ID"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="label"
                    label="类别名称"
                    width="250">
            </el-table-column>
            <el-table-column
                    prop="pId"
                    label="父类别"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注"
                    width="300">
            </el-table-column>
            <el-table-column
                    label="Operation"
                    width="150">
                <template scope="scope">
                    <el-button @click="editItem(scope.$index, tableData)" type="text" size="large">Edit</el-button>
                    <el-button @click="deleteItem(scope.$index, tableData)" type="text" size="large">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination" layout="prev, pager, next" :total="total" :page-size="pageSize"
                       v-on:current-change="changePage">
        </el-pagination>
        <category-updatedialog :dialogFormVisible="dialogFormVisible" :form="form" v-on:canclemodal="dialogVisible"></category-updatedialog>
        <el-dialog
          center="true"
          :visible.sync="deleteDialogVisible"
          width="30%"
          :before-close="handleClose">
          <span>确认删除？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="deleteConfirm()">确认</el-button>
          </span>
        </el-dialog>
    </div>

</template>

<script>
import Bus from "../eventBus.js";
import CategoryUpdatedialog from "./CategoryUpdatedialog.vue";
import CategoryFilterinput from "./CategoryFilterinput.vue";

export default {
  data() {
    return {
      tableData: [],
      apiUrl: "/api/category/query",
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogFormVisible: false,
      form: "",
      deleteDialogVisible: false,
      categoryLeve1: "",
      categoryLeve1Data: []
    };
  },
  components: {
    CategoryUpdatedialog,
    CategoryFilterinput
  },
  mounted() {
    // Bus.$on('filterResultData', (data) => {
    //     console.log("dddddddddd" + data)
    //     this.tableData = data.data;

    // });
    this.onChange();
  },

  methods: {
    selectPCategory() {
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
    onChange: function() {
      this.$axios
        .get(this.apiUrl, {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            pId: this.categoryLeve1
          }
        })
        .then(response => {
          this.tableData = response.data.list;
          this.total = response.data.total;
          this.pageSize = response.data.pageSize;
          console.log(response.data);
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    changePage: function(currentPage) {
      this.currentPage = currentPage;
      this.onChange();
    },
    editItem: function(index, rows) {
      this.dialogFormVisible = true;
      const itemId = rows[index].id;
      const idurl = "/api/persons/detail/" + itemId;
      this.$axios
        .get(idurl)
        .then(response => {
          this.form = response.data;
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    deleteItem: function(index) {
      this.deleteDialogVisible = true;
      this.curIndex = index;
    },
    deleteConfirm() {
      let id = this.tableData[this.curIndex].id;
      const idurl = "/api/category/" + id;
      let self = this;
      this.$axios
        .delete(idurl)
        .then(function(response) {
          self.deleteDialogVisible = false;
          self.onChange();
          console.log(response);
        })
        .catch(function(response) {
          console.log(response);
        });
    },
    formatter(row, column) {
      // let data = this.$moment(row.create_datetime, this.$moment.ISO_8601);
      // return data.format('YYYY-MM-DD')
      return "";
    }
  }
};
</script>

<style>
.table {
  margin-top: -15px;
}

.pagination {
  margin-top: 10px;
  float: right;
}
</style>