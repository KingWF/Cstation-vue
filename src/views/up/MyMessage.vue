<template>
  <div >
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="评论时间" prop="time" width="200px"/>
      <el-table-column label="评论者" prop="account" width="200px"/>
      <el-table-column label="评论内容" prop="content" width="200px">
      <template #default="scope">
        <span v-html="scope.row.content"></span>
      </template>
      </el-table-column>
      <el-table-column align="right" width="600px">
        <template #header>
          <div style="display: flex;justify-content: space-around">
            <div style="">
              <el-select
                  v-model="selectVid"
                  placeholder="Select"
                  size="large"
                  style="width: 200px"
                  @change="handleChange"
              >
                <el-option
                    v-for="item in videoList"
                    :key="item"
                    :label="item.title"
                    :value="item.id"
                />
              </el-select>
            </div>
            <div >
              <el-input style="width: 130px" v-model="search" size="small" placeholder="Type to search" @keyup.enter="searchTable"/>
            </div>
          </div>


        </template>
        <template #default="scope">
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>
<script>
export default {
  data() {
    return {
      videoList:[],
      tableData: [],
      searchData:[],
      search: '',
      handleEdit: '',
      selectVid:0
    }
  },
  mounted() {
    this.$axios.get("video/findAllVideoByUid").then(res => {
      console.log(res.data.data)
      this.videoList = res.data.data
      this.selectVid = res.data.data[0].id
    //   再开始时先查询第一个视频的评论信息
      this.$axios.get("review/findReviewByVid/"+this.selectVid).then(res => {
        console.log('表格数据',res.data.data)
        this.tableData = res.data.data
        this.searchData = res.data.data
      })
    })
  },
  methods: {
    searchTable() {
      if(this.search===''){
        this.tableData = this.searchData
      }else{
        let filteredData = this.searchData.filter(data =>
            !this.search ||
            data.content.toLowerCase().includes(this.search.toLowerCase())
        );
        this.tableData = filteredData
      }
    },
    handleChange(){
      console.log("选择的视频",this.selectVid)
      this.$axios.get("review/findReviewByVid/"+this.selectVid).then(res => {
        console.log('表格数据',res.data.data)
        this.tableData = res.data.data
        this.searchData = res.data.data
      })
    },
    handleDelete(index){
      console.log(index.id)
      this.$axios.get("review/delReview/"+index.id).then(res => {
        console.log(res.data)
        if(res.data.code == 200 && res.data.data == true) {
          this.$axios.get("review/findReviewByVid/"+this.selectVid).then(res => {
            console.log('表格数据',res.data.data)
            this.tableData = res.data.data
            this.$message({
              type: 'success',
              message: '删除成功'
            });
          })

        }else{
          this.$message({
            type: 'error',
            message: '删除失败'
          });
        }
      })
    }
  }

}
</script>
<style>

</style>