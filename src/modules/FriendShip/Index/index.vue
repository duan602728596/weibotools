<template>
  <el-container>
    <el-header :class="classNames(publicStyle.header, 'clearfix')">
      <el-select :class="classNames(publicStyle.fl, publicStyle.mr10)"
        size="mini"
        :disabled="loading"
        v-model="selectLogin"
        @change="handleLoginChange($event)"
      >
        <el-option v-for="item in $store.getters['friendship/getLoginList']()"
          :key="item.username"
          :label="item.username"
          :value="item.cookie"
        />
      </el-select>
      <el-button :class="publicStyle.fl" type="danger" size="mini" icon="el-icon-star-off">批量取消关注</el-button>
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
            <el-button type="danger" size="mini">取关</el-button>
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
  import { getFriendShipList } from './request';

  export default {
    data(): Object{
      return {
        loading: false,   // 加载中
        publicStyle,
        selectLogin: '',
        checkboxValue: [] // 准备取关的id数组
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
      handleCheckboxChange(value: boolean, scope: Object): void{
        this.checkboxValue = value;
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