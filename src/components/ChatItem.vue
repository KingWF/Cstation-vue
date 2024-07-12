<script setup>
import { ref, defineProps, onMounted, inject } from "vue";

const props = defineProps({
  message: Object | String,
});
/** @type {import('axios').Axios} */
const $axios = inject("$axios");

const message = ref({});
const welcomeMessage = ref("");

const sendUserAccount = ref("");

// 获取视频信息
const getMessageInfo = () => {
  if (props.message.startsWith("{")) {
    message.value = JSON.parse(props.message);
  } else {
    welcomeMessage.value = props.message;
  }
};
// 获取发送的用户信息
const getUserInfo = () => {
  // 判断是否是用户发送的信息
  if (message.value.uid) {
    $axios
      .get(`user/getChatRoomMessageSenderAccountById/${message.value.uid}`)
      .then((res) => {
        const resdata = res.data;
        if (resdata.code === 200) {
          sendUserAccount.value = resdata.data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const init = () => {
  getMessageInfo();
  getUserInfo();
};
onMounted(() => {
  init();
});
</script>

<template>
  <el-row>
    <el-col>
      <div class="welcome-message" v-if="welcomeMessage">
        {{ welcomeMessage }}
      </div>
      <div class="chat-message" v-if="message.uid">
        <div class="chat-message-sender">{{ sendUserAccount+"：" }}</div>
        <div class="chat-message-content">{{ message.content }}</div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.welcome-message {
    font-size: 14px;
    color: #999;
    margin-bottom: 10px;
}
.chat-message {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    .chat-message-sender {
        font-size: 14px;
        color: #333;
        margin-right: 2px;
    }
    .chat-message-content {
        font-size: 14px;
        color: #333;
        word-break: break-all;
    }
}
</style>
