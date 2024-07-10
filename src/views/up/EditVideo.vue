<template>
  <div>
    <!-- 面包屑 -->
    <el-row>
      <el-col>
        <div class="breadcrumb">
          <el-icon class="breadcrumb-icon" @click="$router.go(-1)" size="20"
            ><ArrowLeft
          /></el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/upPersonal' }">
              Up主页
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/upPersonal/videoManage' }">
              视频管理
            </el-breadcrumb-item>
            <el-breadcrumb-item> 视频编辑 </el-breadcrumb-item>
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
              <el-input
                v-model="title"
                placeholder="请输入视频标题"
                style="width: 50%"
              ></el-input>
            </div>
          </el-col>
        </el-row>
        <!-- 下拉菜单 -->
        <el-row>
          <el-col>
            <div class="category">
              <el-text>分类：</el-text>
              <!-- 下拉菜单 -->
              <el-select
                v-model="cids"
                placeholder="请选择视频分类，可以是多种"
                style="width: 240px"
                multiple
              >
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
          </el-col>
        </el-row>
        <!-- 视频封面 -->
        <el-row>
          <el-col>
            <el-row>
              <el-col>
                <div class="title">
                  <el-text style="width: 5%" class="title-span">封面：</el-text>
                  <el-image :src="cover" style="width: 40%" />
                </div>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <el-col :span="24">
                <el-button
                  style="width: 40%; margin-left: 5%"
                  type="info"
                  @click="$refs.fileInput.click()"
                >
                  <input
                    @change="coverChange"
                    ref="fileInput"
                    type="file"
                    accept=".png,.jpg,.jfif"
                    v-show="false"
                  />
                  <el-icon><Refresh /></el-icon>
                  更换封面
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 保存、返回按钮 -->
        <el-row>
          <el-col>
            <div
              style="
                width: 45%;
                margin-top: 20px;
                display: flex;
                flex-direction: row;
                justify-content: end;
              "
            >
              <el-button
                :disabled="!isChangeInfo"
                type="primary"
                @click="saveVideo"
                >保存</el-button
              >
              <el-button @click="$router.go(-1)">返回</el-button>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cids: [], //分类id的数组，里面保存用户选择的分类id,
      cidsCk: [],
      categoryList: [],
      title: "",
      cover: null,
      vid: this.$route.params.vid,
      isGetVideoInfo: false,
      fileInput: null,
      video: null,
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    isChangeInfo() {
      if (!this.video) {
        return false;
      }

      // 判断是否有修改
      if (
        this.title === this.video.title &&
        this.cids.toString() === this.cidsCk.toString() &&
        this.cover === this.video.cover
      ) {
        return false;
      }
      return true;
    },
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
            this.cids = resData.data;
            this.cidsCk = resData.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 修改视频封面
     * @param event 上传的图片文件
     */
    coverChange(event) {
      const file = event.target.files[0];
      this.cover = URL.createObjectURL(file);
    },
    saveVideo() {
      // 更新视频信息
      const formData = new FormData();
      formData.append("id", this.video.id);
      formData.append("title", this.title);
      formData.append("uid", this.video.uid);
      formData.append("cids", this.cids);
      formData.append("coverUrl", this.video.cover);
      let url = "video/updateVideo";
      if (this.video.cover === this.cover) {
        url = "video/updateVideoNoCover";
      } else {
        formData.append("cover", this.cover);
      }

      this.$axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.$message.success("保存成功!");
            // 回到视频管理页
            this.$router.push("/upPersonal/videoManage");
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
.breadcrumb {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.breadcrumb-icon {
  cursor: pointer;
}
.breadcrumb-icon:hover {
  color: skyblue;
}
</style>
