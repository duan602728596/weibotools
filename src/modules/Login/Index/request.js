import { jsonp } from '../../../utils';
const queryString: Object = global.require('querystring');
const request: Function = global.require('request');

// 判断是否需要验证码
export function prelogin(usernameBase64: string): Promise{
  return jsonp(`https://login.sina.com.cn/sso/prelogin.php?checkpin=1&entry=mweibo&su=${ usernameBase64 }`);
}

// 获取验证码
export function pattern(username: string): Promise{
  const uri: string = 'https://captcha.weibo.com/api/pattern/get?'
    + `ver=1.0.0&source=ssologin&usrname=${ username }&line=160&side=100&radius=30&_rnd=${ Math.random() }`;
  return jsonp(uri);
}

// 验证验证码
export function verify(id: string, username: string, pathEnc: string, dataEnc: string): Promise{
  const uri: string = 'https://captcha.weibo.com/api/pattern/verify?ver=1.0.0&source=ssologin'
    + `&id=${ id }&usrname=${ username }&path_enc=${ pathEnc }&data_enc=${ dataEnc }`;
  return jsonp(uri);
}

// 登陆
export function login(username: string, password: string, id: ?string): Promise{
  const query: Object = {
    username,
    password
  };
  if(id) query.vid = id;

  const data: Object = queryString.stringify(query);
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