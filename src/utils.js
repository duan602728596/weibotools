/* 通用函数 */
const request: Function = global.require('request');

/**
 * 获取st
 * @param { string } cookie
 */
export function getSt(cookie: string): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    request({
      uri: 'https://m.weibo.cn/api/config',
      method: 'GET',
      headers: {
        Cookie: cookie,
        Connection: 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
                    + ' Chrome/66.0.3359.181 Safari/537.36'
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