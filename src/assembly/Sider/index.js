import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import style from './style.sass';

@withRouter
class Sider extends Component{
  static defaultProps: Object = {
    options: []
  };
  static propTypes: Object = {
    options: PropTypes.array,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object
  };

  // 根据pathname获取默认的selectKey
  getSelectKey(arr: Array): ?string{
    const { location }: Object = this.props;
    const reg: RegExp = new RegExp(`^${ location.pathname }.*$`, 'ig');
    let key: ?string = null;

    for(let i: number = 0, j: number = arr.length; i < j; i++){
      const item: Object = arr[i];

      if('children' in item && item.children.length > 0){
        const key2: ?string = this.getSelectKey(item.children);
        if(key2){
          key = key2;
          break;
        }
      }else{
        if(reg.test(item.href)){
          key = item.id;
          break;
        }
      }
    }
    return key;
  }
  // 渲染菜单
  menu(arr: Array): React.ChildrenAray<React.Element>{
    return arr.map((item: Object, index: number): Object=>{
      if('children' in item && item.children.length > 0){
        // 当有children时，返回Menu.SubMenu，里面包裹Menu.Item
        return (
          <Menu.SubMenu key={ item.id } title={ item.name }>
            { this.menu(item.children) }
          </Menu.SubMenu>
        );
      }else{
        // 当没有children时，返回Menu.Item
        return (
          <Menu.Item key={ item.id }>
            <Link to={ item.href }>{ item.name }</Link>
          </Menu.Item>
        );
      }
    });
  }
  render(): React.Element{
    const options: Array = this.props.options;
    const sk: string = this.getSelectKey(options);

    return (
      <Layout.Sider className={ style.sider } width={ 130 }>
        <Menu theme="light" mode="inline" defaultSelectedKeys={ [sk] } style={{ borderRight: 'none' }}>
          { this.menu(options) }
        </Menu>
      </Layout.Sider>
    );
  }
}

export default Sider;