<template>
  <div>
    <!-- 顶部菜单 -->
    <div class="toolsbox clearfix">
      <h4 class="fl">账号登录</h4>
      <router-link class="fr" to="/">
        <el-button type="danger" size="mini" icon="el-icon-circle-close-outline">返回</el-button>
      </router-link>
      <el-button class="fr mr10" type="primary" size="mini" icon="el-icon-mobile-phone" @click="onDialogDisplay(true)">登录</el-button>
    </div>
    <!-- 表格 -->
    <div class="tablebox">
      <el-table :data="$store.getters['login/getLoginList']()" size="mini">
        <el-table-column label="账号" prop="username"></el-table-column>
        <el-table-column label="登录日期" prop="loginTime"></el-table-column>
        <el-table-column label="st" prop="st"></el-table-column>
        <el-table-column label="操作" prop="handle">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="onDeleteLogin(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹出层 -->
    <el-dialog :visible="visible" title="登录微博账号" :fullscreen="true" :append-to-body="true" :show-close="false">
      <el-form ref="weiboLogin" :rules="rules" :model="weiboLogin">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="weiboLogin.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="weiboLogin.password" type="password"></el-input>
        </el-form-item>
        <el-button class="mr10" type="primary" size="mini" @click="onLogin()">登录</el-button>
        <el-button type="danger" size="mini" @click="onDialogDisplay(false)">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import IndexedDB from 'indexeddb-tools';
  import moment from 'moment';
  import Base64 from 'Base64';
  import hint from 'hint';
  import config from '../../public/config';
  import { yanzheng, getCaptcha, yanzhengCaptcha, loginWeibo, getSt } from './loginWeibo';

  export default {
    data(): Object{
      return {
        visible: false,   // 弹出层
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
          password: ''
        }
      };
    },
    methods: {
      // 弹出层显示
      onDialogDisplay(display: boolean): void{
        this.visible = display;
        if(!display){
          setTimeout((): void=>{
            this.$refs['weiboLogin'].resetFields();
          }, 100);
        }
      },
      // 登录微博
      async loginWeibo(id: ?string): Promise<void>{
        const _this: this = this;
        // 登录
        const step4: {
          data: Object,
          cookie: string
        } = await loginWeibo(this.weiboLogin.username, this.weiboLogin.password, id);
        // 获取st
        const step5: Object = await getSt(step4.cookie);
        // 添加数据
        IndexedDB(config.indexeddb.name, config.indexeddb.version, {
          success(event: Event): void{
            const store: Object = this.getObjectStore(config.indexeddb.objectStore[0].name, true);
            const data: Object = {
              username: _this.weiboLogin.username,
              loginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
              cookie: step4.cookie,
              st: step5.data.st
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
            _this.visible = false;
            setTimeout((): void=>{
              _this.$refs['weiboLogin'].resetFields();
            }, 100);
            this.close();
          }
        });
      },
      // 登录
      onLogin(): void{
        this.$refs['weiboLogin'].validate(async(valid: boolean): Promise<void>=>{
          if(!valid) return void 0;
          try{
            // 判断是否需要验证码
            const step1: Object = await yanzheng(Base64.encode(this.weiboLogin.username));
            if(('showpin' in step1 && step1.showpin === 1) || ('smsurl' in step1)){
              // 获取验证码
              const step2: Object = await getCaptcha(this.weiboLogin.username);
              hint(step2.path_enc, step2.id);
              // 监听验证是否完成
              const cb: Function = async(event: Event): Promise<void>=>{
                try{
                  // 判断验证码是否正确
                  const data: Object = event.data;
                  const step3: Object = await yanzhengCaptcha(
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
                  document.removeEventListener('weibo-pattlock', cb);
                }catch(err){
                  console.error(err);
                  this.$message.error('验证失败！');
                }
              };
              document.addEventListener('weibo-pattlock', cb, false);
            }else{
              this.loginWeibo();
            }
          }catch(err){
            console.error(err);
            this.$message.error('登录失败！');
          }
        });
      },
      // 删除
      onDeleteLogin(scope: Object): void{
        const _this: this = this;
        IndexedDB(config.indexeddb.name, config.indexeddb.version, {
          success(event: Event): void{
            const store: Object = this.getObjectStore(config.indexeddb.objectStore[0].name, true);
            store.delete(scope.row.username);
            _this.$store.dispatch('login/deleteLoginInformation', {
              index: scope.$index
            });
            this.close();
          }
        });
      }
    },
    mounted(): void{
      const _this: this = this;
      IndexedDB(config.indexeddb.name, config.indexeddb.version, {
        success(event: Event): void{
          const store: Object = this.getObjectStore(config.indexeddb.objectStore[0].name, true);
          const results: [] = [];
          store.cursor(config.indexeddb.objectStore[0].key[1], (event2: Event)=>{
            const result: Object = event2.target.result;
            if(result){
              results.push(result.value);
              result.continue();
            }else{
              _this.$store.dispatch('login/loginList', {
                data: results
              });
              this.close();
            }
          });
        }
      });
    }
  };
</script>

<style lang="scss" scoped>
  .toolsbox {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .mr10 {
    margin-right: 10px;
  }
  .tablebox {
    margin: 0 10px 10px;
  }
</style>