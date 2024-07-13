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
          cover: "https://img.zcool.cn/community/019cae5aa879a7a801206d965175e6.jpg@2o.jpg"
        },
        {
          id: 1002,
          title: "热门推荐2",
          cover: "https://ts1.cn.mm.bing.net/th/id/R-C.3c698ce1145888fad9a716796c9ba865?rik=osa%2fhmRJnv3%2b4w&riu=http%3a%2f%2fp3.qhimg.com%2ft01a528f25b0a3df4c9.jpg&ehk=aeYQknqnM3S84g3f%2fYsDHPIiVBxaRjbqkG4IQwpVflg%3d&risl=&pid=ImgRaw&r=0",
        },
        {
          id: 1003,
          title: "热门推荐3",
          cover: "https://activity.hdslb.com/blackboard/static/20190408/b8f2b74d0482aed61472c7065dc1ed56/vrbg-min.jpg"
        },
        {
          id: 1004,
          title: "热门推荐4",
          cover: "https://ts1.cn.mm.bing.net/th/id/R-C.0c7b4fc6da585eef26481aaf1f9b451c?rik=RZWbFtfmI5E6YA&riu=http%3a%2f%2fp2.qhmsg.com%2ft01e276f6dfc91ea30c.jpg&ehk=jZP7iYk5Fe7DGYkr0DIRMN6fNviwRvlXmb8PNax6cDs%3d&risl=&pid=ImgRaw&r=0"
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