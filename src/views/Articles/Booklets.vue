<template>
  <div class="view-articles-booklets">
    <div>
      <el-button type="primary" @click="handleShowDialog('add')"
        >新增</el-button
      >
    </div>
    <el-table :data="bookletList" v-loading="isLoading">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.articles">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="title" label="标题">
              <template slot-scope="scope">
                <a :href="scope.row.url">{{ scope.row.title }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="digest" label="简介"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleShowDialog('edit', scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogType === 'add' ? '新增' : '编辑'"
      :visible="isDialogVisible"
      :before-close="() => (isDialogVisible = false)"
    >
      <el-input v-model="bookletTitle" placeholder="标题" />
      <el-transfer v-model="rightList" :data="leftList"></el-transfer>
      <div style="text-align:right; margin-top: 20px">
        <el-button @click="beforeSubmitBooklet" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getArticleList, updateArticleBook } from "../../api/mini-article";
import { getBookletList, addBooklet, editBook } from "../../api/mini-book";

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      dialogType: "add",
      isDialogVisible: false,
      bookletList: [],
      isLoading: false,
      // form
      cacheTitle: "",
      bookletId: "",
      bookletTitle: "",
      leftList: [],
      rightList: []
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    this.getBookletList();
  },
  mounted() {},
  beforeUpdate() {},
  methods: {
    // 新建/编辑
    beforeSubmitBooklet() {
      if (!this.bookletTitle) return;
      this.$confirm("确定？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        // 新选中
        const newSelectedIds = this.rightList; // id
        // 新建
        if (this.dialogType === "add") {
          const bookInfo = {
            article_id: [],
            title: this.bookletTitle,
            type: "booklet"
          };
          // 先创建 booklet
          addBooklet(bookInfo)
            .then(({ id_list }) => {
              const _id = id_list[0];
              // 再用返回值 _id 更新
              if (newSelectedIds.length) {
                updateArticleBook(newSelectedIds, _id, this.bookletTitle)
                  .then(_ => {
                    this.$success("添加成功");
                    this.isDialogVisible = false;
                    this.getBookletList();
                  })
                  .catch(this.$error);
              } else {
                this.$success("添加成功");
                this.isDialogVisible = false;
                this.getBookletList();
              }
            })
            .catch(this.$error);
        }
        // 编辑
        else {
          const taskList = [];
          if (newSelectedIds.length) {
            taskList.push(
              updateArticleBook(
                newSelectedIds,
                this.bookletId,
                this.bookletTitle
              )
            );
          }
          // 新取消选中
          const newUnselectedIds = this.leftList
            .filter(article => !newSelectedIds.includes(article.key))
            .map(article => article.key); // key: realId
          if (newUnselectedIds.length) {
            taskList.push(updateArticleBook(newUnselectedIds, "", ""));
          }
          // 修改标题
          if (this.cacheTitle !== this.bookletTitle) {
            const bookInfo = {
              title: this.bookletTitle
            };
            taskList.push(editBook(this.bookletId, bookInfo));
          }
          Promise.all(taskList)
            .then(() => {
              this.$success("修改成功");
              this.isDialogVisible = false;
              this.getBookletList();
            })
            .catch(this.$error);
        }
      });
    },
    // api
    getBookletList() {
      this.isLoading = true;
      getBookletList()
        .then(({ data }) => {
          console.log(data);
          this.bookletList = data;
        })
        .catch(this.$error)
        .then(_ => {
          this.isLoading = false;
        });
    },
    // 穿梭框数据
    getArticles() {
      getArticleList()
        .then(data => {
          data.forEach(article => {
            const { bookId, realId, title } = article;
            if (this.dialogType === "add") {
              if (bookId === "") {
                this.leftList.push({
                  key: realId,
                  label: title
                });
              }
            } else {
              if (bookId === "" || bookId === this.bookletId) {
                this.leftList.push({
                  key: realId,
                  label: title
                });
                if (bookId === this.bookletId) {
                  this.rightList.push(realId);
                }
              }
            }
          });
        })
        .catch(this.$error);
    },
    //
    handleShowDialog(type, row) {
      this.dialogType = type;
      this.leftList = [];
      this.rightList = [];
      if (type === "add") {
        this.bookletTitle = "";
      } else {
        const { title, _id } = row;
        this.bookletId = _id;
        this.bookletTitle = title;
        this.cacheTitle = title;
      }
      this.getArticles();
      this.isDialogVisible = true;
    }
  }
};
</script>

<style lang="less">
.el-transfer {
  .el-transfer-panel {
    width: 40%;
  }
}
</style>
