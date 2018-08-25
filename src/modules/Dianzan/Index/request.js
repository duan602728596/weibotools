const request: Function = global.require('request');

/**
 * 获取当前小偶像的信息
 * @param { string } lfid
 * @param { number } page
 */
export function getIndex(lfid: string, page: number = 1): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    request({
      uri: `https://m.weibo.cn/api/container/getIndex?containerid=${ lfid }&page=${ page }`,
      method: 'GET'
    }, (err: any, res: Object, data: string): void=>{
      if(err){
        reject(err);
      }else{
        resolve(JSON.parse(data));
      }
    });
  });
}

/**
 * 点赞
 * @param { string } cookie
 * @param { string } id
 * @param { string } st
 */
export function dianzan(cookie: string, id: string, st: string): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    request({
      uri: 'https://m.weibo.cn/api/attitudes/create',
      method: 'POST',
      headers: {
        Cookie: cookie,
        Referer: 'https://m.weibo.cn/u/5849126473?uid=5849126473&luicode=10000011&lfid=1076035849126473&featurecode=20000320',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `id=${ id }&st=${ st }&attitude=heart`
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