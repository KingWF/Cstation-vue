<template>
  <div class="profile-container">
    <header class="profile-header">
      <div class="avatar-container">
        <img :src="user.avatar" alt="User Avatar" class="avatar">
        <div class="mask" @click="isShowDrawer = true">
          <i class="fas fa-edit edit-icon"></i>
        </div>
      </div>
      <div class="user-info">
        <h1 class="username" style="margin-left: 20px">{{ user.account }}</h1>
      </div>
    </header>
    <main class="profile-main">
      <section class="details-section">
        <h2>详细信息</h2>
        <ul>
          <li><strong>用户姓名:</strong> {{ user.account }} <el-button  :icon="Edit" circle style="margin-left: 100px" @click ="showChangeUsernameDialog=true"/></li>
          <li><strong>等级:</strong>  <el-tag type="success">{{ user.level }}</el-tag> </li>
          <li><strong>密码:</strong> {{beSecret}}   <el-button  :icon="Edit" circle style="margin-left: 100px" @click="showChangePasswordDialog = true" /></li>
        </ul>
      </section>
      <section class="stats-section">
        <h2>社交信息</h2>
        <div class="stat-item">
          <span class="stat-count">{{ userSocialInfo[0] }}</span>
          <div >关注</div>
        </div>
        <div class="stat-item">
          <span class="stat-count">{{ userSocialInfo[1] }}</span>
          <div >收藏</div>
        </div>
        <div class="stat-item">
          <span class="stat-count">{{ userSocialInfo[2] }}</span>
          <div >粉丝</div>
        </div>
        <div class="stat-item">
          <span class="stat-count">{{ userSocialInfo[3] }}</span>
          <div  >个人视频</div>
        </div>
      </section>
      <section class="details-section">
        <h2>人脸信息</h2>

        <ul>
          <li><strong>
            <el-tag type="success" v-if="isRegister">已注册人脸</el-tag>
            <el-tag type="danger" v-else @click="this.$router.push('/faceAdd')">未注册人脸</el-tag>
            </strong> </li>
        </ul>
      </section>

    </main>
    <el-drawer v-model="isShowDrawer" :direction="direction">
      <template #header>
        <h4>修改头像</h4>
      </template>
      <template #default>
        <el-row style="margin-bottom: 20px">
          <el-col :span="6">
              原本头像
          </el-col>
          <el-col :span="18" style="display: flex;justify-content: center">
            <el-avatar :src="user.avatar" :size="140"></el-avatar>
          </el-col>
        </el-row>
<!--        分割线-->
        <el-divider />
        <el-row >
          <el-col :span="24" style="display: flex;justify-content: center">

            <el-upload
                ref="upload"
                class="upload-demo"
                :action="`/api/user/changeAvatar/${this.user.id}`"
                :limit="1"
                :on-exceed="handleExceed"
                :auto-upload="false"
                :on-success="successUpload"
            >
              <template #trigger>
                <el-button type="primary" :size="140">上传新头像</el-button>
              </template>
            </el-upload>
          </el-col>
        </el-row>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="submitUpload">提交</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
  <!-- 修改用户名对话框 -->
  <el-dialog title="修改用户名" v-model="showChangeUsernameDialog">
    <el-form :model="usernameForm" :rules="usernameRules" ref="usernameFormRef">
      <el-form-item label="新用户名" prop="newUsername">
        <el-input v-model="usernameForm.newUsername" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showChangeUsernameDialog = false">取消</el-button>
        <el-button type="primary" @click="submitUsernameChange()">确定</el-button>
      </span>
    </template>
  </el-dialog>>
  <div>
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
        <el-button type="primary" @click="submitPasswordChange()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {Edit, UserFilled} from "@element-plus/icons-vue";
import {ElMessageBox, genFileId} from "element-plus";

export default {
  data() {
    return {
      isRegister: false,
      user: {
        account: '',
        avatar: '',
        id: 0,
        level: '',
        password: '',

      },
      userSocialInfo: {},
      showMask: false,
      isShowDrawer: false,
      password: '',
      showChangePasswordDialog: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      passwordRules: {
        oldPassword: [{required: true, message: '请输入原密码', trigger: 'blur'}],
        newPassword: [{required: true, message: '请输入新密码', trigger: 'blur'}],
        confirmPassword: [
          {required: true, message: '请再次输入新密码', trigger: 'blur'},
          {validator: this.validatePasswordMatch, trigger: 'blur'},
        ],
      },
      showChangeUsernameDialog: false,
      usernameForm: {
        newUsername: '',
      },
      usernameRules: {
        newUsername: [
          {required: true, message: '请输入新用户名', trigger: 'blur'},
          {min: 2, max: 16, message: '用户名要在2-16个字符之间', trigger: 'blur'},
        ],
      },
    }
  },
  computed: {
    UserFilled() {
      return UserFilled
    },
    Edit() {
      return Edit
    },
    beSecret() {
      return "******"
    }
  },
  mounted() {

    //   获取用户信息
    this.$axios.get("user/getUserInfo").then(res => {
      console.log('查询的用户信息', res.data.data)
      this.user = res.data.data
      this.password = res.data.data.password
    })
    //   获取用户社交信息
    this.$axios.get("user/getUserSocialInfo").then(res => {
      console.log(res.data.data)
      this.userSocialInfo = res.data.data
    })
    //   判断是否注册人脸
    this.$axios.get("faceIdentify/isRegisterFace").then(res => {
      console.log('是否注册人脸', res.data)
      if (res.data) {
        this.isRegister = true
      } else {
        this.isRegister = false
      }
    })
  },
  methods: {
    handleExceed(files) {
      this.$refs.upload.clearFiles();
      const file = files[0];
      file.uid = genFileId(); // 注意：检查genFileId是否适用于Element UI
      console.log('文件', file)
      this.$refs.upload.handleStart(file);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    successUpload(response, file, fileList) {
      // 上传文件并接收返回的响应参数
      console.log('上传成功', response)
      if (response.code === 200) {
        this.$message.success('上传成功')
        this.isShowDrawer = false
        this.user.avatar = response.data
        //   重新查询用户信息并赋值给浏览器缓存
        this.$axios.get("user/getUserInfo").then(res => {
          window.localStorage.setItem("user", JSON.stringify(res.data.data))
        })
      }
    },
    cancelClick() {
      this.isShowDrawer = false
    },
    validatePasswordMatch(rule, value, callback) {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        //很好
        callback();
      }
    },
    //changeUsername(){
    // this.$axios.get("/user/changeUsername",{
    //   params:{
    //    id: this.user.id,
    //    name: null
    //   }
    // }).then(res => {
    //   if(res.data.code === 200){
    //      this.$message.success('用户名修改成功');
    //
    //    }else{
    //      this.$message.error('用户名修改失败');
    //    }
    // })

    //},
    submitPasswordChange() {
      this.$refs.passwordFormRef.validate(valid => {
        if (valid) {
          // 提交修改密码的逻辑
          this.$axios.get("/user/changePassword", {
            params: {
              oldPassword: this.passwordForm.oldPassword,
              newPassword: this.passwordForm.newPassword,
            }
          })
              .then(res => {
                if (res.data.code === 200) {
                  this.$message.success('密码修改成功');
                } else if (res.data.code === 501) {
                  this.$message.error('原密码错误');
                } else {
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
    submitUsernameChange() {
      this.$refs.usernameFormRef.validate(valid => {
        if (valid) {
          // 提交修改用户名的逻辑
          this.$axios.get('/user/changeName', {
            params: {
              id: this.user.id,
              username: this.usernameForm.newUsername,
            }
          }).then(response => {
            if (response.data.code === 200) {
              this.user.account = this.usernameForm.newUsername;
              this.$message({
                message: '用户名修改成功',
                type: 'success',
              });
              this.showChangeUsernameDialog = false;
            } else {
              this.$message.error('用户名修改失败，请检查输入或联系管理员');
            }
          }).catch(error => {
            console.error('Error updating username:', error);
            this.$message.error('用户名修改失败，请检查网络或稍后再试');
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-container {
  position: relative;
  display: inline-block;
}
.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: opacity 0.3s ease-in-out;
  z-index: 99;
}

.mask:hover {
  background: rgba(0, 0, 0, 0.49);
}

.edit-icon {
  color: white;
  font-size: 24px;
}

.user-info {
  flex-grow: 1;
}

.username {
  font-size: 2em;
  margin: 0;
}

.bio {
  color: #666;
}

.details-section,
.stats-section {
  margin: 20px 0;
}

.stat-item {
  display: inline-block;
  width: 25%;
  text-align: center;
}

.stat-count {
  font-size: 1.5em;
  color: #333;
}

.stat-label {
  color: #666;
}
</style>
<style scoped>.dynamic-button {
  background-color: #ADD8E6; /* 蓝色 */
  border: none;
  color: white;
  padding: 8px 18px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  transition: transform 0.3s ease; /* 添加过渡效果 */
}

.dynamic-button:hover {
  transform: scale(1.1); /* 鼠标悬停时放大1.1倍 */
}
</style>
