<template>
  <i-layout :class="publicStyle.layout">
    <i-header :class="classNames(publicStyle.header, 'clearfix')">
      <i-select class="select" :class="classNames(publicStyle.fl, publicStyle.mr10, publicStyle.mt17)"
        :disabled="isLoading"
        v-model="selectLoginCookie"
        @on-change="handleLoginChange($event)"
      >
        <i-option v-for="item in $store.getters['friendship/getLoginList']()"
          :key="item.username"
          :label="item.username"
          :value="item.cookie"
        />
      </i-select>
      <i-button :class="classNames(publicStyle.fl, publicStyle.mt17)"
        type="error"
        icon="ios-outlet"
        @click="handleQuguanAllClick"
      >
        批量取消关注
      </i-button>
      <router-link :class="publicStyle.fr" to="/">
        <i-button type="error" icon="md-power">返回</i-button>
      </router-link>
    </i-header>
    <i-content :class="publicStyle.main">
      <i-table ref="friendship"
        :columns="columns"
        :data="$store.getters['friendship/getFrindShipList']()"
        :loading="isLoading"
        @on-selection-change="handleCheckboxChange"
      >
      </i-table>
    </i-content>
  </i-layout>
</template>

<script src="./index.js"></script>
<style src="./style.sass" scoped></style>