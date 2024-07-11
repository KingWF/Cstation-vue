<script >
export default {
  data() {
    return {
      userInfo: {
        avatar: 'https://www.example.com/avatar.jpg', // 示例头像URL
        account: 'exampleUser',
        level: '黄金会员',
      },
      showChangePasswordDialog: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      passwordRules: {
        oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: this.validatePasswordMatch, trigger: 'blur' },
        ],
      },
    };
  },
      mounted(){
      // 页面加载时去
      this.getData()
    },
  methods: {
    getData(){
      console.log("wcnm")
      this.$axios.get("/user/getMe")
      .then(res => {
        if(res.data.code === 200){
          this.userInfo = res.data.data
        }
      })

    },
    validatePasswordMatch(rule, value, callback) {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },
    submitPasswordChange() {
      this.$refs.passwordFormRef.validate(valid => {
        if (valid) {
          // 提交修改密码的逻辑
          this.$axios.get("/user/changePassword",{params:{
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword,
            }
          })
          .then(res => {
            if(res.data.code === 200){
              this.$message.success('密码修改成功');
            }else if (res.data.code===501){
              this.$message.error('原密码错误');
            }else{
              this.$message.error('密码修改失败');
            }
          })
          .catch(error => {
            console.error('密码修改失败', error);
          })
          this.showChangePasswordDialog = false;
          this.passwordForm = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          };
          // this.$message.success('密码修改成功');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>

<template>
  <div id="app" class="personal-center full-screen">
    <!-- 头部信息 -->
    <div class="header-info">
      <el-avatar :size="200" :src="userInfo.avatar" />
      <div class="user-details">
        <h2 class="username">{{ userInfo.account }}</h2>
        <p class="user-level">等级: {{ userInfo.level }}</p>
      </div>
    </div>

    <!-- 修改密码按钮 -->
    <div class="change-password">
      <el-button type="primary" @click="showChangePasswordDialog = true">修改密码</el-button>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" v-model="showChangePasswordDialog">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showChangePasswordDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitPasswordChange">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>


<style scoped>
#app {
  display: flex;
  flex-direction: column;

}

.personal-center {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 垂直方向上均匀分布空间 */
}

.full-screen {
  background-color: #f5f5f5; /* 背景颜色 */
}

.header-info,
.change-password {
  display: flex;
  align-items: center;
  padding: 40px; /* 增大边距 */
}

.main-content {
  flex-grow: 1; /* 内容区域自动扩展以填充剩余空间 */
  overflow-y: auto; /* 如果内容超出，显示滚动条 */
}

.user-details {
  margin-left: 40px; /* 增大与头像之间的间距 */
}

.username {
  font-size: 36px;
  font-weight: bold;
}

.user-level {
  color: #666;
  font-size: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-info,
  .change-password {
    padding: 20px; /* 减小边距 */
  }

  .user-details {
    margin-left: 20px; /* 减小与头像之间的间距 */
  }

  .username {
    font-size: 24px;
  }

  .user-level {
    font-size: 16px;
  }
}
</style>