<template>
    <div>
    <Header @loginSuccess="loginSuccess" ></Header>
    <div class="container">
      <div style="width: 100%;display: flex;flex-direction: column;padding: 20px;">
        <!-- 2.菜单 -->
        <div style="width: 100%;">
          <Menus></Menus>
        </div>
        <div style="width: 100%;margin: 10px">
          <ChatRoomShow></ChatRoomShow>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Menus from '../components/Menus.vue'
import ChatRoomShow from '../components/ChatRoomShow.vue'

export default{
  // 写事件函数，例如点击、双击、change事件等等
  methods:{
    loginSuccess(){
      this.$emit("loginSuccess")
    }
  },
  components:{
    ChatRoomShow,
    Header,
    Menus,
  }
}
</script>