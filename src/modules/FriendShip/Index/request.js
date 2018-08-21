const queryString: Object = global.require('querystring');
const request: Function = global.require('request');

export function getFriendShipList(cookie: string, page: ?number): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    let uri: string = 'https://m.weibo.cn/api/container/getIndex?containerid=231093_-_selffollowed';
    if(page) uri += `&page=${ page }`;
    request({
      uri,
      method: 'POST',
      headers: {
        Cookie: cookie
      }
    }, (err: any, res: Object, data: string): void=>{
      if(err){
        reject(err);
      }else{
        resolve({
          data: JSON.parse(data),
          cookie: res.headers['set-cookie'].join('; ')
        });
      }
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/**
 * 关注
 * @param { string } cookie
 * @param { number } uid
 * @param { string } st
 * @param { boolean } action：关注还是取消关注，true 关注，false 取消关注
 */
export function friendshipsApi(cookie: string, uid: number, st: string, action: boolean = false): Promise{
  const data: string = queryString.stringify({ uid, st });
  return new Promise((resolve: Function, reject: Function): void=>{
    request({
      uri: `https://m.weibo.cn/api/friendships/${ action === true ? 'create' : 'destory' }`,
      method: 'POST',
      headers: {
        Cookie: cookie,
        Referer: 'https://m.weibo.cn/p/index?containerid=231093_-_selffollowed',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
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