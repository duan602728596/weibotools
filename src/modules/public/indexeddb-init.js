/**
 * 初始化数据库
 */
import IndexedDB from 'indexeddb-tools';
import config from './config';

const indexeddb: Object = config.indexeddb;

IndexedDB(indexeddb.name, indexeddb.version, {
  success(event: Event): void{
    this.close();
  },
  upgradeneeded(event: Event): void{
    if(!this.hasObjectStore(indexeddb.objectStore)){
      this.createObjectStore(indexeddb.objectStore, indexeddb.key[0], [
        {
          name: indexeddb.key[1],
          index: indexeddb.key[1]
        },
        {
          name: indexeddb.key[2],
          index: indexeddb.key[2]
        }
      ]);
    }
  }
});