<template>
  <div>
    <!-- 搜索、添加 -->
    <el-row>
      <el-col :span="8">
        <el-input
          @change.passive="searchVideo"
          placeholder="视频标题"
          clearable
          v-model="searchTitle"
          style="width: 80%"
        ></el-input>
        <el-button @click="searchVideo" type="primary" style="margin-left: 10px">搜索</el-button>
      </el-col>
      <el-col :span="1" :offset="15">
        <el-button type="primary" @click="$router.push('/upPersonal/addVideo')"
          >添加</el-button
        >
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-row>
      <el-table :data="videoList" style="width: 100%">
        <el-table-column
          prop="title"
          label="视频标题"
          width="180"
          align="center"
        />

        <!-- prop：对象的属性，只能在el-table-column中使用 -->
        <!-- 如果想在子标签中访问属性，只能通过 #default="scoped" 插槽  scoped简单的理解成 videoList-->
        <el-table-column
          label="视频封面"
          width="180"
          #default="scoped"
          align="center"
        >
          <!-- scoped.row：当前行的对象 -->
          <el-image :src="scoped.row.cover"></el-image>
        </el-table-column>

        <el-table-column label="视频" #default="scoped" align="center">
          <!-- controls:播放控件 -->
          <video
            :src="scoped.row.video"
            style="width: 160px; height: 90px"
            controls
          ></video>
        </el-table-column>

        <el-table-column
          prop="uptime"
          label="上传时间"
          width="180"
          align="center"
        />
        <el-table-column
          prop="playnums"
          label="播放次数"
          width="100"
          align="center"
        />

        <el-table-column
          label="视频状态"
          align="center"
          #default="scoped"
          width="100"
        >
          <el-tag v-if="scoped.row.state == 'video_pass'" type="success"
            >正常</el-tag
          >
          <el-tag v-if="scoped.row.state == 'video_commit'" type="warning"
            >审核中</el-tag
          >
          <el-tag v-if="scoped.row.state == 'video_reject'" type="danger"
            >未通过</el-tag
          >
          <el-tag v-if="scoped.row.state == 'video_lock'" type="info"
            >被锁定</el-tag
          >
        </el-table-column>

        <el-table-column label="操作" align="center" #default="scoped">
          <el-button
            type="primary"
            @click="$router.push('/upPersonal/viewVideo/' + scoped.row.id)"
            >查看</el-button
          >
          <el-button
            type="warning"
            v-if="scoped.row.state != 'video_lock'"
            @click="$router.push('/upPersonal/editVideo/' + scoped.row.id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            v-if="scoped.row.state != 'video_lock'"
            @click="deleteVideo(scoped.row)"
            >删除</el-button
          >
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 分页 -->
    <el-row>
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="total"
        :default-page-size="size"
        @current-change="pageChange"
      />
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      page: 1, // 页面
      size: 5, // 每一页多少条数据
      total: 0, // 总条数
      videoList: [], // 当前页的视频列表、数据
      searchTitle: "", // 搜索的标题
    };
  },
  mounted() {
    // 页面加载时去查询出第一页的视频信息
    this.getData();
  },
  methods: {
    pageChange(page) {
      this.page = page;
      if (this.searchTitle !== "") {
        this.searchVideo();
      } else {
        this.getData();
      }
    },
    getData() {
      // video/findByUid/1/5    video/findByUid?page=1&size=5&account=xxx
      // `模板字符串`  方便拼接字符串
      this.$axios
        .get(`video/findByUid/${this.page}/${this.size}`)
        .then((res) => {
          // 响应对象：里面包含了状态、数据、响应头
          console.log(res);
          // res.data属性：存放后端返回的数据  ResponseResult 对象
          console.log(res.data);
          // res.data.data：分页信息 ResPage
          console.log(res.data.data);
          // 获取到了分页信息对象
          let resPage = res.data.data;
          // 获取总条数
          this.total = resPage.total;
          // 获取当前页数据
          this.videoList = resPage.data;
        });
    },
    /**
     * 删除视频
     * @author ZSCaiGou
     * @date 2024-07-09
     * @param {any} video
     * @returns {any}
     */
    deleteVideo(video) {
      this.$confirm(`确定要删除【${video.title}】吗？`, {
        title: "提示",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`video/delVideo/${video.id}`).then((res) => {
            console.log(res);
            this.$message.success("删除成功");
            this.getData();
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    /**
     * 搜索视频
     */
    searchVideo() {
      if (this.searchTitle === "") {
        this.getData();
        return;
      }
      this.$axios
        .get(`video/findByTitle/${this.searchTitle}/${this.page}/${this.size}`)
        .then((res) => {
          // 响应对象：里面包含了状态、数据、响应头
          console.log(res);
          // res.data属性：存放后端返回的数据  ResponseResult 对象
          console.log(res.data);
          // res.data.data：分页信息 ResPage
          console.log(res.data.data);
          // 获取到了分页信息对象
          let resPage = res.data.data;
          // 获取总条数
          this.total = resPage.total;
          // 获取当前页数据
          this.videoList = resPage.data;
        });
    },
  },
};
</script>
<style scoped></style>
