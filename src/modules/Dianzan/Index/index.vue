<template>
  <el-container>
    <!-- 顶部菜单 -->
    <el-header :class="classNames(publicStyle.header, 'clearfix')">
      <h4 :class="publicStyle.fl">一键点赞</h4>
      <router-link :class="publicStyle.fr" to="/">
        <el-button type="danger" size="mini" icon="el-icon-circle-close-outline">返回</el-button>
      </router-link>
      <el-button :class="classNames(publicStyle.fr, publicStyle.mr10)"
        size="mini" icon="el-icon-circle-plus"
        @click="handleDialogDisplayClick(true)"
      >
        添加lfid
      </el-button>
      <el-button :class="classNames(publicStyle.fr, publicStyle.mr10)"
        type="primary"
        size="mini"
        icon="el-icon-star-on"
        :loading="btnLoading"
        @click="handleDianzanAllClick"
      >
        一键点赞
      </el-button>
    </el-header>
    <!-- 表格 -->
    <el-main :class="publicStyle.main">
      <p>为了避免被微博判断为操作次数频繁，每次点赞间隔3秒。</p>
      <el-table :data="$store.getters['dianzan/getLfidList']()" size="mini">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="lfid" prop="lfid"></el-table-column>
        <el-table-column label="点赞最大页数" prop="page"></el-table-column>
        <el-table-column label="操作" width="300" prop="handle">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" :loading="btnLoading" @click="handleDianzanClick(scope)">点赞</el-button>
              <el-button size="mini" :loading="btnLoading" @click="handleEditLfidClick(scope)">修改</el-button>
              <el-button type="danger"
                size="mini"
                icon="el-icon-delete"
                :loading="btnLoading"
                @click="handleDeleteLfidClick(scope)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 弹出层 -->
    <el-dialog :visible="visible"
      :title="(this.isEdit ? '修改' : '添加') + 'lfid'"
      :fullscreen="true"
      :append-to-body="true"
      :show-close="false"
    >
      <el-form ref="addLfid" :rules="rules" :model="addLfid">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="addLfid.name"></el-input>
        </el-form-item>
        <el-form-item label="lfid：" prop="lfid">
          <el-input v-model="addLfid.lfid"></el-input>
        </el-form-item>
        <el-form-item label="点赞最大页数：" prop="page">
          <el-input v-model="addLfid.page"></el-input>
        </el-form-item>
        <el-button :class="publicStyle.mr10" type="primary" size="mini" @click="handleChangeLfidClick">
          {{ this.isEdit ? '修改' : '添加' }}
        </el-button>
        <el-button type="danger" size="mini" @click="handleDialogDisplayClick(false)">取消</el-button>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script src="./index.js"></script>