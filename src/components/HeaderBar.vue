<template>
  <div class="top" v-show="isShow">
    <div class="top-tags">
      <div class="tag-left">
        <a
          v-for="(item, index) in tags"
          :key="index"
          :href="item.url"
          class="tag"
        >
          <div class="tagName">
            {{ item.name }}
          </div>
        </a>
      </div>
      <div class="scarch">
        <el-input
          v-model="input"
          style="width: 240px"
          placeholder="输入关键词~"
          class="search-input"
        />
      </div>
      <div class="tag-right">
        <a
          v-for="(item, index) in tags2"
          :key="index"
          :href="item.url"
          class="tag"
        >
          <div class="tagName">
            {{ item.name }}
          </div>
        </a>
      </div>
      <div class="log">
        <text> 登录</text>
      </div>
    </div>
  </div>

  <div class="hide-tag" v-show="!isShow">
    <div class="tag-left">
      <a
        v-for="(item, index) in tags"
        :key="index"
        :href="item.url"
        class="tag"
      >
        <div class="tagName">
          {{ item.name }}
        </div>
      </a>
    </div>
    <div class="scarch">
      <el-input
        v-model="input"
        style="width: 240px"
        placeholder="输入关键词~"
        class="search-input"
      />
    </div>
    <div class="tag-right">
      <a
        v-for="(item, index) in tags2"
        :key="index"
        :href="item.url"
        class="tag"
      >
        <div class="tagName">
          {{ item.name }}
        </div>
      </a>
    </div>
    <div class="log">
      <text> 登录</text>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const isShow = ref(false);

const input = ref("");
let tags = ref([
  {
    id: 1,
    name: "首页",
    url: "/",
  },
  {
    id: 2,
    name: "直播",
    url: "/page",
  },
  {
    id: 3,
    name: "漫画",
    url: "",
  },
  {
    id: 4,
    name: "赛事",
    url: "",
  },
  {
    id: 4,
    name: "番剧",
    url: "",
  },
  {
    id: 4,
    name: "其他",
    url: "",
  },
]);
let tags2 = ref([
  {
    id: 1,
    name: "消息",
    url: "/",
  },
  {
    id: 2,
    name: "收藏",
    url: "/page",
  },
  {
    id: 3,
    name: "历史",
    url: "",
  },
]);
</script>
<style lang="scss" scoped>
.top {
  // position: fixed;
  // top: 0;
  // left: 0;
  // z-index: 999;
}
.top-tags {
  width: 100%;
  height: 30px;
  position: absolute;
  display: flex;
  padding-bottom: 10px;
  background-color: rgba(51, 130, 104, 0.377);
  align-items: center;
}
.tag-left {
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  width: 40%;
}
.scarch {
  width: 20%;
  height: 20px;

  .search-input {
    border-radius: 20px;
  }
}
.tag-right {
  width: 35%;
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.log {
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
}
.tag {
  margin-top: 10px;
  color: rgb(255, 255, 255);
  font-size: 18px;
  /* 固定盒子尺寸 */
  width: 200px;
  /* 允许文字溢出 */
  overflow: hidden;
  /* 添加过渡效果 */
  transition: transform 0.3s ease;
  text-decoration: none;
}
.tag:hover {
  transform: scale(1.2); /* 放大1.2倍 */
}

.hide-tag {
  position: fixed;
  width: 100%;
  height: 30px;
  display: flex;
  padding-bottom: 10px;
  background-color: rgb(243, 243, 243);
  align-items: center;
  top: 0;
  left: 0;
  .tag {
    color: black;
  }
}
// 平缓下滑
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
