import initWebSql from '../../../components/webSql/webSql';

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

/**
 * 储存用户登陆的信息
 * @param { string } username: 用户名
 * @param { string } password: 密码
 * @param { number } loginTime: 登陆时间的时间戳
 * @param { string } cookie: cookie
 */
export function insertLoginItem(username: string, password: string, loginTime: number, cookie: string): Promise{
  const db: Object = initWebSql();

  return new Promise((resolve: Function, reject: Function): void=>{
    db.transaction(function(tx: Object): void{
      tx.executeSql(
        'INSERT INTO userList (username, password, loginTime, cookie) VALUES (?, ?, ?, ?)',
        [username, password, loginTime, cookie],
        (tx: Object, result: any): void=>{
          resolve(result);
        }
      );
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/**
 * 更新用户登陆的信息
 * @param { string } username: 用户名
 * @param { string } password: 密码
 * @param { number } loginTime: 登陆时间的时间戳
 * @param { string } cookie: cookie
 */
export function updateLoginItem(username: string, password: string, loginTime: number, cookie: string): Promise{
  const db: Object = initWebSql();

  return new Promise((resolve: Function, reject: Function): void=>{
    db.transaction(function(tx: Object): void{
      tx.executeSql(
        'UPDATE userList SET password=?, loginTime=?, cookie=? WHERE username=?',
        [password, loginTime, cookie, username],
        (tx: Object, result: any): void=>{
          resolve(result);
        }
      );
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/**
 * 查询用户是否存在
 * @param { string } username: 用户名
 */
export function queryUsernameIsExists(username: string): Promise{
  const db: Object = initWebSql();

  return new Promise((resolve: Function, reject: Function): void=>{
    db.transaction(function(tx: Object): void{
      tx.executeSql(
        'SELECT * FROM userList WHERE username=?', [username], (tx: Object, result: any): void=>{
          resolve(result);
        }
      );
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}

/**
 * 删除用户
 * @param { string } username: 用户名
 */
export function deleteUserItem(username: string): Promise{
  const db: Object = initWebSql();

  return new Promise((resolve: Function, reject: Function): void=>{
    db.transaction(function(tx: Object): void{
      tx.executeSql(
        'DELETE FROM userList WHERE username=?', [username], (tx: Object, result: any): void=>{
          resolve(result);
        }
      );
    });
  }).catch((err: any): void=>{
    console.error(err);
  });
}