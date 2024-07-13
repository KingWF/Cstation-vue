<template>
  <div class="fans-container">
    <el-row>
      我的关注
    </el-row>
    <el-row>
          <el-col :span="24" style="margin: 10px 0 10px 0" v-for="(follow, index) in follows" :key="index" class="fan-item">
            <el-card>
              <el-row justify="space-around">
                <el-col :span="10">
                  <el-image :src="follow.avatar" alt="Fan Avatar" class="avatar" />
                </el-col>
                <el-col :span="14">
                  用户昵称:<h3 class="name">{{ follow.account }}</h3>
                  <el-button type="danger" style="margin-left: 150px;" color="#ADD8E6" @click="cancelFollow(follow.id)">取消关注</el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
    </el-row>

  </div>
</template>
<script>
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      follows: []
    }
  },
  mounted() {
    // 发送请求获取粉丝数据
  this.getFollowsData();
  },
  methods:{
    getFollowsData(){
      this.$axios.get('follow/findFollows').then(res => {
        console.log('关注数据获取成功', res.data.data)
        this.follows = res.data.data;
      });
    },
    cancelFollow(id){
      this.$axios.get('follow/update/false/'+id).then(res => {
       if(res.data.code == 200){
         this.getFollowsData();
         ElMessage({
           message: '取消关注成功',
           type: 'success'
         })
       }
      });
    }
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
  width: 100px;
}
</style>
