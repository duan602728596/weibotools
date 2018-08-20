<template>
  <el-container>
    <el-header :class="classNames(publicStyle.header, 'clearfix')">
      <el-select :class="classNames(publicStyle.fl, publicStyle.mr10)"
        size="mini"
        :disabled="loading"
        v-model="selectLoginCookie"
        @change="handleLoginChange($event)"
      >
        <el-option v-for="item in $store.getters['friendship/getLoginList']()"
          :key="item.username"
          :label="item.username"
          :value="item.cookie"
        />
      </el-select>
      <el-button :class="publicStyle.fl"
        type="danger"
        size="mini"
        icon="el-icon-star-off"
        @click="handleQuguanAllClick"
      >
        批量取消关注
      </el-button>
      <router-link :class="publicStyle.fr" to="/">
        <el-button type="danger" size="mini" icon="el-icon-circle-close">返回</el-button>
      </router-link>
    </el-header>
    <el-main :class="publicStyle.main">
      <el-table ref="friendship"
        size="mini"
        row-key="user.id"
        :data="$store.getters['friendship/getFrindShipList']()"
        v-loading="loading"
        @selection-change="handleCheckboxChange"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <img class="avatar" :src="scope.row.user.profile_image_url">
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="300" prop="user.screen_name"></el-table-column>
        <el-table-column label="身份" prop="desc1"></el-table-column>
        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" v-if="!scope.row.isQuguan" @click="handleGuanzhuClick(scope, false)">取关</el-button>
            <el-button size="mini" v-else @click="handleGuanzhuClick(scope, true)">关注</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script type="text/javascript">
  import { getLoginList } from '../../../components/indexedDB/select';
  import publicStyle from '../../../components/publicStyle/publicStyle.scss';
  import { getSt } from '../../../utils';
  import { getFriendShipList, friendshipsApi } from './request';

  export default {
    data(): Object{
      return {
        loading: false,        // 加载中
        publicStyle,
        selectLoginCookie: '', // 选中账号的cookie
        checkboxValue: []      // 准备取关的id数组
      };
    },
    methods: {
      // 选中一个账号
      async handleLoginChange(value: string): Promise<void>{
        this.loading = true;
        this.checkboxValue = [];
        try{
          let page: number = 1;
          let list: [] = [];
          while(page){
            const { data }: { data: Object } = await getFriendShipList(value, page);
            if(data.cards.length === 0){
              break;
            }else{
              const { card_group }: { card_group: [] } = data.cards[data.cards.length - 1];
              list = list.concat(card_group);
              page += 1;
            }
          }
          this.$store.dispatch('friendship/frindShipList', {
            data: list
          });
        }catch(err){
          console.error(err);
        }
        this.loading = false;
      },
      // 表格内checkbox事件
      handleCheckboxChange(value: boolean): void{
        this.checkboxValue = value;
      },
      // 关注或者取关
      handleGuanzhuClick(scope: Object, action): void{
        this.guanzhu([scope.row], action);
      },
      // 批量取关
      handleQuguanAllClick(): void{
        this.guanzhu(this.checkboxValue, false);
      },
      // 取关
      async guanzhu(itemList: Array, action: boolean): Promise<void>{
        try{
          if(itemList.length === 0) return void 0;
          this.loading = true;

          const step: {
            data: Object,
            cookie: string
          } = await getSt(this.selectLoginCookie);
          const { st }: { st: string } = step.data.data;
          const cookie: string = `${ this.selectLoginCookie }; ${ step.cookie }`;
          for(const item: Object of itemList){
            const result: Object = await friendshipsApi(cookie, item.user.id, st, action);
            console.log(result);
            if(action === false){
              item.isQuguan = true;
            }else{
              delete item.isQuguan;
            }
          }
          if(action === false){
            this.$refs['friendship'].clearSelection();
            this.checkboxValue = [];
            this.$message.success('取关成功！');
          }else{
            this.$message.success('关注成功！');
          }
          // change ui
          this.$store.dispatch('friendship/frindShipList', {
            data: [...this.$store.getters['friendship/getFrindShipList']()]
          });
        }catch(err){
          console.error(err);
          if(action === false){
            this.$message.error('取关失败！');
          }else{
            this.$message.error('关注失败！');
          }
        }
        this.loading = false;
      }
    },
    async mounted(): Promise<void>{
      this.$store.dispatch('friendship/loginList', {
        data: await getLoginList()
      });
    }
  };
</script>

<style lang="scss" scoped>
  .avatar {
    display: block;
    width: 40px;
    height: 40px;
  }
</style>