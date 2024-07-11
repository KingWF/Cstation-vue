<template>
  <el-skeleton style="width: 240px;padding: 10px" animated  >
    <template #template>
      <el-skeleton-item variant="image" style=" width: 85%;height: 140px;border-radius: 20px" />
      <div style="padding-top: 14px">
        <el-skeleton-item variant="p" style="width: 50%" />
        <div style="display: flex;align-items: center">
          <el-skeleton-item variant="text" style="width: 10%;margin-right: 16px" />
          <el-skeleton-item variant="text" style="width: 60%" />
        </div>
      </div>
    </template>
  </el-skeleton>
</template>
<script>

</script>

<style scoped>

</style>