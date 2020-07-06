import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import {
  Container,
  Button,
  Select,
  Header,
  Aside,
  Menu,
  Main,
  Submenu,
  Backtop,
  MenuItem,
  Table,
  TableColumn,
  Form,
  FormItem,
  Radio,
  Input,
  Dialog,
  Transfer,
  Link,
  RadioGroup,
  RadioButton,
  Tooltip,
  Pagination,
  Upload,
  MenuItemGroup,
  Loading,
  MessageBox,
  Message,
  Icon,
  Tag
} from "element-ui";
const elComponents = [
  Container,
  Button,
  Select,
  Header,
  Aside,
  Menu,
  Main,
  Submenu,
  Backtop,
  MenuItem,
  Table,
  TableColumn,
  Form,
  FormItem,
  Radio,
  Input,
  Dialog,
  Transfer,
  Link,
  RadioGroup,
  RadioButton,
  Tooltip,
  Pagination,
  Upload,
  MenuItemGroup,
  Icon,
  Tag
];
elComponents.forEach(component => Vue.use(component));
Vue.use(Loading.directive);
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;

import indexMixin from "./mixin";
Vue.mixin(indexMixin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
