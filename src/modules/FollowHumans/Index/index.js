import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import classNames from 'classnames';
import { Select, Button, Table, message, Avatar } from 'antd';
import publicStyle from '../../../components/publicStyle/publicstyle.sass';
import style from './style.sass';
import { userList } from '../store/reducer';
import { queryUserList } from '../sql';
import { requestFollowHumansList } from '../request';

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
    const { rows }: Object = await queryUserList();
    const { userList }: Object = this.props.action;

    userList({ data: rows });
  }
  // 加载数据
  async loadFollowHumansList(nextPage: number): Promise<void>{
    console.log(nextPage);

    this.setState({ loading: true });

    try{
      const { userList }: Object = this.props;
      const { selectValue, followHumansList }: Object = this.state;
      const res: Object = await requestFollowHumansList(userList[selectValue].cookie, nextPage);
      // 数据
      const { cards }: Object = res.data.data;
      const isEnd: boolean = cards.length === 0;
      const card_group: [] = isEnd ? [] : cards[cards.length - 1].card_group;

      followHumansList.push(...card_group);

      console.log(card_group);

      this.setState({
        followHumansList,
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
    const { page }: Object = this.state;

    this.loadFollowHumansList(page + 1);
  };
  // 刷新列表
  handleLoadFollowHumansClick: Function = (event: Event): void=>{
    this.loadFollowHumansList(1);
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
            <Avatar key="avatar" src={ item.user.profile_image_url } shape="square" icon="user" />,
            <b key="username" className={ style.username }>{ value }</b>
          ];
        }
      },
      {
        title: '介绍',
        dataIndex: 'desc1',
        render: (value: string, item: Object, index: number): string => `${ item.user.verified ? '微博认证：' : '' }${ value }`
      }
    ];
  }
  render(): React.Element{
    const { selectValue, page, followHumansList, loading, selectedRowKeys }: Object = this.state;

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
          <Button icon="hourglass"
            loading={ loading }
            disabled={ selectValue === null || page === null }
            onClick={ this.handleLoadFollowHumansNextPageClick }
          >
            加载更多
          </Button>
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