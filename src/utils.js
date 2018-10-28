/* 通用函数 */
import moment from 'moment';
const request: Function = global.require('request');

/**
 * jsonP方法
 * @param { string } uri: 请求地址
 */
export function jsonP(uri: string): Promise{
  let script: Element = document.createElement('script');

  return new Promise((resolve: Function, reject: Function): void=>{
    // callback
    const time: number = moment().unix();
    const callbackName: string = `jsonpCallback${ time }${ Math.floor(Math.random() * 9999) }`;
    script.src = `${ uri }&callback=${ callbackName }`;
    script.id = callbackName;

    window[callbackName] = (data: Object): void=>{
      resolve(data);
    };

    // load
    const handleScriptLoad: Function = (event: Event): void=>{
      delete window[callbackName];
      script.removeEventListener('load', handleScriptLoad);
      script.removeEventListener('error', handleScriptError);
      document.body.removeChild(script);
      script = null;
    };

    // error
    const handleScriptError: Function = (event: Event): void=>{
      handleScriptLoad();
      reject(event);
    };

    script.addEventListener('load', handleScriptLoad, false);
    script.addEventListener('error', handleScriptError, false);
    document.body.appendChild(script);
  });
}

/**
 * 延迟事件
 * @param { number } time
 */
export function sleep(time: number = 0): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    setTimeout((): void=>{
      resolve();
    }, time);
  });
}

/**
 * 获取st
 * @param { string } cookie
 */
export function requestSt(cookie: string): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    request({
      uri: 'https://m.weibo.cn/api/config',
      method: 'GET',
      headers: { Cookie: cookie }
    }, (err: Error, res: Object, data: string): void=>{
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