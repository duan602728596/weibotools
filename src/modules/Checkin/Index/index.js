import publicStyle from '../../../components/publicStyle/publicStyle.sass';
import { getLoginList } from '../../../components/indexedDB/select';
import { getChaohuaList, checkIn } from './request';
import { sleep } from '../../../utils';
import Header from './Header.vue';

export default {
  components: { Header },
  data(): Object{
    return {
      publicStyle,
      activeNames: [],
      btnLoading: false  // 按钮是否加载中
    };
  },
  methods: {
    // 签到
    async checkIn(item: Object, list: Array): Promise<void>{
      // 循环签到超话
      const j2: number = item.children.length;
      let i2: number = 0;

      while(i2 < j2){
        const item2: Object = item.children[i2];
        const step1: Object = await checkIn(item.cookie, item2.containerid);

        // 签到失败
        if(!step1){
          this.$message.error(`【${ item2.title_sub }】签到失败。正在重新签到该超话...`);
          await sleep(1500);
          return void 0;
        }

        let code: ?(number | string) = null;
        let msg: ?string = null;

        if(step1.code === '100000'){
          // 签到成功
          const isErr: boolean = 'error_code' in step1.data;

          code = isErr ? step1.data.error_code : tep1.code;
          msg = isErr ? step1.data.error_msg : `${ step1.data?.alert_title }，${ step1.data?.alert_subtitle }`;
        }else{
          // 其他情况
          code = step1.code;
          msg = step1.msg;
        }

        item2.code = code;
        item2.msg = msg;
        i2++;

        // 修改ui
        this.$store.dispatch('checkin/loginList', { data: list });
        await sleep(1500);
      }
    },
    // 解析超话数据
    chaohuaListData(rawArray: Array): Array{
      const list: [] = [];

      rawArray.forEach((value: Object, index: number, arr: []): void=>{
        if(value.card_type !== 8) return void 0;

        const s: string = value.scheme.match(/containerid=[a-zA-Z0-9]+/)[0];
        const containerid: string = s.split('=')[1];

        list.push({
          pic: value.pic,
          title_sub: value.title_sub,
          containerid
        });
      });

      return list;
    },
    // 获取超级话题列表
    async getChaohuaList(item: Object): Promise<void>{
      let l: Array = [];
      let sinceId: ?string = null;
      let isBreak: ?boolean = true;

      // 循环获取超话
      while(isBreak){
        const step1: Object = await getChaohuaList(item.cookie, sinceId);
        const cardlistInfo: Object = step1.data.cardlistInfo;
        const card_group: Object = step1.data.cards[0].card_group;

        l = l.concat(this.chaohuaListData(card_group)); // 循环card_group，提取数据

        if('since_id' in cardlistInfo) sinceId = cardlistInfo.since_id;
        else isBreak = false;
      }

      item.children = l;
    },
    // 自动签到
    async handleAutoCheckinClick(): Promise<void>{
      try{
        this.btnLoading = true;
        const list: [] = this.$store.getters['checkin/getLoginList']();

        for(let i: number = 0, j: number = list.length; i < j; i++){
          const item: Object = list[i];
          await this.handleCheckinOneClick(null, item, list);
        }

        this.btnLoading = false;
      }catch(err){
        console.error(err);
        this.btnLoading = false;
        this.$message.error('签到失败！');
      }
    },
    // 单个签到
    async handleCheckinOneClick(event: ?Event, item: Object, list: Array): Promise<void>{
      if(event) event.stopPropagation();

      try{
        this.btnLoading = true;

        // 获取超级话题列表
        if(!('children' in item)) await this.getChaohuaList(item);

        // 获取列表后修改ui
        this.$store.dispatch('checkin/loginList', { data: list });

        // 签到
        await this.checkIn(item, list);
        item.status = 1;

        // 签到后修改ui
        this.$store.dispatch('checkin/loginList', { data: list });
        this.btnLoading = false;
      }catch(err){
        console.error(err);
        this.btnLoading = false;
        this.$message.error('签到失败！');
      }
    },
    // 手动签到
    async handleManualCheckinClick(item: Object, item2: Object): Promise<void>{
      const step1: Object = await checkIn(item.cookie, item2.containerid);

      if(step1){
        let code: ?(number | string) = null;
        let msg: ?string = null;

        if(step1.code === '100000'){
          // 签到成功
          const isErr: boolean = 'error_code' in step1.data;

          code = isErr ? step1.data.error_code : step1.code;
          msg = isErr ? step1.data.error_msg : `${ step1.data?.alert_title }，${ step1.data?.alert_subtitle }`;
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