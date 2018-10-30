const queryString: Object = global.require('querystring');
const request: Function = global.require('request');

/**
 * 获取关注的人的列表
 * @param { string } cookie: 账号的cookie
 * @param { ?number } page: 页码
 */
export function requestFollowHumansList(cookie: string, page: ?number): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    let uri: string = 'https://m.weibo.cn/api/container/getIndex?containerid=231093_-_selffollowed';

    if(page) uri += `&page=${ page }`;

    request({
      uri,
      method: 'POST',
      headers: { Cookie: cookie }
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