<template>
  <div>
    <Header :hideLogo="hideLogo" :topColor="topColor" :keepSearchKey="searchKey" :enableSearch="enableSearch"></Header>
    <div style="padding:0 15px 0 15px ;margin-top: 100px">
      <el-row justify="center">
        <el-col :span="5" style="display: flex;justify-content: center;margin:10px 0 30px 0  ">
          <!-- 输入框 -->
          <el-input
              v-model="searchKey"
              style="width: 600px;height: 40px"
              placeholder="输入搜索内容~"
              :prefix-icon="Search"
              @keyup.enter="fetchVideos()"
          />
        </el-col>
      </el-row>

      <el-row :gutter="20" >
        <el-col :span="4" v-for="video in videos" :key="video" >
          <VideoItem :video="video"></VideoItem>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import VideoItem from "@/components/VideoItem.vue";
import Header from "@/components/Header.vue";
import {Search} from "@element-plus/icons-vue";

export default {
  name: 'VideoList',
  computed: {
    Search() {
      return Search
    }
  },
  components: {Header, VideoItem},
  data() {
    return {
      searchKey: '',
      videos: [],
      hideLogo: false,
      hideSearch: false,
      topColor: '#8c8c8c',
      enableSearch:true

    };
  },
  created() {
    // 从URL中读取searchkey参数
    this.searchKey = this.$route.query.searchkey || '';
    console.log('传入的searchkey:', this.searchKey)
    this.fetchVideos();
  },
  methods: {
    // 获取视频参数
    async fetchVideos() {
      console.log('请求方法调用')
      try {

        this.$axios.get('search/searchVideo/' + this.searchKey).then(res => {
          console.log(res.data.data)
          this.videos= res.data.data
          // location.reload(true);
        })
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    },
  },
};
</script>
