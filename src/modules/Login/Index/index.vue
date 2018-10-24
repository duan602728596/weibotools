<template>
  <i-layout :class="publicStyle.layout">
    <!-- 顶部菜单 -->
    <Header :onClick="handleDialogDisplayClick.bind(this, true)" />
    <!-- 表格 -->
    <i-content :class="publicStyle.main">
      <p class="shuoming">账号过半个月左右要重新登陆一下，避免过期。</p>
      <i-table :columns="columns" :data="$store.getters['login/getLoginList']()"></i-table>
    </i-content>
    <!-- 弹出层 -->
    <Modal ref="weiboLogin"
      :visible="visible"
      :value="weiboLogin"
      :onOk="handleLoginClick.bind(this)"
      :onCancel="handleDialogDisplayClick.bind(this, false)"
    />
  </i-layout>
</template>

<script src="./index.js"></script>
<style src="./style.sass" lang="sass" scoped></style>