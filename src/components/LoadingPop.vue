<template>
    <div class="loading-box">
        <div class="loader">
            <div class="loader-logo"></div>
            <div class="text">Loading page</div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style lang='scss' scoped>
.loading-box {
  position: fixed;
  top: calc(50vh - 110px);
  left: calc(50vw - 200px);
  width: 400px;
  height: 220px;
  background-color: rgba($primary-bg-rgb, $alpha: 0.90);
  border: 3px solid rgba($secondary-text-rgb, 0.1);
  z-index: 200;

  .loader {
    display: flex;
    justify-content: center;
    font-family: "letter-font", Serif;
    padding: 80px;

    .loader-logo {
      position: relative;
      top: 0;
      left: 0;
    }

    .text {
      text-align: center;
      color: rgba($primary-text-rgb, 1);
      font-size: 22px;
      font-weight: 600;
      margin-left: 20px;
      line-height: 56px;
    }
  }
}
</style>