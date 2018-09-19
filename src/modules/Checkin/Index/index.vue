<template>
  <i-layout :class="publicStyle.layout">
    <!-- 顶部菜单 -->
    <i-header :class="$classNames(publicStyle.header, 'clearfix')">
      <h4 :class="$classNames(publicStyle.fl, publicStyle.title)">超级话题一键签到</h4>
      <router-link :class="publicStyle.fr" to="/">
        <i-button type="error" icon="md-power">返回</i-button>
      </router-link>
      <i-button :class="$classNames(publicStyle.fr, publicStyle.mr10, publicStyle.mt17)"
        type="warning"
        icon="ios-paper-plane-outline"
        :loading="btnLoading"
        @click="handleAutoCheckinClick"
      >
        {{ btnLoading === false ? '一键签到' : '签到中...' }}
      </i-button>
    </i-header>
    <!-- 签到列表 -->
    <i-content :class="publicStyle.main">
      <i-collapse v-model="activeNames">
        <i-panel v-for="item in $store.getters['checkin/getLoginList']()"
          :key="item.username"
          :name="item.username"
        >
          <span :class="publicStyle.mr10">
            <b>{{ item.username }}</b>
            <i-tag color="success" v-if="item.status === 1">已签到</i-tag>
          </span>
          <i-button size="small"
            :loading="btnLoading"
            @click="handleCheckinOneClick($event, item, $store.getters['checkin/getLoginList']())"
          >
            签到
          </i-button>
          <template slot="content">
            <ul class="list clearfix" v-if="item.children && item.children.length > 0">
              <li class="list-item clearfix" v-for="item2 in item.children">
                <img class="list-item-image" :src="item2.pic">
                <b class="list-item-title">{{ item2.title_sub }}</b>
                <span class="list-item-status" v-if="item2.code === undefined">签到中...</span>
                <span class="list-item-status-success" v-else-if="item2.code === '100000'">{{ item2.msg }}</span>
                <span class="list-item-status-fail" v-else>{{ item2.msg }}</span>
                <i-button class="manual-checkin-btn"
                    :class="publicStyle.fr"
                    size="small"
                    title="手动签到"
                    icon="ios-create-outline"
                    shape="circle"
                    v-if="!(item2.code === '100000' || item2.code === 382004)"
                    @click="handleManualCheckinClick(item, item2)"
                />
              </li>
              <li class="list-item list-item-space" v-if="item.children.length % 2 !== 0"></li>
            </ul>
            <div class="no-data" v-else>暂无数据</div>
          </template>
        </i-panel>
      </i-collapse>
    </i-content>
  </i-layout>
</template>

<script src="./index.js"></script>
<style src="./style.sass" lang="sass" scoped></style>