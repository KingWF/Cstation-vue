<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col>
        <div class="breadcrumb">
          <el-icon class="breadcrumb-icon" @click="$router.go(-1)" size="20"><ArrowLeft /></el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/upPersonal' }">
              Up主页
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/upPersonal/videoManage' }">
              视频管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              视频查看
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              {{ title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
      </el-col>
    </el-row>
    <!-- 视频信息 -->
    <el-row>
      <el-col :span="16" style="margin-left: 20px">
        <!-- 视频标题 -->
        <el-row>
          <el-col>
            <div class="title">
              <el-text class="title-span">标题：</el-text>
              <el-text style="font-weight: bold"> {{ title }} </el-text>
            </div>
          </el-col>
        </el-row>
        <!-- 下拉菜单 -->
        <el-row>
          <el-col>
            <div class="category">
              <el-text>分类：</el-text>
              <template
                v-if="categoryList.length > 0"
                v-for="(item, index) in categoryList"
                :key="item.id"
              >
                <el-tag v-if="cids.includes(item.id)" type="success">{{
                  item.name
                }}</el-tag>
              </template>
            </div>
          </el-col>
        </el-row>
        <!-- 上传时间 -->
        <el-row v-if="isGetVideoInfo">
          <el-col>
            <div class="title">
              <el-text class="title-span">上传时间：</el-text>
              <el-text style="font-weight: bold">
                {{ video.uptime }}
              </el-text>
            </div>
          </el-col>
        </el-row>

        <!-- 播放量 -->
        <el-row v-if="isGetVideoInfo">
          <el-col>
            <div class="title">
              <el-text class="title-span">播放量：</el-text>
              <el-text style="font-weight: bold">
                {{ video.playnums }}
              </el-text>
            </div>
          </el-col>
        </el-row>
        <!-- 视频状态 -->
        <el-row v-if="isGetVideoInfo">
          <el-col>
            <div class="title">
              <el-text class="title-span">视频状态：</el-text>
              <el-tag v-if="video.state === 'video_pass'" type="success"
                >正常</el-tag
              >
              <el-tag v-if="video.state === 'video_commit'" type="pramry"
                >审核中</el-tag
              >
              <el-tag v-if="video.state === 'video_lock'" type="info"
                >锁定中</el-tag
              >
              <el-tag v-if="video.state === 'video_reject'" type="error"
                >审核未通过</el-tag
              >
            </div>
          </el-col>
        </el-row>
        <!-- 视频播放 -->
        <el-row v-if="isGetVideoInfo">
          <el-col :span="12" style="margin-top: 20px">
            <UpViewVideo :video="video"></UpViewVideo>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import UpViewVideo from "@/components/UpViewVideo.vue";
export default {
  data() {
    return {
      cids: [], //分类id的数组，里面保存用户选择的分类id,
      categoryList: [],
      title: "",
      cover: null,
      video: null,
      vid: this.$route.params.vid,
      isGetVideoInfo: false,
    };
  },
  components: {
    UpViewVideo,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 获取视频数据和分类数据
      this.getData();
    },
    /**
     * 获取视频信息
     * @author ZSCaiGou
     * @date 2024-07-10
     */
    getData() {
      // 请求视频的分类选项
      this.$axios
        .get("category/all")
        .then((res) => {
          this.categoryList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      // 请求视频信息
      this.$axios
        .get(`video/getUpVideoInfoByVid/${this.vid}`)
        .then((res) => {
          const resData = res.data;
          if (resData.code === 200) {
            this.video = resData.data;
            this.cover = this.video.cover;
            this.title = this.video.title;
            this.isGetVideoInfo = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // 获取视频分类信息
      this.$axios
        .get(`video/getVideoCategoryByVid/${this.vid}`)
        .then((res) => {
          const resData = res.data;
          if (resData.code === 200) {
            console.log(resData.data);
            this.cids = resData.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.title {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.category {
  margin-top: 20px;
}
.breadcrumb{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.breadcrumb-icon{
  cursor: pointer;
}
.breadcrumb-icon:hover{
  color: skyblue
}
</style>
