<template>
  <div class="cross-wrap">
    <div class="cross">
      <PopHeader title="Cross chain in" @click="props.close()" />
      <div class="w-full flex items-center">
        <div class="w-full flex-1 p-7">
          <div class="chain-path">&nbsp;From</div>
          <div class="chain-title flex items-center">
            <img src="/imgs/chainBifrost.svg" class="mr-3">
            Biforst
          </div>
        </div>
        <i class="iconfont to-chain">&#xe7d8;</i>
        <div class="w-full flex-1 p-7">
          <div class="chain-path text-right">To&nbsp;&nbsp;</div>
          <div class="chain-title flex justify-end items-center">
            WeTEE
            <img src="/imgs/chainWetee.svg" class="ml-3">
          </div>
        </div>
      </div>
      <div class="split"></div>
      <div class="w-full flex items-center relative text-center p-7">
        <div class="flex flex-col justify-between items-center">
          <span class="flex items-center token-title">
            <img src="/imgs/vStaking/vDOT.svg" class="token-icon">
            <div class="flex flex-col">
              <span class="text-left font-bold">vDOT</span>
              <span class="text-left">
                Available&nbsp;&nbsp;{{ vAmount.free }}
              </span>
            </div>
          </span>
        </div>
        <div class=" flex flex-1 items-center in-input">
          <input type="number" class="w-full text-right mr-2" placeholder="0.0" :value="value" @input="onValue">
          <div class="max-btn">
            Max
          </div>
        </div>
      </div>
      <div class="split"></div>
      <div class="w-full p-7">
        <div class="dest">Destination Address</div>
        <div class="address">{{ userStore.userInfo.addr }}</div>
      </div>
      <div class="split"></div>
      <div class="w-full p-7">
        <div class="flex items-center mb-1">
          <div>Powered by</div>
          <div class="flex-1 text-right flex justify-end">
            <div class="xcm">Polkadot - XCM</div>
          </div>
        </div>
        <div class="flex items-center">
          <div>Fee</div>
          <div class="flex-1 text-right">0 vDOT</div>
        </div>
      </div>
      <div class="split"></div>
      <div class="flex flex-col items-center justify-center">
        <button type="button" class="submit ">
          <div>Cross in</div>
        </button>
      </div>
    </div>
    <div class="login-pop-mask"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { BN } from "@polkadot/util";

import PopHeader from "@/components/PopHeader.vue";
import { useGlobalStore } from "@/stores/global";
import { getNumberfromChain, getNumstrfromChain } from "@/utils/chain";

const props = defineProps(["router", "store", "close", "app"])
const valueSlider = ref(0)
const value = ref()
const targetValue = ref()
const vassetId = ref(5000)
const userStore = useGlobalStore()
const vtoken2token = ref()
const vAmount = ref<any>({})
const dAmount = ref<any>({})

const onValue = (e: any) => {
  valueSlider.value = getNumberfromChain(e.target.value).mul(new BN(100)).div(getNumberfromChain(vAmount.value.free)).toNumber()
  value.value = e.target.value

  targetValue.value = value.value * vtoken2token.value[1][0] / vtoken2token.value[1][1]
}

onMounted(async () => {
  // 获取资产信息 
  let assetsList = await weteeHttpApi().entries("asset", "assetsInfo");
  let assets: any = {};
  assetsList.forEach(({ keys, value }: any) => {
    assets[getNumstrfromChain(keys[0])] = value;
  });

  let cvtoken2token: any = await weteeHttpApi().query("fairlanch", "vtoken2token", [vassetId.value]);
  vtoken2token.value = cvtoken2token;

  let vamount = await weteeHttpApi().query("tokens", "accounts", [userStore.userInfo.addr, vassetId.value]);
  vAmount.value = vamount.toHuman();

  let amount = await weteeHttpApi().query("tokens", "accounts", [userStore.userInfo.addr, getNumberfromChain(cvtoken2token[0])]);
  dAmount.value = amount.toHuman();
})

const weteeHttpApi = () => {
  const g = props.app!.config.globalProperties;
  return g.$getWeteeHttpApi();
}
</script>

<style lang="scss" scoped>
.cross-wrap {
  width: 100%;
  height: 100vh;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  .cross {
    max-width: 450px;
    width: 100%;
    padding-bottom: 20px;
    background-color: rgba($primary-bg-rgb, $alpha: 1);
    border: 3px solid rgba($primary-text-rgb, 0.2);
    font-size: 15px;
  }

  .chain-path {
    margin-bottom: 10px;
  }

  .to-chain {
    font-size: 20px;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #5757572b;
  }

  .chain-title {
    img {
      width: 38px;
      border: 4px solid #5757577a;
      border-radius: 50%;
    }
  }

  .token-title {
    font-size: 14px;
    line-height: 1.3;
  }

  .dest {
    font-size: 14px;
    color: rgba($primary-text-rgb, $alpha: 1);
    font-weight: bold;
  }

  .address {
    font-size: 13px;
  }

  .split {
    height: 1px;
    width: 100%;
    background-color: rgba($secondary-text-rgb, 0.08);
    text-align: center;
  }

  .token-icon {
    height: 39px;
    margin-right: 8px;
    display: block;
    position: relative;
    top: -1px;
  }

  .in-input {
    position: relative;

    input {
      background-color: transparent;
      height: 40px;
      font-size: 18px;
      outline: none;
      color: #ffffff;
    }

    input[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input::-webkit-input-placeholder {
      color: #ffffff9b;
    }

    input:-ms-input-placeholder {
      color: #ffffff9b;
    }

    input::placeholder {
      color: #ffffff9b;
    }

    .max-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      font-size: 16px;
      margin-left: 5px;
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

  .xcm {
    padding: 6px 5px 5px 5px;
    line-height: 1;
    background-color: #e6007a;
    font-weight: bold;
  }

  .submit {
    background: rgba($primary-text-rgb, 0.2);
    width: 88%;
    padding: 10px 10px;
    margin-top: 20px;
    font-weight: bold;
    font-size: 18px;
  }
}
</style>