/* 登陆弹出层 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Input, Checkbox } from 'antd';

@Form.create()
class LoginModal extends Component{
  static propTypes: Object = {
    form: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func
  };

  state: {
    checked: boolean
  } = {
    checked: false // checkbox的状态
  };

  // 登陆
  handleOkClick: Function = (event: Event): void=>{
    const { form, onOk }: Object = this.props;

    form.validateFields((err: Object, value: Object): void=>{
      if(err) return void 0;

      onOk(value, (): void=>{
        form.resetFields();
        this.setState({ checked: false });
      });
    });
  };
  // 关闭回调函数
  handleCancelClick: Function = (event: Event): void=>{
    const { form, onCancel }: Object = this.props;

    onCancel();
    form.resetFields();
    this.setState({ checked: false });
  };
  // checkbox的回调函数
  handleCheckedChange: Function = (event: Event): void=>{
    const { checked }: Object = this.state;

    this.setState({ checked: !checked });
  };
  render(): React.Element{
    const col: Object = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    const { visible, form }: Object = this.props;
    const { getFieldDecorator }: Object = form;

    return (
      <Modal title="账号登陆"
        zIndex={ 1 }
        visible={ visible }
        centered={ true }
        keyboard={ false }
        onOk={ this.handleOkClick }
        onCancel={ this.handleCancelClick }
      >
        <Form>
          <Form.Item label="用户名" { ...col }>
            {
              getFieldDecorator('username', {
                rules: [{
                  required: true,
                  message: '请输入用户名',
                  whitespace: true
                }]
              })(<Input />)
            }
          </Form.Item>
          <Form.Item label="密码" { ...col }>
            {
              getFieldDecorator('password', {
                rules: [{
                  required: true,
                  message: '请输入密码',
                  whitespace: true
                }]
              })(<Input type="password" />)
            }
          </Form.Item>
          <Form.Item label="使用验证码登陆" { ...col }>
            {
              getFieldDecorator('isVcode')(
                <Checkbox checked={ this.state.checked }
                  onChange={ this.handleCheckedChange }
                />)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default LoginModal;