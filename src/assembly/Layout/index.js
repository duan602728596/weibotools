import React, { Component } from 'react';
import { Layout as AntdLayout } from 'antd';
import style from './style.sass';
import Header from '../Header/index';
import Routers from '../../router/Routers';

class Layout extends Component{
  render(): React.Element{
    return (
      <AntdLayout className={ style.layout }>
        <Header />
        <AntdLayout>
          <Routers />
        </AntdLayout>
      </AntdLayout>
    );
  }
}

export default Layout;