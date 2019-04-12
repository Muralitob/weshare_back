<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 基础表格
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="文章标题" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.article.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="作者" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.article.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="read_num" label="阅读数" width="120">
        </el-table-column>
        <el-table-column prop="col_num" label="收藏数" width="120">
        </el-table-column>
        <el-table-column prop="like_num" label="喜欢数" width="120">
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间">
            <template slot-scope="scope">
                {{convertUTCTimeToLocalTime(scope.row.create_time)}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row._id)"
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
      degree: '',
      good_type: '',
      idx: -1,
      usedTypeMap: {
        electronic: '电子产品',
        cloth: '服饰',
        electricapp: '电器',
        cosmetics: '化妆品',
        game: '游戏',
        audiovisual: '音像',
        study: '学习用品'
      }
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
      this.url = "/api/article/get_real_articles";
      this.$axios
        .get(this.url, {
            params: {
                page: this.cur_page,
                limit: 10,
                keyword,
            }
          
        })
        .then(({ data }) => {
          this.total = data.total;
          this.tableData = data.articles;
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
     
    },
    handleDelete(uid) {
      // this.idx = index;
      // this.delVisible = true;
      let arr = [];
      arr.push(uid);
      let url = "/api/article/delete_article_by_ids";
      this.$axios
        .delete(url, {
          data: arr
        })
        .then(({ data }) => {
          if (data.code == 108) {
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
