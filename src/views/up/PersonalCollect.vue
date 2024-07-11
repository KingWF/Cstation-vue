<template>
  <div class="fans-container">
    <el-row>
      我的收藏
    </el-row>
    <el-row>
      <el-col :span="24" style="margin: 10px 0 10px 0" v-for="(fan, index) in fans" :key="index" class="fan-item">
        <el-card>
          <el-row justify="space-around">
            <el-col :span="10">
              <el-image :src="fan.cover" alt="Fan Avatar" class="avatar" />
            </el-col>
            <el-col :span="14">
              视频标题:<h3 class="name">{{ fan.title }}</h3>
            </el-col>
          </el-row>

        </el-card>

      </el-col>
    </el-row>

  </div>
</template>
<script>
export default {
  data() {
    return {
      fans: []
    }
  },
  mounted() {
    // 发送请求获取粉丝数据
    this.$axios.get('collect/findCollect').then(res => {
      console.log('粉丝数据获取成功', res.data.data)
      this.fans = res.data.data;
    });
  }
}
</script>
<style scoped>
.fans-container {
  width: 100%;
  margin: auto;
  padding: 20px;
}
.avatar{
  border-radius: 20px;
  width: 200px;
  height: 100px;
}
</style>
