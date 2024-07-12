<template>
<div>
    <el-row >
      <el-col :span="5" v-for="abc in videos" :key="abc" style="height: 220px">
        <VideoItem :video="abc" :roominfo="roominfo"></VideoItem>
      </el-col>
    </el-row>
</div>
</template>

<script>
import VideoItem from "@/components/ChatRoomShowItem.vue";
export default {
    components: {
        VideoItem
    },
    data() {
        return {
            videos:[],
            roominfo:{}
        }
    },
    mounted() {
        this.$axios.get('chatroom/getChatroomInfo').then(response => {
            console.log(response.data)
            this.videos = response.data.data[0]
            this.roominfo = response.data.data[1]
            console.log(this.roominfo)
        })
    },
}
</script>
