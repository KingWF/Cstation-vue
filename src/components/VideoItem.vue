<template>
  <div v-if="show" class="item-box">
    <el-row>
      <img :src="video.cover" class="cover">
    </el-row>
    <el-row class="play-icon">
      <img src="@/assets/play.png" class="rec-list-play" @click="play(video.id)">
    </el-row>
    <p class="title">
        {{truncateTitle(video.title) }}
        <span class="play-count">播放量:{{ video.playnums }}</span>
    </p>
    <p style="position: relative;top: -30px;">
      <span style="color: red;">{{video.username}}</span>&nbsp;&nbsp;
      <span style="font-size: 12px;">{{video.uptime}}</span>
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,  // 显示、交互用的属性
    }
  },
  props: {
    video: Object,  // 用来接收父组件传递的数据
  },
  mounted() {
    if (this.video) {
      this.show = true
    }
  },
  methods:{
    play(id){
      this.$router.push("/play/" + id)   //   /play/n
    },
    truncateTitle(title) {
      // 截断标题，如果超过30个字符则添加省略号
      return title.length > 10 ? title.substring(0, 10) + '...' : title;
    }
  }
}
</script>
<style scoped>
.item-box {
  width: 100%;
  position: relative;
  padding: 10px;
}
.cover {
  width: 80%;
  height: 140px;
  border: 1px solid gainsboro;
  border-radius: 15px;
}
.play-icon {
  width: 280px;
  height: 140px;
  position: absolute;
  top: 10px;
  left: 10px;
}
.rec-list-play {
  width: 100%;
  height: 100%;
}
.rec-list-play:hover {
  transform: scale(1.1);
}
.title {
  margin-top: 10px;
  font-weight: bold;
  white-space: nowrap; /* 强制文本不换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 使用省略号表示溢出的内容 */
  display: inline-block; /* 将 p 标签设置为行内块元素，确保宽度生效 */
}
.play-count {
  color: grey;
  font-size: 12px;
  height: 0px;
  position: absolute;
  right: 80px;
}
</style>