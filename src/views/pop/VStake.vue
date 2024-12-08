<template>
  <div class="vstake-wrap">
    <div class="vstake">
      <PopHeader title="Vtoken stake" @click="props.close()" />
      <div class="flex flex-col items-center">
        <div class="w-full flex flex-col items-center relative text-center p-7">
          <div class="flex justify-between items-center mb-4 w-full">
            <span class="flex items-center token-title">
              <img :src="'/imgs/vStaking/' + assetInfo(vassetId.toString()).metadata.name + '.svg'" alt=""
                class="token-icon">
              <span class="text-base">{{ assetInfo(vassetId.toString()).metadata.name }}</span>
            </span>
            <span class="space-x-2 flex items-center">
              <span class="fonts-small-light-normal">Balance</span>
              <span class="fonts-small">{{ showWTE(new BN(vAmount.free)) }}</span>
              <span class="cursor-pointer flex items-center cross-in" @click="corssIn">
                <i class="iconfont">&#xe64a;</i>&nbsp;Cross in
              </span>
            </span>
          </div>
          <div class="flex w-full items-center in-input pb-4">
            <input type="number" class="w-full" placeholder="0.0" :value="value" @input="onValue">
            <div class="max-btn">
              <button class="text-sm text-purple-normal font-medium" @click="max">Max</button>
            </div>
          </div>
          <NSlider class="pb-5" :value="valueSlider" :step="5" @UpdateValue="onValueSlider" />
        </div>
        <div class="split">
          <i class="iconfont">&#xe7d8;</i>
        </div>
        <div class="flex-1 w-full flex flex-col items-center text-center p-7">
          <div class="flex items-center justify-between mb-4 w-full">
            <span class="flex items-center token-title">
              <img :src="'/imgs/vStaking/' + assetInfo(vtoken2token[0]).metadata.name + '.svg'" class="token-icon">
              <span class="text-base">{{ assetInfo(vtoken2token[0]).metadata.name }}</span>
            </span>
            <span class="space-x-2 ">
              <span class="fonts-small-light-normal">Balance</span>
              <span class="fonts-small font-manrope">{{ dAmount.free ? showWTE(new BN(dAmount.free)) : "-" }}</span>
            </span>
          </div>
          <div class="flex w-full items-center in-input">
            <input type="number" v-model="targetValue" placeholder="0.0" disabled>
          </div>
        </div>
        <div class="split"></div>
        <button class="submit" type="button" :disabled="value == 0" @click="submit">
          <div>Stake</div>
        </button>
      </div>
    </div>
    <div class="login-pop-mask"></div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import { NSlider } from 'naive-ui'

import PopHeader from "@/components/PopHeader.vue";
import { useGlobalStore } from "@/stores/global";
import { getBnFromChain, getNumstrfromChain, WTE, showWTE } from "@/utils/chain";
import { BN } from "@polkadot/util";
import { getHttpApi } from "@/plugins/chain";

const props = defineProps(["router", "close", "app"])
const valueSlider = ref(0)
const value = ref()
const targetValue = ref()
const vassetId = ref(5000)
const assetsInfo = ref<any>({})
const userStore = useGlobalStore()
const vtoken2token = ref<any>([0, [1, 1]])
const vAmount = ref<any>({})
const dAmount = ref<any>({})

const onValue = (e: any) => {
  let v = removeNonNumericAndHandleMultipleDecimals(e.target.value);
  if (v == "") {
    nextTick(() => {
      value.value = ""
      valueSlider.value = 0
      targetValue.value = 0
    })
    return
  }

  let slider = parseFloat(v) * 100 / showWTE(getBnFromChain(vAmount.value.free))
  valueSlider.value = slider
  if (v.indexOf(".")) {
    value.value = "" + parseFloat(parseFloat(v).toFixed(5))
  } else {
    value.value = v
  }

  targetValue.value = value.value * vtoken2token.value[1][0] / vtoken2token.value[1][1]

  if (slider >= 100) {
    nextTick(() => {
      valueSlider.value = 100
      value.value = ""
      targetValue.value = value.value * vtoken2token.value[1][0] / vtoken2token.value[1][1]
    })
  }
}

const onValueSlider = (e: any) => {
  valueSlider.value = e

  value.value = showWTE(getBnFromChain(vAmount.value.free)) * parseFloat(e) / 100
  targetValue.value = value.value * vtoken2token.value[1][0] / vtoken2token.value[1][1]
}

const corssIn = () => {
  //@ts-ignore
  window.$app.$CrossIn()
}

const assetInfo = (id: string) => {
  if (assetsInfo.value[id]) {
    return assetsInfo.value[id]
  }
  return { metadata: {} }
}

const max = () => {
  onValueSlider(100)
}

const submit = async () => {
  const chain = getChain();
  const client = chain.client;
  const signer = userStore.userInfo.addr;

  try {
    const unix = 1000000
    const v = parseFloat(value.value) * unix
    const tx = client.tx.fairlanch.vStaking(vassetId.value, new BN(v).mul(new BN(WTE)).div(new BN(unix)))
    await chain.SignAndSend(tx, signer, () => {
      //@ts-ignore
      window.$app.$notification["success"]({
        content: 'Success',
        meta: "Staking successful, the staking rewards will be calculated in the next cycle.",
        duration: 2500,
        keepAliveOnHover: true
      })
      props.close();
    }, () => {
    })
  } catch (e: any) {
    //@ts-ignore
    window.$app.$notification["error"]({
      content: 'Error',
      meta: "" + e.toString(),
      duration: 2500,
      keepAliveOnHover: true
    })
  }
}

onMounted(async () => {
  // 获取资产信息 
  let assetsList = await getHttpApi().entries("asset", "assetsInfo", []);
  let assets: any = {};
  assetsList.forEach(({ keys, value }: any) => {
    assets[getNumstrfromChain(keys[0])] = value;
  });
  assetsInfo.value = assets;

  let cvtoken2token: any = await getHttpApi().query("fairlanch", "vtoken2token", [vassetId.value]);
  vtoken2token.value = cvtoken2token;

  let vamount = await getHttpApi().query("tokens", "accounts", [userStore.userInfo.addr, vassetId.value]);
  vAmount.value = vamount;

  let amount = await getHttpApi().query("tokens", "accounts", [userStore.userInfo.addr, getNumstrfromChain(cvtoken2token[0])]);
  dAmount.value = amount;
})

const getChain = (): any => {
  const g = props.app!.config.globalProperties;
  const chain = g.$getChain();
  return chain
}

function removeNonNumericAndHandleMultipleDecimals(str: string) {
  let result = str.replace(/[^0-9\.]/g, '');

  let decimalIndex = result.indexOf('.');
  if (decimalIndex !== -1) {
    result = result.substring(0, decimalIndex + 1) + result.substring(decimalIndex + 1).replace(/\./g, '');
  }
  return result;
}

</script>

<style lang="scss" scoped>
.vstake-wrap {
  width: 100%;
  height: 100vh;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;

  .vstake {
    max-width: 450px;
    width: 100%;
    padding-bottom: 20px;
    background-color: rgba($primary-bg-rgb, $alpha: 1);
    border: 3px solid rgba($primary-text-rgb, 0.2);
    font-size: 15px;
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
      height: 60px;
      width: 60px;
      line-height: 60px;
      text-align: center;
      background-color: rgba($primary-bg-rgb, $alpha: 1);
      position: relative;
      top: -30px;
      transform: rotate(90deg);
    }
  }

  .token-title {
    // background: #8686861a;
    // padding: 9px 0px;
    // border-radius: 42px;

    span {
      font-size: 17px;
      font-weight: 700;
      display: block;
      margin-right: 5px;
    }
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
      font-size: 28px;
      width: 100%;
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
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
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
    width: 88%;
    padding: 10px 10px;
    margin-top: 20px;
    font-weight: bold;
    font-size: 18px;

    &:disabled {
      color: #747474;
      background-color: rgba(40, 40, 40, 0.242);
    }
  }
}
</style>