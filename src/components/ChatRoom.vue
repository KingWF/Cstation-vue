<script setup>
import { ref, defineProps, inject, onMounted, watchEffect } from "vue";
import ChatItem from "./ChatItem.vue";
import EmojiSelect from "./EmojiSelect.vue";
import { ElMessage } from "element-plus";
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

const scrollbarRef = ref(null);

const scrollDiv = ref(null);

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
const getScollBarHeight = () => {
  const height = scrollDiv.value.clientHeight- 400;
  scrollbarRef.value.setScrollTop(height);
};
const init = () => {
  getRoomCount();
  getUserInfo();

};
onMounted(() => {
  init();
});
watchEffect(() => {
  if (props.ChatList.length > 0) {
    roomChatCount.value = props.ChatList.length;
    getRoomCount();
    setTimeout(() => {
      getScollBarHeight();
    }, 0.5);
  }
});

const inputMsg = ref("");

const sendMsg = () => {
  if(inputMsg.value.trim() === ""){
    ElMessage.error("消息不能为空");
    return;
  }
  const message = {
    content: inputMsg.value,
    uid: userInfo.value.id,
    vid: props.vid,
  };
  props.ws.send(`ChatRoom|` + JSON.stringify(message));
  inputMsg.value = "";
};

const selectEmoji = (emoji) => {
  inputMsg.value += emoji;
} 
</script>

<template>
  <div>
    <el-card shadow="always">
      <template #header>
        <el-row class="chat-room-header">
          <el-col>
            <el-text>房间人数：{{ roomCount }}</el-text>
          </el-col>
        </el-row>
      </template>

      <el-scrollbar @scroll="hanleScroll" ref="scrollbarRef" height="480px" always >
        <div ref="scrollDiv">
          <TransitionGroup name="list">
            <el-row v-for="item in ChatList" :key="item">
              <el-col :span="24">
                <chat-item :message="item"></chat-item>
              </el-col>
            </el-row>
          </TransitionGroup>
        </div>
      </el-scrollbar>
    </el-card>
    <el-row>
      <el-col :span="24">
        <div class="chat-room-input">
          <el-input style="width: 60%;" @keyup.enter.native="sendMsg"  v-model="inputMsg" placeholder="请输入消息"></el-input>
          <el-popover
            placement="top"
            :width="540"
            trigger="click"
          >
            <template #reference>
              <el-icon class="emoji-icon" style="margin-left: 10px;" size="30"><Plus /></el-icon>
            </template>
          <emoji-select @select="selectEmoji"></emoji-select>

          </el-popover>
          

          <el-button style="margin-left: 10px;" type="primary"  @click="sendMsg">发送</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.chat-room-input {
  display: flex;
  flex-direction: row;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.emoji-icon{
  cursor: pointer;
  color: #909399;
}
.emoji-icon:hover{
  scale: 1.2;
  color: skyblue;
}
</style>
