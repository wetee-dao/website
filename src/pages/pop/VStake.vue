<template>
  <div class="vstake-wrap">
    <div class="vstake">
      <PopHeader :title="'Vtoken stake - ' + assetInfo(vassetId.toString()).metadata.symbol" @click="props.close()" />
      <div class="flex flex-col items-center">
        <div class="w-full flex flex-col items-center relative text-center p-7">
          <div class="flex justify-between items-center mb-4 w-full">
            <span class="flex items-center token-title">
              <img :src="'/imgs/vStaking/' + assetInfo(vassetId.toString()).metadata.symbol + '.svg'" alt=""
                class="token-icon">
              <span class="text-base">{{ assetInfo(vassetId.toString()).metadata.name }}</span>
            </span>
            <span class="space-x-2 flex items-center">
              <span class="fonts-small-light-normal">Balance</span>
              <span class="fonts-small">{{ showToken(new
                BN(vAmount.free), assetInfo(vassetId.toString()).metadata.decimals) }}</span>
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
          <i class="iconfont" @click="opposite()">&#xe696;</i>
        </div>
        <div class="flex-1 w-full flex flex-col items-center text-center p-7">
          <div class="flex items-center justify-between mb-4 w-full">
            <span class="flex items-center token-title">
              <img :src="'/imgs/vStaking/' + assetInfo(vtoken2token[0]).metadata.symbol + '.svg'" class="token-icon">
              <span class="text-base">{{ assetInfo(vtoken2token[0]).metadata.name }}</span>
            </span>
            <span class="space-x-2 ">
              <span class="fonts-small-light-normal">Balance</span>
              <span class="fonts-small font-manrope">{{ dAmount.free ? showToken(new
                BN(dAmount.free), assetInfo(vtoken2token[0]).metadata.decimals) : "-" }}</span>
            </span>
          </div>
          <div class="flex w-full items-center in-input">
            <input type="number" v-model="targetValue" placeholder="0.0" disabled>
          </div>
        </div>
        <div class="split"></div>
        <button class="submit" type="button" :disabled="!value || parseFloat(value) < 0.1" @click="submit">
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
import { getBnFromChain, getNumstrfromChain, showToken } from "@/utils/chain";
import { BN } from "@polkadot/util";
import { $getChainProvider, getHttpApi } from "@/plugins/chain";

const props = defineProps(["close", "params"])
const valueSlider = ref(0)
const value = ref()
const targetValue = ref()
const vassetId = ref(parseInt(props.params.vassetId))
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

  let slider = parseFloat(v) * 100 / showToken(getBnFromChain(vAmount.value.free), assetInfo(vassetId.value.toString()).metadata.decimals)
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

  value.value = showToken(getBnFromChain(vAmount.value.free), assetInfo(vassetId.value.toString()).metadata.decimals) * parseFloat(e) / 100
  targetValue.value = value.value * vtoken2token.value[1][0] / vtoken2token.value[1][1]
}

const startInit = async () => {
  await initData();
  setTimeout(() => {
    initData();
  }, 6000)
}

const corssIn = () => {
  let item = assetInfo(vassetId.value.toString())
  window.$app.$CrossIn({
    asset_id: vassetId.value,
    symbol: item.metadata.symbol.replaceAll(' ', ''),
  }, () => {
    startInit();
  })
}

const assetInfo = (id: string) => {
  if (id && assetsInfo.value[getNumstrfromChain(id)]) {
    return assetsInfo.value[getNumstrfromChain(id)]
  }
  return { metadata: {} }
}

const max = () => {
  onValueSlider(100)
}

const opposite = () =>{
  props.close();
  window.$app.$UnStake({
    assetId: vtoken2token.value[0],
  }, () => {

  })
}

const submit = async () => {
  await $getChainProvider(async (chain): Promise<void> => {
    const client = chain!.client!;
    const signer = userStore.userInfo.addr;
    const unix = 1000000
    const v = parseFloat(value.value) * unix
    const bv = new BN(v).mul(new BN(10).pow(new BN(assetInfo(vassetId.value.toString()).metadata.decimals))).div(new BN(unix))

    const tx = client.tx.fairlanch.vStaking(vassetId.value, bv)
    await chain.signAndSend(tx, signer, () => {
      window.$notification["success"]({
        content: 'Success',
        meta: "Staking successful, the staking rewards will be calculated in the next cycle.",
        duration: 10500,
        keepAliveOnHover: true
      })
      props.close();
    }, () => {

    })
  });
}

onMounted(() => {
  initData();
})

const initData = async () => {
  // 获取资产信息 
  let assetsList = await getHttpApi().entries("asset", "assetInfos", []);
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
      font-size: 25px;
      height: 60px;
      width: 60px;
      line-height: 60px;
      text-align: center;
      background-color: rgba($primary-bg-rgb, $alpha: 1);
      color: rgba($secondary-text-rgb, 0.6);
      position: relative;
      top: -30px;
      transform: rotate(90deg);
      cursor: pointer;
    }
  }

  .token-title {
    span {
      font-size: 17px;
      font-weight: 700;
      display: block;
      margin-right: 5px;
    }

    position: relative;
    &::after {
      content: ' ';
      background-color: #222;
      border-radius: 50%;
      width: 39px;
      height: 39px;
      position: absolute;
      z-index: 1;
    }
    img {
      z-index: 2;
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
    background: rgba($primary-text-rgb, 0.7);
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