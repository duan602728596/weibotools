/**
 * 参数配置
 */

const config: Object = {
  indexeddb: {
    name: 'weibo-automatic-sign-in-tool',
    version: 2,
    objectStore: [
      {
        name: 'login-list',
        key: ['username', 'loginTime', 'cookie', 'st']
      }
    ]
  }
};

export default config;