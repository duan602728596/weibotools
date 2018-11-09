import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Button } from 'antd';
import publicStyle from '../../../components/publicStyle/publicstyle.sass';

class Like extends Component{
  render(): React.Element{
    return (
      <Fragment>
        <div className={ publicStyle.mb10 }>
          <Button type="primary" icon="plus-square">添加lfid</Button>
        </div>
      </Fragment>
    );
  }
}

export default Like;