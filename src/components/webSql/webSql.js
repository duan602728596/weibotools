/* 初始化数据库表 */
export function initTable(): void{
  initWebSql().transaction(function(tx: Object): void{
    /**
     * 表名：userList
     * 字段：
     *   username：用户名
     *   password：密码
     *   loginTime：登陆时间
     *   cookie：登陆后获取到的cookie
     */
    tx.executeSql('CREATE TABLE IF NOT EXISTS userList (username unique, password, loginTime, cookie)');
  });
}
/* 数据库 */
function initWebSql(): Database{
  return openDatabase('webotools', 1, '微博工具数据库', 2 * (1024 ** 2));
}

export default initWebSql;