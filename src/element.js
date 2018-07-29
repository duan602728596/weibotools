/* element按需加载 */
import Vue from 'vue/dist/vue';
import {
  Row, Col, Button, Table, TableColumn, Dialog, Form, FormItem,
  Input, Message, Collapse, CollapseItem, Checkbox
} from 'element-ui';

Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Checkbox);

Vue.prototype.$message = Message;