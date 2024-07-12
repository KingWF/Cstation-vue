<template>
  <div>
    <el-row>
      <!-- 轮播图 -->
      <el-col :span="10" style="height: 440px; ">
        <el-carousel height="400px" style="border-radius: 30px">
          <el-carousel-item v-for="item in carousels" :key="item">
            <el-image style="width: 100%; height: 440px" :src="item.cover" fit="fill" />
          </el-carousel-item>
        </el-carousel>
      </el-col>

      <!-- 推荐视频 -->
      <el-col :span="14">
        <el-row style="height: 440px;margin-left: 40px" >
          <el-col :span="8" v-for="abc in videoList" :key="abc" style="height: 220px">
            <VideoItem :video="abc"></VideoItem>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import VideoItem from './VideoItem.vue'
export default{
  // data写当前页面的属性，data在脚手架项目中必须是一个函数，不能是对象：为了在组件复用时不会出现互相干扰
  // data里面必须返回一个对象，对象中就写当前页面的属性
  data(){
    return {
      // 轮播图数据
      carousels:[
        {
          id: 1001,
          title: "热门推荐1",
          cover: "https://cdjava96.oss-cn-chengdu.aliyuncs.com/c1.png"
        },
        {
          id: 1002,
          title: "热门推荐2",
          cover: "https://cdjava96.oss-cn-chengdu.aliyuncs.com/c2.png",
        },
        {
          id: 1003,
          title: "热门推荐3",
          cover: "https://cdjava96.oss-cn-chengdu.aliyuncs.com/c3.png"
        },
        {
          id: 1004,
          title: "热门推荐4",
          cover: "https://cdjava96.oss-cn-chengdu.aliyuncs.com/c4.png"
        }
      ],
      // 视频数据
      videoList: [],

    }
  },
  mounted(){
    // 发请求将最新的视频查询出来：审核通过的视频
    this.$axios.get("video/findRecommend").then(res => {
      console.log(res.data)
      this.videoList = res.data.data
    })
  },
  components:{
    VideoItem
  }
}
</script>
<style scoped>

</style>