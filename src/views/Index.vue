<template>
  <div>
    <!-- 1.header：logo、搜索、头像 -->
    <!-- 3.使用组件 -->
    <Header @loginSuccess="loginSuccess" ></Header>

    <div class="container">
      <div style="width: 100%;display: flex;flex-direction: column;padding: 20px;">
        <!-- 2.菜单 -->
        <div style="width: 100%;">
          <Menus></Menus>
        </div>
        <!-- 3.轮播图、热门视频 -->
        <div style="width: 100%;margin: 10px;">
          <Hot></Hot>
        </div>
        <!-- 4.其它视频的列表 -->
        <div style="width: 100%;margin: 10px">
          <RecommendVideo></RecommendVideo>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink} from 'vue-router'
// 1.导入组件
import Header from '../components/Header.vue'
import Menus from '../components/Menus.vue'
import Hot from '../components/Hot.vue'
import RecommendVideo from "@/components/RecommendVideo.vue";

export default{
  // 写事件函数，例如点击、双击、change事件等等
  methods:{
    loginSuccess(){
      this.$emit("loginSuccess")
    }
  },
  components:{
    RecommendVideo,
    // 2.注册组件
    Header,
    Menus,
    Hot
  }
}
</script>

<style scoped>
.container{
width: 100%;
//margin-top: 60px;
}
</style>