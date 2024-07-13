<template>
  <div>
    <Header
      :hideLogo="true"
      :topColor="'#0e6ec9'"
      :enableSearch="true"
    />
  </div>
  <div style="margin-top: 100px;width: 100%">
    <el-row style="display: flex;">
      <div  style="width:100%;display: flex;align-items: center;margin-left: 20px;justify-content: space-around">
        <div>
          <img src="/src/assets/static/icons/历史通话记录.png" style="width: 50px;height: 50px"/>
          <span style="font-size: 20px;margin-left: 10px">播放记录</span>
        </div>
        <div @click="deleteAllRecord()">
          <div><el-icon size="20" style="color:#ff0000;margin-right: 4px"><DeleteFilled /></el-icon>清空历史记录</div>
        </div>
      </div>
    </el-row>
    <el-row justify="center" style="margin-top: 20px">
      <el-col :span="24" style="display: flex;justify-content: center">
        <el-timeline >
          <el-timeline-item :timestamp="record.time" placement="top" v-for="(record, index) in historyRecordTableDataList">
            <el-card>
              <el-row >
                <el-col :span="8">
                  <el-image :src="record.video.cover" style="width: 220px;height: 150px;margin:0 0 0 20px" />
                </el-col>
                <el-col :span="16">
                  <el-descriptions
                      :title="record.title"
                      :column="3"
                      size="default"
                      border

                  >
                    <template #extra>
                      <el-button type="danger" @click="deleteOneRecord(record.id)">删除</el-button>
                      <el-button type="primary" @click="toPlay(record.video)">查看</el-button>
                    </template>
                    <el-descriptions-item width="100px">
                      <template #label>
                        <div class="cell-item">
                          视频名称
                        </div>
                      </template>
                      {{ record.title }}
                    </el-descriptions-item>
                    <el-descriptions-item width="100px">
                      <template #label>
                        <div class="cell-item">
                          播放者
                        </div>
                      </template>
                      {{ record.name }}
                    </el-descriptions-item>
                    <el-descriptions-item width="100px">
                      <template #label>
                        <div class="cell-item">
                          播放次数
                        </div>
                      </template>
                      {{ record.playnums }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                        发布时间
                        </div>
                      </template>
                      <el-tag size="small">{{ record.uptime }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          播放时间
                        </div>
                      </template>
                      {{record.time}}
                    </el-descriptions-item>
                  </el-descriptions>
                </el-col>
              </el-row>

            </el-card>
          </el-timeline-item>

        </el-timeline>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import {MoreFilled} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
export default {
  data() {
    return {
      loading: true,
      records: [],
      sortKey: 'playTime',
      sortOrder: 'desc',
      searchKey:'',
      historyRecordTableDataList:[],
      // activities : [],
    };
  },
  computed: {
  },
  components:{
    Header
  },
  mounted() {
    this.getRecordsData()
  },
  methods: {
    getRecordsData(){
      this.$axios.get('history/getHistoryRecord').then(res => {
        console.log('获取的历史记录', res.data.data)

        for (const record of res.data.data) {
          console.log('记录数据',record)
          // 构建表格数据格式
          let historyRecordTableData = {
            id: record.tvideoPlayRecord.id,
            name:JSON.parse(window.localStorage.getItem("user")).account,
            cover: record.video.cover,
            title: record.video.title,
            time: this.formatISOToCustom(record.tvideoPlayRecord.time),
            playnums: record.tvideoPlayRecord.playnums,
            uptime: record.video.uptime,
            tvideoPlayRecord: record.tvideoPlayRecord,
            video: record.video
          }
          this.historyRecordTableDataList.push(historyRecordTableData)
          // //   构建时间线格式
          // let activity = {
          //   content: record.video.title,
          //   timestamp: record.tvideoPlayRecord.time,
          //   size: 'large',
          //   type: 'primary',
          //   video: record.video,
          //   tvideoPlayRecord: record.tvideoPlayRecord,
          //   time: this.formatISOToCustom(record.tvideoPlayRecord.time)
          // }
          // this.activities.push(activity)
        }
      })
    },
    deleteAllRecord(){
      ElMessageBox.confirm(
          '确定删除所有的播放历史记录?',
          '清空记录',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            this.$axios.get('history/deleteAllHistoryRecord').then(res => {
              if(res.data.code==200){
                ElMessage({
                  type: 'success',
                  message: '删除成功',
                })
                this.historyRecordTableDataList=[]
              }
              else {
                ElMessage({
                  type: 'error',
                  message: '删除失败',
                })
              }
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消删除',
            })
          })
    },
    deleteOneRecord(id){
      ElMessageBox.confirm(
          '确定删除这条播放历史记录?',
          '删除播放记录',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            this.$axios.get('history/deleteHistoryRecord/'+id).then(res => {
              if(res.data.code==200){
                ElMessage({
                  type: 'success',
                  message: '删除成功',
                })
                this.historyRecordTableDataList = this.historyRecordTableDataList.filter(item => item.id !== id);
              }else{
                ElMessage({
                  type: 'error',
                  message: '删除失败',
                })
              }
            })

          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消删除',
            })
          })
    },
    toPlay(video) {
      this.$router.push({
        path: '/play/' + video.id
      })
    },
    //   时间格式转换
      formatISOToCustom(isoTime) {
        let date = new Date(isoTime);

        let year = date.getUTCFullYear();
        let month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
        let day = ("0" + date.getUTCDate()).slice(-2);
        let hours = ("0" + date.getUTCHours()).slice(-2);
        let minutes = ("0" + date.getUTCMinutes()).slice(-2);
        let seconds = ("0" + date.getUTCSeconds()).slice(-2);

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
    }
};
</script>

<style scoped>
.history-playback {
  max-width: 800px;
  margin: 0 auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
