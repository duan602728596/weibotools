/**
 * 参数配置
 */

const config: Object = {
  indexeddb: {
    name: 'weibo-automatic-sign-in-tool',
    version: 1,
    objectStore: 'login-list',
    key: ['username', 'loginTime', 'cookie']
  }
};

export default config;