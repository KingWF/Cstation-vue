<template>
    <div>
      <!-- 搜索、添加 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="投诉内容" v-model="reason" style="width: 80%;"></el-input>
          <el-button type="success" @click="search()">搜索</el-button>
        </el-col>
      </el-row>
  
      <!-- 表格 -->
      <el-row>
        <el-table :data="reportList" style="width: 100%">
          <el-table-column #default="{row}" label="被投诉视频名称" width="180" align="center">
            <div @click="play(row)">{{row.title}}</div>
          </el-table-column>
            
          <el-table-column prop="account" label="被投诉UP主账号" width="180" align="center"/>
          
          <el-table-column prop="time" label="投诉时间" width="180" align="center"/>

          <el-table-column prop="reason" label="投诉内容" width="180" align="center"/>
          
          <el-table-column label="操作" align="center" #default="scoped">
            <el-button type="danger" @click="handle(scoped);this.state='report_reject'">不通过</el-button>
            <el-button type="success" @click="handle(scoped);this.state='report_pass'">通过</el-button>
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
  </template>
  <script>
  export default{
    data(){
      return{
        page: 1, // 页面
        size: 5, // 每一页多少条数据
        total: 0, // 总条数
        reportList: [], // 当前页的视频列表、数据
        state: "",
        reason: ""
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
        // report/findByUid/1/5    report/findByUid?page=1&size=5&account=xxx
        // `模板字符串`  方便拼接字符串
        this.$axios.get(`report/findAll/${this.page}/${this.size}`).then(res =>{
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
          this.reportList = resPage.data
        })
      },
      handle(scoped){
        console.log(scoped)
        // 引用传递
        let report = scoped.row
        this.$axios.put("report/" + report.id+"/"+this.state).then(res => {
          if(res.data.code == 200){
            this.$message.success("审核成功")
            // 更新页面
            this.getData()
            //
          }
        })
      },
      play(row){
        console.log(row)
        // 跳转到播放页面
        this.$router.push({path: "/play/" + row.vid})
      },
      search(){
      if(this.reason.trim() == ""){
        getData()
        return
      }else{
        this.reportList = this.reportList.filter(item => {
          return item.reason.indexOf(this.reason) != -1
        })
      }
    }
  }
  }
  </script>
  <style scoped>
  
  </style>