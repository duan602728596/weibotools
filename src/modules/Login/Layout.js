import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import loadReducer from '../../store/loadReducer';
import reducer from './store/reducer';
import Content from '../../assembly/Content/index';
import Index from './Index/index';

@loadReducer(reducer)
class ModuleLayout extends Component{
  render(): React.Element{
    return (
      <Content>
        <Switch>
          <Route path="/Login" component={ Index } exact={ true } />
        </Switch>
      </Content>
    );
  }
}

export default ModuleLayout;