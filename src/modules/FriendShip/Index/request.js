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
        resolve(JSON.parse(data));
      }
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}