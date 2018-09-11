<template>
  <i-layout :class="publicStyle.layout">
    <!-- 顶部菜单 -->
    <i-header :class="classNames(publicStyle.header, 'clearfix')">
      <h4 :class="classNames(publicStyle.fl, publicStyle.title)">一键点赞</h4>
      <router-link :class="publicStyle.fr" to="/">
        <i-button type="error" icon="md-power">返回</i-button>
      </router-link>
      <i-button :class="classNames(publicStyle.fr, publicStyle.mr10, publicStyle.mt16)"
        type="info"
        icon="ios-add-circle-outline"
        @click="handleDialogDisplayClick(true)"
      >
        添加lfid
      </i-button>
      <i-button :class="classNames(publicStyle.fr, publicStyle.mr10, publicStyle.mt16)"
        type="warning"
        icon="md-heart"
        :loading="btnLoading"
        @click="handleDianzanAllClick"
      >
        一键点赞
      </i-button>
    </i-header>
    <!-- 表格 -->
    <i-content :class="publicStyle.main">
      <p class="shuoming">为了避免被微博判断为操作次数频繁，每次点赞间隔3秒。</p>
      <i-table :columns="columns" :data="$store.getters['dianzan/getLfidList']()"></i-table>
    </i-content>
    <!-- 弹出层 -->
    <i-modal v-model="visible" :title="(isEdit ? '修改' : '添加') + 'lfid'" :footer-hide="true">
      <i-form ref="addLfid" :rules="rules" :model="addLfid">
        <i-form-item label="名称：" prop="name">
          <i-input v-model="addLfid.name"></i-input>
        </i-form-item>
        <i-form-item label="lfid：" prop="lfid">
          <i-input v-model="addLfid.lfid"></i-input>
        </i-form-item>
        <i-form-item label="点赞最大页数：" prop="page">
          <i-input v-model="addLfid.page"></i-input>
        </i-form-item>
        <i-button :class="publicStyle.mr10" type="primary" @click="handleChangeLfidClick">
          {{ isEdit ? '修改' : '添加' }}
        </i-button>
        <i-button type="error" @click="handleDialogDisplayClick(false)">取消</i-button>
      </i-form>
    </i-modal>
  </i-layout>
</template>

<script src="./index.js"></script>
<style src="./style.sass" scoped></style>