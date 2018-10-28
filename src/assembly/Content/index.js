import React, { Component } from 'react';
import { Layout } from 'antd';
import style from './style.sass';

class Content extends Component{
  render(): React.Element{
    return (
      <Layout.Content className={ style.content }>
        { this.props.children }
      </Layout.Content>
    );
  }
}

export default Content;