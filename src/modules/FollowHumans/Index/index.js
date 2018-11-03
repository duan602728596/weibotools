import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import classNames from 'classnames';
import { Select, Button, Table, message, Avatar, Popconfirm } from 'antd';
import publicStyle from '../../../components/publicStyle/publicstyle.sass';
import style from './style.sass';
import { userList } from '../store/reducer';
import { queryUserList } from '../sql';
import { requestSt } from '../../../utils';
import { requestFollowHumansList, friendshipsApi } from '../request';

/* state */
const state: Function = createStructuredSelector({
  userList: createSelector(
    ($$state: Immutable.Map): ?Immutable.Map => $$state.has('followHumans') ? $$state.get('followHumans') : null,
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
  static propTypes: Object = {
    userList: PropTypes.array,
    action: PropTypes.objectOf(PropTypes.func)
  };

  state: {
    selectValue: ?string,
    page: number,
    followHumansList: Array,
    followHumansListCookie: ?string,
    loading: boolean,
    selectedRowKeys: string[],
    selectedRows: Object[]
  } = {
    selectValue: null,            // select的值
    page: 0,                      // 页码
    followHumansList: [],         // 列表
    followHumansListCookie: null, // 关注和取关会用到cookie
    loading: false,               // 加载动画
    selectedRowKeys: [],          // 表格的checkbox
    selectedRows: []              // 表格的checkbox
  };

  async componentDidMount(): Promise<void>{
    const { rows }: { rows: Array } = await queryUserList();
    const { userList }: { userList: Function } = this.props.action;

    userList({ data: rows });
  }
  // 单个取关或关注
  async handleAttentionOrCancelAttentionClick(item: Object, action: boolean, info: ?Object, event: ?Event): Promise<void>{
    try{
      const { userList }: { userList: Array } = this.props;
      const { selectValue, followHumansListCookie, followHumansList }: {
        selectValue: ?number,
        followHumansListCookie: string,
        followHumansList: Array
      } = this.state;
      let resSt: ?Object = null;

      if(!info) resSt = await requestSt(userList[selectValue].cookie);

      const { st }: { st: string } = info ? info : resSt.data.data;
      const cookie: string = info ? info.cookie : `${ userList[selectValue].cookie }; ${ resSt.cookie }; ${ followHumansListCookie }`;

      // 返回的结果可能为{ok: 0, errno: "100006", msg: "token校验失败"}
      const result: Object = await friendshipsApi(cookie, item.user.id, st, action);

      if('errno' in result){
        message.error(result.msg);
        return void 0;
      }

      if(action) delete item.isQuguan;
      else item.isQuguan = true;

      if(event) this.setState({ followHumansList: [...followHumansList] });
    }catch(err){
      console.error(err);
      message.error('关注或取关失败！');
    }
  }
  // 一键取关
  handleOneClickToCancelAttentionClick: Function = async(event: Event): Promise<void>=>{
    const { userList }: { userList: Array } = this.props;
    const { selectValue, selectedRows, followHumansListCookie, followHumansList }: {
      selectValue: ?number,
      selectedRows: Array,
      selectedRowKeys: Array,
      followHumansListCookie: string,
      followHumansList: Array
    } = this.state;
    const resSt: Object = await requestSt(userList[selectValue].cookie);
    const { st }: { st: string } = resSt.data.data;
    const cookie: string = `${ userList[selectValue].cookie }; ${ resSt.cookie }; ${ followHumansListCookie }`;
    const info: Object = { st, cookie };

    for(const item: Object of selectedRows){
      await this.handleAttentionOrCancelAttentionClick(item, false, info);
    }

    this.setState({
      selectedRows: [],
      selectedRowKeys: [],
      followHumansList: [...followHumansList]
    });
  };
  // 加载数据
  async loadFollowHumansList(nextPage: number, action: boolean): Promise<void>{
    this.setState({ loading: true });

    try{
      const { userList }: { userList: Array } = this.props;
      const { selectValue, followHumansList }: {
        selectValue: ?number,
        followHumansList: Array
      } = this.state;
      const res: Object = await requestFollowHumansList(userList[selectValue].cookie, nextPage);
      // 数据
      const { cards }: Object = res.data.data;
      const isEnd: boolean = cards.length === 0;
      const card_group: [] = isEnd ? [] : cards[cards.length - 1].card_group;

      this.setState({
        followHumansList: do{
          if(action){
            card_group;
          }else{
            followHumansList.push(...card_group);
            followHumansList;
          }
        },
        followHumansListCookie: res.cookie,
        page: isEnd ? null : nextPage, // 当前页码
        loading: false
      });
    }catch(err){
      console.error(err);
      message.error('数据加载失败！');
      this.setState({ loading: false });
    }
  }
  // 加载更多
  handleLoadFollowHumansNextPageClick: Function = (event: Event): void=>{
    const { page }: { page: number } = this.state;

    this.loadFollowHumansList(page + 1, false);
  };
  // 刷新列表
  handleLoadFollowHumansClick: Function = (event: Event): void=>{
    this.loadFollowHumansList(1, true);
  };
  // select onChange
  handleSelectChange: Function = (value: number, option: Object): void=>{
    this.setState({
      selectValue: value,
      page: 0,
      followHumansList: [],
      followHumansListCookie: null,
      selectedRowKeys: [],
      selectedRows: []
    });
  };
  // 表格checkbox选择
  handleRowSelectionChange: Function = (selectedRowKeys: string[], selectedRows: Object[]): void=>{
    this.setState({ selectedRowKeys, selectedRows });
  };
  // select option
  selectOptionView(): React.ChildrenArray<React.Element>{
    return this.props.userList.map((item: Object, index: number): React.Element=>{
      return (
        <Select.Option key={ item.username } value={ index }>
          { item.username }
        </Select.Option>
      );
    });
  }
  // 表格配置
  columns(): Array{
    return [
      {
        title: '用户名',
        dataIndex: 'user.screen_name',
        render: (value: string, item: Object, index: number): React.ChildrenArray<React.Element>=>{
          return [
            <Avatar key="avatar" className={ style.avatar } src={ item.user.profile_image_url } shape="square" icon="user" />,
            <b key="username" className={ style.username }>{ value }</b>
          ];
        }
      },
      {
        title: '介绍',
        dataIndex: 'desc1',
        render: (value: string, item: Object, index: number): string => `${ item.user.verified ? '微博认证：' : '' }${ value }`
      },
      {
        title: '操作',
        key: 'handle',
        render: (value: any, item: Object, index: number): React.Element => {
          // 已经取关
          if(item.isQuguan){
            return (
              <Button size="small" onClick={ this.handleAttentionOrCancelAttentionClick.bind(this, item, true, null) }>
                关注
              </Button>
            );
          }else{
            return (
              <Popconfirm title="确定要取关吗？" onConfirm={ this.handleAttentionOrCancelAttentionClick.bind(this, item, false, null) }>
                <Button type="danger" size="small">取关</Button>
              </Popconfirm>
            );
          }
        }
      }
    ];
  }
  render(): React.Element{
    const { selectValue, page, followHumansList, loading, selectedRowKeys }: {
      selectValue: ?number,
      page: number,
      followHumansList: Array,
      loading: boolean,
      selectedRowKeys: Array
    } = this.state;

    return (
      <Fragment>
        <div className={ publicStyle.mb10 }>
          <Select className={ classNames(publicStyle.mr10, style.select) }
            disabled={ loading }
            value={ selectValue }
            onChange={ this.handleSelectChange }
          >
            { this.selectOptionView() }
          </Select>
          <Button className={ publicStyle.mr10 }
            type="primary"
            icon="redo"
            loading={ loading }
            disabled={ selectValue === null }
            onClick={ this.handleLoadFollowHumansClick }
          >
            刷新列表
          </Button>
          <Button className={ publicStyle.mr10 }
            icon="hourglass"
            loading={ loading }
            disabled={ selectValue === null || page === null }
            onClick={ this.handleLoadFollowHumansNextPageClick }
          >
            加载更多
          </Button>
          <Popconfirm title="是否要批量取消关注吗？" onConfirm={ this.handleOneClickToCancelAttentionClick }>
            <Button type="danger"
              icon="usergroup-delete"
              loading={ loading }
              disabled={ selectValue === null || selectedRowKeys.length === 0 }
            >
              一键取关
            </Button>
          </Popconfirm>
        </div>
        <Table size="middle"
          rowKey="itemid"
          dataSource={ followHumansList }
          columns={ this.columns() }
          bordered={ true }
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: this.handleRowSelectionChange
          }}
        />
      </Fragment>
    );
  }
}

export default Index;