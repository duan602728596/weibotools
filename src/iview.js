/* element按需加载 */
import Vue from 'vue/dist/vue';
import {
  Row, Col, Layout, Header, Content, Button, ButtonGroup, Table, TableColumn, Modal, Form, FormItem, Input, Message,
  Collapse, Panel, Checkbox, Select, Option, Spin, Tag, Avatar
} from 'iview';
import 'iview/src/styles/index.less';

Vue.component('i-row', Row);
Vue.component('i-col', Col);
Vue.component('i-layout', Layout);
Vue.component('i-header', Header);
Vue.component('i-content', Content);
Vue.component('i-button', Button);
Vue.component('i-button-group', ButtonGroup);
Vue.component('i-table', Table);
Vue.component('i-modal', Modal);
Vue.component('i-form', Form);
Vue.component('i-form-item', FormItem);
Vue.component('i-input', Input);
Vue.component('i-collapse', Collapse);
Vue.component('i-panel', Panel);
Vue.component('i-checkbox', Checkbox);
Vue.component('i-select', Select);
Vue.component('i-option', Option);
Vue.component('i-spin', Spin);
Vue.component('i-tag', Tag);
Vue.component('i-avatar', Avatar);

Vue.prototype.$message = Message;