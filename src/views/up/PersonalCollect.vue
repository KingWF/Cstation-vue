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
              <a :href="fan.link" target="_blank">
              <el-image :src="fan.cover" alt="Fan Avatar" class="avatar" />
                </a>
            </el-col>
            <el-row :span="14">
              视频标题:<h3 class="name">{{ fan.title }}</h3>
            </el-row>
            <el-row :span="14">
              <el-button type="danger" @click="cancelFavorite(fan)">取消收藏</el-button>
            </el-row>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import axios from "axios";
import {ElMessage} from "element-plus";

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
  },
  methods: {
    // 处理取消收藏的函数
    cancelFavorite(fan) {
      // 调用后端API取消收藏
      let flag = false;
      this.$axios.get('/collect/update/'+flag +'/' + fan.id).then(res => {
        if (res.data.code == 200) {
          ElMessage({
            message: '取消收藏成功',
            type: 'success',
          });
          //删除
          for (let i = 0; i < this.fans.length; i++) {
            if (fan.id == this.fans[i].id) {
              this.fans.splice(i, 1);
              break;
            }
          }
        }
      })
    },
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
