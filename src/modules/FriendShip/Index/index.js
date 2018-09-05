import { getLoginList } from '../../../components/indexedDB/select';
import publicStyle from '../../../components/publicStyle/publicStyle.sass';
import { getSt } from '../../../utils';
import { getFriendShipList, listApi, friendshipsApi } from './request';

export default {
  data(): Object{
    return {
      loading: false,           // 加载中
      publicStyle,
      selectLoginCookie: '',    // 选中账号的cookie
      friendShipListCookie: '', // 请求关注列表时获取的cookie，关注或取消关注都会用到
      checkboxValue: []         // 准备取关的id数组
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
        let cookie: ?string = null;
        while(page){
          const res: Object = await getFriendShipList(value, page);
          const { data }: { data: Object } = res.data;
          if(!cookie) cookie = res.cookie; // cookie，后面关注和取关会用到
          if(data.cards.length === 0){
            break;
          }else{
            const { card_group }: { card_group: [] } = data.cards[data.cards.length - 1];
            list = list.concat(card_group);
            page += 1;
          }
        }
        this.friendShipListCookie = cookie;
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
    handleGuanzhuClick(scope: Object, action: boolean): void{
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
        const cookie: string = `${ this.selectLoginCookie }; ${ step.cookie }; ${ this.friendShipListCookie }`;
        for(const item: Object of itemList){
          const res: Object = await friendshipsApi(cookie, item.user.id, st, action);
          if(res.ok === 1){
            if(action === false){
              item.isQuguan = true;
            }else{
              delete item.isQuguan;
            }
          }else{
            this.$message.error(`${ item.user.screen_name }：${ res.msg }`);
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