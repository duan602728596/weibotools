import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import classNames from 'classnames';
import { Button, Collapse, Icon } from 'antd';
import publicStyle from '../../../components/publicStyle/publicstyle.sass';
import style from './style.sass';
import { userList } from '../store/reducer';
import { queryUserList } from '../sql';

/* state */
const state: Function = createStructuredSelector({
  userList: createSelector(
    ($$state: Immutable.Map): ?Immutable.Map => $$state.has('superTopic') ? $$state.get('superTopic') : null,
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
  async componentDidMount(): Promise<void>{
    const { rows }: Object = await queryUserList();

    this.props.action.userList({ data: rows });
  }
  // 渲染Collapse
  userListCollapseView(list: Array): React.ChildrenArray<React.Element>{
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
              >
                签到
              </Button>
            </div>
          }
        />
      );
    });
  }
  render(): React.Element{
    const { userList }: Object = this.props;

    return (
      <Fragment>
        <div className={ publicStyle.mb10 }>
          <Button type="primary" icon="highlight">一键签到</Button>
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