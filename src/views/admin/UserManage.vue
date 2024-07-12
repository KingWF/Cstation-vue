<template>
 <div>
   <div class="search-bar">
   <!-- 搜索、添加 -->
    <el-row :gutter="20" class="search-row">
      <el-col :span="4">
        <el-input placeholder="输入用户姓名" style="width: 100%;" v-model="name"></el-input>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="state"
          placeholder="选择用户状态"        style="width: 100%;"
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
      <el-col :span="4">
        <el-select
          v-model="level"
          placeholder="选择用户等级"        style="width: 100%;"
          @change="changeState"
        >
          <el-option
            v-for="item in levelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="success" @click="getData" :icon="Search" >搜索</el-button>
        <el-button type="primary" @click="refresh" ><el-icon><RefreshRight /></el-icon>重置</el-button>
      </el-col>
    </el-row>
</div>
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

          <el-table-column prop="level" label="等级" width="180" align="center">
          </el-table-column>

          <el-table-column label="用户状态" align="center" #default="scoped"  width="100">
            <el-tag v-if="scoped.row.state === 'user_normal'" type="success">正常</el-tag>
            <el-tag v-if="scoped.row.state === 'user_lock'" type="info">被锁定</el-tag>
          </el-table-column>

          <el-table-column label="操作" align="center" #default="scoped">
            <el-button type="danger" v-if="scoped.row.state === 'user_normal'" @click="lock(scoped)" ><el-icon><Lock /></el-icon>锁定</el-button>
            <el-button type="success" v-if="scoped.row.state !== 'user_normal'" @click="pass(scoped)" ><el-icon><Unlock /></el-icon>解锁</el-button>
            <el-button type="success" @click="changeState(scoped)" :icon="Edit">修改</el-button>
          </el-table-column>
        </el-table>
      </el-row>
    <!-- 修改用户等级的对话框 -->
      <el-dialog title="修改用户等级" v-model="modifyLevelDialogVisible"  width="500" >
        <el-form :model="form" >
          <el-form-item label="新等级"   >
            <el-select v-model="form.level" placeholder="请选择">
              <el-option
                v-for="item in levelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modifyLevelDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitModifyLevel">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <el-row>
        <el-pagination 
          layout="prev, pager, next, jumper" 
          :total="total" 
          v-model:page-size="pageSize"
          @current-change="pageChange"
          />
      </el-row>
    </div>
</template>

<script >
import {Edit, Search} from "@element-plus/icons-vue";

  export default{
    computed: {
      Edit() {
        return Edit
      },
      Search() {
        return Search
      }
    },
    data(){
      return{
        currentPage: 1, // 页面
        pageSize: 5, // 每一页多少条数据
        total: 0, // 总条数
        pages: 0,//总页数
        userList: [], //
        state: undefined,
        level: undefined,
        name: undefined,
        modifyLevelDialogVisible: false, // 控制修改等级对话框的显示隐藏
        form: {
          id: 0,
          level: ''
      },
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
        console.log("分页" + currentPage)
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
          //总页数
          this.pages = resPage.totalPages
          console.log("总条数" + this.total)
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
        console.log(val.row)
        // 将状态传递给后台进行分页查询
        this.showModifyLevelDialog(val.row);
      },
      showModifyLevelDialog(row) {
      this.form.id = row.id
      this.modifyLevelDialogVisible = true;
    },
    submitModifyLevel() {
      // 提交修改等级的逻辑
      // 这里可以调用你的API进行修改等级的操作
      // 修改完成后，记得关闭对话框并刷新数据
      console.log(this.form)

      this.$axios.get("user/changeUserLevel",{
        params: {
          id: this.form.id,
          level: this.form.level
        }
      }).then(res => {
        if(res.data.code == 200){
          this.$message.success("修改成功")
        }
        this.modifyLevelDialogVisible = false;
        this.getData(); // 假设 getData 是你的数据获取方法
        this.form.id = 0;
        this.form.level='';
      })
    },
    refresh(){
        this.name = undefined
        this.state = undefined
        this.level = undefined
    }
    }
  }
</script>

<style scoped>.search-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-row .el-input__inner,
.search-row .el-select .el-input__inner {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.search-row .el-button {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

/* 可选：如果希望所有元素都有相同的高度 */
.search-row .el-input,
.search-row .el-select,
.search-row .el-button {
  height: 40px;
}
.search-bar {
  background-color: #fafafa; /* 背景颜色 */
  padding: 20px; /* 内边距 */
  border-radius: 15px; /* 圆角 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 阴影 */
  transition: box-shadow 0.3s ease; /* 阴影过渡 */
}

.search-bar:hover {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* 鼠标悬停时的阴影 */
}

</style>