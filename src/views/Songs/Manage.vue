<template>
  <div class="view-albums-manage">
    <div>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="string"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :on-remove="handleRemove"
        :on-progress="handleProgress"
        :before-upload="handleBeforeUpload"
        :http-request="handleCustomUpload"
        :file-list="fileList"
        accept="audio/mp3"
        multiple
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </div>
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
        <el-form-item label="排序" prop="order">
          <el-input size="mini" v-model="formData.order"></el-input>
        </el-form-item>
        <el-form-item label="专辑名" prop="title">
          <el-input size="mini" v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="艺术家" prop="artist">
          <el-input size="mini" v-model="formData.artist"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="release_time">
          <el-input size="mini" v-model="formData.release_time"></el-input>
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
        <el-form-item label="信息" prop="info">
          <el-input size="mini" v-model="formData.info"></el-input>
        </el-form-item>
        <el-form-item label="专辑封面">
          <el-button :disabled="uploadedCover" @click="handleSelectCover"
            >选择图片</el-button
          >
          <el-button
            :disabled="uploadedCover"
            @click="handleUploadFile"
            type="primary"
            >上传</el-button
          >
        </el-form-item>
        <el-form-item label="歌曲" prop="song_id">
          <el-button :disabled="uploadedCover" @click="handleSelectSongs"
            >选择歌曲</el-button
          >
          <el-button
            :disabled="uploadedCover"
            @click="handleUploadFile"
            type="primary"
            >上传</el-button
          >
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button @click="isDialogVisible = false">取消</el-button>
          <el-button @click="beforeSubmitAlbum" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
      <input
        style="display: none"
        type="file"
        ref="file"
        @change="handleFileChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import { fileUploadForce } from "../../api/mini-file";
import { STORAGE } from "../../../config";

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
      formData: {},
      formRules: {},
      uploadedCover: false,
      fileList: []
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  mounted() {},
  beforeUpdate() {},
  methods: {
    handleSelectSongs() {},
    handleSelectCover() {},
    beforeSubmitAlbum() {},
    handleUploadFile() {},
    handleFileChange() {},
    submitUpload(...params) {
      console.log(params);
    },
    // el-upload
    handleRemove(file, fileList) {
      console.log("on remove", file, fileList);
    },
    handleProgress(event, file, fileList) {
      console.log("on progress", event, file, fileList);
    },
    handleBeforeUpload(file) {
      console.log("before upload", file);
    },
    handleCustomUpload(wrappedFile) {
      const { file } = wrappedFile;
      fileUploadForce(file, STORAGE.SONG, file.name, progressEvent => {
        let num = ((progressEvent.loaded / progressEvent.total) * 100) | 0; //百分比
        wrappedFile.onProgress({ percent: num }); //进度条
      });
    },
    // http-request 不会触发 success/error
    handleUploadSuccess(response, file, fileList) {
      console.log("on success", response, file, fileList);
    },
    handleUploadError(err, file, fileList) {
      console.log("on error", err, file, fileList);
    }
  }
};
</script>

<style lang="less" scoped></style>
