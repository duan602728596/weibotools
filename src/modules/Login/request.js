import { jsonP } from '../../utils';
const queryString: Object = global.require('querystring');
const request: Function = global.require('request');

/**
 * 判断是否需要验证码
 * @param { string | number } username: 用户名
 */
export function preLogin(username: string): Promise{
  const bUsername: string = btoa(username);

  return jsonP(`https://login.sina.com.cn/sso/prelogin.php?checkpin=1&entry=mweibo&su=${ bUsername }`);
}

/**
 * 获取验证码
 * @param { string | number } username: 用户名
 */
export function requestVerificationCode(username: string): Promise{
  const uri: string = 'https://captcha.weibo.com/api/pattern/get?'
    + `ver=1.0.0&source=ssologin&usrname=${ username }&line=160&side=100&radius=30&_rnd=${ Math.random() }`;

  return jsonP(uri);
}

/**
 * 手势验证
 * @param { string } id: 验证的id
 * @param { string } username: 用户名
 * @param { string } pathEnc: 路径和id的算法
 * @param { string } dataEnc: 路径坐标的算法
 */
export function gestureVerify(id: string, username: string, pathEnc: string, dataEnc: string): Promise{
  const uri: string = 'https://captcha.weibo.com/api/pattern/verify?ver=1.0.0&source=ssologin';
  const query: string = queryString.stringify({
    id: encodeURIComponent(id),
    usrname: encodeURIComponent(username),
    path_enc: encodeURIComponent(pathEnc),
    data_enc: encodeURIComponent(dataEnc)
  });

  return jsonP(`${ uri }&${ query }`);
}

/**
 * 登陆微博
 * @param { string } username: 用户名
 * @param { string } password: 密码
 * @param { ?string } id: 验证码的id
 */
export function login(username: string, password: string, id: ?string): Promise{
  const query: Object = { username, password };

  if(id) query.vid = id;

  const data: string = queryString.stringify(query);

  return new Promise((resolve: Function, reject: Function): void=>{
    request({
      uri: 'https://passport.weibo.cn/sso/login',
      method: 'POST',
      headers: {
        Referer: 'https://passport.weibo.cn/signin/login?entry=mweibo&r=http%3A%2F%2Fm.weibo.cn',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
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