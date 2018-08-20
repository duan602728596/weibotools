<template>
  <el-container>
    <!-- 顶部菜单 -->
    <el-header :class="classNames(publicStyle.header, 'clearfix')">
      <h4 :class="publicStyle.fl">一键点赞</h4>
      <router-link :class="publicStyle.fr" to="/">
        <el-button type="danger" size="mini" icon="el-icon-circle-close-outline">返回</el-button>
      </router-link>
      <el-button :class="classNames(publicStyle.fr, publicStyle.mr10)"
        size="mini" icon="el-icon-circle-plus"
        @click="handleDialogDisplayClick(true)"
      >
        添加lfid
      </el-button>
      <el-button :class="classNames(publicStyle.fr, publicStyle.mr10)"
        type="primary"
        size="mini"
        icon="el-icon-star-on"
        :loading="btnLoading"
        @click="handleDianzanClick"
      >
        一键点赞
      </el-button>
    </el-header>
    <!-- 表格 -->
    <el-main :class="publicStyle.main">
      <p>为了避免被微博判断为操作次数频繁，每次点赞间隔3秒。</p>
      <el-table :data="$store.getters['dianzan/getLfidList']()" size="mini">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="lfid" prop="lfid"></el-table-column>
        <el-table-column label="点赞最大页数" prop="page"></el-table-column>
        <el-table-column label="操作" prop="handle">
          <template slot-scope="scope">
            <el-button-group>
              <!-- TODO: 单个人的点赞 -->
              <el-button size="mini" @click="handleEditLfidClick(scope)">修改</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteLfidClick(scope)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 弹出层 -->
    <el-dialog :visible="visible"
      :title="(this.isEdit ? '修改' : '添加') + 'lfid'"
      :fullscreen="true"
      :append-to-body="true"
      :show-close="false"
    >
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
        <el-button :class="publicStyle.mr10" type="primary" size="mini" @click="handleChangeLfidClick">
          {{ this.isEdit ? '修改' : '添加' }}
        </el-button>
        <el-button type="danger" size="mini" @click="handleDialogDisplayClick(false)">取消</el-button>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script type="text/javascript">
  import IndexedDB from 'indexeddb-tools';
  import config from '../../../components/config/config';
  import { getLoginList } from '../../../components/indexedDB/select';
  import publicStyle from '../../../components/publicStyle/publicStyle.scss';
  import { sleep, getSt } from '../../../utils';
  import { getIndex, dianzan } from './request';

  export default {
    data(): Object{
      return {
        publicStyle,
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
        isEdit: false, // 是否为编辑模式
        addLfid: {
          name: '',
          lfid: '',
          page: '1'
        }
      };
    },
    methods: {
      // 弹出层显示
      handleDialogDisplayClick(display: boolean): void{
        this.isEdit = false;
        this.visible = display;
        if(display){
          this.addLfid = {
            name: '',
            lfid: '',
            page: '1'
          };
          if(this.$refs['addLfid']) this.$refs['addLfid'].resetFields();
        }
      },
      // 修改lfid
      handleEditLfidClick(scope: Object): void{
        const { row }: { row: Object } = scope;
        this.addLfid.name = row.name;
        this.addLfid.lfid = row.lfid;
        this.addLfid.page = row.page;
        this.isEdit = true;
        this.visible = true;
      },
      // 添加或修改一个lfid
      handleChangeLfidClick(): void{
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
              if(!_this.isEdit) _this.$refs['addLfid'].resetFields(); // 如果是编辑模式，不重置表单
              this.close();
            }
          });
        });
      },
      // 删除一个lfid
      handleDeleteLfidClick(scope: Object): void{
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
      async handleDianzanClick(): Promise<void>{
        this.btnLoading = true;
        try{
          const loginList: Object[] = await getLoginList();
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