<template>
  <el-container>
    <!-- 顶部菜单 -->
    <el-header :class="classNames(publicStyle.header, 'clearfix')">
      <h4 :class="publicStyle.fl">超级话题一键签到</h4>
      <router-link :class="publicStyle.fr" to="/">
        <el-button type="danger" size="mini" icon="el-icon-circle-close">返回</el-button>
      </router-link>
      <el-button :class="classNames(publicStyle.fr, publicStyle.mr10)"
        v-if="btnLoading === false"
        type="primary"
        size="mini"
        icon="el-icon-edit"
        @click="handleAutoCheckinClick"
      >
        一键签到
      </el-button>
      <el-button :class="classNames(publicStyle.fr, publicStyle.mr10)"
        v-else
        type="primary"
        size="mini"
        :loading="btnLoading"
      >
        签到中...
      </el-button>
    </el-header>
    <!-- 签到列表 -->
    <el-main :class="publicStyle.main">
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="item in $store.getters['checkin/getLoginList']()"
          :key="item.username"
          :name="item.username"
        >
          <template slot="title">
            <span :class="publicStyle.mr10">
              <b>{{ item.username }}</b>
              <el-tag type="success" size="mini" v-if="item.status === 1">已签到</el-tag>
            </span>
            <el-button size="mini"
              :loading="btnLoading"
              @click="handleCheckinOneClick($event, item, $store.getters['checkin/getLoginList']())"
            >
              签到
            </el-button>
          </template>
          <ul class="list clearfix" v-if="item.children && item.children.length > 0">
            <li class="list-item clearfix" v-for="item2 in item.children">
              <img class="list-item-image" :src="item2.pic">
              <b class="list-item-title">{{ item2.title_sub }}</b>
              <span class="list-item-status" v-if="item2.code === undefined">签到中...</span>
              <span class="list-item-status-success" v-else-if="item2.code === '100000'">{{ item2.msg }}</span>
              <span class="list-item-status-fail" v-else>{{ item2.msg }}</span>
              <el-button class="manual-checkin-btn"
                :class="publicStyle.fr"
                type="primary"
                size="mini"
                title="手动签到"
                icon="el-icon-edit"
                :circle="true"
                v-if="!(item2.code === '100000' || item2.code === 382004)"
                @click="handleManualCheckinClick(item, item2)"
              />
            </li>
            <li class="list-item list-item-space" v-if="item.children.length % 2 !== 0"></li>
          </ul>
          <div class="no-data" v-else>暂无数据</div>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script src="./index.js"></script>
<style src="./style.sass" scoped></style>