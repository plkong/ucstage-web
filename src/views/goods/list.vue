<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row height="650" style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="category">
        <template slot-scope="scope">
          <span>{{ scope.row.category.label }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="title">
        <template slot-scope="scope">
          <router-link :to="'/goods/edit/'+scope.row.id" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="stars">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.stars" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column  label="detail">
        <template slot-scope="scope">
          <div v-html="scope.row.detail"></div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="190">
        <template slot-scope="scope" >
          <router-link :to="'/goods/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button type="primary" size="small" icon="el-icon-delete" @click="openDeleteDialog(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="警告"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <span>确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteGoods">确 定</el-button>
      </span>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'GoodsList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      dialogVisible: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      deleteGoodsId: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      console.log("query..........")
      this.listLoading = true
      let cur = this;
      this.$axios
        .get('/api/goods/query', {
          params: {
            pageNum: cur.listQuery.page,
            pageSize: cur.listQuery.limit,
            categoryId: 0
          }
        })
        .then(response => {
          cur.list = response.data.list;
          cur.total = response.data.total;
          cur.listLoading = false
          console.log(response.data);
        })
        .catch(function(response) {
          console.log(response);
          cur.listLoading = false
        })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    openDeleteDialog(id) {
      this.dialogVisible = true
      this.deleteGoodsId = id
      console.log(id)
    },
    deleteGoods() {
      const idurl = "/api/goods/" + this.deleteGoodsId
      let self = this
      
      this.$axios
        .delete(idurl)
        .then(function(response) {
          self.dialogVisible = false
          console.log(response)
          self.getList()
        })
        .catch(function(response) {
          console.log(response)
        });
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
