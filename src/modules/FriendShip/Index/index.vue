<template>
  <el-container>
    <el-header :class="classNames(publicStyle.header, 'clearfix')">
      <el-select :class="classNames(publicStyle.fl, publicStyle.mr10)"
        size="mini"
        :disabled="loading"
        v-model="selectLoginCookie"
        @change="handleLoginChange($event)"
      >
        <el-option v-for="item in $store.getters['friendship/getLoginList']()"
          :key="item.username"
          :label="item.username"
          :value="item.cookie"
        />
      </el-select>
      <el-button :class="publicStyle.fl"
        type="danger"
        size="mini"
        icon="el-icon-star-off"
        @click="handleQuguanAllClick"
      >
        批量取消关注
      </el-button>
      <router-link :class="publicStyle.fr" to="/">
        <el-button type="danger" size="mini" icon="el-icon-circle-close">返回</el-button>
      </router-link>
    </el-header>
    <el-main :class="publicStyle.main">
      <el-table ref="friendship"
        size="mini"
        row-key="user.id"
        :data="$store.getters['friendship/getFrindShipList']()"
        v-loading="loading"
        @selection-change="handleCheckboxChange"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <img class="avatar" :src="scope.row.user.profile_image_url">
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="300" prop="user.screen_name"></el-table-column>
        <el-table-column label="身份" prop="desc1"></el-table-column>
        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" v-if="!scope.row.isQuguan" @click="handleGuanzhuClick(scope, false)">取关</el-button>
            <el-button size="mini" v-else @click="handleGuanzhuClick(scope, true)">关注</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script src="./index.js"></script>
<style src="./style.sass" scoped></style>