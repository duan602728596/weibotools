import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { Layout, Icon } from 'antd';
import style from './style.sass';

type NavOptionsItem = {
  id: string,
  name: string | React.Element,
  href: string
};

const navOptions: Array<NavOptionsItem> = [
  {
    id: 'index',
    name: <Icon className={ style.home } type="home" theme="twoTone" />,
    href: '/Index'
  },
  {
    id: 'login',
    name: '用户登陆',
    href: '/Login'
  },
  {
    id: 'superTopic',
    name: '超级话题',
    href: '/SuperTopic'
  }
];

class Header extends Component{
  // 判断首页home
  oddEvent(item: navOptionsItem, match: Object, location: Object): boolean{
    const { pathname }: { pathname: string } = location;
    const { href }: { href: string } = item;
    const reg: RegExp = new RegExp(`^${ href }.*$`, 'ig');

    if(pathname === '/' && href === navOptions[0].href){
      return true;
    }
    return match && reg.test(pathname);
  }
  // 循环输出导航
  navList(options: Array<NavOptionsItem>): React.ChildrenArray<React.Element>{
    return options.map((item: NavOptionsItem, index: number): Object=>{
      return (
        <NavLink key={ item.id }
          className={ style.linkItem }
          to={ item.href }
          activeClassName={ style.navActive }
          isActive={ this.oddEvent.bind(this, item) }
        >
          { item.name }
        </NavLink>
      );
    });
  }
  render(): React.Element{
    return (
      <Layout.Header className={ style.header }>
        <nav className={ classNames(style.nav, 'clearfix') }>
          { this.navList(navOptions) }
        </nav>
      </Layout.Header>
    );
  }
}

export default Header;