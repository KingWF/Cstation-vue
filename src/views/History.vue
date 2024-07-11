<template>
  <div>
    <Header
      :hideLogo="true"
      :topColor="'#0e6ec9'"
      :enableSearch="true"
    />
  </div>
  <div style="margin-top: 100px;">
    <el-row style="width: 100%;display: flex;justify-content: space-around" >
      <el-col :span="6" style="display: flex;flex-direction: column;align-items: center;margin-left: 20px">
        <div>
          <img src="/src/assets/static/icons/历史通话记录.png" style="width: 50px;height: 50px"/>
          <span style="font-size: 20px;margin-left: 10px">播放记录</span>
        </div>
      </el-col>
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
export default {
  data() {
    return {
      loading: true,
      records: [],
      sortKey: 'playTime',
      sortOrder: 'desc',
      searchKey:'',
      historyRecordTableDataList:[],
      activities : []
    };
  },
  computed: {
    sortedRecords() {
      return this.records.slice().sort((a, b) => {
        if (this.sortOrder === 'asc') {
          return a[this.sortKey] > b[this.sortKey] ? 1 : -1;
        } else {
          return a[this.sortKey] < b[this.sortKey] ? 1 : -1;
        }
      });
    }
  },
  components:{
    Header
  },
  mounted() {
    this.$axios.get('history/getHistoryRecord').then(res => {
      console.log('获取的历史记录', res.data.data)

      for (const record of res.data.data) {
        console.log('记录数据',record)
        // 构建表格数据格式
        let historyRecordTableData = {
          name:JSON.parse(window.localStorage.getItem("user")).account,
          cover: record.video.cover,
          title: record.video.title,
          time: record.tvideoPlayRecord.time,
          playnums: record.tvideoPlayRecord.playnums,
          uptime: record.video.uptime,
          tvideoPlayRecord: record.tvideoPlayRecord,
          video: record.video
        }
        this.historyRecordTableDataList.push(historyRecordTableData)
      //   构建时间线格式
        let activity = {
          content: record.video.title,
          timestamp: record.tvideoPlayRecord.time,
          size: 'large',
          type: 'primary',
          video: record.video,
          tvideoPlayRecord: record.tvideoPlayRecord
        }
        this.activities.push(activity)
      }
      console.log('结果',this.historyRecordTableDataList[0].video.cover)
    })
  },
  methods: {
    toPlay(video){
      this.$router.push({
        path: '/play/'+video.id
      })
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
