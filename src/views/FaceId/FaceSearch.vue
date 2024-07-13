<template>
  <div class="baseMainDown">
    <el-image src="/src/assets/static/015c145da813afa801209e1fbc0a3a.png@2o.png" :style="imageStyle" />
  </div>
  <div class="baseMainOver" >
    <div class="base" v-if="isShow">
      <div class="camera">
        <video id="videoCamera" :autoplay="autoplay" style="height:379px;width:450px;border-radius: 50%"></video>
        <div >
          <canvas
              style="display: none;border-radius: 50%"
              id="canvasCamera"
              :width="videoWidth"
              :height="videoHeight"

          ></canvas>
        </div>
      </div>
    </div>
      <div class="face-img" v-else>
        <img :src="imgSrc" alt="" />
      </div>
  </div>
  <div class="baseLoading" v-if="isShow">
    <div style="color:#ffffff;font-size: 30px;font-weight: bolder">自动识别中...</div>
  </div>
  <div class="baseBtn" >
    <div v-if="!ifShowLoading">
<!--      <el-button @click="handlePhotograph" v-if="isShow">拍照</el-button>-->
      <el-button v-if="!isShow" @click="restartPhoto">重新识别</el-button>
    </div >
    <div v-else style="width: 400px">
      <el-progress :percentage="identifyProgress" :stroke-width="15" striped />
    </div>

  </div>
  <div class="baseImg">
    <el-row style="display: flex;flex-direction: column;justify-content: center;align-items: center" v-if="isShowImg">
      <div style="margin-top: 30px;justify-content: center">
        <el-image :src="SearchFaceUser.avatar" style="width: 250px;height: 250px;border-radius: 50%"></el-image>
      </div>

    </el-row>
  </div>
  <div  style="position: absolute;justify-content: center ;background:#1e1f22;width: 300px;height: 30px;  top: 70%;
  left: 62%;" v-if="isShowImg">
    <span style="color:#ffffff;">用户账号：</span><span style="color: #409eff">{{SearchFaceUser.account}}</span>
  </div>
  <div class="baseBtn2" v-if="isShowImg">
    <el-button plain type="success" @click="login">确认登录</el-button>
  </div>
  <div style="position: fixed;top: 20px;right: 0;width: 100%;height: 40px;background: #0eb63d;display: flex;justify-content: center;align-items: center" v-if="ifwaitTime">
    <div style="color: #ffffff;font-weight: bolder">{{timeRemaining}}秒后将自动跳转登录!</div>
  </div>

</template>

<script>
import {ElMessage, ElNotification} from "element-plus";

export default {
  data() {
    return {
      windowHeight: 0,
      isShow:true,
      videoWidth: 300,
      videoHeight: 200,
      cameraList: [{ id: "", label: "摄像头1" }],
      currentCamera: "",
      imgSrc: "",
      SearchFaceUser:{},
      isShowImg:false,
      ifShowLoading: false,
      identifyProgress:0,
      autoplay: true,
      recognitionInterval: null, // 用于存储 setInterval 的返回值
      isRequesting: false, // 控制是否正在发送请求
      timeRemaining: 5,
      timerId: null,
      ifwaitTime:false
    };
  },

  components: {},

  computed: {
    imageStyle() {
      return { 'width': '100%', 'height': `${this.windowHeight}px` };
    },
  },

  mounted() {
    // 获取页面高度
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    // 获取摄像头列表
    this.getDevices().then(res => {
      if (res.length) {
        this.cameraList = res;
      }
      this.currentCamera = this.cameraList[0].id;
      this.main();
    });
    // 组件挂载后开始识别
    this.recognitionInterval = setInterval(this.startRecognition, 4000);
  },
  beforeDestroy() {
    this.stopRecognition();
    window.removeEventListener('resize', this.updateWindowDimensions);
  },
  methods: {
    startRecognition() {
      if (!this.isRequesting) {
        console.log('识别方法执行');
        // 执行识别逻辑
        this.recognitionLogic();
      }
    },
    recognitionLogic() {
      // 识别逻辑，可以是异步的
      this.isRequesting = true;
      this.handlePhotograph();
    },
    restartRecognition() {
      // 清除现有定时器并重新开始
      clearInterval(this.recognitionInterval);
      this.recognitionInterval = setInterval(this.startRecognition, 4000);
    },
    stopRecognition() {
      // 清除定时器
      if (this.recognitionInterval !== null) {
        clearInterval(this.recognitionInterval);
        this.recognitionInterval = null;
      }
    },
    updateWindowDimensions() {
      this.windowHeight = window.innerHeight;
    },
    // 登录账号并进入首页
    login(){
      // 发请求进行直接登录
      this.$axios.post("user/directLogin", this.SearchFaceUser).then(res =>{
        console.log(res)
        if(res.data.code === 200){
          this.$message.success("登录成功")
          // 将用户信息、token信息保存到本地
          let user = res.data.data
          let token = res.headers.authorization

          // 更新浏览器缓存的用户信息
          window.localStorage.setItem("user", JSON.stringify(user))
          window.localStorage.setItem("token", token)
          // // 关闭摄像机
          // this.disableCamera()
          // location.reload()
          this.disableCamera()
          this.$router.push("/")

        }
      })
    },
    main() {
      this.thisCanvas = document.getElementById("canvasCamera");
      this.thisContext = this.thisCanvas.getContext("2d");
      this.thisVideo = document.getElementById("videoCamera");
      this.enableCamera(this.currentCamera);
    },
    disableCamera() {
      const stream = this.thisVideo.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
        this.thisVideo.srcObject = null;
      }
    },
    getDevices() {
      return new Promise((resolve, reject) => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          window.alert("不支持 mediaDevices.enumerateDevices()");
        }
        navigator.mediaDevices
            .enumerateDevices()
            .then(devices => {
              let cameraList = [];
              devices.forEach((device, index) => {
                // 获取摄像头外设 videoinput
                if (device.kind && device.kind === "videoinput") {
                  if (device.deviceId) {
                    cameraList.push({
                      id: device.deviceId,
                      label: device.label
                    });
                  }
                }
              });
              resolve(cameraList);
            })
            .catch(err => {
              console.log(err.name + ": " + err.message);
              reject();
            });
      });
    },
    /**
     * @desc 获取摄像头权限 getUserMedia
     * deviceId	getDevices()函数获取的设备id
     * success  调用成功的回调函数
     * error	调用失败的回调函数
     */
    getUserMedia(deviceId, success, error) {
      const constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          transform: "scaleX(-1)",
          deviceId: deviceId
        }
      };
      if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(success)
            .catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error);
      } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
      } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
      }
    } /** @desc 摄像头使能封装 */,
    enableCamera(deviceId) {
      this.getUserMedia(
          deviceId,
          stream => {
            if ("srcObject" in this.thisVideo) {
              this.thisVideo.srcObject = stream;
            } else {
              // 避免在新的浏览器中使用它，新浏览器正在被弃用。没有开启摄像头权限或浏览器版本不兼容
              this.thisVideo.src = window.URL.createObjectURL(stream);
            }
            this.thisVideo.onloadedmetadata = e => {
              this.thisVideo.play();
            };
          },
          error => {
            console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
            alert("摄像头打开失败，请检查摄像头并点击浏览器地址栏右侧的摄像头标志进行开启设置");
          }
      );
    },
    // 设置进度条时间延时器
    setDelay(time) {
      setTimeout(() => {
        this.identifyProgress=time
      },1000)

    },
    // 跳转倒计时
    startCountdown() {
      this.timerId = setInterval(() => {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
          clearInterval(this.timerId);
        }
      }, 1000);
    },
    // 拍照
    handlePhotograph() {
      // 显示识别加载
      // 显示进度加载条
      this.ifShowLoading = true;
      this.setDelay(10)
      this.thisContext.drawImage(this.thisVideo, 0, 0, 300, 200);
      // 获取图片base64链接;
      this.imgSrc = this.thisCanvas.toDataURL("image/png", 0.7);
      // 将图片数据保存到localStorage
      window.localStorage.setItem('faceImage', this.imgSrc);
      this.isShow= false;
      this.setDelay(30)
      this.setDelay(50)
      this.setDelay(70)

      this.$axios.post("faceIdentify/searchFace", {image:this.imgSrc.replace(/^data:image\/\w+;base64,/, '')}).then(res => {
        // 设置进度为60
        this.setDelay(90)

        if(res.data.code===200){
          let user_id = res.data.data.result.userList[0].userId
          let score = res.data.data.result.userList[0].score
          if(score > 80){
            this.$axios.get("user/getUserByFaceId/"+user_id).then(res => {
                this.identifyProgress = 80;
              console.log('根据人脸识别出来的用户账号',res.data)
              if(res.data.code===200){
                this.SearchFaceUser=res.data.data
                this.setDelay(10)
                setTimeout(() => {
                  ElMessage.success(res.data.message)
                  this.ifShowLoading=false
                  this.isShowImg=true
                },1000)
                // 开启跳转倒计时
                this.startCountdown()
                this.ifwaitTime=true
                // ElNotification({
                //   title: '登录提醒',
                //   type: 'success',
                //   message: "五秒后将自动跳转登录!",
                //   position: 'bottom-right',
                //   duration:5000,
                // })
                setTimeout(()=>{
                  this.ifwaitTime=false

                  this.login()
                  if (this.timerId) {
                    clearInterval(this.timerId);
                  }

                },5000)
              }else{
                ElMessage.error(res.data.message)
                this.ifShowLoading=false
                this.isRequesting=false
                setTimeout(() => {
                  this.restartPhoto()
                },2000)
              }
            })
          }
          console.log('识别结果uid',res.data.result.userList[0].userId)
          console.log('识别分数',res.data.result.userList[0].score)
        }else{
         ElMessage.error(res.data.message)
          this.ifShowLoading=false
          this.isRequesting=false
          setTimeout(() => {
            this.restartPhoto()
          },2000)
        }
        })

    },
    restartPhoto(){
      location.reload()
      // this.isShow=true
      // this.isShowImg=false
      // this.imgSrc=''
    }
  }
};
</script>
<style scoped>
.baseMainDown{
  position: relative;
}
.baseMainOver{
  position: absolute;
  top: 50%;
  left: 28.8%;
  transform: translate(-50%, -50%);
}
.baseLoading{
  position: absolute;
  top: 50%;
  left: 28.8%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 20%;
  background: rgba(126, 126, 126, 0.6);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.base{
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.camera{
  //width: 400px;
  //height: 400px;
  //border-radius: 50%;
  display:flex;
  justify-content: center;
  flex-direction: column;
  //overflow: hidden;
}
.face-img{
  height:300px;
  width:300px;

  display:flex;
  justify-content: center;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.baseBtn{
  position: absolute;
  top: 88%;
  left: 28.8%;
  transform: translate(-50%, -50%);
}
.baseBtn2{
  position: absolute;
  top: 88%;
  right: 22%;
  transform: translate(-50%, -50%);
}
.baseImg{
  position: absolute;
  top: 44%;
  left: 71.5%;
  transform: translate(-50%, -50%);
}

</style>
