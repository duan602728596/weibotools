import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Button, Table, message, Popconfirm } from 'antd';
import moment from 'moment';
import hint from 'hint';
import publicStyle from '../../../components/publicStyle/publicstyle.sass';
import { userList } from '../store/reducer';
import style from './style.sass';
import LoginModal from './LoginModal';
import { preLogin, requestVerificationCode, gestureVerify, login } from './request';
import { queryUserList, insertLoginItem, updateLoginItem, queryUsernameIsExists, deleteUserItem } from './sql';

/* state */
const state: Function = createStructuredSelector({
  userList: createSelector(
    ($$state: Immutable.Map): ?Immutable.Map => $$state.has('login') ? $$state.get('login') : null,
    ($$data: ?Immutable.Map): Array => $$data ? $$data.get('userList').toJS() : []
  )
});

/* dispatch */
const dispatch: Function = (dispatch: Function): Object=>({
  action: bindActionCreators({
    userList
  }, dispatch)
});

@connect(state, dispatch)
class Index extends Component{
  _verificationCodeCallback: ?Function = null;
  state: {
    isLoginModalVisible: boolean
  } = {
    isLoginModalVisible: false // 弹出层的显示和隐藏
  };

  async componentDidMount(): Promise<void>{
    const { rows }: Object = await queryUserList();

    this.props.action.userList({ data: rows });
  }
  // 查找索引
  getUserListIndex(rawArray: Array, username: string): number{
    let index: ?number = null;

    for(let i: number = 0, j: number = rawArray.length; i < j; i++){
      if(rawArray[i].username === username){
        index = i;
        break;
      }
    }

    return index;
  }
  // 登陆
  async loginWeibo(value: Object, id: ?string, callback: ?Function): Promise<void>{
    try{
      const loginRes: Object = await login(value.username, value.password, id);
      const data: Object = loginRes.data;

      // 登陆失败
      if(data.retcode !== 20000000){
        message.error(`（${ data.retcode }）${ data.msg }`);
        return void 0;
      }

      const exists: Object = await queryUsernameIsExists(value.username);
      const time: number = moment().unix() * 1000;
      const argu: [] = [value.username, value.password, time, loginRes.cookie];
      const { userList }: Object = this.props;
      const item: Object = {
        username: value.username,
        password: value.password,
        loginTime: time,
        cookie: loginRes.cookie
      };

      if(exists.rows.length > 0){
        await updateLoginItem(...argu);
        userList[this.getUserListIndex(userList, value.username)] = item;
      }else{
        await insertLoginItem(...argu);
        userList.push(item);
      }

      message.success('微博登陆成功！');
      this.props.action.userList({ data: userList });
      callback && callback();
    }catch(err){
      console.error(err);
      message.error('微博登陆失败！');
    }
  }
  // 手势验证的回调函数
  async verificationCodeCallback(verificationCode: Object, value: Object, callback: ?Function, event: Event): Promise<void>{
    try{
      const { path_enc, data_enc }: Object = event.data;
      const gestureVerifyRes: Object = await gestureVerify(verificationCode.id, value.username, path_enc, data_enc);

      document.removeEventListener('weibo-pattlock', this._verificationCodeCallback);
      this._verificationCodeCallback = null;

      if(gestureVerifyRes.code === '100000') this.loginWeibo(value, verificationCode.id, callback);
      else message.error(`（${ gestureVerifyRes.code }）${ gestureVerifyRes.msg }`);
    }catch(err){
      console.error(err);
      message.error('微博手势验证失败！');
    }
  }
  // 获取验证码
  async getVerificationCode(value: Object, callback: ?Function): Promise<void>{
    try{
      const verificationCodeRes: Object = await requestVerificationCode(value.username);

      hint(verificationCodeRes.path_enc, verificationCodeRes.id);
      this._verificationCodeCallback = this.verificationCodeCallback.bind(this, verificationCodeRes, value, callback);
      document.addEventListener('weibo-pattlock', this._verificationCodeCallback, false);
    }catch(err){
      console.error(err);
      message.error('获取验证码信息失败！');
    }
  }
  // 登陆微博
  async verifyWeibo(value: Object, callback: ?Function): Promise<void>{
    try{
      // 直接使用验证码
      if(value.isVcode){
        this.getVerificationCode(value, callback);
        return void 0;
      }

      // 判断是否需要验证码
      const preLoginRes: Object = await preLogin(value.username);

      if(('showpin' in preLoginRes && preLoginRes.showpin === 1) || ('smsurl' in preLoginRes)){
        // 获取手势验证的验证码
        this.getVerificationCode(value, callback);
        return void 0;
      }

      // 不使用验证码，直接登陆
      this.loginWeibo(value, null, callback);
    }catch(err){
      console.error(err);
      message.error('微博登陆初始化失败！');
    }
  }
  // 删除登陆的账号
  async handleDeleteUserItemClick(item: Object, index: number, event: Event): Promise<void>{
    await deleteUserItem(item.username);

    const { userList }: Object = this.props;

    userList.splice(index, 1);
    this.props.action.userList({ data: userList });
  }
  // 重新登陆
  handleLoginAgainClick(item: Object, isVcode: boolean, event: Event): void{
    const value: Object = {
      username: item.username,
      password: item.password
    };

    if(isVcode) value.isVcode = true;

    this.verifyWeibo(value);
  }
  // 弹出层的显示和隐藏
  handleLoginModalDisplayClick(value: boolean, event: Event): void{
    this.setState({ isLoginModalVisible: value });
  }
  // 数组的配置
  columus(): Array{
    return [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '密码',
        dataIndex: 'password'
      },
      {
        title: '登陆时间',
        dataIndex: 'loginTime',
        render: (value: number, item: Object, index: number): string => moment(value).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        key: 'handle',
        render: (value: number, item: Object, index: number): React.Element=>{
          return (
            <Button.Group>
              <Button className={ style.groupBtn }
                size="small"
                onClick={ this.handleLoginAgainClick.bind(this, item, false) }
              >
                重新登陆
              </Button>
              <Button className={ style.groupBtn }
                size="small"
                onClick={ this.handleLoginAgainClick.bind(this, item, true) }
              >
                使用验证码重新登陆
              </Button>
              <Popconfirm title="是否删除？" onConfirm={ this.handleDeleteUserItemClick.bind(this, item, index) }>
                <Button className={ style.groupBtn } type="danger" size="small">删除</Button>
              </Popconfirm>
            </Button.Group>
          );
        }
      }
    ];
  }
  render(): React.Element{
    return (
      <Fragment>
        <div className={ publicStyle.mb10 }>
          <Button type="primary" icon="login" onClick={ this.handleLoginModalDisplayClick.bind(this, true) }>登陆账号</Button>
        </div>
        <Table size="middle"
          rowKey="username"
          dataSource={ this.props.userList }
          columns={ this.columus() }
          bordered={ true }
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true
          }}
        />
        <LoginModal visible={ this.state.isLoginModalVisible }
          onOk={ this.verifyWeibo.bind(this) }
          onCancel={ this.handleLoginModalDisplayClick.bind(this, false) }
        />
      </Fragment>
    );
  }
}

export default Index;