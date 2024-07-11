<template>
<!--  添加分类按钮-->
<div class="button-container">
  <el-button type="primary" @click="showAddCategoryDialog = true">添加分类</el-button>
</div>
  <!-- 添加分类对话框 -->
  <el-dialog title="添加分类" v-model="showAddCategoryDialog">
    <el-form :model="categoryForm" :rules="categoryRules" ref="categoryFormRef">
      <el-form-item label="分类名称" prop="username">
        <el-input v-model="categoryForm.username" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddCategoryDialog = false">取消</el-button>
        <el-button type="primary" @click="submitCategoryCreation">确定</el-button>
      </span>
    </template>
  </el-dialog>
 <div >
      <!-- 表格 -->
      <el-row>
        <el-table :data="categoryList" style="width: 100%">
          <el-table-column prop="name" label="分类名称" width="auto" >
          </el-table-column>
          <el-table-column label="分类状态" align="center" #default="scoped" width="auto">
            <el-tag v-if="scoped.row.state === 'category_normal'" type="success" size="large">正常</el-tag>
            <el-tag v-if="scoped.row.state === 'category_lock'" type="info" size="large">被锁定</el-tag>
          </el-table-column>
          <el-table-column label="操作" align="center" #default="scoped" width="auto">
            <el-button type="danger" v-if="scoped.row.state === 'category_normal'" @click="lock(scoped)">锁定</el-button>
            <el-button type="success" v-if="scoped.row.state !== 'category_normal'" @click="pass(scoped)">解锁</el-button>
            <el-button type="success" @click="changeState(scoped)" >修改</el-button>
            <el-button type="danger" @click="deleteCategory(scoped)">删除</el-button>
          </el-table-column>
        </el-table>
      </el-row>
    <!-- 修改分类等级的对话框 -->
      <el-dialog title="修改分类等级" v-model="modifyLevelDialogVisible"  width="500" >
        <el-form :model="form" >
          <el-form-item label="名称"   >
            <el-input v-model="form.name" placeholder="请输入新的名称">
            </el-input>
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
  export default{
    data(){
      return{
        currentPage: 1, // 页面
        pageSize: 10, // 每一页多少条数据
        total: 0, // 总条数
        pages: 0,//总页数
        categoryList: [], //
        modifyLevelDialogVisible: false, // 控制修改等级对话框的显示隐藏
        form: {
          id: 0,
          name: ''
      },
        showAddCategoryDialog: false,
      categoryForm: {
        username: '',
      },
      categoryRules: {
        username: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { min: 2, message: '分类名至少2个字符', trigger: 'blur'},
          { max: 16, message: '分类名最多16个字符', trigger: 'blur'},

        ],
      },
        stateList:[
          {
            value: 'category_normal',
            label: '正常'
          },
          {
            value: 'category_lock',
            label: '被锁定'
          }
        ],

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
        // category/findByUid/1/5    category/findByUid?page=1&size=5&account=xxx
        // `模板字符串`  方便拼接字符串
        this.$axios.get(`category/list`,{
          params:{
            currentPage: this.currentPage,
            pageSize: this.pageSize,
          }
        }).then(res =>{
          let resPage = res.data.data
          // 获取总条数
          this.total = resPage.totalRecords
          //总页数
          this.pages = resPage.totalPages
          console.log("总条数" + this.total)
          // 获取当前页数据
          this.categoryList = resPage.list
          console.log(this.categoryList)
        })
      },
      lock(scoped){
        console.log(scoped)
        // 引用传递
        let category = scoped.row
        this.$axios.get("category/lock/",{
          params: {
            id: category.id,
            state: 'category_lock'
          }
        }).then(res => {
          if(res.data.code == 200){
            // 更新页面
            category.state = 'category_lock'
            //
            this.$message.success("锁定成功")
          }
        })
      },
      pass(scoped){
        console.log(scoped)
        // 引用传递
        let category = scoped.row
        this.$axios.get("category/lock/",{
          params: {
            id: category.id,
            state: 'category_normal'
          }
        }).then(res => {
          if(res.data.code == 200){
            // 更新页面
            category.state = 'category_normal'
            //
            this.$message.success("解锁成功")
          }
        })
      },
      deleteCategory(val){
        let id = val.row.id
        this.$axios.get("category/delete",{
          params: {
            id: id
          }
        }).then(res => {
          if(res.data.code === 200){
            // 更新页面
            this.getData()
            this.$message.success("删除成功")
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
      this.form.name = row.name
      this.modifyLevelDialogVisible = true;
    },
    submitModifyLevel() {
      // 提交修改等级的逻辑
      // 这里可以调用你的API进行修改等级的操作
      // 修改完成后，记得关闭对话框并刷新数据
      console.log(this.form)

      this.$axios.get("category/changeName",{
        params: {
          id: this.form.id,
          name: this.form.name
        }
      }).then(res => {
        if(res.data.code == 200){
          this.$message.success("修改成功")
        }
        this.modifyLevelDialogVisible = false;
        this.getData(); // 假设 getData 是你的数据获取方法
        this.form.id = 0;
        this.form.name='';
      })
    },
      submitCategoryCreation() {
      this.$refs.categoryFormRef.validate(valid => {
        if (valid) {
          // 提交创建分类的逻辑
          this.$axios.get('/category/add', {
            params:{
              username: this.categoryForm.username,
            }
          }).then(response => {
            if (response.data.code === 200) {
              this.$message({
                message: '分类创建成功',
                type: 'success',
              });
              //更新页面
              this.getData()
              this.showAddCategoryDialog = false;
              this.categoryForm.username = '';

            } else {
              this.$message.error('分类创建失败，请检查输入或联系管理员');
            }
          }).catch(error => {
            console.error('Error creating category:', error);
            this.$message.error('分类创建失败，请检查网络或稍后再试');
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    }
  }
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end;
}

</style>