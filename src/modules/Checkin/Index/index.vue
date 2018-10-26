<template>
  <i-layout :class="publicStyle.layout">
    <!-- 顶部菜单 -->
    <Header :loading="btnLoading" :onClick="handleAutoCheckinClick" />
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
              <!-- 渲染签到 -->
              <li class="list-item clearfix" v-for="childrenItem in item.children">
                <img class="list-item-image" :src="childrenItem.pic">
                <b class="list-item-title">{{ childrenItem.title_sub }}</b>
                <span class="list-item-status" v-if="childrenItem.code === undefined">签到中...</span>
                <span class="list-item-status-success" v-else-if="childrenItem.code === '100000'">{{ childrenItem.msg }}</span>
                <span class="list-item-status-fail" v-else>{{ childrenItem.msg }}</span>
                <i-button class="manual-checkin-btn"
                  :class="publicStyle.fr"
                  size="small"
                  title="手动签到"
                  icon="ios-create-outline"
                  shape="circle"
                  v-if="!(childrenItem.code === '100000' || childrenItem.code === 382004)"
                  @click="handleManualCheckinClick(item, childrenItem)"
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