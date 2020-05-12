export default {
  methods: {
    $success(message) {
      this.$message({
        message,
        type: "success"
      });
    },
    $error(message) {
      this.$message.error(message);
    }
  }
};
