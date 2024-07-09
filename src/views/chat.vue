<template>
  <div style="display: flex;justify-content: center;align-items: center;background: #404847;height: 630px;">
    <div class="main">
      <div class="left">
        <div style="position:relative;height:100%">
          <el-card style="position:relative;height:100%;overflow: auto">
            <template #header>
              <div class="header">
                <span style="font-weight: bolder">在线博友</span>
              </div>
            </template>
            <div v-for="o in friend" :key="o" style="font-weight: bold;margin-bottom: 5px;">{{o}}</div>
          </el-card>

        </div>
      </div>
      <div class="right">
        <div class="msg">
          <div class="name">
            <el-card>
              <span style="position:relative;margin-top: 30px;font-weight: bolder;">欢迎来到【简印】星球</span>
              <span style="position: relative;float: right;font-weight: normal">
                你的昵称 : <span style="font-weight: bolder">{{myName}}</span>
              </span>

            </el-card>
          </div>
          <el-card class="text">
            <div v-for="o in otherMsg" :key="o" class="text item">
              <template v-if="o.from!==myName">
                <div style="text-align: left">{{o.from}}<br/>
                  <div style="background: gainsboro;position: relative;float: left;width: 50%;text-align: left;padding:5px;word-break:break-all">
                    <span style="position: relative;left: 0">{{o.sendMsg}}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div style="text-align: right">{{o.from}}<br/>
                  <div style="background: cornflowerblue;position: relative;float: right;width: 50%;text-align: left;padding:5px;word-break:break-all">
                    <span style="position: relative;left: 0">{{o.sendMsg}}</span>
                  </div>

                </div>
              </template>
            </div>
          </el-card>
          <!--          <div class="text">
                      <div v-for="o in otherMsg" :key="o" class="text item">
                        <template v-if="o.from!==myName">
                          <div style="text-align: left">{{o.from}}<br/>{{o.sendMsg}}</div>
                        </template>
                        <template v-else>
                          <div style="text-align: right">{{o.from}}<br/>{{o.sendMsg}}</div>
                        </template>
                      </div>
                    </div>-->
        </div>
        <div class="send">
          <el-input v-model="text" :autosize="{ minRows: 5, maxRows: 10 }"     type="textarea"
                    placeholder="Please input" @keyup.enter.native="send"
                    style="position:relative;height:78%;overflow: auto"/>
          <el-button @click="send" type="primary" style="position:relative;float: right;right: 2%;" >发送</el-button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import {ElMessageBox,ElMessage} from "element-plus";

export default {
  beforeRouteLeave (to, from, next) {
    ElMessageBox.confirm(
        '正在离开本页面，本页面内所有未保存数据都会丢失',
        '警告',
        {
          confirmButtonText: '离开',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
        .then(() => {
          this.exit();
          next();
        })
        .catch(() => {
          window.history.go(1);
          ElMessage({
            type: 'info',
            message: '取消操作！',
          })
        })
  },
  name: "AllChat",
  data(){
    return{
      ws:null,
      myName:'我的名字',
      friend:[],
      text:'',
      myMsg:[],
      otherMsg:[],
      list:{
        systemMsgFlag:'',
        from:'',
        sendMsg:''
      }
    }
  },
  update() {
    this.scrollToBottom()
  },
  mounted() {
    this.getConnect();
    this.scrollToBottom()
  },
  watch:{
    /*    '$route.path'( to , from ){
          console.log( to , from )
          if( to !== '/chat'){
            this.exit();
          }
        }*/
  },
  methods:{
    scrollToBottom(){
      const container=document.getElementsByClassName("text");
      container.scrollTop=container.scrollHeight;
    },
    getConnect(){
      console.log('用户信息',window.localStorage.getItem('user'))
      const tokenStr=JSON.parse(window.localStorage.getItem('user'));
      console.log('tokenStr|name',tokenStr.account)
      this.ws = new WebSocket(`ws://localhost:8080/chat/`+tokenStr.account);
      this.myName = tokenStr.account;
      this.ws.onopen = this.open
      this.ws.onclose = this.close
      this.ws.onerror = this.error
      this.ws.onmessage = this.getMessage
    },
    open(){
      window.onunload=function(){
        this.ws.close()
      };
      window.onbeforeunload=function(){
        this.ws.close()
      };
    },
    exit(){
      this.ws.close();
    },
    error(data){
      console.log("webSocket连接错误：",data);
      this.ws.close();
    },
    getMessage(msg) {
      this.list=JSON.parse(JSON.stringify(msg.data));
      if (typeof this.list ==='string'){
        this.list = JSON.parse(this.list)
      }
      console.log('聊天信息！',this.list.sendMsg)
      if (this.list.systemMsgFlag){
        this.friend=this.list.sendMsg;
      }else {
        if (this.list.sendMsg!=null){
          // if (this.list.from!==this.myName) {
          this.otherMsg.push(this.list);
        }
        this.scrollToBottom();
      }
    },
    close() {
      this.ws.close();
    },
    send(){
      const a=this.text;
      console.log('输入的消息',a)
      if (a.match(/^\s*$/)){
        ElMessage({
          showClose: true,
          message: '消息不可为空，发送失败！',
          type: 'warning',
        })
      }else {
        this.myMsg.push(a);
        this.ws.send(JSON.stringify(a));
        this.text='';
        this.scrollToBottom();
      }

    }
  }
}
</script>

<style scoped>
.main{
  display:flex;
  position: relative;
  width: 65%;
  margin: 0;
  height: 95%;
}

.left{
  height: 100%;
  float: left;
  width: 30%;

}
.right{
  -webkit-flex: 1;
  width: 70%;
  left: 30%;
  height: 100%;
}
.msg{
  background: cornsilk;
  height: 70%;
}
.name{
  position: relative;
  background: cornflowerblue;
  height: 15%;
  font-weight: bolder;
  left: 0
}
.text{
  height: 85%;
  overflow:auto;
}
.send{
  background: aliceblue;
  height: 30%;
}
</style>
