<template>
  <div class="image-container"  v-if="!hideLogo" @click="backHome">
    <div>
      <img :src="imgSrc" alt="Background Image" class="home-img">
      <div class="logo">
        <img src="@/assets/logo.png"
             alt="">
      </div>
    </div>
  </div>
  <div  class="base" :style="{background: topColor}">
    <!-- 菜单、输入框、头像 -->
    <!-- 行 :gutter="20" 指定列之间的间距  单位px -->
    <el-row :gutter="20">
      <!-- 列 span：指定当前el-col占用多少列-->
      <el-col :span="10">
        <ul class="menu">
          <li><a href="/">首页</a></li>
          <li><a href="#">番剧</a></li>
          <li><a href="#">直播</a></li>
          <li><a href="#">游戏中心</a></li>
          <li><a href="#">会员购</a></li>
          <li><a href="#">漫画</a></li>
          <li><a href="#">赛事</a></li>
          <li><a href="https://cn.bing.com/sportsdetails?q=%E6%AC%A7%E6%B4%B2%E6%9D%AF&sport=Soccer&scenario=League&TimezoneId=China%20Standard%20Time&league=Soccer_InternationalEuroCup&intent=Generic&seasonyear=2024&segment=sports&isl2=true&">欧洲杯</a></li>
          <li><a href="#">周年庆</a></li>
        </ul>
      </el-col>

      <!-- 搜索输入框 -->
      <el-col :span="5" style="display: flex;justify-content: center" >
        <!-- 输入框 -->
        <el-input
            v-model="searchKey"
            style="width: 400px;height: 35px"
            placeholder="输入搜索内容~"
            :prefix-icon="Search"
            @keyup.enter="onSearch()"
            :disabled="!enableSearch"
        />
      </el-col>

      <!-- 头像、个人、投稿 -->
      <el-col :span="9">
<!--        头像和个人信息显示-->
        <div @click="checkState" v-if="isLogin">
          <el-popover
              @hide="hideInfo"
              :width="300"
              popper-style="margin-top: 80px; padding: 20px;"

          >
            <template #reference>
              <el-avatar :size="35" @mouseenter="bigAvater" :src="avatar" class="avatar" :style="avatarStyle"/>
            </template>
            <template #default v-if="isLogin">
              <el-row :gutter="30">
                <el-col :span="24"  style="display: flex;justify-content: center">
                <div style="font-size: 25px;font-weight: bold">{{user.account}}</div>
                </el-col>
              </el-row>
              <el-row :gutter="30" justify="center">
                <div style="margin-right: 5px"><span style="color: #a8a8a8">硬币</span>: 475  </div>
                <div><span style="color: #a8a8a8">B币</span>: 5</div>
              </el-row>
              <el-row class="user-rank" >
                <el-col :span="3" >
                  Lv{{rank_star}}
                </el-col>
                <el-col :span="21" style="margin-top: 2px">
                  <el-progress  :percentage="percentage" :color="customColor" :format="rankFormat" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div style="color: #a8a8a8;font-size: 15px;margin-top: 10px">当前成长值为 {{percentage}}, 还需 {{100-percentage}} 贡献值升级到 Lv{{rank_star+1}}</div>
                </el-col>
              </el-row>

              <el-row style="margin-top: 10px;margin-bottom: 30px">
                <!--关注-->
                <el-col :span="8" class="follows" >
                  <el-row style="font-size: 25px;font-weight: 400;color: #000000">
                    {{userSocialInfo[0]}}
                  </el-row>
                  <el-row >
                    关注
                  </el-row>
                </el-col>
                <!--粉丝-->
                <el-col :span="8" class="follows" >
                  <el-row style="font-size: 25px;font-weight: 400;color: #000000">
                    {{userSocialInfo[2]}}
                  </el-row>
                  <el-row>
                    粉丝
                  </el-row>
                </el-col>
                <!--动态-->
                <el-col :span="8" class="follows" >
                  <el-row style="font-size: 25px;font-weight: 400;color: #000000">
                    {{userSocialInfo[3]}}
                  </el-row>
                  <el-row>
                    动态
                  </el-row>
                </el-col>
              </el-row>
<!--              个人中心-->
              <el-row style="margin:15px 0 15px 0" @click="toPage(`/videoManage`)">
                <el-col :span="4"><el-icon size="25"><User /></el-icon></el-col>
                <el-col :span="18" style="font-size: 18px">个人中心</el-col>
                <el-col :span="2"><el-icon size="20"><ArrowRight /></el-icon></el-col>
              </el-row>
<!--              投稿管理-->
              <el-row style="margin:15px 0 15px 0" @click="toPage(``)">
                <el-col :span="4"><el-icon size="25"><VideoPlay /></el-icon></el-col>
                <el-col :span="18" style="font-size: 18px">投稿管理</el-col>
                <el-col :span="2"><el-icon size="20"><ArrowRight /></el-icon></el-col>
              </el-row>
<!--              推荐服务-->
              <el-row style="margin:15px 0 15px 0" @click="toPage(``)">
                <el-col :span="4"><el-icon size="25"><Star /></el-icon></el-col>
                <el-col :span="18" style="font-size: 18px">推荐服务</el-col>
                <el-col :span="2"><el-icon size="20"><ArrowRight /></el-icon></el-col>
              </el-row>
              <el-divider />
<!--              退出登录-->
              <el-row style="margin:15px 0 15px 0" @click="logout">
                <el-col :span="4"><el-icon size="25"><Remove /></el-icon></el-col>
                <el-col :span="18" style="font-size: 18px">退出登录</el-col>
                <el-col :span="2"><el-icon size="20"><ArrowRight /></el-icon></el-col>
              </el-row>
            </template>
          </el-popover>
        </div>
        <div v-else @click="checkState"> <el-avatar :size="35" :src="avatar" class="avatar" :style="avatarStyle"/></div>
        <div class="menu2" >
          <div class="meau-right" >
            <el-icon color="white" size="25px"><Help /></el-icon>
            <div style="color: white;">大会员</div>
          </div>
          <div class="meau-right">
            <el-icon color="white" size="25px"><ChatDotRound /></el-icon>
            <div style="color: white;">消息</div>
          </div>
          <div class="meau-right">
            <el-icon color="white" size="25px"><View /></el-icon>
            <div style="color: white;">动态</div>
          </div>
          <div class="meau-right" @click="toPage('/history')">
            <el-icon color="white" size="25px"><Clock /></el-icon>
            <div style="color: white;">历史</div>
          </div>
          <div class="meau-right">
            <el-icon color="white" size="25px"><User /></el-icon>
            <div style="color: white;">创作中心</div>
          </div>
          <div class="meau-right">
              <el-button type="danger" @click="upload" v-if="isNotAdmin() && isLogin">
                <el-icon>
                  <UploadFilled />
                </el-icon>投稿
              </el-button>
          </div>
          <div class="meau-right">
              <el-button type="danger" plain v-if="isLogin" @click="logout">
                注销
              </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

<!--    &lt;!&ndash; logo  :offset="20"  设置偏移量&ndash;&gt;-->
<!--    <el-row>-->
<!--      <el-col :span="4">-->
<!--        <img src="@/assets/logo.png"-->
<!--             alt=""-->
<!--             style="width: 100%; height: auto;">-->
<!--      </el-col>-->
<!--    </el-row>-->

    <!-- 登录、注册对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="登录/注册"
      width="40%">
      <div>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-input placeholder="账号" style="margin-bottom: 20px;" v-model="user.account"></el-input>
            <el-input placeholder="密码" style="margin-bottom: 20px;" v-model="user.password" show-password></el-input>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2">
            <el-button type="success" style="width: 100px;" @click="login">登录</el-button>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button type="success" plain style="width: 100px;" ><a href="/faceSearch" style="color:#40a9ff;"> 人脸识别登录</a></el-button>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button type="success" plain style="width: 100px;" @click="register">注册</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>

</template>
<script>

import {Search, UploadFilled} from "@element-plus/icons-vue";
import axios from "axios";

export default {
  components: {UploadFilled},
  data(){
    return{
      dialogVisible : false, // 默认情况下对话框隐藏
      user:{
        account: "",
        password: ""
      },
      avatar: "https://cdjava96.oss-cn-chengdu.aliyuncs.com/login.png",
      isLogin: false,
      isShowInfo: false,
      rank_odds:0,
      // 用户等级进度
      percentage:40,
      rank_star:2,
      customColor :'#f19f52',
      followNum:44,
      fansNum:41,
      dynamicNum:40,
      imgSrc:'/src/assets/static/233dcdceae41a91bf1ec0268b48ad3dd8e6340ac.jpg@1256w_708h_!web-article-pic.jpg',
      searchKey:'',
      userSocialInfo:[]
    }
  },
  mounted(){
    // 判断本地是否有用户信息  得到的是字符串
    let user = window.localStorage.getItem("user")
    if(user){
      // JSON.parse 将字符串转换成对象
      this.user.account=JSON.parse(user).account
      this.avatar = JSON.parse(user).avatar
      // 已登录
      this.isLogin = true
    }
    console.log('keepSearchKey', this.keepSearchKey)
    if(this.keepSearchKey!==''){
      this.searchKey = this.keepSearchKey
    }
    //   获取用户社交信息
    this.$axios.get("user/getUserSocialInfo").then(res => {
      console.log(res.data.data)
      this.userSocialInfo = res.data.data
    })
  },
  computed: {
    Search() {
      return Search
    },
    avatarStyle() {
      // 根据 isShowInfo 的值返回不同的样式对象
      return this.isShowInfo ? { transform: 'translateY(40px) scale(2.7)'} : {};
    },
  },
  props:{
    hideLogo: {
      type: Boolean,
      default: false // 默认值为 false
    },
    topColor: {
      type: String,
      default: 'rgba(255,255,255,0)' // 默认值同样为 false
    },
    keepSearchKey:{
      type: String,
      default: ''
    },
    enableSearch:{
      type: Boolean,
      default: true
    }

  },
  methods:{
    // 跳转页面
    toPage(path){
      const user = JSON.parse(window.localStorage.getItem("user"))
      let url = ''
      if(user){
        if(user.role == 'up'){
          url = '/upPersonal'
        }else{
          url= '/adminPersonal'
        }
      }
      path = url + path
      this.$router.push(path)
    },
    // 返回首页
    backHome(){
      this.$router.push('/')
    },
    // 等级样式
    rankFormat(percentage) {
       return 'Lv'+(this.rank_star+1)
     },
    // 鼠标放在头像上面
    bigAvater(){
      console.log('showbig')
      this.isShowInfo = true
    },
    hideInfo(){
      console.log('small')
      this.isShowInfo = false
    },
    login(){
      console.log(this.user)
      // 发请求进行登录  axios
      this.$axios.post("user/login", this.user).then(res =>{
        console.log(res)
        if(res.data.code == 200){
          this.$message.success("登录成功")
          console.log("用戶信息", res.data.data)
          // 将用户信息、token信息保存到本地
          let user = res.data.data
          let token = res.headers.authorization

          // 设置用户头像
          this.avatar = user.avatar

          this.isLogin = true

          // localStorage:浏览器自带用来存储数据的
          // JSON.stringify 将对象转换JSON格式字符串，因为localStorage只能存字符串
          window.localStorage.setItem("user", JSON.stringify(user))
          window.localStorage.setItem("token", token)

          // 隐藏登录的对话框
          this.dialogVisible = false

          // 通过自定义事件告知父组件登录成功了
          this.$emit("loginSuccess")
        }
      })
    },
    register(){
      if(this.user.account == '' || this.user.password == ''){
        this.$message.error("账号或密码不能为空")
        return
      }else{
        this.$axios.post("user/register", this.user).then(res =>{
          console.log(res)
          if(res.data.code == 200){
            this.$message.success("注册成功")
            // 隐藏注册的对话框
            this.dialogVisible = false
          }
          else if(res.data.code == 400){
            this.$message.error(res.data.message)
          }
        })
      }
    },
    checkState(){
      // 判断本地是否有用户信息
      let user = window.localStorage.getItem("user")

      // 如果user有数据说明登录过了,否则没有
      if(user){
        // 登录了  跳转到个人后台页面
        // 判断当前用户是管理员还是up主
        user = JSON.parse(user)
        //
        if(user.role == 'up'){
          this.$router.push("/upPersonal/videoManage")
        }else{
          this.$router.push("/adminPersonal/videoManage")
        }
      }else{
        // 没登录
        this.dialogVisible = true
      }
    },
    isNotAdmin(){
      let user = window.localStorage.getItem("user")
      if(user){
        user = JSON.parse(user)
        if(user.role == 'admin'){
          return false
        }
      }
      return true
    },
    logout(){
      // 删除本地的用户信息
      window.localStorage.removeItem("user")
      window.localStorage.removeItem("token")
      //
      this.isLogin = false
      this.avatar = "https://cdjava96.oss-cn-chengdu.aliyuncs.com/login.png"
      // 登出之后跳转到首页
      this.$router.push("/")
    },
    // 搜索视频
    onSearch() {
      console.log('搜索:', this.searchKey);
      // 强制刷新当前页面
      // location.reload(true);
      this.$router.push({ path: '/search', query: { searchkey: this.searchKey } });
    },
  }
}
</script>
<style scoped>
.image-container{
  position: relative;
}
.home-img{
  width: 100%;
  height: 130px;
}
.base{
  padding-top: 10px;
  /* //background: rgba(96, 86, 86, 0.76); */
  position: absolute;
  z-index: 999;
  width: 100%;
  top: 0;
  height: 60px;
}
.logo{
  margin-left: 20px;
  position: absolute;
  //top: 90px;
  top: 45px;
  img{
    width: 300px;
    height: 80px;
  }
  overflow: hidden;
}
.menu {
  display: flex;
  list-style-type: none;
  justify-content: space-around;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.menu2 {
  display: flex;
  justify-content: space-around;
  //margin: 0 0 0 40px;
  margin-left: 40px;
}
.menu li {
  float: left;
}

.menu li a {
  display: block;
  color: #ffffff;
  font-size: 15px;
  text-align: center;
  padding: 10px 10px;
  text-decoration: none;
  transition: all 0.3s ease; /* 添加过渡效果 */
}

/* 鼠标悬停时的样式 */
.menu li a:hover {
  transform:  scale(1.5);
}

/* 清除浮动 */
.menu:after {
  content: '';
  display: table;
  clear: both;
}
.meau-right{
  display: flex; /* 启用 Flexbox */
  white-space: nowrap; /* 防止内容换行 */
  //overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 当内容溢出时显示省略号 */
  flex-direction:column;
  align-items: center;
  font-size: 13px;
}

/* 头像变化*/
.avatar{
  position: absolute;
  transition: transform 0.3s ease;
  display: flex;
  justify-content: center;
  z-index: 999;
}
/* .user-rank{
  //display: flex;
  //justify-content: space-between;
} */
.follows{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center
}
</style>