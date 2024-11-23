<template>
  <div class="vstake-wrap">
    <div class="vstake">
      <PopHeader title="Vtoken stake" @click="props.close()" />
      <div class="flex flex-col items-center">
        <div class="w-full flex flex-col items-center relative text-center p-6">
          <div class="flex justify-between items-center mb-4 w-full">
            <span class="flex items-center">
              <img src="/imgs/vDOT.svg" alt="" class="w-6 h-6 mr-2">
              <span class="text-base font-bold">vDOT</span>
            </span>
            <span class="space-x-2 flex items-center">
              <span class="fonts-small-light-normal">Balance</span>
              <span class="fonts-small">0.0000</span>
              <span class="cursor-pointer flex items-center cross-in">
                <i class="iconfont">&#xe64a;</i>&nbsp;Cross in
              </span>
            </span>
          </div>
          <div class="flex w-full items-center in-input">
            <input type="number" class="w-full" placeholder="0.0" value="">
            <div class="max-btn">
              <button class="text-sm text-purple-normal font-medium">Max</button>
            </div>
          </div>
        </div>
        <div class="split">
          <i class="iconfont">&#xe7d8;</i>
        </div>
        <div class="flex-1 w-full flex flex-col items-center text-center p-6">
          <div class="flex items-center justify-between mb-4 w-full">
            <span class="flex items-center">
              <img src="/imgs/wDOT.svg" alt="" class="w-6 h-6 mr-2">
              <span class="text-base font-bold">DOT</span>
            </span>
            <span class="space-x-2 ">
              <span class="fonts-small-light-normal">Balance</span>
              <span class="fonts-small font-manrope">0.0000</span>
            </span>
          </div>
          <div class="flex w-full items-center in-input">
            <input type="number" placeholder="0.0" value="">
          </div>
        </div>
        <div class="split"></div>
        <button type="button" class="submit ">
          <div>Stake</div>
        </button>
      </div>
    </div>
    <div class="login-pop-mask"></div>
  </div>
</template>

<script lang="ts" setup>
import PopHeader from "@/components/PopHeader.vue";

const props = defineProps(["router", "store", "close", "app"])
</script>

<style lang="scss" scoped>
.vstake-wrap {
  width: 100%;
  height: 100vh;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;

  .vstake {
    width: 400px;
    padding-bottom: 20px;
    background-color: rgba($primary-bg-rgb, $alpha: 1);
    border: 3px solid rgba($primary-text-rgb, 0.2);
  }

  .fonts-small-light-normal {
    color: rgba($secondary-text-rgb, 0.6);
  }

  .split {
    height: 1px;
    width: 100%;
    background-color: rgba($secondary-text-rgb, 0.08);
    text-align: center;

    .iconfont {
      display: inline-block;
      font-size: 22px;
      height: 40px;
      width: 40px;
      line-height: 40px;
      text-align: center;
      background-color: rgba($primary-bg-rgb, $alpha: 1);
      border: 2px solid rgba($secondary-text-rgb, 0.08);
      position: relative;
      top: -20px;
      transform: rotate(90deg);
    }
  }

  .in-input {
    position: relative;

    input {
      background-color: transparent;
      height: 40px;
      font-size: 26px;
      width: 100%;
      text-indent: 1px;
      outline: none;
      color: #ffffff88;
    }

    input[type="number"] {
      -moz-appearance: textfield;
      /* Firefox */
      appearance: textfield;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      /* Safari */
      margin: 0;
    }

    .max-btn {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      background-color: rgba($primary-bg-rgb, $alpha: 1);
    }
  }

  .cross-in {
    background: rgba($primary-text-rgb, 0.2);
    padding: 0 6px;
    font-size: 14px;
    font-weight: bold;

    .iconfont {
      font-size: 18px;
      display: inline-block;
    }
  }

  .submit {
    background: rgba($primary-text-rgb, 0.2);
    width: 90%;
    padding: 5px 10px;
    margin-top: 20px;
  }
}
</style>