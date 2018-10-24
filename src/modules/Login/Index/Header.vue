<template>
  <!-- 顶部菜单 -->
  <i-header :class="$classNames(publicStyle.header, 'clearfix')">
    <h4 :class="$classNames(publicStyle.fl, publicStyle.title)">微博账号登录</h4>
    <router-link :class="publicStyle.fr" to="/">
      <i-button type="error" icon="md-power">返回</i-button>
    </router-link>
    <i-button :class="$classNames(publicStyle.fr, publicStyle.mr10, publicStyle.mt17)"
      type="info"
      icon="md-phone-portrait"
      @click="$props.onClick"
    >
      登录
    </i-button>
  </i-header>
</template>

<script>
  import publicStyle from '../../../components/publicStyle/publicStyle.sass';

  export default {
    props: ['onClick'],
    data(): Object{
      return {
        publicStyle
      };
    }
  };
</script>