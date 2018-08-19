import IndexedDB from 'indexeddb-tools';
import config from '../config/config';

// 获取已登陆账号列表
export function getLoginList(): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    IndexedDB(config.indexeddb.name, config.indexeddb.version, {
      success(event: Event): void{
        const store: Object = this.getObjectStore(config.indexeddb.objectStore[0].name, true);
        const results: [] = [];
        store.cursor(config.indexeddb.objectStore[0].key[1], (event2: Event): void=>{
          const result: Object = event2.target.result;
          if(result){
            results.push(result.value);
            result.continue();
          }else{
            resolve(results);
            this.close();
          }
        });
      }
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}