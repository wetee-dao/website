<template>
  <div class="title">
    <div class="flex-1">{{
      props.title
      }}</div>
    <i class="iconfont right">&#xe601;</i>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["title", "close"])
</script>

<style lang="scss" scoped>
.title {
  padding: 10px 20px;
  border-bottom: 2px solid rgba($secondary-text-rgb, 0.04);
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;

  .logo {
    width: 20px;
    margin-right: 10px;
    position: relative;
    top: -1px
  }

  .right {
    float: right;
    display: block;
    cursor: pointer;
    font-size: 25px;
    position: relative;
  }
}
</style>