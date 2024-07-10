<template>
 <div >
      <!-- 搜索、添加 -->
      <el-row>
        <el-col :span="4">
          <el-input placeholder="用户姓名" style="width: 200px;" v-model="name"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="state"
            placeholder="请选择用户状态"
            style="width: 200px"
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
        <el-row :span="4">
          <el-select
              v-model="level"
              placeholder="请选择用户等级"
              style="width: 200px"
              @change="changeState"
            >
              <el-option
                v-for="item in levelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
        <el-row :span="4">
          <el-button type="success" @click="getData">搜索</el-button>
        </el-row>
      </el-row>

      <!-- 表格 -->
      <el-row>
        <el-table :data="userList" style="width: 100%">
          <el-table-column prop="id" label="id" width="180" align="center"/>

          <el-table-column prop="avatar" label="用户头像" width="180" align="center">
            <template #default="scope">
              <img :src="scope.row.avatar" style="width: 100px; height: 100px; border-radius: 50%;"/>
            </template>
          </el-table-column>

          <el-table-column prop="account" label="账号" width="180" align="center"/>

          <el-table-column prop="level" label="等级" width="180" align="center"/>

          <el-table-column label="用户状态" align="center" #default="scoped"  width="100">
            <el-tag v-if="scoped.row.state === 'user_normal'" type="success">正常</el-tag>
            <el-tag v-if="scoped.row.state === 'user_lock'" type="info">被锁定</el-tag>
          </el-table-column>

          <el-table-column label="操作" align="center" #default="scoped">
            <el-button type="danger" v-if="scoped.row.state === 'user_normal'" @click="lock(scoped)">锁定</el-button>
            <el-button type="success" v-if="scoped.row.state !== 'user_normal'" @click="pass(scoped)">解锁</el-button>
            <el-button type="success" >修改</el-button>
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

<script >
  export default{
    data(){
      return{
        currentPage: 1, // 页面
        pageSize: 5, // 每一页多少条数据
        total: 0, // 总条数
        userList: [], //
        state: undefined,
        level: undefined,
        name: undefined,
        stateList:[
          {
            value: 'user_normal',
            label: '正常'
          },
          {
            value: 'user_lock',
            label: '被锁定'
          }
        ],
        levelList:[
          {
            value: 'vip',
            label: 'vip'
          },
          {
              value: 'svip',
            label: 'svip'
          },
          {
            value: 'vvip',
            label: 'vvip'
          }
        ]
      }
    },
    mounted(){
      // 页面加载时去查询出第一页的视频信息
      this.getData()
    },
    methods:{
      pageChange(currentPage){
        this.currentPage = currentPage
        this.getData()
      },
      getData(){
        // user/findByUid/1/5    user/findByUid?page=1&size=5&account=xxx
        // `模板字符串`  方便拼接字符串
        this.$axios.get(`user/list`,{
          params:{
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            state: this.state,
            level: this.level,
            name: this.name
          }
        }).then(res =>{
          // 响应对象：里面包含了状态、数据、响应头
          // console.log(res)
          // // res.data属性：存放后端返回的数据  ResponseResult 对象
          // console.log(res.data)
          // // res.data.data：分页信息 ResPage
          // console.log(res.data.data)
          // 获取到了分页信息对象
          let resPage = res.data.data
          // 获取总条数
          this.total = resPage.totalRecords
          console.log(this.total)
          // 获取当前页数据
          this.userList = resPage.list
          console.log(this.userList)
        })
      },
      lock(scoped){
        console.log(scoped)
        // 引用传递
        let user = scoped.row
        this.$axios.get("user/lock/",{
          params: {
            id: user.id,
            state: 'user_lock'
          }
        }).then(res => {
          if(res.data.code == 200){
            // 更新页面
            user.state = 'user_lock'
            //
            this.$message.success("锁定成功")
          }
        })
      },
      pass(scoped){
        console.log(scoped)
        // 引用传递
        let user = scoped.row
        this.$axios.get("user/lock/",{
          params: {
            id: user.id,
            state: 'user_normal'
          }
        }).then(res => {
          if(res.data.code == 200){
            // 更新页面
            user.state = 'user_normal'
            //
            this.$message.success("审核成功")
          }
        })
      },
      changeState(val){
        console.log(val)
        // 将状态传递给后台进行分页查询

      }
    }
  }
</script>

<style scoped>

</style>