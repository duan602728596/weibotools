import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import classNames from 'classnames';
import { Button, Collapse, Icon, Avatar, message } from 'antd';
import publicStyle from '../../../components/publicStyle/publicstyle.sass';
import style from './style.sass';
import { userList } from '../store/reducer';
import { superTopicLoading, checkInList } from '../store/checkIn';
import { queryUserList } from '../sql';
import { requestSuperTopicList, checkIn } from '../request';
import { sleep } from '../../../utils';

/* state */
const state: Function = createStructuredSelector({
  userList: createSelector(
    ($$state: Immutable.Map): ?Immutable.Map => $$state.has('superTopic') ? $$state.get('superTopic') : null,
    ($$data: ?Immutable.Map): Array => $$data ? $$data.get('userList').toJS() : []
  ),
  superTopicLoading: createSelector(
    ($$state: Immutable.Map): ?Immutable.Map => $$state.has('superTopic') ? $$state.get('superTopic').get('checkIn') : null,
    ($$data: ?Immutable.Map): boolean => $$data ? $$data.get('superTopicLoading') : false
  ),
  checkInList: createSelector(
    ($$state: Immutable.Map): ?Immutable.Map => $$state.has('superTopic') ? $$state.get('superTopic').get('checkIn') : null,
    ($$data: ?Immutable.Map): Object => $$data ? $$data.get('checkInList') : {}
  )
});

/* dispatch */
const dispatch: Function = (dispatch: Function): Object=>({
  action: bindActionCreators({
    userList,
    superTopicLoading,
    checkInList
  }, dispatch)
});

@connect(state, dispatch)
class Index extends Component{
  static propTypes: Object = {
    userList: PropTypes.array,
    superTopicLoading: PropTypes.bool,
    checkInList: PropTypes.object,
    action: PropTypes.objectOf(PropTypes.func)
  };

  state: {
    loading: boolean
  } = {
    loading: false // 全局的loading动画
  };

  async componentDidMount(): Promise<void>{
    if(this.props.userList.length === 0){
      this.handleRefreshUserListClick();
    }
  }
  // 刷新微博账户列表
  handleRefreshUserListClick: Function = async(event: ?Event): Promise<void>=>{
    const { rows }: Object = await queryUserList();
    const { userList, checkInList }: Object = this.props.action;

    userList({ data: rows });
    checkInList({ data: {} });
  };
  // 签到单个数据
  async handleCheckInAnItemClick(listItem: Object, userItem: Object, event: ?Event): Promise<void>{
    const { checkInList, action }: Object = this.props;

    try{
      const res: ?Object = await checkIn(userItem.cookie, listItem.containerId);

      let code: ?(number | string) = null;
      let msg: ?string = null;

      if(res === null){
        code = -99999;
        msg = '签到失败，请手工签到！';
      }else if(res.code === '100000'){
        // 签到成功
        const isErr: boolean = 'error_code' in res.data;

        code = isErr ? res.data.error_code : res.code;
        msg = isErr ? res.data.error_msg : `${ res.data?.alert_title }，${ res.data?.alert_subtitle }`;
      }else{
        // 其他情况
        code = res.code;
        msg = res.msg;
      }
      checkInList[`${ userItem.username }@@${ listItem.containerId }`] = { code, msg };
    }catch(err){
      console.error(err);
    }

    action.checkInList({ data: checkInList });
    this.forceUpdate();
  }
  // 签到一个列表
  async checkInAUserItemClick(userItem: Object): Promise<void>{
    for(const item: Object of userItem.superTopicList){
      await this.handleCheckInAnItemClick(item, userItem);
      await sleep(1500);
    }
    message.info(`【${ userItem.username }】签到完毕。`);
  }
  // 格式化超话数据
  formatData(list: Array): Array{
    const result: Array = [];

    list.forEach((value: Object, index: number, array: Array): void=>{
      if(value.card_type !== 8) return void 0; // card_type=8时为超话数据
      // 提取containerid
      const scheme: string = value.scheme.match(/containerid=[a-zA-Z0-9]+/)[0];
      const containerId: string = scheme.split('=')[1];

      result.push({
        pic: value.pic,            // 超话头像
        titleSub: value.title_sub, // 超话标题
        containerId                // Id
      });
    });

    return result;
  }
  // 获取一个用户的超话列表
  async handleGetSuperTopicListClick(userItem: Object, event: ?Event): Promise<void>{
    const { userList, action }: Object = this.props;
    // 如果是点击事件，则运行loading动画
    if(event){
      event.stopPropagation();
      action.superTopicLoading(true);
    }

    try{
      const list: Array = [];
      let sinceId: ?string = undefined;

      while(sinceId !== null){
        const resList: Object = await requestSuperTopicList(userItem.cookie, sinceId);
        const { cardlistInfo }: Object = resList.data;
        const { card_group }: Object = resList.data.cards[0];

        list.push(...this.formatData(card_group));
        sinceId = ('since_id' in cardlistInfo) ? cardlistInfo.since_id : null;
      }

      userItem.superTopicList = list;
      action.userList({ data: userList });
      await this.checkInAUserItemClick(userItem); // 签到
    }catch(err){
      console.error(err);
      message.error(`【${ userItem.username }】获取超话列表失败！`);
    }

    if(event) action.superTopicLoading(false);
  }
  // 一键签到
  handleCheckInAllClick: Function = async(event: Event): Promise<void>=>{
    const { userList, action }: Object = this.props;

    action.superTopicLoading(true);

    for(const item: Object of userList) await this.handleGetSuperTopicListClick(item);

    action.superTopicLoading(false);
    action.userList({ data: userList });
  };
  // 渲染
  superTopicListView(userItem: Object): React.ChildrenArray<React.Element>{
    const { checkInList }: Object = this.props;
    const element: [] = [];

    for(const item: Object of userItem.superTopicList){
      const cItem: Object = checkInList[`${ userItem.username }@@${ item.containerId }`] || {};
      const isSuccess: boolean = cItem.code === '100000'; // 签到成功
      const isCheckIn: boolean = cItem.code === 382004;   // 已签到

      element.push(
        <li key={ item.containerId } className={ classNames(style.superTopicItem, 'clearfix') }>
          <Avatar src={ item.pic } shape="square" icon="user" />
          <b className={ style.title }>{ item.titleSub }</b>
          {
            do{
              if(cItem.code && cItem.msg){
                <span className={ classNames(style.info, isSuccess ? style.success : style.fail) }>
                  { cItem.msg }
                </span>;
              }
            }
          }
          <Button className={ style.btn }
            type="primary"
            title="手动签到"
            icon="edit"
            shape="circle"
            ghost={ true }
            disabled={ isSuccess || isCheckIn }
            onClick={ this.handleCheckInAnItemClick.bind(this, item, userItem) }
          />
        </li>
      );
    }

    if(userItem.superTopicList % 2 !== 0) element.push(<li key="space" className={ style.superTopicItem } />);

    return element;
  }
  // 渲染Collapse
  userListCollapseView(list: Array): React.ChildrenArray<React.Element>{
    const { superTopicLoading }: Object = this.props;

    return list.map((item: Object, index: number): React.Element=>{
      return (
        <Collapse.Panel key={ item.username }
          header={
            <div className="clearfix">
              <span className={ style.collapseTitle }>{ item.username }</span>
              <Button className={ classNames(publicStyle.mr10, style.collapseBtn) }
                type="primary"
                size="small"
                ghost={ true }
                loading={ superTopicLoading }
                onClick={ this.handleGetSuperTopicListClick.bind(this, item) }
              >
                签到
              </Button>
            </div>
          }
        >
          {
            item.superTopicList && item.superTopicList.length > 0
              ? <ul className={ style.superTopicList }>{ this.superTopicListView(item) }</ul>
              : <div className={ style.noList }>暂无数据</div>
          }
        </Collapse.Panel>
      );
    });
  }
  render(): React.Element{
    const { userList, superTopicLoading }: Object = this.props;

    return (
      <Fragment>
        <div className={ publicStyle.mb10 }>
          <Button className={ publicStyle.mr10 }
            type="primary"
            icon="highlight"
            loading={ superTopicLoading }
            onClick={ this.handleCheckInAllClick }
          >
            一键签到
          </Button>
          <Button type="danger"
            icon="reload"
            loading={ superTopicLoading }
            onClick={ this.handleRefreshUserListClick }
          >
            刷新微博账户列表
          </Button>
        </div>
        {
          userList.length === 0 ? (
            <div className={ style.noData }>
              <Icon className={ publicStyle.mr10 } type="exclamation-circle" theme="filled" />
              暂无数据
            </div>
          ) : (
            <Collapse>{ this.userListCollapseView(userList) }</Collapse>
          )
        }
      </Fragment>
    );
  }
}

export default Index;