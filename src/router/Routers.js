import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncModule from './asyncModule';
import Index from '../modules/Index/Layout';

const Login: Function = asyncModule((): Promise => import('../modules/Login/Layout'));
const SuperTopic: Function = asyncModule((): Promise => import('../modules/SuperTopic/Layout'));

/* 路由模块 */
class Routers extends Component{
  render(): React.Element{
    return (
      <Switch>
        <Route path="/" component={ Index } exact={ true } />
        <Route path="/Index" component={ Index } />
        <Route path="/Login" component={ Login } />
        <Route path="/SuperTopic" component={ SuperTopic } />
      </Switch>
    );
  }
}

export default Routers;