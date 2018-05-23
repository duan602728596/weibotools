<template>
  <div class="box">
    <el-row type="flex">
      <el-col class="group" :xs="8" :sm="8" :md="6" :lg="4" :xl="4">
        <router-link class="imgLink" to="/Login" title="账号登录">
          <img src="./l1.jpg">
        </router-link>
        <router-link to="/Login">账号登录</router-link>
      </el-col>
      <el-col class="group" :xs="8" :sm="8" :md="6" :lg="4" :xl="4">
        <router-link class="imgLink" to="/Checkin" title="一键签到">
          <img src="./l2.jpg">
        </router-link>
        <router-link to="/Checkin">一键签到</router-link>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .box {
    padding: 20px 0;
  }
  .group {
    text-align: center;
  }
  .imgLink {
    display: block;
    margin: 0 auto 10px;
    width: 150px;
    height: 150px;
    border: 3px solid #f7ae07;
    border-radius: 5px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>