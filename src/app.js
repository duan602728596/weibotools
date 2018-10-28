import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { storeFactory } from './store/store';
import Layout from './assembly/Layout/index';
import { initTable } from './components/webSql/webSql';

initTable();

/* app */
ReactDOM.render(
  <Provider store={ storeFactory(window.__INITIAL_STATE__ || {}) }>
    <LocaleProvider locale={ zhCN }>
      <HashRouter>
        <Layout />
      </HashRouter>
    </LocaleProvider>
  </Provider>,
  document.getElementById('app')
);