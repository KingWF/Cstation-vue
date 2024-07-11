<template>
    <div>
      <!-- 搜索、添加 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="评论内容" v-model="content" style="width: 80%;"></el-input>
          <el-button type="success" @click="search()">搜索</el-button>
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
        <el-table :data="reviewList" style="width: 100%">
          <el-table-column prop="id" label="id" width="180" align="center"/>
            
          <el-table-column #default="{row}" label="评论内容" width="180" align="center">
            <span v-html="row.content"></span>
          </el-table-column>

          <el-table-column prop="time" label="评论时间" width="180" align="center"/>
          
          <el-table-column prop="account" label="用户名" width="180" align="center"/>

          <el-table-column label="评论状态" align="center" #default="scoped"  width="110">
            <el-tag v-if="scoped.row.state == 'review_pass'" type="success">审核通过</el-tag>
            <el-tag v-if="scoped.row.state == 'review_lock'" type="danger">审核不通过</el-tag>
            <el-tag v-if="scoped.row.state == 'review_commit'" type="warning">审核中</el-tag>
          </el-table-column>
  
          <el-table-column label="操作" align="center" #default="scoped">
            <el-button type="danger" @click="lock(scoped)">不通过</el-button>
            <el-button type="success" @click="pass(scoped)">通过</el-button>
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
        reviewList: [], // 当前页的视频列表、数据
        state: "",
        content: "",
        stateList:[
          {
            value: 'review_pass',
            label: '通过'
          },
          {
            value: 'review_commit',
            label: '审核中'
          },
          {
            value: 'review_lock',
            label: '不通过'
          }
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
        // review/findByUid/1/5    review/findByUid?page=1&size=5&account=xxx
        // `模板字符串`  方便拼接字符串
        this.$axios.get(`review/findAll/${this.page}/${this.size}`).then(res =>{
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
          this.reviewList = resPage.data
        })
      },
      lock(scoped){
        console.log(scoped)
        // 引用传递
        let review = scoped.row
        this.$axios.get("review/lock/" + review.id).then(res => {
          if(res.data.code == 200){
            // 更新页面
            review.state = 'review_lock'
            //
            this.$message.success("审核不通过")
          }
        })
      },
      pass(scoped){
        console.log(scoped)
        // 引用传递
        let review = scoped.row
        this.$axios.get("review/pass/" + review.id).then(res => {
          if(res.data.code == 200){
            // 更新页面
            review.state = 'review_pass'
            //
            this.$message.success("审核通过")
          }
        })
      },
      changeState(val){
        console.log(val)
        // 将状态传递给后台进行分页查询
  
      },
      search(){
      // review/findByUid/1/5    review/findByUid?page=1&size=5&account=xxx
      // `模板字符串`  方便拼接字符串
      this.$axios.get(`review/findAll/${this.page}/1000`).then(res =>{
        // 获取到了分页信息对象
        let resPage = res.data.data
        // 获取总条数
        this.total = resPage.total
        // 获取当前页数据
        this.reviewList = resPage.data
        console.log(this.reviewList)
        console.log(this.content)
        console.log(this.state)
        // 过滤数据
        if(this.content != "" || this.state != ""){
        this.reviewList = this.reviewList.filter(item => {
          return item.content.includes(this.content) && item.state == this.state  
      })}else if(this.content != ""){
        this.reviewList = this.reviewList.filter(item => {
          return item.content.includes(this.content)
      })}else if(this.state != ""){
        this.reviewList = this.reviewList.filter(item => {
          return item.state == this.state
      })}
      console.log(this.reviewList)
    })
    }
  }
  }
  </script>
  <style scoped>
  
  </style>