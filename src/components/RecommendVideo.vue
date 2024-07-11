<template>
  <div>
    <el-row >
      <el-col :span="4" v-for="abc in videoList" :key="abc" style="height: 220px">
        <VideoItem :video="abc"></VideoItem>
      </el-col>
    </el-row>
    <el-row v-if="isLoading">
      <el-row>
        <el-col :span="4" v-for="abc in 6" :key="abc" style="height: 220px">
          <HomeLoading></HomeLoading>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" v-for="abc in 6" :key="abc" style="height: 220px">
          <HomeLoading></HomeLoading>
        </el-col>
      </el-row>
    </el-row>

  </div>
</template>
<script>
import VideoItem from "@/components/VideoItem.vue";
import HomeLoading from "@/components/HomeLoading.vue";
export default{
  // data写当前页面的属性，data在脚手架项目中必须是一个函数，不能是对象：为了在组件复用时不会出现互相干扰
  // data里面必须返回一个对象，对象中就写当前页面的属性
  data(){
    return {
      isLoading:true,
      // 视频数据
      videoList: [],
      recommendVideo: [],
      items: [],
      loadingMore: false, // 添加一个标志，表示是否正在加载更多内容
    }
  },
  mounted(){
    window.addEventListener('scroll', this.handleScroll);
    // 发请求将最新的视频查询出来：审核通过的视频
    this.$axios.get("video/findNew").then(res => {
      console.log(res.data)
      this.videoList = res.data.data
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods:{
    handleScroll() {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const threshold = 50;

      if (scrollPosition + threshold >= documentHeight && !this.loadingMore) {
        this.loadingMore = true; // 标记为正在加载更多
        console.log('触底了！');
        this.loadMoreContent();
      }
    },
    async loadMoreContent() {
      let recommend;
      // 模拟异步加载数据
      await new Promise(resolve =>
      this.$axios.get("video/findNew").then(res => {
        recommend = res.data.data

      })
      );
      // 更新数据
      this.recommendVideo.push(...recommend); // 假设newItems是从服务器获取的新数据

      // 数据加载完成后，重置loadingMore标志
      this.loadingMore = false;
    },
  },
  components:{
    HomeLoading,
    VideoItem
  }
}


</script>



<style scoped>

</style>