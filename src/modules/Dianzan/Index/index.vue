<template>
  <div>
    <!-- 顶部菜单 -->
    <div class="toolsbox clearfix">
      <h4 class="fl">一键点赞</h4>
      <router-link class="fr" to="/">
        <el-button type="danger" size="mini" icon="el-icon-circle-close-outline">返回</el-button>
      </router-link>
      <el-button class="fr mr10" type="primary" size="mini" icon="el-icon-circle-plus" @click="onDialogDisplay(true)">添加lfid</el-button>
    </div>
    <!-- 表格 -->
    <div class="tablebox">
      <el-table size="mini">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="lfid" prop="ifid"></el-table-column>
        <el-table-column label="操作" prop="handle">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹出层 -->
    <el-dialog :visible="visible" title="添加lfid" :fullscreen="true" :append-to-body="true" :show-close="false">
      <el-form ref="addLfid" :rules="rules" :model="addLfid">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="addLfid.name"></el-input>
        </el-form-item>
        <el-form-item label="lfid：" prop="lfid">
          <el-input v-model="addLfid.lfid"></el-input>
        </el-form-item>
        <el-button class="mr10" type="primary" size="mini">添加</el-button>
        <el-button type="danger" size="mini" @click="onDialogDisplay(false)">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  export default {
    data(): Object{
      return {
        visible: true,   // 弹出层
        // 校验规则
        rules: {
          name: {
            required: true,
            message: '请输入名称！'
          },
          lfid: {
            required: true,
            message: '请输入lfid！'
          }
        },
        addLfid: {
          name: '',
          lfid: ''
        }
      };
    },
    methods: {
      // 弹出层显示
      onDialogDisplay(display: boolean): void{
        this.visible = display;
        if(!display){
          setTimeout((): void=>{
            this.$refs['addLfid'].resetFields();
          }, 100);
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  .toolsbox {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .mr10 {
    margin-right: 10px;
  }
  .tablebox {
    margin: 0 10px 10px;
  }
</style>