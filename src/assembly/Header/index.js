import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { Layout } from 'antd';
import style from './style.sass';

type NavOptionsItem = {
  name: string,
  href: string
};

const navOptions: Array<NavOptionsItem> = [
  {
    name: '微博工具',
    href: '/'
  },
  {
    name: '用户登陆',
    href: '/Login'
  }
];

class Header extends Component{
  // 判断首页home
  oddEvent(item: navOptionsItem, match: Object, location: Object): boolean{
    const { pathname }: { pathname: string } = location;
    const { href }: { href: string } = item;
    const reg: RegExp = new RegExp(`^${ href }.*$`, 'ig');

    return pathname === href;
  }
  // 循环输出导航
  navList(options: Array<NavOptionsItem>): React.ChildrenArray<React.Element>{
    return options.map((item: navOptionsItem, index: number): Object=>{
      return (
        <NavLink key={ index }
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