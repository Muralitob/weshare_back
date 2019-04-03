<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 新闻列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="origin" label="来源" width="150"></el-table-column>
        <el-table-column prop="title" label="标题" width="120"></el-table-column>
        <el-table-column prop="read_num" label="阅读数" width="120"></el-table-column>
        <el-table-column prop="update_time" label="更新时间">
            <template slot-scope="scope">
                {{convertUTCTimeToLocalTime(scope.row.update_time)}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="reset(scope.row.uid)"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row.uid)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="50px">
        <el-form-item label="日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.date"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "basetable",
  data() {
    return {
      url: "./vuetable.json",
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      total: 1,
      form: {
        name: "",
        date: "",
        address: ""
      },
      idx: -1
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取 easy-mock 的模拟数据
    getData(keyword) {
      // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      this.url = "/api/news/news";
      this.$axios
        .get(this.url, {
            params: {
                page: this.cur_page,
                keyword
            }
          
        })
        .then(({ data }) => {
          this.total = data.total;
          this.tableData = data.news;
        });
    },
    search() {
      this.is_search = true;
      this.getData(this.select_word)
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    reset(uid) {
      this.url = "/api/user/reset_password_from_admin";
      let uids = []
      uids.push(uid)
      this.$axios
        .post(this.url, {
            uids
        })
        .then(({ data }) => {
            if(data.code == 217) {
                this.$message.success("重置成功");
            }
          console.log(data);
        });
    },
    handleDelete(uid) {
      // this.idx = index;
      // this.delVisible = true;
      let arr = [];
      arr.push(uid);
      let url = "/api/news/news";
      this.$axios
        .delete(url, {
          data: {
            news_ids: arr
          }
        })
        .then(({ data }) => {
          if (data.code == 219) {
            this.getData();
            this.$message.success("删除成功");
          }
        });
    },
    delAll() {
      let url = "/api/user/user";
      this.$axios
        .delete(url, {
          data: {
            user_uids: this.multipleSelection
          }
        })
        .then(({ data }) => {
          if (data.code == 219) {
            this.getData();
            this.$message.success("删除成功");
          }
        });
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = Object.values(val).map(e => {
        return e.uid
      });
    },
    // 保存编辑
    saveEdit() {
      this.$set(this.tableData, this.idx, this.form);
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
    },
    // 确定删除
    deleteRow() {
      this.tableData.splice(this.idx, 1);
      this.$message.success("删除成功");
      this.delVisible = false;
    },
    convertUTCTimeToLocalTime: function(UTCDateString) {
      if (!UTCDateString) {
        return "-";
      }
      function formatFunc(str) {
        //格式化显示
        return str > 9 ? str : "0" + str;
      }
      var date2 = new Date(UTCDateString); //这步是关键
      var year = date2.getFullYear();
      var mon = formatFunc(date2.getMonth() + 1);
      var day = formatFunc(date2.getDate());
      var hour = date2.getHours();
      var noon = hour >= 12 ? "PM" : "AM";
      hour = hour >= 12 ? hour - 12 : hour;
      hour = formatFunc(hour);
      var min = formatFunc(date2.getMinutes());
      var dateStr =
        year + "-" + mon + "-" + day + " " + noon + " " + hour + ":" + min;
      return dateStr;
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
</style>
