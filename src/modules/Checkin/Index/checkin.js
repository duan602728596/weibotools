const request: Function = global.require('request');

/**
 * 微博获取超话列表
 * @param { string } cookie
 * @param { ?string } sinceId
 */
export function getChaohuaList(cookie: string, sinceId: ?string): Promise{
  let url: string = 'https://m.weibo.cn/api/container/getIndex?containerid=100803_-_page_my_follow_super';
  if(sinceId){
    url += `&since_id=${ encodeURIComponent(sinceId) }`;
  }
  return new Promise((resolve: Function, reject: Function): void=>{
    request({
      uri: url,
      method: 'GET',
      headers: {
        Cookie: cookie
      }
    }, (err: any, res: Object, data: string): void=>{
      if(err){
        reject(err);
      }else{
        resolve(JSON.parse(data));
      }
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/**
 * 解析超话数据
 * @param { Array } rawArray
 */
export function chaohuaListData(rawArray: Array): Array{
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
}

/**
 * 签到
 * @param { string } cookie
 * @param { string } containerid
 *
 * TODO: 微博已恢复旧签到接口的状态，旧接口可以放心使用
 * 新接口使用 【POST：https://m.weibo.cn/api/container/button?sign=686d57&request_url=http%3A%2F%2Fi.huati.weibo.com%2Fmobile
 * %2Fsuper%2Factive_checkin%3Fpageid%3D10080848fab43dc8c0cce225e66ce7109d399c】接口，
 * 地址来自于超话地址的pageInfo.toolbar_menus[0].params.action
 */
export function checkIn(cookie: string, containerid: string): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    request({
      uri: `https://weibo.com/p/aj/general/button?api=http://i.huati.weibo.com/aj/super/checkin&id=${ containerid }`,
      method: 'GET',
      headers: {
        Cookie: cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
                    + ' Chrome/66.0.3359.181 Safari/537.36'
      },
      timeout: 5000
    }, (err: any, res: Object, data: string): void=>{
      if(err){
        resolve(null);   // 断线重连
      }else{
        resolve(JSON.parse(data));
      }
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/**
 * 避免过于请求的点赞，所以进行了延迟
 * @param { number } time
 */
export function yanChi(time: number): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    setTimeout((): void=>{
      resolve();
    }, time);
  }).catch((err: any): void=>{
    console.error(err);
  });
}