import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Content from '../../assembly/Content/index';
import Index from './Index/index';

class ModuleLayout extends Component{
  render(): React.Element{
    return (
      <Content>
        <Switch>
          <Route path="/" component={ Index } exact={ true } />
        </Switch>
      </Content>
    );
  }
}

export default ModuleLayout;