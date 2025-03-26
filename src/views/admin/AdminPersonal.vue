<template>
  <div>
    <el-container style="">
      <el-header >
        <Header :hideLogo="hideLogo" :topColor="topColor"  :enableSearch="enableSearch"></Header>
      </el-header>
      <el-container style="margin-top: 30px">
        <el-aside width="200px" style="height: 600px;">
          <!-- 菜单 -->
          <el-scrollbar>
            <el-menu >
              <el-menu-item index="1" @click="$router.push('/adminPersonal/videoManage')">
                <el-icon><VideoCamera/></el-icon>
                视频管理</el-menu-item>
              <el-menu-item index="2" @click="$router.push('/adminPersonal/reportManage')">
                <el-icon><Message/></el-icon>
                投诉管理</el-menu-item>
              <el-menu-item index="3" @click="$router.push('/adminPersonal/reviewManage')">
                <el-icon><Star/></el-icon>
                评论管理</el-menu-item>
              <el-menu-item index="4" @click="$router.push('/adminPersonal/diversityManage')">
                <el-icon><Setting/></el-icon>
                分类管理</el-menu-item>
              <el-menu-item index="5"  @click="$router.push('/adminPersonal/userManage')">
                <el-icon><Setting/></el-icon>
                用户管理</el-menu-item>
<!--              <el-menu-item index="6" @click="$router.push('/adminPersonal/UserMessage')">-->
<!--                <el-icon><Setting/></el-icon>-->
<!--                个人信息</el-menu-item>-->
            </el-menu>
          </el-scrollbar>

        </el-aside>
        <el-main style="">
          <!-- 二级路由view：切换页面中的部分内容（独立的页面） -->
          <RouterView/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from '../../components/Header.vue'
import { RouterLink, RouterView } from 'vue-router'
export default{
  data(){
    return{
      hideLogo: true,
      topColor: '#0e6ec9',
      enableSearch:false
    }
  },
  components:{
    Header
  }
}
</script>
<style scoped>

</style>