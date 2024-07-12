<script setup>
import { ref, defineProps, inject, onMounted, watchEffect } from "vue";
import ChatItem from "./ChatItem.vue";

const props = defineProps({
  vid: String,
  ChatList: Array,
  ws: WebSocket,
});
/** @type {import('axios').Axios} */
const $axios = inject("$axios");

const roomCount = ref(0);

const roomChatCount = ref(0);

const userInfo = ref({});

// 初始化房间人数
const getRoomCount = () => {
  $axios
    .get(`video/getChatRoomCountByVid/${props.vid}`)
    .then((res) => {
      const resdata = res.data;
      roomCount.value = resdata.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
// 获取用户信息
const getUserInfo = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    userInfo.value = user;
  }
};
const init = () => {
  getRoomCount();
};
onMounted(() => {
  init();
  getUserInfo();
});
watchEffect(() => {
  if (props.ChatList.length > 0) {
    roomChatCount.value = props.ChatList.length;
    getRoomCount();
  }
});

const inputMsg = ref("");

const sendMsg = () => {
  const message = {
    content: inputMsg.value,
    uid: userInfo.value.id,
    vid: props.vid,
  };
  props.ws.send(`ChatRoom|` + JSON.stringify(message));
  inputMsg.value = "";
};
</script>

<template>
  <div>
    <el-card shadow="always ">
      <template #header>
        <el-row class="chat-room-header">
          <el-col>
            <el-text>房间人数：{{ roomCount }}</el-text>
          </el-col>
        </el-row>
      </template>

      <el-scrollbar height="480px">
        <el-row v-for="item in ChatList" :key="item">
          <el-col :span="24">
            <chat-item :message="item"></chat-item>
          </el-col>
        </el-row>
      </el-scrollbar>
    </el-card>
    <el-row>
      <el-col :span="24" >
        <div class="chat-room-input">
          <el-input v-model="inputMsg" placeholder="请输入消息"></el-input>
          <el-button type="primary" @click="sendMsg">发送</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.chat-room-input{
  display: flex;
  flex-direction: row;
}
</style>
