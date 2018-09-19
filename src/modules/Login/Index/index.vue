<template>
  <i-layout :class="publicStyle.layout">
    <!-- 顶部菜单 -->
    <i-header :class="$classNames(publicStyle.header, 'clearfix')">
      <h4 :class="$classNames(publicStyle.fl, publicStyle.title)">微博账号登录</h4>
      <router-link :class="publicStyle.fr" to="/">
        <i-button type="error" icon="md-power">返回</i-button>
      </router-link>
      <i-button :class="$classNames(publicStyle.fr, publicStyle.mr10, publicStyle.mt17)"
        type="info"
        icon="md-phone-portrait"
        @click="handleDialogDisplayClick(true)"
      >
        登录
      </i-button>
    </i-header>
    <!-- 表格 -->
    <i-content :class="publicStyle.main">
      <p class="shuoming">账号过半个月左右要重新登陆一下，避免过期。</p>
      <i-table :columns="columns" :data="$store.getters['login/getLoginList']()"></i-table>
    </i-content>
    <!-- 弹出层 -->
    <i-modal v-model="visible" title="登录微博账号" :footer-hide="true">
      <i-form ref="weiboLogin" label-suffix="：" :rules="rules" :model="weiboLogin">
        <i-form-item label="用户名" prop="username">
          <i-input v-model="weiboLogin.username" />
        </i-form-item>
        <i-form-item label="密码" prop="password">
          <i-input v-model="weiboLogin.password" type="password" />
        </i-form-item>
        <i-form-item label="使用验证码登陆">
          <i-checkbox v-model="weiboLogin.vcode"></i-checkbox>
        </i-form-item>
        <div class="btn-box">
          <i-button :class="publicStyle.mr10" type="primary" @click="handleLoginClick">登录</i-button>
          <i-button type="error" @click="handleDialogDisplayClick(false)">取消</i-button>
        </div>
      </i-form>
    </i-modal>
  </i-layout>
</template>

<script src="./index.js"></script>
<style src="./style.sass" lang="sass" scoped></style>