/**
 * 初始化数据库
 */

import IndexedDB from 'indexeddb-tools';
import config from '../config/config';

const objectStore: Object[] = config.indexeddb.objectStore;

IndexedDB(config.indexeddb.name, config.indexeddb.version, {
  success(event: Event): void{
    this.close();
  },
  upgradeneeded(event: Event): void{
    objectStore.map((item: Object, index: number): void=>{
      if(!this.hasObjectStore(item.name)){
        const keys: Object[] = [];
        for(let i: number = 1, j: number = item.key.length; i < j; i++){
          keys.push({
            name: item.key[i],
            index: item.key[i]
          });
        }
        this.createObjectStore(item.name, item.key[0], keys);
      }
    });
  }
});