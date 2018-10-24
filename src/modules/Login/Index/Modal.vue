<template>
  <!-- 弹出层 -->
  <i-modal v-model="$props.visible" title="登录微博账号" :footer-hide="true" :closable="false" :mask-closable="false">
    <i-form ref="weiboLogin" label-suffix="：" :rules="rules" :model="$props.value">
      <i-form-item label="用户名" prop="username">
        <i-input v-model="$props.value.username" />
      </i-form-item>
      <i-form-item label="密码" prop="password">
        <i-input v-model="$props.value.password" type="password" />
      </i-form-item>
      <i-form-item label="使用验证码登陆">
        <i-checkbox v-model="$props.value.vcode"></i-checkbox>
      </i-form-item>
      <div class="btn-box">
        <i-button :class="publicStyle.mr10" type="primary" @click="$props.onOk">登录</i-button>
        <i-button type="error" @click="$props.onCancel">取消</i-button>
      </div>
    </i-form>
  </i-modal>
</template>

<script>
  import publicStyle from '../../../components/publicStyle/publicStyle.sass';

  export default {
    props: ['visible', 'value', 'onOk', 'onCancel'],
    data(): Object{
      return {
        publicStyle,
        // 校验规则
        rules: {
          username: {
            required: true,
            message: '请输入用户名！'
          },
          password: {
            required: true,
            message: '请输入密码！'
          }
        }
      };
    }
  };
</script>