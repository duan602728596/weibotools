<template>
  <div class="box">
    <el-row>
      <el-col class="group" :xs="8" :sm="8" :md="6" :lg="6" :xl="6">
        <router-link class="imgLink" to="/Login" title="账号登录">
          <img src="./image/l1.jpg">
        </router-link>
        <router-link to="/Login">微博账号登录</router-link>
      </el-col>
      <el-col class="group" :xs="8" :sm="8" :md="6" :lg="6" :xl="6">
        <router-link class="imgLink" to="/Checkin" title="一键签到">
          <img src="./image/l2.jpg">
        </router-link>
        <router-link to="/Checkin">超级话题一键签到</router-link>
      </el-col>
      <el-col class="group" :xs="8" :sm="8" :md="6" :lg="6" :xl="6">
        <router-link class="imgLink" to="/Dianzan" title="一键点赞">
          <img src="./image/l3.jpg">
        </router-link>
        <router-link to="/Checkin">一键点赞</router-link>
      </el-col>
      <el-col class="group" :xs="8" :sm="8" :md="6" :lg="6" :xl="6">
        <router-link class="imgLink" to="/FriendShip" title="关注列表">
          <img src="./image/l4.jpg">
        </router-link>
        <router-link to="/FriendShip">关注管理</router-link>
      </el-col>
    </el-row>
    <!-- 广告 -->
    <div class="guanggao" v-if="isGuanggao">
      <div class="guanggao-box">
        <p class="text">扫一扫，打赏一下可怜的作者。嘤嘤嘤...</p>
        <el-row>
          <el-col :span="12">
            <img class="shoukuan" src="./image/wx.jpg">
          </el-col>
          <el-col :span="12">
            <img class="shoukuan" src="./image/zfb.jpg">
          </el-col>
        </el-row>
      </div>
      <el-button class="close" type="danger" icon="el-icon-circle-close" @click="handleCloseGuanggaoClick">关闭</el-button>
    </div>
  </div>
</template>

<script src="./index.js"></script>
<style src="./style.sass" scoped></style>