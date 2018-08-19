<template>
  <div>
    <!-- 顶部菜单 -->
    <div class="toolsbox clearfix">
      <h4 class="fl">一键点赞</h4>
      <p class="fl">（每次点赞间隔3秒）</p>
      <router-link class="fr" to="/">
        <el-button type="danger" size="mini" icon="el-icon-circle-close-outline">返回</el-button>
      </router-link>
      <el-button class="fr mr10" size="mini" icon="el-icon-circle-plus" @click="handleDialogDisplay(true)">添加lfid</el-button>
      <el-button class="fr mr10" type="primary" size="mini" icon="el-icon-star-on" :loading="btnLoading" @click="handleDianzan()">一键点赞</el-button>
    </div>
    <!-- 表格 -->
    <div class="tablebox">
      <el-table :data="$store.getters['dianzan/getLfidList']()" size="mini">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="lfid" prop="lfid"></el-table-column>
        <el-table-column label="点赞最大页数" prop="page"></el-table-column>
        <el-table-column label="操作" prop="handle">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteLfid(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹出层 -->
    <el-dialog :visible="visible" title="添加lfid" :fullscreen="true" :append-to-body="true" :show-close="false">
      <el-form ref="addLfid" :rules="rules" :model="addLfid">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="addLfid.name"></el-input>
        </el-form-item>
        <el-form-item label="lfid：" prop="lfid">
          <el-input v-model="addLfid.lfid"></el-input>
        </el-form-item>
        <el-form-item label="点赞最大页数：" prop="page">
          <el-input v-model="addLfid.page"></el-input>
        </el-form-item>
        <el-button class="mr10" type="primary" size="mini" @click="handleAddLfid()">添加</el-button>
        <el-button type="danger" size="mini" @click="handleDialogDisplay(false)">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import IndexedDB from 'indexeddb-tools';
  import config from '../../../components/config/config';
  import { sleep, getSt } from '../../../utils';
  import { getIndex, dianzan } from './request';

  export default {
    data(): Object{
      return {
        visible: false,     // 弹出层
        btnLoading: false,  // 按钮是否加载中
        // 校验规则
        rules: {
          name: {
            required: true,
            message: '请输入名称！'
          },
          lfid: {
            required: true,
            message: '请输入lfid！'
          },
          page: {
            required: true,
            message: '请输入点赞最大页数！'
          }
        },
        addLfid: {
          name: '',
          lfid: '',
          page: '1'
        }
      };
    },
    methods: {
      // 弹出层显示
      handleDialogDisplay(display: boolean): void{
        this.visible = display;
        if(!display){
          setTimeout((): void=>{
            this.$refs['addLfid'].resetFields();
          }, 100);
        }
      },
      // 添加一个lfid
      handleAddLfid(): void{
        const _this: this = this;
        this.$refs['addLfid'].validate(async(valid: boolean): Promise<void>=>{
          if(!valid) return void 0;
          IndexedDB(config.indexeddb.name, config.indexeddb.version, {
            success(event: Event): void{
              const store: Object = this.getObjectStore(config.indexeddb.objectStore[1].name, true);
              const data: Object = {
                name: _this.addLfid.name,
                lfid: _this.addLfid.lfid,
                page: _this.addLfid.page
              };
              store.put(data);
              // 修改ui
              const list: [] = _this.$store.getters['dianzan/getLfidList']();
              let index: number = -1;
              for(let i: number = 0, j: number = list.length; i < j; i++){
                if(_this.addLfid.lfid === list[i].lfid){
                  index = i;
                  break;
                }
              }
              if(index === -1){
                list.push(data);
              }else{
                list[index] = data;
              }
              _this.$store.dispatch('dianzan/lfidList', {
                data: list
              });
              _this.$refs['addLfid'].resetFields();
              this.close();
            }
          });
        });
      },
      // 删除一个lfid
      handleDeleteLfid(scope: Object): void{
        const _this: this = this;
        IndexedDB(config.indexeddb.name, config.indexeddb.version, {
          success(event: Event): void{
            const store: Object = this.getObjectStore(config.indexeddb.objectStore[1].name, true);
            store.delete(scope.row.lfid);
            _this.$store.dispatch('dianzan/deleteLfid', {
              index: scope.$index
            });
            this.close();
          }
        });
      },
      // 获取登录列表
      getLoginList(): Promise{
        return new Promise((resolve: Function, reject: Function): void=>{
          IndexedDB(config.indexeddb.name, config.indexeddb.version, {
            success(event: Event): void{
              const store: Object = this.getObjectStore(config.indexeddb.objectStore[0].name, true);
              const results: [] = [];
              store.cursor(config.indexeddb.objectStore[0].key[1], (event2: Event): void=>{
                const result: Object = event2.target.result;
                if(result){
                  results.push(result.value);
                  result.continue();
                }else{
                  resolve(results);
                  this.close();
                }
              });
            }
          });
        }).catch((err: any): void=>{
          console.error(err);
        });
      },
      // 点赞
      async dianzanLfid(item: Object, loginList: Array): Promise<void>{
        let cards: Object[] = [];
        // 获取信息
        for(let p: number = 1, q: number = Number(item.page); p <= q; p++){
          const step1: Object = await getIndex(item.lfid, p);
          const cds: Object[] = step1.data?.data?.cards || [];
          if(cds.length === 0){
            break;
          }else{
            cards = cards.concat(cds);
          }
        }
        // 循环点赞
        for(let l: number = 0, m: number = cards.length, k: number = loginList.length; l < m; l++){
          const item2: Object = cards[l];
          if(item2.card_type === 9){
            for(let n: number = 0; n < k; n++){
              const item3: Object = loginList[n];
              await dianzan(item3.cookie, item2.mblog.id, item3.st);
              await sleep(3000);
            }
          }
        }
      },
      // 一键点赞
      async handleDianzan(): Promise<void>{
        this.btnLoading = true;
        try{
          const loginList: Object[] = await this.getLoginList();
          const lfidList: Object[] = this.$store.getters['dianzan/getLfidList']();
          // 获取st
          for(let i: number = 0, j: number = loginList.length; i < j; i++){
            const step: {
              data: Object,
              cookie: string
            } = await getSt(loginList[i].cookie);
            loginList[i].st = step.data.data.st;
            loginList[i].cookie += `; ${ step.cookie }`;
          }
          // 循环lfid
          for(let i: number = 0, j: number = lfidList.length; i < j; i++){
            const item: Object = lfidList[i];
            await this.dianzanLfid(item, loginList);
            await sleep(3000);
          }
          this.btnLoading = false;
        }catch(err){
          this.btnLoading = false;
          this.$message.error('点赞失败！');
          console.error(err);
        }
      }
    },
    mounted(): void{
      const _this: this = this;
      IndexedDB(config.indexeddb.name, config.indexeddb.version, {
        success(event: Event): void{
          const store: Object = this.getObjectStore(config.indexeddb.objectStore[1].name, true);
          const results: [] = [];
          store.cursor(config.indexeddb.objectStore[1].key[1], (event2: Event): void=>{
            const result: Object = event2.target.result;
            if(result){
              results.push(result.value);
              result.continue();
            }else{
              _this.$store.dispatch('dianzan/lfidList', {
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