/**
 * 参数配置
 */

const config: Object = {
  indexeddb: {
    name: 'weibo-automatic-sign-in-tool',
    version: 6,
    objectStore: [
      {
        name: 'login-list',
        key: ['username', 'loginTime', 'cookie', 'password']
      },
      {
        name: 'lfid-list',
        key: ['lfid', 'name', 'page']
      }
    ]
  }
};

export default config;