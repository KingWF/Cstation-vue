<template>
  <el-row class="base">
    <div class="camera" v-if="isShow">
      <video id="videoCamera" autoplay ></video>
      <div >
        <canvas
            style="display: none"
            id="canvasCamera"
            :width="videoWidth"
            :height="videoHeight"

        ></canvas>
      </div>
    </div>
    <div class="face-img" v-else>
      <img :src="imgSrc" alt="" />
    </div>
  </el-row>
  <el-row justify="center" style="margin-top: 30px">
    <button @click="handlePhotograph" v-if="isShow">拍照</button>
    <button v-else @click="restartPhoto">重新拍照</button>
  </el-row>
  <el-row style="display: flex;flex-direction: column;justify-content: center;align-items: center" v-if="isShowImg">
    <div style="margin-top: 30px;justify-content: center">
      <el-image :src="SearchFaceUser.avatar" style="width: 300px;height: 300px;border-radius: 50%"></el-image>
    </div>
    <div  style="margin-top: 30px;justify-content: center">
      用户账号：<span style="color: #409eff">{{SearchFaceUser.account}}</span>
    </div>
    <div style="margin-top: 30px">
      <el-button type="primary" @click="login">确认登录</el-button>
    </div>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      isShow:true,
      videoWidth: 300,
      videoHeight: 200,
      cameraList: [{ id: "", label: "摄像头1" }],
      currentCamera: "",
      imgSrc: "",
      SearchFaceUser:{},
      isShowImg:false
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.getDevices().then(res => {
      if (res.length) {
        this.cameraList = res;
      }
      this.currentCamera = this.cameraList[0].id;
      this.main();
    });
  },

  methods: {
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
    // 拍照
    handlePhotograph() {
      this.thisContext.drawImage(this.thisVideo, 0, 0, 300, 200);
      // 获取图片base64链接;
      this.imgSrc = this.thisCanvas.toDataURL("image/png", 0.7);
      // 将图片数据保存到localStorage
      window.localStorage.setItem('faceImage', this.imgSrc);

      this.isShow= false;

      this.$axios.post("faceIdentify/searchFace", {image:this.imgSrc.replace(/^data:image\/\w+;base64,/, '')}).then(res => {
          let user_id = res.data.result.user_list[0].user_id
          let score = res.data.result.user_list[0].score
          if(score > 80){
            this.$axios.get("user/getUserByFaceId/"+user_id).then(res => {
              console.log('根据人脸识别出来的用户账号',res.data)
              if(res.data.code===200){
                this.SearchFaceUser=res.data.data
                this.isShowImg=true
              }else{
                alert('根据人脸识别出来的用户账号失败')
              }
            })
          }
          console.log('识别结果uid',res.data.result.user_list[0].user_id)
          console.log('识别分数',res.data.result.user_list[0].score)
        })

    },
    restartPhoto(){
      this.isShow=true
      this.isShowImg=false
      this.imgSrc=''
    }
  }
};
</script>
<style scoped>
.base{
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.camera{
  width: 600px;
  height: 400px;
  border-radius: 50%;
  display:flex;
  justify-content: center;
  flex-direction: column;
}
.face-img{
  width: 600px;
  height: 400px;
  display:flex;
  justify-content: center;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
