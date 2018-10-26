<template>
  <!-- 顶部菜单 -->
  <i-header :class="$classNames(publicStyle.header, 'clearfix')">
    <h4 :class="$classNames(publicStyle.fl, publicStyle.title)">超级话题一键签到</h4>
    <router-link :class="publicStyle.fr" to="/">
      <i-button type="error" icon="md-power">返回</i-button>
    </router-link>
    <i-button :class="$classNames(publicStyle.fr, publicStyle.mr10, publicStyle.mt17)"
      type="warning"
      icon="ios-paper-plane-outline"
      :loading="$props.loading"
      @click="$props.onClick"
    >
      {{ $props.loading === false ? '一键签到' : '签到中...' }}
    </i-button>
  </i-header>
</template>

<script>
  import publicStyle from '../../../components/publicStyle/publicStyle.sass';

  export default {
    props: ['loading', 'onClick'],
    data(): Object{
      return {
        publicStyle
      };
    }
  };
</script>