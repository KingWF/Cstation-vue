<script setup>

import { ref} from 'vue'
const emojiList = ref([
  {value: '😀'},
  {value: '😃'},
  {value: '😄'},
  {value: '😆'},
  {value: '😅'},
  {value: '🤣'},
  {value: '😂'},
  {value: '🙂'},
  {value: '🙃'},
  {value: '🫠'},
  {value: '😉'},
  {value: '😊'},
  {value: '😇'},
  {value: '🥰'},
  {value: '😍'},
  {value: '🤩'},
  {value: '😘'},
  {value: '😗'},
  {value: '😚'},
  {value: '🥲'},
  {value: '😋'},
  {value: '😛'},
  {value: '🤪'},
  {value: '🤑'},
  {value: '🤗'},
  {value: '🤭'},
  {value: '🫢'},
  {value: '🤔'},
  {value: '🫡'},
  {value: '🤨'},
  {value: '😪'},
  {value: '🙄'},
  {value: '😴'},
  {value: '🤮'},
  {value: '🥴'},
  {value: '🥳'},
  {value: '🤓'},
  {value: '🧐'},
  {value: '😨'},
  {value: '😰'},
  {value: '😭'},
  {value: '😣'},
  {value: '😞'},
  {value: '😓'},
  {value: '😤'},
  {value: '😡'},
  {value: '💩'},
  {value: '🤡'},
  {value: '💓'},
  {value: '💔'},
  {value: '💋'},
  {value: '💥'},
  {value: '💤'},
  {value: '👍'},
  {value: '👎'},
  {value: '👊'},
  {value: '👏'},
  {value: '👀'},
  {value: '👅'},
  {value: '💤'},
  {value: '🚩'},
  {value: '🏳️'},
  {value: '🏴‍☠️'},
  {value: '🏳️‍⚧️'},

])

</script>

<template>
    <div class="emoji-select-container">
        <div class="emoji-select" v-for="item in emojiList" :key="item.value">
            <button class="emoji-btn" @click="$emit('select', item.value)">{{item.value}}</button>
        </div>
    </div>
</template>

<style scoped>
.emoji-select-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-wrap: wrap;
    width: 500px;
}
.emoji-select {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    margin-top: 20px;
    flex-direction: row;
    .emoji-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        font-size: 20px;
        border: none;
        background-color: #f5f5f5;
        cursor: pointer;
    }
    .emoji-btn:hover {
        scale: 1.1;
    }
}

</style>