/**
 * 初始化数据库
 */

import IndexedDB from 'indexeddb-tools';
import config from './config';

const objectStore: Object[] = config.indexeddb.objectStore;

IndexedDB(config.indexeddb.name, config.indexeddb.version, {
  success(event: Event): void{
    this.close();
  },
  upgradeneeded(event: Event): void{
    if(!this.hasObjectStore(objectStore[0].name)){
      this.createObjectStore(objectStore[0].name, objectStore[0].key[0], [
        {
          name: objectStore[0].key[1],
          index: objectStore[0].key[1]
        },
        {
          name: objectStore[0].key[2],
          index: objectStore[0].key[2]
        },
        {
          name: objectStore[0].key[3],
          index: objectStore[0].key[3]
        }
      ]);
    }
  }
});