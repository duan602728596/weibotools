<template>
  <el-container>
    <!-- 顶部菜单 -->
    <el-header :class="classNames(publicStyle.header, 'clearfix')">
      <h4 :class="publicStyle.fl">微博账号登录</h4>
      <router-link :class="publicStyle.fr" to="/">
        <el-button type="danger" size="mini" icon="el-icon-circle-close-outline">返回</el-button>
      </router-link>
      <el-button :class="classNames(publicStyle.fr, publicStyle.mr10)"
        type="primary"
        size="mini"
        icon="el-icon-mobile-phone"
        @click="handleDialogDisplayClick(true)"
      >
        登录
      </el-button>
    </el-header>
    <!-- 表格 -->
    <el-main>
      <p>账号过半个月左右要重新登陆一下，避免过期。</p>
      <el-table :data="$store.getters['login/getLoginList']()" size="mini">
        <el-table-column label="账号" prop="username"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="登录日期" width="140" prop="loginTime"></el-table-column>
        <el-table-column label="操作" width="330" prop="handle">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" @click="handleLoginAgainClick(scope)">重新登录</el-button>
              <el-button size="mini" @click="handleLoginAgainClick(scope, true)">使用验证码重新登陆</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteLoginClick(scope)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 弹出层 -->
    <el-dialog :visible="visible" title="登录微博账号" :fullscreen="true" :append-to-body="true" :show-close="false">
      <el-form ref="weiboLogin" label-suffix="：" :rules="rules" :model="weiboLogin">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="weiboLogin.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="weiboLogin.password" type="password" />
        </el-form-item>
        <el-form-item label="使用验证码登陆">
          <el-checkbox v-model="weiboLogin.vcode"></el-checkbox>
        </el-form-item>
        <div class="btn-box">
          <el-button class="mr10" type="primary" size="mini" @click="handleLoginClick">登录</el-button>
          <el-button type="danger" size="mini" @click="handleDialogDisplayClick(false)">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script src="./index.js"></script>
<style src="./style.sass" scoped></style>