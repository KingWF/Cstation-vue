<template>
  <el-row>
    <div id="xgPlayerWrap"></div>
  </el-row>
<!--  <el-row style="margin-top: 15px;">-->
<!--    <el-col :span="8">-->
<!--      <el-input placeholder="非实时弹幕内容"-->
<!--                v-model="damuContent"></el-input>-->
<!--    </el-col>-->
<!--    <el-col :span="1">-->
<!--      <el-button color="#409eff"-->
<!--                 plain-->
<!--                 @click="sendDanmu" @keyup.enter="sendDanmu">发弹幕</el-button>-->
<!--    </el-col>-->
<!--  </el-row>-->
  <el-row style="margin-top: 30px">
    <el-col :span="2">
      实时连接状态：
    </el-col>
    <el-col :span="4">
      <img src="/src/assets/static/icons/在线1.png" v-if="isOnline" alt="0" class="online-img"/>
      <img src="/src/assets/static/icons/在线.png" alt="1" v-else class="online-img"/>
    </el-col>
  </el-row>
  <el-row style="margin-top: 15px;">
    <el-col :span="8">
      <el-input placeholder="实时弹幕内容"
                v-model="damuTimeContent"></el-input>
    </el-col>
    <el-col :span="1">
      <el-button color="#409eff"
                 plain
                 @click="send" @keyup.enter="send">发弹幕</el-button>
    </el-col>

  </el-row>
</template>

<script>
import Player, { Events } from 'xgplayer' // 引入西瓜视频模块
import 'xgplayer/dist/index.min.css' // 引入西瓜视频样式
import Danmu from 'xgplayer/es/plugins/danmu'
import 'xgplayer/es/plugins/danmu/index.css'
import {ElMessage} from "element-plus";

export default {
  name: 'MyVideo',
  mounted() {
    // 发送请求获取视频信息
    this.init()

  //   连接websocket
    this.getConnect();
  //   加载页面监听事件
    this.addPopstateListener();
  },
  beforeDestroy() {
    this.removePopstateListener();
  },
  data() {
    return {
      player: null,
      damuContent: '',  // 弹幕内容
      damuTimeContent:'',//实时弹幕内容
      id: 1000,  // 弹幕id，实际应该从后台生成
      playertime: 0, // 记录当前视频时间，方便发送弹幕
      isOnline: false,
    }
  },
  props: {
    video: Object,
    danmuList: Array
  },

  methods: {
    // 加载页面监听
    addPopstateListener() {
      window.addEventListener('popstate', this.onPopstate);
    },
    // 移出页面监听
    removePopstateListener() {
      window.removeEventListener('popstate', this.onPopstate);
    },
    onPopstate(event) {
      console.log('返回上一个页面，并断开和websocket的连接');
      this.close()
      // 在这里可以添加自己的逻辑，例如提示用户是否有未保存的更改
    },
    init() {
      let vue = this
      let video = this.video
      let danmuList = []

      console.log('该视频的弹幕信息',this.danmuList);

      // 遍历弹幕封装数据
      for (const danmu of this.danmuList) {
        let comment = {
          id: danmu.id,
          duration: danmu.duration,
          start: danmu.start,
          mode: danmu.mode,
          txt: danmu.txt,
          style:{
            color: danmu.color
          }
        }
        // 将弹幕放入数组
        danmuList.push(comment)
      }

      this.player = new Player({
        id: 'xgPlayerWrap', // 占位dom元素
        width: 640,
        height: 360, // 视频宽高尺寸
        url: video.video, // 视频源
        poster: video.cover, // 视频封面
        autoplay: false, // 是否自动播放，不自动播放，浏览器有限制规则
        autoplayMuted: false, // 是否自动播放（静音播放）
        videoInit: true, // 是否默认初始化video，默认初始化，默认true
        playsinline: true, // 是否启用内联播放模式，仅移动端生效
        defaultPlaybackRate: 1, // 默认播放速度（可选：0.5/0.75/1/1.5/2等）
        volume: 0.72, // 播放音量（可选：0 ~ 1）
        loop: false, // 是否循环播放，默认不循环播放
        startTime: window.localStorage.getItem('video_' + vue.video.id)
          ? parseFloat(window.localStorage.getItem('video_' + vue.video.id))
          : 0, // 点播模式下，初始起播时间
        videoAttributes: {}, // video扩展属性，暂且不配置
        lang: 'zh-cn', // 播放器初始显示语言，设置为中文
        fluid: true, // 是否流式布局（宽高优先于流失布局，默认16:9）注掉上方宽高看效果
        fitVideoSize: 'fixed', // 保持容器宽/高，不做适配，按照容器来
        videoFillMode: 'auto', // 宽高不够自动底色填充（fill拉伸填充等...）
        seekedStatus: 'play', // 跳转后继续播放
        // 播放器进度条故事点信息数组
        progressDot: [
          {
            id: 0, // 唯一标识，用于删除的时候索引
            time: 30, // 展示的时间点，例子为在播放到10s钟的时候展示
            text: '进度条信息提示...', // hover的时候展示文案，可以为空
            duration: 5, // 展示时间跨度，单位为s
            style: {
              // 指定样式
              backgroundColor: 'pink',
            },
          },
        ],
        thumbnail: null, // 进度条预览图配置，普通业务用不到
        marginControls: false, // 是否开启画面和控制栏分离模式，不开启空间多一些
        domEventType: 'default', // 响应的事件类型，不用指定，用默认的即可
        /**
         * 交互功能配置（一般使用默认即可）
         * */
        /**
         * 插件配置，根据需求自选
         * */
        icons: {}, // 使用默认的icon图标
        i18n: [], // 使用默认的中文
        // 自定义一些颜色
        commonStyle: {
          progressColor: 'green', // 整个进度条颜色
          playedColor: 'chocolate', // 已播放的进度条颜色
          volumeColor: 'pink', // 音量大小竖向滑块颜色
        },
        controls: true, // 是否使用底部控制栏，默认使用
        miniprogress: true, // 是否使用mini进度条（当底部控制栏隐藏时生效）
        screenShot: false, // 关闭截图功能
        rotate: true, // 是否使用视频旋转插件，默认不使用
        download: false, // 是否使用下载按钮，一般不用，一般自定义控制
        pip: true, // 使用使用画中画模式，默认不用
        mini: true, // 是否使用小屏幕控件
        cssFullscreen: true, // 是否使用网页样式全屏按钮开关
        playbackRate: [0.5, 1, 1.5, 2], //传入倍速可选数组
        keyShortcut: false, // 是否开启快捷键模式,
        plugins: [Danmu],
        danmu: {
          comments: danmuList,
          //弹幕显示区域
          area: {
            start: 0, //区域顶部到播放器顶部所占播放器高度的比例
            end: 1, //区域底部到播放器顶部所占播放器高度的比例
          },
          closeDefaultBtn: false, //是否隐藏弹幕开关按钮，设置为true时不显示开关按钮
          defaultOpen: true, //是否默认开启弹幕，设置为false时不开启弹幕
          panel: false, //弹幕面板
          fontSize: 28, // 弹幕字体大小  px
        },
      })
      this.player.on(Events.PLAY, (ev) => {
        console.log('-播放开始-', ev)
        this.$emit('start')
      })
      this.player.on(Events.PAUSE, (ev) => {
        console.log('-播放暂停-', ev)
      })
      this.player.on('loadedmetadata', (ev) => {
        console.log('-媒体数据加载好了-', ev)
      })
      this.player.on(Events.SEEKED, (ev) => {
        console.log('-跳着播放-', ev)
      })
      this.player.on(Events.TIME_UPDATE, (ev) => {
        window.localStorage.setItem('video_' + video.id, ev.currentTime)
        this.playertime = ev.currentTime
      })
      this.player.on(Events.ENDED, (ev) => {
        console.log('-播放结束-', ev)
        // 将本地记录的播放时间给删除：下一次从0开始播放了
        window.localStorage.removeItem('video_' + video.id)
        // 向父组件发送播放结束的事件
        this.$emit("ended")
      })
    },
    // 非实时弹幕
    sendDanmu() {
      let content = {
        start: this.playertime * 1000,
        txt: this.damuContent,
        vid: this.video.id,
        style:{}
      }

      // 将弹幕发送到服务器
      this.$axios.post("danmu/add", content).then(res => {
        console.log(res.data)
        let danmu = res.data.data

        // 封装弹幕信息显示在屏幕上
        content.id = danmu.id
        content.duration = danmu.duration
        content.mode = danmu.mode
        content.style.color = danmu.color

        // 发弹幕到屏幕上
        this.player.danmu.sendComment(content)
        // 清空弹幕输入框
        this.damuContent = ''
      })

      // console.log(content)

    },
    // 发送实时弹幕
    send(){
      if(!this.isOnline){
        ElMessage({
          showClose: true,
          message: '请先登录！',
          type: 'warning',
        })
        return;
      }
      const a=this.damuTimeContent;
      console.log('实时弹幕',a)
      if (a.match(/^\s*$/)){
        ElMessage({
          showClose: true,
          message: '消息不可为空，发送失败！',
          type: 'warning',
        })
      }else {
        // 构造弹幕结构
        let content = {
          start: this.playertime * 1000,
          txt: this.damuTimeContent,
        }
        const contentStr=JSON.stringify(content);
        console.log('发送弹幕',contentStr)
        // // 发送弹幕
        this.ws.send(contentStr);
        this.damuTimeContent='';
      }
    },
    // sendTimeDanmu() {
    //   let content = {
    //     start: this.playertime * 1000,
    //     txt: this.damuContent,
    //     vid: this.video.id,
    //     style:{}
    //   }
    //     // 发弹幕到屏幕上
    //     this.player.danmu.sendComment(content)
    //     // 清空弹幕输入框
    //     this.damuContent = ''
    //
    //   // console.log(content)
    //
    // },
    getConnect(){
      console.log('用户信息',window.localStorage.getItem('user'))
      const tokenStr=JSON.parse(window.localStorage.getItem('user'));
      console.log('userId',tokenStr.id)
      console.log('videId',this.video.id)
      const to_user=tokenStr.id+'-'+this.video.id
      this.ws = new WebSocket(`ws://localhost:8080/chat/`+to_user);
      this.myName = tokenStr.account;
      this.ws.onopen = this.open
      this.ws.onclose = this.close
      this.ws.onerror = this.error
      this.ws.onmessage = this.getMessage
      this.$emit('WsConnect',this.ws)
    },
    open(){
      window.onunload=function(){
        this.ws.close()
      };
      window.onbeforeunload=function(){
        this.ws.close()
      };
      this.isOnline=true;
    },
    exit(){
      this.ws.close();
    },
    error(data){
      console.log("webSocket连接错误：",data);
      this.ws.close();
    },
    getMessage(msg) {
      let message=null
      console.log("接收到的实时弹幕",msg.data)
      let part = msg.data.split('|');
      if(part[0] === 'ChatRoom'){
        this.$emit('RoomMessage',part[1])
        return;
      }
      if (typeof msg.data ==='string'){
        message = JSON.parse(msg.data)
      }
      console.log(message)
    //   构造实时弹幕参数
      let content = {
        start: 0,
        txt: '',
        vid: this.video.id,
        style:{
          color:''
        }
      }
      content.start=message.start+1000
      content.id=message.id
      content.duration = message.duration
      content.mode = message.mode
      content.style.color = message.color
      content.txt=message.txt

      console.log('进入播放的弹幕',content)
      this.player.danmu.sendComment(content)
      this.damuTimeContent='';
    },
    close() {
      this.ws.close();
      console.log('用户退出实时弹幕',window.localStorage.getItem('user'))
    },

  //   监听页面退出
   handleBeforeUnload (event) {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = ''; // 必须设置 returnValue，即使为空字符串
        return ''; // 或者这里返回字符串
      }
    }

  },
}
</script>

<style scoped>
#xgPlayerWrap {
  flex: auto;
}
#xgPlayerWrap video {
  width: 100%;
}
.online-img{
  margin-left: 30px;
  width: 50px;
  height: 50px;
}
</style>
