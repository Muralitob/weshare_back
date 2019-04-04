<template>
  <div id="text-contribute">
    <el-input v-model="article.title" size="large" placeholder="请输入标题"/>
    <Editor v-model="article.content" @summary="returnSummary"></Editor>
    <!-- <div class="block-wrap">
      <h3 class="block-title">
        <p>添加标签</p>
        <span class="tip">{{(`还可以添加${restCount}个标签`)}}</span>
      </h3>
      <div class="tag-wrap">
        <Tag
          color="primary"
          v-for="item in tagLists"
          :key="item"
          :name="item"
          closable
          @on-close="colseTag"
        >{{item}}</Tag>
        <Input @on-enter="addTag" :maxlength="8" clearable style="width: 100px" v-model="inputTag"/>
        <span>按回车键添加</span>
      </div>
    </div> -->
    <div class="btn-bar">
      <el-button class="handleArticle" type="success" @click="handleArticle('real')">提交文章</el-button>
    </div>
  </div>
</template>

<script>
import Editor from "../common/Editor";
// import general from "../../general/js";
export default {
  components: {
    Editor
  },
  data() {
    return {
      article: {
        content: "",
        summary: "",
        title: ""
      }, //文章
      draftsList: [],
      activeTab: "edit",
      tagLists: [], //标签
      inputTag: "",
      total: 0
    };
  },
  computed: {
    restCount() {
      return 10 - this.tagLists.length;
    }
  },
  methods: {
    reciveContent(content) {
      // console.log(content)
    },
    addTag() {
      if (this.inputTag) {
        this.tagLists.push(this.inputTag);
      }
      this.tagLists = [...new Set(this.tagLists)];
      this.inputTag = "";
    },
    colseTag(event, name) {
      const index = this.tagLists.indexOf(name);
      this.tagLists.splice(index, 1);
    },
    handleArticle(category) {
      let url = "/api/news/news";
      let _id = this.$route.params.article_id
      this.$axios
        .put(url, {
          _id,
          article: this.article,
        })
        .then(({ data }) => {
          this.$message.success("编辑成功");
          this.$router.push({name: 'articlelist'})
          this.article = {}
        })
        .catch(err => {});
    },
    changepage(index) {
      this.getDrafts("drafts", index);
    },
    getDrafts(obj) {
      // console.log(name)
      this.activeTab = obj.name;
      if (name === "drafts") {
        api
          .getArticles("fake", 1)
          .then(({ data }) => {
            this.draftsList = data.articles;
            console.log(this.draftsList);
            this.total = data.length;
          })
          .catch(err => {
            // this.$Message.error(general.translate(data.code));
          });
      }
    },
    returnSummary(data) {
      this.article.summary = data;
    },
    getData(_id) {
      let url = "/api/news/get_new_by_id"
      this.$axios.get(url, {
        params: {
          _id
        }
      }).then(({data}) => {
        this.article = data.new.article
        console.log(data)
      }).catch((err) => {
        
      });
    },
  },
  created() {
    this.getData(this.$route.params.article_id)
  }
};
</script>

<style lang="scss">
#text-contribute {
  position: relative;
}
.handleArticle {
  /* position: absolute;
    bottom: 0; */
}
.draft-pageBox {
  padding: 20px 20px;
  background-color: #fff;
}
.btn-bar {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  button {
    margin: 0 20px;
  }
}
.block-wrap {
  margin: 20px 0;
}
.block-title {
  display: flex;
  align-items: center;
  padding: 6px 0;
  span {
    color: #99a2aa;
    padding-left: 8px;
  }
}
.tag-wrap {
  span {
    color: #99a2aa;
    padding-left: 8px;
  }
}
.draft-card {
  background-color: #fff;
  height: 12rem;
  padding: 20px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  .meta-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .meta-summary {
    font-size: 14px;
    line-height: 20px;
    color: #99a2aa;
    padding: 5px 0 10px;
    word-wrap: break-word;
    word-break: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  p {
    color: #99a2aa;
  }
}
</style>
