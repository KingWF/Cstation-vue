<template>
  <div>
    <el-container>
      <el-header style="padding: 0 ;">
        <Header :hideLogo="hideLogo" :topColor="topColor"  :enableSearch="enableSearch"></Header>
      </el-header>
      <el-container class="up-container">
        <el-aside width="200px" style="height: 600px">
          <!-- 菜单 -->
          <el-scrollbar>
            <el-menu :default-active="menuActiveIndex">
              <el-menu-item index="1" @click="$router.push('/upPersonal/videoManage')">
                <el-icon><VideoCamera/></el-icon>
                视频管理</el-menu-item>
              <el-menu-item index="2" @click="$router.push('/upPersonal/myMessage')">
                <el-icon><Message/></el-icon>
                我的消息</el-menu-item>
              <el-menu-item index="3" @click="$router.push('/upPersonal/personalCollect')">
                <el-icon><Star/></el-icon>
                我的收藏</el-menu-item>
              <el-menu-item index="4" @click="$router.push('/upPersonal/personalFollow')">
                <el-icon><Connection /></el-icon>
                我的关注</el-menu-item>
              <el-menu-item index="5" @click="console.log('Clicked'); $router.push('/upPersonal/personalFun')">
                <el-icon><Avatar/></el-icon>
                我的粉丝</el-menu-item>
              <el-menu-item index="6" @click="console.log('Clicked'); $router.push('/upPersonal/personalMessage')">
                <el-icon><Setting/></el-icon>
                个人信息</el-menu-item>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main style="">
          <!-- 二级路由view：切换页面中的部分内容（独立的页面） -->
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from "../../components/Header.vue";
import { RouterLink, RouterView } from "vue-router";
import {Avatar, Connection, Setting, Star, VideoCamera} from "@element-plus/icons-vue";
export default {
  components: {
    VideoCamera,
    Star,
    Connection,
    Avatar,
    Setting,
    Header,
  },
  methods: {
    checkRoute() {
      const path = this.$route.path;

      if (path.includes("videoManage")) {
        this.menuActiveIndex = "1";
      }
      if (path.includes("editVideo")) {
        this.menuActiveIndex = "1";
      }
      if (path.includes("viewVideo")) {
        this.menuActiveIndex = "1";
      }
      if (path.includes("myMessage")) {
        this.menuActiveIndex = "2";
      }
      if(path.includes("personalCollect")){
        this.menuActiveIndex = "3";
      }
      if(path.includes("personalFollow")){
        this.menuActiveIndex = "4";
      }
      if(path.includes("personalFun")){
        this.menuActiveIndex = "5";
      }
      if(path.includes("personalMessage")) {
        this.menuActiveIndex = "6";
      }
    },
  },
  watch: {
    '$route': 'checkRoute'
  },
  activated() {
    console.log('activated');
    this.checkRoute()
  },
  mounted() {
    this.checkRoute();
  },
  created() {
    this.checkRoute(); // 初始加载时也调用一次
  },
  data(){
    return{
      menuActiveIndex: "1",
      hideLogo: true,
      hideSearch: true,
      topColor: '#0e6ec9',
      enableSearch:true
    }
  }

}
</script>
<style scoped>
/*  */
.up-container {
  margin-top: 50px;
}
</style>
