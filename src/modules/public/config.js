/**
 * 参数配置
 */

const config: Object = {
  indexeddb: {
    name: 'weibo-automatic-sign-in-tool',
    version: 3,
    objectStore: [
      {
        name: 'login-list',
        key: ['username', 'loginTime', 'cookie', 'st']
      },
      {
        name: 'lfid-list',
        key: ['lfid', 'name']
      }
    ]
  }
};

export default config;