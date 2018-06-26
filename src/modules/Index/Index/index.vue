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
      <el-col class="group" :xs="8" :sm="8" :md="6" :lg="4" :xl="4">
        <router-link class="imgLink" to="/Dianzan" title="一键点赞">
          <img src="./l3.jpg">
        </router-link>
        <router-link to="/Checkin">一键点赞</router-link>
      </el-col>
    </el-row>
    <!-- 广告 -->
    <div class="guanggao" v-if="isGuanggao">
      <div class="guanggao-box">
        <p class="text">扫一扫，打赏一下可怜的作者。嘤嘤嘤...</p>
        <el-row>
          <el-col :span="12">
            <img class="shoukuan" src="./wx.jpg">
          </el-col>
          <el-col :span="12">
            <img class="shoukuan" src="./zfb.jpg">
          </el-col>
        </el-row>
      </div>
      <el-button class="close" type="danger" icon="el-icon-circle-close" @click="onCloseGuanggao()">关闭</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
  const process: Object = global.require('process');

  let isGuanggao: boolean = do{
    if(process.env.NODE_ENV === 'development'){
      false;
    }else{
      const r: number = Math.random();
      (r > 0.1 && r < 0.4) || (r > 0.6 && r < 0.8);
    }
  };

  export default {
    data(): Object{
      return {
        isGuanggao // 是否显示广告
      };
    },
    methods: {
      // 关闭广告
      onCloseGuanggao(): void{
        this.isGuanggao = false;
      }
    }
  };
</script>

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
  .guanggao {
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .8);
  }
  .guanggao-box {
    margin: 0 auto;
    width: 500px;
    padding: 120px 0;
  }
  .text {
    margin-bottom: 20px;
    font-size: 24px;
    color: #fff;
    text-align: center;
  }
  .shoukuan {
    display: block;
    margin: 0 auto;
    width: 230px;
  }
  .close {
    position: absolute;
    z-index: 100;
    right: 50px;
    top: 30px;
  }
</style>