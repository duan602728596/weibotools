<template>
  <div>
    <!-- 顶部菜单 -->
    <div class="toolsbox clearfix">
      <h4 class="fl">一键签到</h4>
      <router-link class="fr" to="/">
        <el-button type="danger" size="mini" icon="el-icon-circle-close">返回</el-button>
      </router-link>
      <el-button class="fr mr10"
          v-if="btnLoading === false"
          type="primary"
          size="mini"
          icon="el-icon-edit"
          @click="onCheckin()"
      >
        一键签到
      </el-button>
      <el-button class="fr mr10" v-else type="primary" size="mini" :loading="btnLoading">签到中...</el-button>
    </div>
    <!-- 签到列表 -->
    <div class="qiandaobox">
      <el-collapse v-model="activeNames" @change="onQiandaoListChange">
        <el-collapse-item
          v-for="item in $store.getters['checkin/getLoginList']()"
          :key="item.username"
          :name="item.username"
          :title="title(item.username, item.status)"
        >
          <ul class="clearfix" v-if="item.children && item.children.length > 0">
            <li class="list-item" v-for="item2 in item.children">
              <img class="list-item-image" :src="item2.pic">
              <b class="list-item-title">{{ item2.title_sub }}</b>
              <span class="list-item-status-fail" v-if="item2.status === 0">{{ item2.text }}</span>
              <span class="list-item-status-success" v-else-if="item2.status === 1">{{ item2.text }}</span>
              <span class="list-item-status" v-else>签到中...</span>
            </li>
          </ul>
          <div class="no-data" v-else>暂无数据</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script type="text/javascript">
  import IndexedDB from 'indexeddb-tools';
  import config from '../../public/config';
  import { getChaohuaList, chaohuaListData, checkIn, yanChi } from './checkin';

  export default {
    data(): Object{
      return {
        activeNames: [],
        btnLoading: false  // 按钮是否加载中
      };
    },
    methods: {
      // 签到变化
      onQiandaoListChange(value: string[]): void{
        this.activeNames = value;
      },
      // title
      title(username: string, status: ?number): string{
        return `${ username } ${ status === 1 ? '【已签到】' : '' }`;
      },
      // 签到
      async onCheckin(): Promise<void>{
        try{
          this.btnLoading = true;
          // 获取超话列表
          const list: [] = this.$store.getters['checkin/getLoginList']();
          for(let i: number = 0, j: number = list.length; i < j; i++){
            const item: Object = list[i];
            let l: Array = [];
            let sinceId: ?string = null;
            let isBreak: ?boolean = true;
            // 循环获取超话
            while(isBreak){
              const step1: Object = await getChaohuaList(item.cookie, sinceId);
              const cardlistInfo: Object = step1.data.cardlistInfo;
              const card_group: Object = step1.data.cards[0].card_group;
              l = l.concat(chaohuaListData(card_group)); // 循环card_group，提取数据
              if('since_id' in cardlistInfo){
                sinceId = cardlistInfo.since_id;
              }else{
                isBreak = false;
              }
            }
            item.children = l;
            // 循环签到超话
            const j2: number = item.children.length;
            let i2: number = 0;
            while(i2 < j2){
              const item2: Object = item.children[i2];
              const step1: Object = await checkIn(item.cookie, item2.containerid);
              if(step1){
                if(step1.code === '100000'){
                  // 签到成功
                  item2.status = 1;
                  item2.text = step1.code;  // res.data.alert_title;
                }else{
                  // 其他情况
                  item2.status = 0;
                  item2.text = step1.code;  // res.msg;
                }
                i2++;
              }else{
                this.$message.error(`【${ item2.title_sub }】签到失败。正在重新签到该超话...`);
              }
              await yanChi(1500);
            }
            item.status = 1;
            this.$store.dispatch('checkin/loginList', {
              data: list
            });
          }
          this.btnLoading = false;
        }catch(err){
          console.error(err);
          this.btnLoading = false;
          this.$message.error('签到失败！');
        }
      }
    },
    mounted(): void{
      const _this: this = this;
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
              _this.$store.dispatch('checkin/loginList', {
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
  .qiandaobox {
    padding: 0 10px 10px;
  }
  .no-data {
    text-align: center;
    font-size: 12px;
    color: #9b9b9b;
  }
  .list-item {
    box-sizing: border-box;
    padding: 5px;
    width: 50%;
    float: left;
    &-image {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    &-title {
      vertical-align: 15px;
      font-size: 16px;
      margin-right: 5px;
    }
    &-status {
      vertical-align: 16px;
      font-size: 14px;
      &-fail, &-success {
        vertical-align: 16px;
      }
      &-fail {
        color: #f00;
      }
      &-success {
        color: #52d938;
      }
    }
  }
</style>