<template>
  <div >
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="Date" prop="date" width="200px"/>
      <el-table-column label="Name" prop="name" width="200px"/>
      <el-table-column align="right" width="600px">
        <template #header>
          <div style="background: #409eff;display: flex;justify-content: space-around">
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
              <el-input style="width: 130px" v-model="search" size="small" placeholder="Type to search" />
            </div>
          </div>


        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            Edit
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
          >
            Delete
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
      search: '',
      handleEdit: '',
      handleDelete: '',
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
      })
    })
  },
  methods: {
    handleChange(){
      console.log("选择的视频",this.selectVid)
      this.$axios.get("review/findReviewByVid/"+this.selectVid).then(res => {
        console.log('表格数据',res.data.data)
        this.tableData = res.data.data
      })
    }
  }

}
</script>
<style>

</style>