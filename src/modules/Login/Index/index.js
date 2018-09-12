import IndexedDB from 'indexeddb-tools';
import moment from 'moment';
import hint from 'hint';
import config from '../../../components/config/config';
import { getLoginList } from '../../../components/indexedDB/select';
import publicStyle from '../../../components/publicStyle/publicStyle.sass';
import { prelogin, pattern, verify, login } from './request';

export default {
  data(): Object{
    return {
      publicStyle,
      visible: false, // 弹出层
      // 表格配置
      columns: [
        {
          title: '账号',
          key: 'username'
        },
        {
          title: '密码',
          key: 'password'
        },
        {
          title: '登录日期',
          key: 'loginTime',
          width: 180
        },
        {
          title: '操作',
          key: 'handle',
          width: 320,
          render: (h: Function, scope: Object): Object=>{
            return h('i-button-group', [
              h('i-button', {
                props: {
                  size: 'small',
                  loading: this.btnLoading
                },
                on: {
                  click: this.handleLoginAgainClick.bind(this, scope, false)
                }
              }, ['重新登录']),
              h('i-button', {
                props: {
                  size: 'small',
                  loading: this.btnLoading
                },
                on: {
                  click: this.handleLoginAgainClick.bind(this, scope, true)
                }
              }, ['使用验证码重新登陆']),
              h('i-button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'ios-beaker',
                  loading: this.btnLoading
                },
                on: {
                  click: this.handleDeleteLoginClick.bind(this, scope)
                }
              }, ['删除'])
            ]);
          }
        }
      ],
      // 校验规则
      rules: {
        username: {
          required: true,
          message: '请输入用户名！'
        },
        password: {
          required: true,
          message: '请输入密码！'
        }
      },
      // 表单
      weiboLogin: {
        username: '',
        password: '',
        vcode: false
      }
    };
  },
  methods: {
    // 弹出层显示
    handleDialogDisplayClick(display: boolean): void{
      this.visible = display;
      if(display){
        this.weiboLogin = {
          username: '',
          password: '',
          vcode: false
        };
        if(this.$refs.weiboLogin) this.$refs.weiboLogin.resetFields();
      }
    },
    // 登录微博
    async loginWeibo(id: ?string): Promise<void>{
      try{
        const _this: this = this;
        // 登录
        const step4: {
          data: Object,
          cookie: string
        } = await login(this.weiboLogin.username, this.weiboLogin.password, id);
        // 添加数据
        IndexedDB(config.indexeddb.name, config.indexeddb.version, {
          success(event: Event): void{
            const store: Object = this.getObjectStore(config.indexeddb.objectStore[0].name, true);
            const data: Object = {
              username: _this.weiboLogin.username,
              password: _this.weiboLogin.password,
              loginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
              cookie: step4.cookie
            };
            store.put(data);
            // 修改ui
            const list: [] = _this.$store.getters['login/getLoginList']();
            let index: number = -1;
            for(let i: number = 0, j: number = list.length; i < j; i++){
              if(_this.weiboLogin.username === list[i].username){
                index = i;
                break;
              }
            }
            if(index === -1){
              list.push(data);
            }else{
              list[index] = data;
            }
            _this.$store.dispatch('login/loginList', {
              data: list
            });
            _this.$message.success('登陆成功！');
            _this.visible = false;
            this.close();
          }
        });
      }catch(err){
        console.error(err);
        this.$message.error('登陆失败！');
      }
    },
    // 验证码回调函数
    async verifyCallback(step2: Object, event: Event): Promise<void>{
      try{
        // 判断验证码是否正确
        const data: Object = event.data;
        const step3: Object = await verify(
          encodeURIComponent(step2.id),
          encodeURIComponent(this.weiboLogin.username),
          encodeURIComponent(data.path_enc),
          encodeURIComponent(data.data_enc)
        );
        if(step3.code === '100000'){
          this.loginWeibo(step2.id);
        }else{
          this.$message.error(`（${ step3.code }）${ step3.msg }`);
        }
      }catch(err){
        console.error(err);
        this.$message.error('验证失败！');
      }
      document.removeEventListener('weibo-pattlock', this._verifyCallback);
      this._verifyCallback = null;
    },
    // 登陆、获取验证码
    async prelogin(): Promise<void>{
      try{
        // 判断是否需要验证码
        const step1: Object = await prelogin(btoa(this.weiboLogin.username));
        if(('showpin' in step1 && step1.showpin === 1) || ('smsurl' in step1) || this.weiboLogin.vcode === true){
          // 获取验证码
          const step2: Object = await pattern(this.weiboLogin.username);
          hint(step2.path_enc, step2.id);
          this._verifyCallback = this.verifyCallback.bind(this, step2);
          document.addEventListener('weibo-pattlock', this._verifyCallback, false);
        }else{
          this.loginWeibo();
        }
      }catch(err){
        console.error(err);
        this.$message.error('登录失败！');
      }
    },
    // 登陆、获取验证码
    handleLoginClick(): void{
      this.$refs.weiboLogin.validate((valid: boolean): void=>{
        if(!valid) return void 0;
        this.prelogin();
      });
    },
    // 重新登陆
    handleLoginAgainClick(scope: Object, useVcode: boolean = false): void{
      const { row }: { row: Object } = scope;
      this.weiboLogin.username = row.username;
      this.weiboLogin.password = row.password;
      this.weiboLogin.vcode = useVcode;
      this.prelogin();
    },
    // 删除
    handleDeleteLoginClick(scope: Object): void{
      const _this: this = this;
      IndexedDB(config.indexeddb.name, config.indexeddb.version, {
        success(event: Event): void{
          const store: Object = this.getObjectStore(config.indexeddb.objectStore[0].name, true);
          store.delete(scope.row.username);
          _this.$store.dispatch('login/deleteLoginInformation', {
            index: scope.index
          });
          this.close();
        }
      });
    }
  },
  async mounted(): Promise<void>{
    this.$store.dispatch('login/loginList', {
      data: await getLoginList()
    });
  }
};