/**
 * 参数配置
 */

const config: Object = {
  indexeddb: {
    name: 'weibo-automatic-sign-in-tool',
    version: 5,
    objectStore: [
      {
        name: 'login-list',
        key: ['username', 'loginTime', 'cookie']
      },
      {
        name: 'lfid-list',
        key: ['lfid', 'name', 'page']
      }
    ]
  }
};

export default config;