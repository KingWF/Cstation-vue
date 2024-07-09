<template>
  <div>
    <h1>视频搜索结果</h1>
    <el-row>
      <el-col :span="24">
        <el-row :gutter="12">
          <el-col :span="8" v-for="video in videos" :key="video">
            <VideoItem :video="video"></VideoItem>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import VideoItem from "@/components/VideoItem.vue";

export default {
  name: 'VideoList',
  components: {VideoItem},
  data() {
    return {
      searchKey: '',
      videos: [],
    };
  },
  created() {
    // 从URL中读取searchkey参数
    this.searchKey = this.$route.query.searchkey || '';
    console.log('传入的searchkey:', this.searchKey)
    this.fetchVideos();
  },
  methods: {
    async fetchVideos() {
      console.log('请求方法调用')
      try {
        // 假设你有一个获取视频列表的API
        this.$axios.get('search/searchVideo/' + this.searchKey).then(res => {
          console.log(res.data.data)
          this.videos = res.data.data;
        })
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    },
  },
};
</script>
