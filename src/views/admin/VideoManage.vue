<template>
  <div>
    <!-- 搜索、添加 -->
    <el-row>
      <el-col :span="8">
        <el-input placeholder="视频标题" v-model="title" style="width: 80%;"></el-input>
        <el-button type="success" @click="search">搜索</el-button>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="state"
          placeholder="请选择"
          style="width: 240px"
          @change="changeState"
        >
          <el-option
            v-for="item in stateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-row>
      <el-table :data="videoList" style="width: 100%">
        <el-table-column prop="title" label="视频标题" width="180" align="center"/>

        <!-- prop：对象的属性，只能在el-table-column中使用 -->
        <!-- 如果想在子标签中访问属性，只能通过 #default="scoped" 插槽  scoped简单的理解成 videoList-->
        <el-table-column label="视频封面" width="180" #default="scoped" align="center">
          <!-- scoped.row：当前行的对象 -->
          <el-image :src="scoped.row.cover"></el-image>
        </el-table-column>

        <el-table-column label="视频" #default="scoped" align="center">
          <!-- controls:播放控件 -->
          <video :src="scoped.row.video" style="width: 160px;height: 90px;" controls></video>
        </el-table-column>

        <el-table-column prop="uptime" label="上传时间" width="180" align="center"/>

        <el-table-column label="视频状态" align="center" #default="scoped"  width="100">
          <el-tag v-if="scoped.row.state == 'video_pass'" type="success">正常</el-tag>
          <el-tag v-if="scoped.row.state == 'video_commit'" type="warning">审核中</el-tag>
          <el-tag v-if="scoped.row.state == 'video_reject'" type="danger">未通过</el-tag>
          <el-tag v-if="scoped.row.state == 'video_lock'" type="info">被锁定</el-tag>
        </el-table-column>

        <el-table-column label="操作" align="center" #default="scoped">
          <el-button type="danger" v-if="scoped.row.state != 'video_lock'" @click="lock(scoped)">锁定</el-button>
          <el-button type="success" v-if="scoped.row.state == 'video_lock'" @click="unlock(scoped)">解锁</el-button>
          <el-button type="success" v-if="scoped.row.state == 'video_commit'" @click="openCheckDialog(scoped)">审核</el-button>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 分页 -->
    <el-row>
      <el-pagination 
        layout="prev, pager, next, jumper" 
        :total="total" 
        :default-page-size="size"
        @current-change="pageChange"
        />
    </el-row>
  </div>

  <!-- 审核对话框 -->
   <el-dialog v-model="checkDialog" title="审核视频">
      <el-form>
        <el-form-item>
          <el-radio v-model="checkResult" label="video_pass">通过</el-radio>
        </el-form-item>
        <el-form-item>
          <el-radio v-model="checkResult" label="video_reject">未通过</el-radio>
        </el-form-item>
      </el-form>
      <template #footer>
      <div class="dialog-footer">
        <el-button @click="checkDialog = false">取消</el-button>
        <el-button type="primary" @click="check">
          确认
        </el-button>
      </div>
    </template>
   </el-dialog>
</template>
<script>
export default{
  data(){
    return{
      video: {
        title: "",
        cover: "",
        video: "",
        uptime: "",
        state: ""
      }, // 当前选中的视频对象
      checkDialog: false, // 审核对话框
      checkResult: "", // 审核结果
      page: 1, // 页面
      size: 5, // 每一页多少条数据
      total: 0, // 总条数
      videoList: [], // 当前页的视频列表、数据
      state: "",
      title: "",
      stateList:[
        {
          value: 'video_pass',
          label: '通过'
        },
        {
          value: 'video_commit',
          label: '审核中'
        },
        {
          value: 'video_lock',
          label: '被锁定'
        },
        {
          value: 'video_reject',
          label: '未通过'
        },
      ]
    }
  },
  mounted(){
    // 页面加载时去查询出第一页的视频信息
    this.getData()
  },
  methods:{
    pageChange(page){
      this.page = page
      //
      this.getData()
    },
    getData(){
      // video/findByUid/1/5    video/findByUid?page=1&size=5&account=xxx
      // `模板字符串`  方便拼接字符串
      this.$axios.get(`video/findAll/${this.page}/${this.size}`).then(res =>{
        // 响应对象：里面包含了状态、数据、响应头
        console.log(res)
        // res.data属性：存放后端返回的数据  ResponseResult 对象
        console.log(res.data)
        // res.data.data：分页信息 ResPage
        console.log(res.data.data)
        // 获取到了分页信息对象
        let resPage = res.data.data
        // 获取总条数
        this.total = resPage.total
        // 获取当前页数据
        this.videoList = resPage.data
      })
    },
    lock(scoped){
      console.log(scoped)
      // 引用传递
      let video = scoped.row
      this.$axios.get("video/lock/" + video.id).then(res => {
        if(res.data.code == 200){
          // 更新页面
          video.state = 'video_lock'
          //
          this.$message.success("锁定成功")
        }
      })
    },
    unlock(scoped){
      console.log(scoped)
      // 引用传递
      let video = scoped.row
      this.$axios.get("video/unlock/" + video.id).then(res => {
        if(res.data.code == 200){
          // 更新页面
          video.state = 'video_commit'
          //
          this.$message.success("解锁成功")
        }
      })
    },
    check(){
      this.checkDialog = false
      console.log(this.checkResult)
      console.log(this.video)
      if(this.checkResult == "video_pass"){
      this.$axios.get(`video/pass/` + this.video.id).then(res => {
        if(res.data.code == 200){
          // 更新页面
          this.video.state = this.checkResult
          //
          this.$message.success("审核通过")
        }
      })}else{
        this.$axios.get(`video/reject/` + this.video.id).then(res => {
          if(res.data.code == 200){
            // 更新页面
            this.video.state = this.checkResult
            //
            this.$message.success("审核不通过")
          }
        })
      }
    },
    openCheckDialog(scoped){
      this.video = scoped.row
      this.checkDialog = true
    },
    changeState(val){
      console.log(val.row)
      // 将状态传递给后台进行分页查询
    },
    search(){
      if(this.title.trim() == "" && this.state.trim() == ""){
        getData()
        return
      }
      // video/findByUid/1/5    video/findByUid?page=1&size=5&account=xxx
      // `模板字符串`  方便拼接字符串
      this.$axios.get(`video/findAll/${this.page}/1000`).then(res =>{
        // 响应对象：里面包含了状态、数据、响应头
        console.log(res)
        // res.data属性：存放后端返回的数据  ResponseResult 对象
        console.log(res.data)
        // res.data.data：分页信息 ResPage
        console.log(res.data.data)
        // 获取到了分页信息对象
        let resPage = res.data.data
        // 获取总条数
        this.total = resPage.total
        // 获取当前页数据
        this.videoList = resPage.data
        if(this.title.trim() != "" && this.state.trim() != ""){
        this.videoList = this.videoList.filter(item => {
          return item.title.includes(this.title) && item.state == this.state
        })}else if(this.title.trim() != ""){
          this.videoList = this.videoList.filter(item => {
            return item.title.includes(this.title)
          })
        }else if(this.state.trim() != ""){
          this.videoList = this.videoList.filter(item => {
            return item.state == this.state
          })
        }
        console.log(this.videoList)
      })
    }
  }
}
</script>
<style scoped>

</style>