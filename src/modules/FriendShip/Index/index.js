import { getLoginList } from '../../../components/indexedDB/select';
import publicStyle from '../../../components/publicStyle/publicStyle.sass';
import { getSt } from '../../../utils';
import { getFriendShipList, listApi, friendshipsApi } from './request';

export default {
  data(): Object{
    return {
      isLoading: false,           // 加载中
      publicStyle,
      selectLoginCookie: '',    // 选中账号的cookie
      friendShipListCookie: '', // 请求关注列表时获取的cookie，关注或取消关注都会用到
      checkboxValue: [],        // 准备取关的id数组
      // 表格配置
      columns: [
        {
          title: '',
          width: 60,
          type: 'selection'
        },
        {
          title: '头像',
          key: 'user.profile_image_url',
          width: 70,
          render: (h: Function, item: Object): Object=>{
            return h('i-avatar', {
              props: {
                shape: 'square',
                size: 'large',
                src: item.row.user.profile_image_url
              }
            });
          }
        },
        {
          title: '用户名',
          key: 'user.screen_name',
          render: (h: Function, item: Object): string=>{
            return h('span', [item.row.user.screen_name]);
          }
        },
        {
          title: '身份',
          key: 'desc1'
        },
        {
          title: '操作',
          key: 'handle',
          width: 100,
          render: (h: Function, scope: Object): Object=>{
            if(!scope.row.isQuguan){
              return h('i-button', {
                props: {
                  size: 'small',
                  type: 'error'
                },
                on: {
                  click: this.handleGuanzhuClick.bind(this, scope, false)
                }
              }, ['取关']);
            }else{
              return h('i-button', {
                props: {
                  size: 'small'
                },
                on: {
                  click: this.handleGuanzhuClick.bind(this, scope, true)
                }
              }, '关注');
            }
          }
        }
      ]
    };
  },
  methods: {
    // 选中一个账号
    async handleLoginChange(value: string): Promise<void>{
      this.isLoading = true;
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
      this.isLoading = false;
    },
    // 根据id查找index
    findIndexById(list: [], id: number, from: number, to: number): ?number{
      if(list.length === 0) return null;

      if(from === to){
        if(list[from].user.id === id) return from;
        else return null;
      }

      const middle: number = Math.floor((to - from) / 2) + from;

      const left: ?number = this.findIndexById(list, id, from, middle);
      if(left !== null) return left;

      const right: ?number = this.findIndexById(list, id, middle + 1, to);
      if(right !== null) return right;

      return null;
    },
    // 表格内checkbox事件
    handleCheckboxChange(value: boolean): void{
      console.log(value);
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
        this.isLoading = true;

        const data: [] = this.$store.getters['friendship/getFrindShipList']();
        const step: {
          data: Object,
          cookie: string
        } = await getSt(this.selectLoginCookie);
        const { st }: { st: string } = step.data.data;
        const cookie: string = `${ this.selectLoginCookie }; ${ step.cookie }; ${ this.friendShipListCookie }`;
        for(const item: Object of itemList){
          const res: Object = await friendshipsApi(cookie, item.user.id, st, action);
          if(res.ok === 1){
            const index: number = this.findIndexById(data, item.user.id, 0, data.length - 1);
            if(action === false){
              data[index].isQuguan = true;
            }else{
              delete data[index].isQuguan;
            }
          }else{
            this.$message.error(`${ item.user.screen_name }：${ res.msg }`);
          }
        }
        if(action === false){
          this.$refs.friendship.selectAll(false);
          this.checkboxValue = [];
          this.$message.success('取关成功！');
        }else{
          this.$message.success('关注成功！');
        }
        // change ui
        this.$store.dispatch('friendship/frindShipList', {
          data: [...data]
        });
      }catch(err){
        console.error(err);
        if(action === false){
          this.$message.error('取关失败！');
        }else{
          this.$message.error('关注失败！');
        }
      }
      this.isLoading = false;
    }
  },
  async mounted(): Promise<void>{
    this.$store.dispatch('friendship/loginList', {
      data: await getLoginList()
    });
  }
};