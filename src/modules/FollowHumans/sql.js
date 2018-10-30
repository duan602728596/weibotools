import initWebSql from '../../components/webSql/webSql';

/**
 * 查询用户列表
 */
export function queryUserList(): Promise{
  const db: Object = initWebSql();

  return new Promise((resolve: Function, reject: Function): void=>{
    db.transaction(function(tx: Object): void{
      tx.executeSql(
        'SELECT * FROM userList', [], (tx: Object, result: any): void=>{
          resolve(result);
        }
      );
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}