<template>
  <div v-loading="isLoading"
  element-loading-text="正在上传视频，请不要刷新页面..."
  element-loading-background="rgba(255,255,255)"
  >
    <el-row>
      <el-col :span="12">
        <el-input placeholder="请输入视频名称" v-model="title"style="margin-bottom:20px;"></el-input>

        <!-- 选封面 -->
        <ImageChange @changeFile="coverChange"></ImageChange>
        
        <!-- 选视频 -->
        <VideoChange @changeFile="videoChange"></VideoChange>

        <!-- 下拉菜单 -->
        <el-select
          v-model="cids"
          placeholder="请选择视频分类，可以是多种"
          style="width: 240px;margin-top: 20px;"
          multiple
          @change="changeCategory"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-button style="margin-top: 10px;" type="success" @click="upload">上传视频</el-button>
    </el-row>
  </div>
</template>
<script>
import ImageChange from '../../components/ImageChange.vue'
import VideoChange from '../../components/VideoChange.vue'
export default{
  data(){
    return{
      cids: [],//分类id的数组，里面保存用户选择的分类id,
      categoryList:[],
      title: "",
      cover: null,
      video: null,
      isLoading: false
    }
  },
  components:{
    ImageChange,
    VideoChange
  },
  mounted(){
    // 请求视频的分类信息
    this.$axios.get("category/all").then(res => {
      console.log(res.data)
      this.categoryList = res.data.data
    })
  },
  methods:{
    // 参数是被选中的分类id数组
    changeCategory(cids){
      // 记录选中了哪些
      this.cids = cids
    },
    upload(){
      if(this.title===""){
        this.$message.error("请输入视频名称！")
        return
      }
      if(this.cover==null){
        this.$message.error("请选择封面！")
        return
      }
      if(this.video==null){
        this.$message.error("请选择视频！")
        return
      }
      if(this.cids.length===0){
        this.$message.error("请选择视频分类！")
        return
      }
      // 得到标题、图片、视频、分类
      let data = new FormData()
      data.append("title", this.title)
      data.append("cover", this.cover)
      data.append("video", this.video)
      data.append("cids", this.cids)
      this.isLoading = true
      // 发请求提交数据
      this.$axios.post("video/add", data, {
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res)
        if(res.data.code == 200){
          this.$message.success("添加成功!")
          this.isLoading = false
          // 回到视频管理页
          this.$router.push("/upPersonal/videoManage")
        }
      }).catch(err => {
        this.$message.error("添加失败,网络错误！")
        this.isLoading = false
      })

    },
    coverChange(cover){
      this.cover = cover
    },
    videoChange(video){
      this.video = video
    }
  }
}
</script>
<style scoped>

</style>