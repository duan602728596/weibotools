<template>
  <el-container>
    <!-- 顶部菜单 -->
    <el-header class="clearfix" :class="publicStyle.header">
      <h4 :class="publicStyle.fl">一键签到</h4>
      <router-link :class="publicStyle.fr" to="/">
        <el-button type="danger" size="mini" icon="el-icon-circle-close">返回</el-button>
      </router-link>
      <el-button :class="classNames(publicStyle.fr, publicStyle.mr10)"
        v-if="btnLoading === false"
        type="primary"
        size="mini"
        icon="el-icon-edit"
        @click="handleAutoCheckinClick()"
      >
        一键签到
      </el-button>
      <el-button :class="classNames(publicStyle.fr, publicStyle.mr10)"
        v-else
        type="primary"
        size="mini"
        :loading="btnLoading"
      >
        签到中...
      </el-button>
    </el-header>
    <!-- 签到列表 -->
    <el-main :class="publicStyle.main">
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="item in $store.getters['checkin/getLoginList']()"
          :key="item.username"
          :name="item.username"
          :title="title(item.username, item.status)"
        >
          <ul class="list clearfix" v-if="item.children && item.children.length > 0">
            <li class="list-item clearfix" v-for="item2 in item.children">
              <img class="list-item-image" :src="item2.pic">
              <b class="list-item-title">{{ item2.title_sub }}</b>
              <span class="list-item-status" v-if="item2.code === undefined">签到中...</span>
              <span class="list-item-status-success" v-else-if="item2.code === '100000'">{{ item2.msg }}</span>
              <span class="list-item-status-fail" v-else>{{ item2.msg }}</span>
              <el-button class="manual-checkin-btn"
                :class="publicStyle.fr"
                type="primary"
                size="mini"
                title="手动签到"
                icon="el-icon-edit"
                :circle="true"
                v-if="!(item2.code === '100000' || item2.code === 382004)"
                @click="handleManualCheckinClick(item, item2)"
              />
            </li>
          </ul>
          <div class="no-data" v-else>暂无数据</div>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script type="text/javascript">
  import publicStyle from '../../../components/publicStyle/publicStyle.scss';
  import { getLoginList } from '../../../components/indexedDB/select';
  import { getChaohuaList, checkIn } from './request';
  import { sleep } from '../../../utils';

  export default {
    data(): Object{
      return {
        publicStyle,
        activeNames: [],
        btnLoading: false  // 按钮是否加载中
      };
    },
    methods: {
      // title
      title(username: string, status: ?number): string{
        return `${ username } ${ status === 1 ? '【已签到】' : '' }`;
      },
      // 签到
      async checkIn(item: Object, list: Array): Promise<void>{
        // 循环签到超话
        const j2: number = item.children.length;
        let i2: number = 0;
        while(i2 < j2){
          const item2: Object = item.children[i2];
          const step1: Object = await checkIn(item.cookie, item2.containerid);
          if(step1){
            let code: ?(number | string) = null;
            let msg: ?string = null;
            if(step1.code === '100000'){
              // 签到成功
              if('error_code' in step1.data){
                code = step1.data.error_code;
                msg = step1.data.error_msg;
              }else{
                code = step1.code;
                msg = `${ step1.data?.alert_title }，${ step1.data?.alert_subtitle }`;
              }
            }else{
              // 其他情况
              code = step1.code;
              msg = step1.msg;
            }
            item2.code = code;
            item2.msg = msg;
            i2++;
            // 修改ui
            this.$store.dispatch('checkin/loginList', {
              data: list
            });
          }else{
            this.$message.error(`【${ item2.title_sub }】签到失败。正在重新签到该超话...`);
          }
          await sleep(1500);
        }
      },
      // 解析超话数据
      chaohuaListData(rawArray: Array): Array{
        const list: [] = [];
        rawArray.forEach((value: Object, index: number, arr: []): void=>{
          if(value.card_type === 8){
            const s: string = value.scheme.match(/containerid=[a-zA-Z0-9]+/)[0];
            const containerid: string = s.split('=')[1];
            list.push({
              pic: value.pic,
              title_sub: value.title_sub,
              containerid
            });
          }
        });
        return list;
      },
      // 自动签到
      async handleAutoCheckinClick(): Promise<void>{
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
              l = l.concat(this.chaohuaListData(card_group)); // 循环card_group，提取数据
              if('since_id' in cardlistInfo){
                sinceId = cardlistInfo.since_id;
              }else{
                isBreak = false;
              }
            }
            item.children = l;
            // 修改ui
            this.$store.dispatch('checkin/loginList', {
              data: list
            });
            await this.checkIn(item, list);
            item.status = 1;
            // 修改ui
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
      },
      // 手动签到
      async handleManualCheckinClick(item: Object, item2: Object){
        const step1: Object = await checkIn(item.cookie, item2.containerid);
        if(step1){
          let code: ?(number | string) = null;
          let msg: ?string = null;
          if(step1.code === '100000'){
            // 签到成功
            if('error_code' in step1.data){
              code = step1.data.error_code;
              msg = step1.data.error_msg;
            }else{
              code = step1.code;
              msg = `${ step1.data?.alert_title }，${ step1.data?.alert_subtitle }`;
            }
          }else{
            // 其他情况
            code = step1.code;
            msg = step1.msg;
          }
          item2.code = code;
          item2.msg = msg;
          // 修改ui
          this.$store.dispatch('checkin/loginList', {
            data: this.$store.getters['checkin/getLoginList']()
          });
        }else{
          this.$message.error(`【${ item2.title_sub }】签到失败。`);
        }
      }
    },
    async mounted(): Promise<void>{
      this.$store.dispatch('checkin/loginList', {
        data: await getLoginList()
      });
    }
  };
</script>

<style lang="scss" scoped>
  .no-data {
    text-align: center;
    font-size: 12px;
    color: #9b9b9b;
  }
  .manual-checkin-btn {
    margin-top: 6px;
  }

  $border: 1px solid #ebeef5;
  .list {
    border-top: $border;
    border-left: $border;
    border-right: $border;
  }
  .list-item {
    box-sizing: border-box;
    float: left;
    padding: 5px;
    width: 50%;
    line-height: 0;
    border-bottom: $border;
    &:nth-of-type(odd) {
      border-right: $border;
    }
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