import Vue from 'vue';
import App from './App';
import router from './router';
import Cookies from "js-cookie";
Vue.use(Cookies);
Vue.prototype.$cookie = Cookies;
import {
  Button,
  Select,
  Dialog,
  Option,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Row,
  Col,
  Icon,
  Tabs,
  TabPane,
  Input,
  Checkbox,
  CheckboxGroup,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableColumn,
  Pagination,
  Popover,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DatePicker,
  Message,
  Autocomplete,
  MessageBox,
  Tooltip,
  Upload,
  RadioGroup,
  Radio,
  Tree,
  Form,
  Progress,
  FormItem,
  Collapse,
  CollapseItem
} from "element-ui";


// 引入组件
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Row);
Vue.use(Col);
Vue.use(Icon);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Popover);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(DatePicker);
Vue.use(Autocomplete);
Vue.use(Tree);
Vue.use(Tooltip);
Vue.use(Upload);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Progress);
Vue.use(Dialog);
Vue.use(Collapse);
Vue.use(CollapseItem);

import "element-ui/lib/theme-chalk/index.css";
// import "vditor/src/assets/scss/index.scss"
/* 初始化CSS, 公共类样式*/
import "@/assets/css/base.css";

//工具类函数
import Tools from "@/assets/js/tools.js";
//console.log('工具',Tools)

//请求封装函数
import client from "@/assets/js/client.js";
Vue.prototype.$client = client;



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  beforeCreate() {
    window.Tools = Tools
  }
})
