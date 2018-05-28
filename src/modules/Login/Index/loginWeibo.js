const request: Function = global.require('request');

/**
 * 微博登录
 * @param { string } su
 */
export function yanzheng(su: string): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    request({
      uri: `https://login.sina.com.cn/sso/prelogin.php?checkpin=1&entry=mweibo&su=${ su }`,
      method: 'GET'
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
 * 获取验证码
 * @param { string } username
 */
export function getCaptcha(username: string): Promise{
  const rnd: number = Math.random();
  return new Promise((resolve: Function, reject: Function): void=>{
    request({
      uri: `https://captcha.weibo.com/api/pattern/get?ver=1.0.0&source=ssologin&usrname=${ username }&line=160&side=100&radius=30&_rnd=${ rnd }`,
      method: 'GET'
    }, (err: any, res: Object, data: string): void=>{
      if(err){
        reject(err);
      }else{
        resolve(JSON.parse(data.replace(/[()]/g, '')));
      }
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/**
 * 验证验证码
 * @param { string } id
 * @param { string } username
 * @param { string } pathEnc
 * @param { string } dataEnc
 */
export function yanzhengCaptcha(id: string, username: string, pathEnc: string, dataEnc: string ): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    request({
      uri: `https://captcha.weibo.com/api/pattern/verify?ver=1.0.0&id=${ id }&usrname=${ username }&source=ssologin&path_enc=${ pathEnc }&data_enc=${ dataEnc }`,
      method: 'GET'
    }, (err: any, res: Object, data: string): void=>{
      if(err){
        reject(err);
      }else{
        resolve(JSON.parse(data.replace(/[()]/g, '')));
      }
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/**
 * 登录微博
 * @param { string } username
 * @param { string } password
 * @param { string } id
 */
export function loginWeibo(username: string, password: string, id: ?string): Promise{
  let data: string = `username=${ username }&password=${ password }`;
  if(id) data += `&vid=${ id }`;
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