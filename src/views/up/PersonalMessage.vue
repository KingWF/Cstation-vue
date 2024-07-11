<template>
  <div class="profile-container">
    <header class="profile-header">
      <img :src="user.avatar" alt="User Avatar" class="avatar" />
      <div class="user-info">
        <h1 class="username">{{ user.account }}</h1>

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
  </div>
</template>
<script>
import {Edit} from "@element-plus/icons-vue";

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
      password:''
    }
  },
  computed:{
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
  methods() {

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

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
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
