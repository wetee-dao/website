<template>
  <div class="cross-wrap">
    <div class="cross">
      <PopHeader :title="'Cross out to ' + to.name" @click="props.close()" />
      <div class="w-full flex items-center">
        <div class="w-full flex-1 p-7">
          <div class="chain-path">&nbsp;From</div>
          <div class="chain-title flex items-center">
            <img src="/imgs/chainWetee.svg" class="mr-3">
            WeTEE
          </div>
        </div>
        <i class="iconfont to-chain" @click="opposite()">&#xe696;</i>
        <div class="w-full flex-1 p-7">
          <div class="chain-path text-right">To&nbsp;&nbsp;&nbsp;</div>
          <div class="chain-title flex justify-end items-center">
            {{ to.name }}
            <img :src="to.icon" class="ml-3">
          </div>
        </div>
      </div>
      <div class="split"></div>
      <div class="w-full flex items-center relative text-center p-7">
        <div class="flex flex-col justify-between items-center">
          <span class="flex items-center token-title">
            <img :src="'/imgs/vStaking/' + params.symbol + '.svg'" class="token-icon">
            <div class="flex flex-col">
              <span class="text-left font-bold">{{ params.symbol }}</span>
              <span class="text-left amount-value">
                available:&nbsp;{{ showToken(new BN(fromAmount.free),
                  assetInfo.metadata.decimals) }}
              </span>
            </div>
          </span>
        </div>
        <div class=" flex flex-1 items-center in-input">
          <input type="number" class="w-full text-right mr-2" placeholder="0.0" :value="value" @input="onValue">
          <div class="max-btn" @click="max">
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
          <div class="flex-1 text-right">{{ fee }}</div>
        </div>
      </div>
      <!-- <div class="split"></div> -->
      <div class="flex flex-col items-center justify-center">
        <button type="button" :disabled="!value || parseFloat(value) < 0.1" class="submit " @click="submit(false)">
          <div>Cross out</div>
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
import { getNumstrfromChain, showToken } from "@/utils/chain";
import { $getChainProvider, getConfig, getHttpApi } from "@/plugins/chain";

const props = defineProps(["close", "params"])
const params: any = ref(props.params);
const chainId = ref("")
const value = ref()
const userStore = useGlobalStore()
const fromAmount = ref<any>({})
const para_id = ref("0")
const config = getConfig()
const to = ref(config.Chains[para_id.value])
const assetInfo = ref({
  metadata: { decimals: 0 }
})
const fee = ref("-")

onMounted(async () => {
  // 获取资产的 ParaId
  let assetParaIds = await getHttpApi().entries("asset", "assetParaIds", []);
  assetParaIds.forEach(({ keys, value }: any) => {
    if (getNumstrfromChain(keys[0]) == params.value.asset_id) {
      para_id.value = getNumstrfromChain(value)
      to.value = config.Chains[para_id.value]
    }
  });

  // 获取资产余额
  let t = await getHttpApi().query("tokens", "accounts", [userStore.userInfo.addr, parseInt(params.value.asset_id)]);
  fromAmount.value = t;

  // 获取链ID
  chainId.value = getNumstrfromChain(await getHttpApi().query("asset", "chainID", []));

  // 获取资产信息
  assetInfo.value = await getHttpApi().query("asset", "assetInfos", [params.value.asset_id]);
})

const onValue = (e: any) => {
  value.value = e.target.value

  submit(true)
}

const max = () => {
  value.value = showToken(new BN(fromAmount.value.free), assetInfo.value.metadata.decimals)
}

const opposite = () =>{
  const symbol = params.value.symbol;
  const asset_id = params.value.asset_id;
  props.close();
  window.$app.$CrossIn({
    asset_id: asset_id,
    symbol: symbol,
  }, () => {

  })
}

const submit = async (isTry: boolean = false) => {
  const chainConfig = config.Chains[para_id.value]
  const isParent = chainConfig.isParent;

  const unix = 1000000
  const v = parseFloat(value.value) * unix
  const bnv = new BN(v).mul(new BN(10).pow(new BN(assetInfo.value.metadata.decimals))).div(new BN(unix))

  await $getChainProvider(async (chain): Promise<void> => {
    const api = chain.client;
    const signer = userStore.userInfo.addr;

    let call = api!.tx.xTokens.transfer(
      params.value.asset_id,
      bnv,
      isParent ? {
        V2: {
          parents: 1,
          interior: {
            X1: {
              AccountId32: {
                network: null,
                id: api!.createType('AccountId32', signer).toHex(),
              }
            }
          },
        },
      } : {
        V2: {
          parents: 0,
          interior: {
            X2: [
              {
                Parachain: parseInt(para_id.value)
              },
              {
                AccountId32: {
                  network: null,
                  id: api!.createType('AccountId32', signer).toHex(),
                }
              }
            ]
          }
        }
      },
      "Unlimited"
    )

    if (isTry) {
      let info = await call.paymentInfo(signer)
      let v = showToken(info.partialFee.toBn(), api!.registry.chainDecimals[0])

      fee.value = v +" "+ api!.registry.chainTokens[0];
      return
    }

    try {
      await chain.signAndSend(call, signer, () => {
        window.$notification["success"]({
          content: 'Success',
          meta: "Staking successful, the staking rewards will be calculated in the next cycle.",
          duration: 2500,
          keepAliveOnHover: true
        })
        props.close();
      }, () => {

      })
    } catch (e: any) {

    }
  },undefined,isTry)
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
  background-color: rgba(0, 0, 0, 0.83);
  display: flex;
  align-items: center;
  justify-content: center;

  .cross {
    max-width: 450px;
    width: 100%;
    padding-bottom: 20px;
    background-color: rgba($primary-bg-rgb, $alpha: 1);
    border: 3px solid rgba($accent-color, 0.33);
    font-size: 15px;
  }

  .amount-value {
    font-size: 12px;
  }

  .chain-path {
    margin-bottom: 10px;
  }

  .to-chain {
    font-size: 20px;
    width: 40px;
    height: 40px;
    margin-top: 28px;
    text-align: center;
    line-height: 40px;
    background: rgba($secondary-text-rgb, 0.03);
    cursor: pointer;
  }

  .chain-title {
    img {
      width: 38px;
      height: 38px;
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
    color: rgba($accent-color, $alpha: 0.5);
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
      padding: 0 10px;
      background-color: rgba($accent-color, $alpha: 0.2);
      border-radius: 2px;
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
    background: rgba($accent-color, 0.7);
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