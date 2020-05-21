<template>
  <div class="view-albums-manage">
    <div>
      <el-button size="small" @click="handleShowDialog('add')"
        >添加专辑</el-button
      >
    </div>
    <el-table :data="albumList" v-loading="isLoading">
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.songList">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column label="封面" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.cover" target="_blank">查看</a>
        </template>
      </el-table-column>
      <el-table-column prop="release_time" label="时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleShowDialog('edit', scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
        <!-- 
        <el-form-item label="信息" prop="info">
          <el-input size="mini" v-model="formData.info"></el-input>
        </el-form-item>
        <el-form-item label="录制时间" prop="record_time">
          <el-input size="mini" v-model="formData.record_time"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="genre">
          <el-input size="mini" v-model="formData.genre"></el-input>
        </el-form-item>
        <el-form-item label="厂牌" prop="label">
          <el-input size="mini" v-model="formData.label"></el-input>
        </el-form-item>
        <el-form-item label="录音室" prop="studio">
          <el-input size="mini" v-model="formData.studio"></el-input>
        </el-form-item>
        <el-form-item label="制作人" prop="producer">
          <el-input size="mini" v-model="formData.producer"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input size="mini" v-model="formData.order"></el-input>
        </el-form-item> -->
        <el-form-item label="艺术家" prop="artist">
          <el-input size="mini" v-model="formData.artist"></el-input>
        </el-form-item>
        <el-form-item label="专辑名" prop="title">
          <el-input size="mini" v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="release_time">
          <el-input size="mini" v-model="formData.release_time"></el-input>
        </el-form-item>
        <el-form-item label="专辑封面">
          <el-button
            :disabled="uploadedCover"
            @click="handleSelectCover"
            size="mini"
            >选择专辑封面</el-button
          >
          <el-button
            :disabled="uploadedCover"
            @click="handleUploadCover"
            type="primary"
            size="mini"
            >上传</el-button
          >
          <br />
          <el-input
            :disabled="uploadedCover"
            v-model="coverName"
            placeholder="文件名"
            size="mini"
          />
        </el-form-item>
        <el-form-item v-if="dialogType === 'add'" label="歌曲">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="string"
            :on-success="handleUploadSuccess"
            :http-request="handleCustomUpload"
            :file-list="songList"
            accept="audio/mp3"
            multiple
          >
            <el-button slot="trigger" size="mini" type="primary"
              >选择文件</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="isDialogVisible = false">取消</el-button>
          <el-button @click="beforeSubmitAlbum" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
      <input
        style="display: none"
        type="file"
        ref="cover"
        @change="handleCoverChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  uploadSongFile,
  addSongs,
  uploadAlbumCover,
  addAlbum,
  setAlbumSongs,
  getAlbums,
  editAlbum
} from "../../api/mini-song";
import { updateFileRecord } from "../../api/mini-file";

export default {
  name: "",
  components: {},
  filters: {},
  mixins: [],
  props: [],
  data() {
    return {
      // table
      isLoading: false,
      albumList: [],
      // dialog
      dialogType: "add",
      isDialogVisible: false,
      editId: "",
      // album
      formData: {
        artist: "The Beatles",
        title: "",
        release_time: ""
      },
      formRules: {
        artist: [{ required: true, message: "缺少作者", trigger: "blur" }],
        title: [{ required: true, message: "缺少标题", trigger: "blur" }],
        release_time: [{ required: true, message: "缺少时间", trigger: "blur" }]
      },
      // songs
      songList: [],
      // cover
      coverFile: null,
      uploadedCover: false,
      coverName: ""
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  mounted() {
    this.getAlbums();
  },
  beforeUpdate() {},
  methods: {
    // table
    getAlbums() {
      this.isLoading = true;
      getAlbums()
        .then(albums => {
          this.albumList = albums;
        })
        .catch(this.$error)
        .then(_ => {
          this.isLoading = false;
        });
    },
    // dialog
    handleShowDialog(type, row) {
      this.coverFile = null;
      this.uploadedCover = false;
      this.coverName = "";

      this.editId = "";
      this.formData.release_time = "";
      this.formData.title = "";
      this.formData.artist = "The Beatles";

      this.songList = [];
      if (type === "edit") {
        const { _id, title, artist, release_time } = row;
        this.editId = _id;
        this.formData.release_time = release_time;
        this.formData.title = title;
        this.formData.artist = artist;
        this.coverName = "留空时不修改图片";
      }
      this.dialogType = type;
      this.isDialogVisible = true;
    },
    // cover
    handleCoverChange(e) {
      const file = e.target.files[0];
      if (!file) {
        this.coverName = "";
        this.coverFile = null;
        return;
      }
      this.coverName = file.name;
      this.uploadFileExt = file.name.substring(file.name.lastIndexOf("."));
      this.coverFile = file;
    },
    handleSelectCover() {
      this.$refs.cover.value = "";
      this.$refs.cover.click();
    },
    handleUploadCover() {
      if (!this.coverFile) return this.$message.error("请选择文件");
      if (!this.coverName) return this.$message.error("输入文件名");
      let filename = "";
      if (
        this.coverName.substring(this.coverName.lastIndexOf(".")) ===
        this.uploadFileExt
      ) {
        filename = this.coverName;
      } else {
        filename = this.coverName + this.uploadFileExt;
      }
      uploadAlbumCover(this.coverFile, filename)
        .then(({ fileId, filename, filePath }) => {
          this.formData.cover = fileId; // cloud_id
          this.$success("上传成功");
          this.coverName = filename;
          this.uploadedCover = true;
        })
        .catch(err => {
          this.$error("图片上传失败: " + err);
        });
    },
    // songs/el-upload
    handleUploadSuccess(response, file, fileList) {
      // el-upload 这个组件略奇葩
      // file-list 并没有实现双向绑定
      // http-request 结束之后，file-list 打印一下是空的
      // 但是又不能在每个请求完成的时候给 file-list push 文件
      // 会报错，只能直接赋值
      // this.songList.push(file);
      this.songList = fileList;
    },
    // http-request 需要返回一个 promise
    // 文档没说，看一下 element-ui 的源码
    handleCustomUpload(wrappedFile) {
      const { file } = wrappedFile;
      return uploadSongFile(file, file.name, percent => {
        wrappedFile.onProgress({ percent }); //进度条
      });
    },
    // upload
    beforeSubmitAlbum() {
      this.$confirm("确定？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        if (this.dialogType === "add") {
          this.submitAddAlbum();
        } else {
          this.submitEditAlbum();
        }
      });
    },
    submitAddAlbum() {
      if (!this.uploadedCover) return this.$message.error("没上传封面");

      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            // 上传 album，获取 album_id
            const albumData = {
              artist: this.formData.artist,
              title: this.formData.title,
              release_time: this.formData.release_time,
              song_id: [],
              cover_id: this.formData.cover, // cloud_id
              //
              record_time: "",
              genre: "",
              label: "",
              studio: "",
              producer: "",
              order: 0,
              info: ""
            };
            const album_id = await addAlbum(albumData); // _id
            // 上传 songs，获取 song_ids
            const songCloudId = [];
            const songData = this.songList.map(({ response }) => {
              const { fileId, filePath, filename } = response;
              songCloudId.push(fileId);
              const pureName = filename.substring(0, filename.lastIndexOf("."));
              return {
                title: pureName, // 无扩展名
                album_id,
                cloud_id: fileId,
                //
                writer: "",
                singer: "",
                studio: "",
                side: "", // A/B
                order: 0,
                lyrics: "",
                info: ""
              };
            });
            // 数据库 _id
            const songIds = await addSongs(songData);
            // 更新 album 的 song_id 字段
            const result = await setAlbumSongs(album_id, songIds);
            this.$success(result);
            this.getAlbums();
            this.isDialogVisible = false;
            // 更新封面图和歌曲文件的使用状态
            updateFileRecord([this.formData.cover, ...songCloudId])
              .then(() => {
                this.$message("file 表更新成功");
              })
              .catch(err => {
                this.$error("更新 file 表失败: " + err);
              });
          } catch (err) {
            this.$error(err);
          }
        }
      });
    },
    submitEditAlbum() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const albumInfo = {
            artist: this.formData.artist,
            title: this.formData.title,
            release_time: this.formData.release_time
          };
          if (this.uploadedCover) {
            albumInfo.cover_id = this.formData.cover;
          }
          editAlbum(this.editId, albumInfo)
            .then(res => {
              this.$success(res);
              this.getAlbums();
              this.isDialogVisible = false;
            })
            .catch(this.$error);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
