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
          
          <el-select
            v-model="categoryLeve2"
            filterable 
            collapse-tags
            style="margin-left: 20px;"
            placeholder="请选择" @change="onChange()">
            <el-option
              v-for="item in categoryLeve2Data"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
        </el-form>
        <!-- <Category-filterinput></Category-filterinput> -->
        <el-table
                :data="tableData"
                border
                style="width: 100%"
                class="table">
            <el-table-column
                    fixed
                    prop="id"
                    label="ID"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="category.label"
                    label="类别名称"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="名称"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="color"
                    label="颜色"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="size"
                    label="规格"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="stars"
                    label="热度"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="detail"
                    label="详情"
                    width="400">
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
      apiUrl: "/api/goods/query",
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogFormVisible: false,
      form: "",
      deleteDialogVisible: false,
      curIndex: 0,
      categoryLeve1: "",
      categoryLeve2: "",
      categoryLeve1Data: [],
      categoryLeve2Data: []
    };
  },
  components: {
    CategoryUpdatedialog,
    CategoryFilterinput
  },
  mounted() {
    this.onChange();
    let cur = this;
    this.$axios
      .get("api/category/categorys/0")
      .then(response => {
        console.log(response.data);
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
    dialogVisible: function() {
      this.dialogFormVisible = false;
    },

    onChange: function() {
      let categoryId = this.categoryLeve2;
      if (
        this.categoryLeve2 === null ||
        this.categoryLeve2 === undefined ||
        this.categoryLeve2 === ""
      ) {
        categoryId = this.categoryLeve1;
      }
      this.$axios
        .get(this.apiUrl, {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            categoryId: categoryId
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
      const idurl = "/api/goods/" + id;
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