import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const routes = [
  {
    path: "/",
    component: () => import("@/layout/Index.vue"),
    children: [
      {
        path: "/",
        component: () => import("@/views/Home.vue"),
        meta: { icon: "el-icon-s-home", title: "首页", menu: true }
      },
      {
        path: "/sync",
        component: () => import("@/views/Sync.vue"),
        meta: { icon: "el-icon-refresh", title: "同步和备份", menu: true }
      },
      {
        path: "/materials",
        component: () => import("@/views/Materials/Index.vue"),
        meta: { icon: "el-icon-document-copy", title: "素材管理", menu: true },
        children: [
          {
            path: "/materials/news",
            component: () => import("@/views/Materials/News.vue"),
            meta: {
              title: "图文素材",
              menu: true
            }
          },
          {
            path: "/materials/image",
            component: () => import("@/views/Materials/Images.vue"),
            meta: {
              title: "图片素材",
              menu: true
            }
          }
        ]
      },
      {
        path: "/articles",
        component: () => import("@/views/Articles/Index.vue"),
        meta: { icon: "el-icon-document", title: "文章", menu: true },
        children: [
          {
            path: "/articles/manage",
            component: () => import("@/views/Articles/Manage.vue"),
            meta: {
              title: "文章管理",
              menu: true
            }
          },
          {
            path: "/articles/books",
            component: () => import("@/views/Articles/Books.vue"),
            meta: {
              title: "书籍分类",
              menu: true
            }
          },
          {
            path: "/articles/booklets",
            component: () => import("@/views/Articles/Booklets.vue"),
            meta: {
              title: "小册分类",
              menu: true
            }
          }
        ]
      },
      {
        path: "/comments",
        component: () => import("@/views/Comments.vue"),
        meta: { icon: "el-icon-chat-dot-square", title: "评论", menu: true }
      },
      {
        path: "/users",
        component: () => import("@/views/Users/Index.vue"),
        children: [
          {
            path: "/users/manage",
            component: () => import("@/views/Users/Manage.vue"),
            meta: {
              title: "用户管理",
              menu: true
            }
          },
          {
            path: "/users/log",
            component: () => import("@/views/Users/Log.vue"),
            meta: {
              title: "日志",
              menu: true
            }
          }
        ],
        meta: { icon: "el-icon-user", title: "用户", menu: true }
      },
      {
        path: "/settings",
        component: () => import("@/views/Settings.vue"),
        meta: { icon: "el-icon-setting", title: "设置", menu: true }
      }
    ]
  }
];

export default new Router({
  routes
});
