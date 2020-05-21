<template>
  <div class="view-articles-book">
    <div class="tool-bar">
      <el-button type="primary" @click="handleShowDialog('add')"
        >新增</el-button
      >
    </div>
    <!---->
    <div class="books-wrapper">
      <div
        v-for="(book, index) in bookList"
        :key="index"
        :data-id="book._id"
        class="book"
      >
        <img class="book__cover" :src="book.url" />
        <p class="book__title">{{ book.title }}</p>
        <p class="book__author">{{ book.author }}</p>
        <p class="book__intro">{{ book.intro }}</p>
        <p class="book__editor">
          <el-link :underline="false" @click="handleShowDialog('edit', book)"
            >编辑信息</el-link
          >
          <el-link :underline="false" @click="handleEditArticle(book)"
            >编辑文章</el-link
          >
        </p>
      </div>
    </div>
    <!-- 新增/修改 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增' : '修改'"
      :visible="isDialogVisible"
      :before-close="() => (isDialogVisible = false)"
    >
      <el-form
        :model="formData"
        :rules="formRules"
        label-width="80px"
        ref="form"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="formData.author"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="formData.intro"></el-input>
        </el-form-item>
        <el-form-item label="封面图">
          <el-button :disabled="uploaded" @click="handleSelectFile"
            >选择图片</el-button
          >
          <el-button
            :disabled="uploaded"
            @click="handleUploadFile"
            type="primary"
            >上传</el-button
          >
          <br />
          <el-input
            :disabled="uploaded"
            v-model="uploadFilename"
            placeholder="文件名"
          />
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="isDialogVisible = false">取消</el-button>
          <el-button @click="beforeSubmitBook" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
      <input
        style="display: none"
        type="file"
        ref="file"
        @change="handleFileChange"
      />
    </el-dialog>
    <!-- 设置文章 -->
    <el-dialog
      title="添加文章"
      :visible="isArticleDialogVisible"
      :before-close="() => (isArticleDialogVisible = false)"
      class="add-article"
    >
      <el-transfer v-model="rightList" :data="leftList"></el-transfer>
      <div style="text-align:right; margin-top: 20px">
        <el-button @click="beforeSubmitArticle" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getArticleList, updateArticleBook } from "../../api/mini-article";
import {
  uploadBookCover,
  getBookList,
  addBook,
  editBook
} from "../../api/mini-book";
import { addFileRecord, updateFileRecord } from "../../api/mini-file";
import { genFileURL } from "../../utils/wx";

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      isArticleDialogVisible: false,
      isDialogVisible: false,
      dialogType: "add",
      bookId: "", // if edit
      // upload file
      file: null,
      uploadFilename: "",
      uploadFileExt: "",
      uploaded: false,
      // form
      formData: {
        title: "",
        author: "",
        intro: "",
        cover: "" // cover_id
      },
      formRules: {
        title: [{ required: true, message: "缺少标题", trigger: "blur" }],
        author: [{ required: true, message: "缺少作者", trigger: "blur" }],
        intro: [{ required: true, message: "缺少简介", trigger: "blur" }]
      },
      // table
      bookListRaw: [],
      // 书籍下属文章
      selectedBookId: "",
      selectedBookTitle: "",
      leftList: [],
      rightList: []
    };
  },
  computed: {
    bookList() {
      return this.bookListRaw.map(ele => {
        return {
          ...ele,
          url: genFileURL(ele.cover_id)
        };
      });
    }
  },
  watch: {},
  beforeCreate() {},
  created() {
    this.getBooks();
  },
  mounted() {},
  beforeUpdate() {},
  methods: {
    getBooks() {
      getBookList()
        .then(({ data }) => (this.bookListRaw = data))
        .catch(this.$message.error);
    },
    // 新增/编辑书籍
    handleShowDialog(type, bookInfo) {
      this.dialogType = type;

      this.file = null;
      this.uploadFilename = "";
      this.uploadFileExt = "";
      this.uploaded = false;

      this.formData.title = "";
      this.formData.author = "";
      this.formData.intro = "";
      this.formData.cover = "";
      if (type === "edit") {
        const { _id, author, title, intro } = bookInfo;
        this.bookId = _id;
        this.formData.title = title;
        this.formData.author = author;
        this.formData.intro = intro;
        this.uploadFilename = "留空时不修改图片";
      }

      this.isDialogVisible = true;
    },
    beforeSubmitBook() {
      if (this.dialogType === "add") {
        this.submitAddBook();
      } else {
        this.submitEditBook();
      }
    },
    submitAddBook() {
      if (!this.uploaded) return this.$message.error("没选封面图");
      this.$confirm("确定？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 提交到数据库的 query，用下划线
            const bookInfo = {
              author: this.formData.author,
              article_id: [],
              cover_id: this.formData.cover,
              intro: this.formData.intro,
              status: "",
              title: this.formData.title,
              type: "book"
            };
            addBook(bookInfo)
              .then(() => {
                this.$success("添加成功");
                this.isDialogVisible = false;
                this.getBooks();
                updateFileRecord([this.formData.cover])
                  .then(() => {
                    this.$message("file 表更新成功");
                  })
                  .catch(err => {
                    this.$message.error("更新 file 表失败: " + err);
                  });
              })
              .catch(err => {
                this.$message.error("添加失败: " + err);
              });
          } else {
            return false;
          }
        });
      });
    },
    // 编辑书籍信息
    submitEditBook() {
      this.$confirm("确定？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$refs.form.validate(valid => {
          if (valid) {
            const bookInfo = {
              author: this.formData.author,
              intro: this.formData.intro,
              title: this.formData.title
            };
            if (this.uploaded) {
              bookInfo.cover_id = this.formData.cover;
            }
            // update
            editBook(this.bookId, bookInfo)
              .then(() => {
                this.$success("修改成功");
                this.isDialogVisible = false;
                this.getBooks();
                if (this.uploaded) {
                  updateFileRecord([this.formData.cover])
                    .then(() => {
                      this.$message("file 表更新成功");
                    })
                    .catch(err => {
                      this.$message.error("更新 file 表失败: " + err);
                    });
                }
              })
              .catch(err => {
                this.$message.error("添加失败: " + err);
              });
          } else {
            return false;
          }
        });
      });
    },
    // 修改下属文章
    handleEditArticle(bookInfo) {
      this.isArticleDialogVisible = true;
      this.selectedBookId = bookInfo._id;
      this.selectedBookTitle = bookInfo.title;
      this.leftList = [];
      this.rightList = [];
      this.getArticles();
    },
    getArticles() {
      getArticleList()
        .then(data => {
          data.forEach(article => {
            const { bookId, realId, title } = article;
            if (bookId === "" || bookId === this.selectedBookId) {
              this.leftList.push({
                key: realId,
                label: title
              });
              if (bookId === this.selectedBookId) {
                this.rightList.push(realId);
              }
            }
          });
        })
        .catch(this.$error);
    },
    beforeSubmitArticle() {
      const newSelectedIds = this.rightList; // id
      const newUnselectedIds = this.leftList
        .filter(article => !newSelectedIds.includes(article.key))
        .map(article => article.key); // key: realId
      const taskList = [];
      // 1. 新选中
      if (newSelectedIds.length) {
        taskList.push(
          updateArticleBook(
            newSelectedIds,
            this.selectedBookId,
            this.selectedBookTitle
          )
        );
      }
      // 2. 新取消
      if (newUnselectedIds.length) {
        taskList.push(updateArticleBook(newUnselectedIds, "", ""));
      }
      // databasemigrateexport 接口有并发限制，这个貌似没有？
      Promise.all(taskList)
        .then(() => {
          this.$success("修改成功");
          this.isArticleDialogVisible = false;
        })
        .catch(this.$message.error);
    },
    // 上传文件
    handleSelectFile() {
      this.$refs.file.value = "";
      this.$refs.file.click();
    },
    handleUploadFile() {
      if (!this.file) return this.$message.error("请选择文件");
      if (!this.uploadFilename) return this.$message.error("输入文件名");
      let filename = "";
      if (
        this.uploadFilename.substring(this.uploadFilename.lastIndexOf(".")) ===
        this.uploadFileExt
      ) {
        filename = this.uploadFilename;
      } else {
        filename = this.uploadFilename + this.uploadFileExt;
      }
      uploadBookCover(this.file, filename)
        .then(({ fileId, filename, filePath }) => {
          this.formData.cover = fileId;
          this.$success("上传成功");
          this.uploadFilename = filename;
          this.uploaded = true;
        })
        .catch(err => {
          this.$message.error("图片上传失败: " + err);
        });
    },
    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file) {
        this.uploadFilename = "";
        this.file = null;
        return;
      }
      this.uploadFilename = file.name;
      this.uploadFileExt = file.name.substring(file.name.lastIndexOf("."));
      this.file = file;
    }
  }
};
</script>

<style lang="less">
.tool-bar {
  margin-bottom: 20px;
}
.books-wrapper {
  display: grid;
  grid-template-columns: 33% 33% 33%;
  .book {
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0px 2px 2px 2px #ccc;
    text-align: center;
    margin-bottom: 20px;
    p {
      text-align: left;
    }
    .book__cover {
      width: 200px;
    }
    .book__title {
      font-weight: bold;
      font-size: 18px;
    }
    .book__author {
    }
    .book__intro {
    }
    .book__editor {
      span {
        margin-right: 10px;
      }
    }
  }
}
.el-dialog__wrapper.add-article {
  .el-dialog {
    min-width: 700px;
    .el-dialog__body {
      .el-transfer {
        .el-transfer-panel {
          width: 33%;
        }
      }
    }
  }
}
</style>
