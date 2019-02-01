import publicStyle from '../../../components/publicStyle/publicStyle.sass';

export default {
  data(): Object{
    return {
      isModalDisplay: false,
      formValue: {
        username: null,
        password: null
      },
      rules: {
        username: [{ required: true, message: '请输入用户名！' }],
        password: [{ required: true, message: '请输入密码！' }]
      }
    };
  },
  methods: {
    // 打开弹窗
    handleModalOpenClick(event: Event): void{
      this.isModalDisplay = true;
    },
    // 关闭弹窗
    handleModalCloseClick(event: Event): void{
      this.isModalDisplay = false;
      this.$refs.loginForm.resetFields();
    },
    // input表单同步
    handleInputChange(key: string, event: Event): void{
      const { value }: { value: string } = event.target;

      this.formValue[key] = value;
    }
  },
  render(): Vue.VNode{
    const { formValue, rules }: {
      formValue: Object,
      rules: Object
    } = this;
    const { username, password }: {
      username: string,
      password: string
    } = formValue;

    return (
      <span>
        <i-button type="primary" icon="ios-contacts" onClick={ this.handleModalOpenClick }>登陆</i-button>
        {/* 登陆弹窗 */}
        <i-modal value={ this.isModalDisplay }
          title="微博账号登陆"
          footer-hide={ true }
          mask-closable={ false }
          nativeOnCancel={ this.handleModalCloseClick }
        >
          <i-form ref="loginForm" model={ formValue } rules={ rules }>
            <i-form-item label="用户名" prop="username">
              <i-input value={ username }
                placeholder="请输入微博的用户名"
                nativeOnChange={ this.handleInputChange.bind(this, 'username') }
              />
            </i-form-item>
            <i-form-item label="密码" prop="password">
              <i-input type="password" value={ password }
                placeholder="请输入微博的密码"
                nativeOnChange={ this.handleInputChange.bind(this, 'password') }
              />
            </i-form-item>
            <footer class={ publicStyle.modalBtnBox }>
              <i-button class={ publicStyle.mr10 } type="success">登陆</i-button>
              <i-button type="warning" onClick={ this.handleModalCloseClick }>取消</i-button>
            </footer>
          </i-form>
        </i-modal>
      </span>
    );
  }
};