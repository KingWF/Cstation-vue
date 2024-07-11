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
          <li><strong>用户姓名:</strong> {{ user.account }} <el-button  :icon="Edit" circle style="margin-left: 100px"/></li>
          <li><strong>等级:</strong>  <el-tag type="success">{{ user.level }}</el-tag> </li>
          <li><strong>密码:</strong> {{beSecret}}   <el-button  :icon="Edit" circle style="margin-left: 100px"/></li>
        </ul>
      </section>
      <section class="stats-section">
        <h2>统计信息</h2>
        <div class="stat-item">
          <span class="stat-count">{{ userSocialInfo[0] }}</span>
          <span class="stat-label">关注</span>
        </div>
        <div class="stat-item">
          <span class="stat-count">{{ userSocialInfo[1] }}</span>
          <span class="stat-label">收藏</span>
        </div>
        <div class="stat-item">
          <span class="stat-count">{{ userSocialInfo[2] }}</span>
          <span class="stat-label">粉丝</span>
        </div>
        <div class="stat-item">
          <span class="stat-count">{{ userSocialInfo[3] }}</span>
          <span class="stat-label">视频</span>
        </div>
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
</template>
<script>
import {Edit, UserFilled} from "@element-plus/icons-vue";
import {ElMessageBox, genFileId} from "element-plus";

export default {
  data() {
    return {
      user: {
        account: '',
        avatar:'',
        id:0,
        level:'',
        password:'',
      },
      userSocialInfo:{
      },
      password:'',
      showMask: false,
      isShowDrawer:false
    }
  },
  computed:{
    UserFilled() {
      return UserFilled
    },
    Edit() {
      return Edit
    },
     beSecret(){
      return "******"
    }
  },
  mounted() {

  //   获取用户信息
    this.$axios.get("user/getUserInfo").then(res => {
      console.log('查询的用户信息',res.data.data)
      this.user = res.data.data
      this.password = res.data.data.password
    })
  //   获取用户社交信息
    this.$axios.get("user/getUserSocialInfo").then(res => {
      console.log(res.data.data)
      this.userSocialInfo = res.data.data
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
    successUpload(response, file, fileList){
      // 上传文件并接收返回的响应参数
        console.log('上传成功', response)
        if (response.code === 200) {
          this.$message.success('上传成功')
          this.isShowDrawer = false
          this.user.avatar=response.data
        }
    },
    cancelClick() {
      this.isShowDrawer = false
    }
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
