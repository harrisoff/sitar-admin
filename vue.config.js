const TerserWebpackPlugin = require("terser-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === "production";

const {
  AUTH_SERVER,
  WX_API_SERVER,
  MINI_UPLOAD_SERVER,
  MINI_API_SERVER,
  MINI_STATIC_SERVER
} = require("./config");

module.exports = {
  productionSourceMap: !isProduction,
  devServer: {
    proxy: {
      // 公众号 & 小程序 通用
      "/token": {
        target: AUTH_SERVER,
        changeOrigin: true
      },
      // 微信
      "/wx-api": {
        target: WX_API_SERVER,
        changeOrigin: true,
        pathRewrite: {
          "^/wx-api": "/"
        }
      },
      // 小程序
      "/myUpload": {
        target: MINI_UPLOAD_SERVER,
        changeOrigin: true,
        pathRewrite: {
          "^/myUpload": "/"
        }
      },
      "/mini-api": {
        target: MINI_API_SERVER,
        changeOrigin: true,
        pathRewrite: {
          "^/mini-api": "/"
        }
      },
      "/static": {
        target: MINI_STATIC_SERVER,
        changeOrigin: true,
        pathRewrite: {
          "^/static": "/"
        }
      }
    }
  },
  configureWebpack(config) {
    const plugins = [];
    if (isProduction) {
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(js|css)$"),
          threshold: 10240,
          minRatio: 0.8
        }),
        new TerserWebpackPlugin({
          cache: true,
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        })
      );
    } else {
      plugins.push(new BundleAnalyzerPlugin());
    }
    config.plugins = [...config.plugins, ...plugins];
  }
};
