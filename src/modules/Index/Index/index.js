const process: Object = global.require('process');

const isGuanggao: boolean = do{
  if(process.env.NODE_ENV === 'development'){
    false;
  }else{
    const r: number = Math.random();
    (r > 0.1 && r < 0.4) || (r > 0.6 && r < 0.8);
  }
};

export default {
  data(): Object{
    return {
      isGuanggao // 是否显示广告
    };
  },
  methods: {
    // 关闭广告
    handleCloseGuanggaoClick(): void{
      this.isGuanggao = false;
    }
  }
};