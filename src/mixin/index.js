export default {
  methods: {
    $success(message) {
      this.$message({
        message,
        type: "success"
      });
    },
    $info(message) {
      this.$message({
        message
      });
    },
    $warn(message) {
      this.$message({
        message,
        type: "warning"
      });
    },
    $error(message) {
      this.$message.error(message);
    }
  }
};
