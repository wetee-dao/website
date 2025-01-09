<template>
  <div class="tokens">
    <div class="container section-first">
      <div class="flex items-center bg-transparent mt-7">
        <div class="cross-icon flex items-center">
          <Cross />
        </div>
        <div class="title flex-1">
          <h1 class="page-title">Cross-chain asset transfer</h1>
          <p>Through Polkadot transferring parallel chain assets for computing power and cross.</p>
        </div>
        <!-- <div class="tcross flex">
            <i class="iconfont">&#xe68a;</i>
            <div class="flex flex-col">
              <h1>My total WTE</h1>
              <p>{{ showWTE(getBnFromChain(amount.free)) }} <span class="total_unit">WTE</span></p>
            </div>
          </div>
          <div class="daily flex pl-10">
            <i class="iconfont">&#xe60d;</i>
            <div class="flex flex-col">
              <h1>My Daily Reward</h1>
              <p>1
                <span class="total_unit">WTE</span>
              </p>
            </div>
          </div> -->
      </div>
    </div>

    <div class="container">
      <div class="flex cross-box bg-transparent items-center">
        <div class="icon flex items-center">
          <!-- <img src="/imgs/vDOT.svg" alt="" /> -->
        </div>
        <div class="title min-w-[100px] flex-[2_2_0%] flex flex-col justify-center items-center"></div>
        <div class="title min-w-[100px] flex-1 flex flex-col justify-center items-center">
          Balance
        </div>
        <div class="max-w-[250px] min-w-[250px] flex-1 flex text-left">
          Action
        </div>
      </div>
      <loadingBox class="loader-wrapper" text="Loading crosss ..." v-if="loader == 0" />
      <div class="flex cross-box items-center" v-for="(chainAsset, _) in chainAssetsData">
        <div class="icon flex items-center"
          :style="'background-image: url(\'/imgs/vStaking/' + chainAsset.metadata.symbol.replaceAll(' ', '') + '.svg\')'">
        </div>
        <div class="title flex-[2_2_0%] min-w-[100px] flex flex-col justify-center ">
          <h1>{{ chainAsset.metadata.name }}</h1>
        </div>
        <div class="title min-w-[100px] flex justify-center items-center flex-1">
          <h1 class="!text-center">{{ showToken(new BN(amounts[chainAsset.id]||0), chainAsset.metadata.decimals) }}</h1>
          <span class="unit">{{ chainAsset.metadata.symbol }}</span>
        </div>
        <div class="max-w-[250px] min-w-[250px] flex-1 flex justify-start items-center">
          <div class="action flex justify-center items-center" @click="crossIn(chainAsset)">
            Cross In
            <i class="iconfont">&#xe602;</i>
          </div>
          <div class="uncross action flex justify-center items-center" @click="crossOut(chainAsset)">
            Cross Out
            <i class="iconfont">&#xe602;</i>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { getNumstrfromChain, showToken } from '@/utils/chain';
import { onMounted, onUnmounted, ref } from 'vue';

import loadingBox from "@/components/loading-box.vue";
import { getHttpApi } from '@/plugins/chain';
import { useGlobalStore } from '@/stores/global';
import Cross from "@/components/svg/Cross.vue";
import useGlobelProperties from '@/plugins/globel';
import { BN } from '@polkadot/util';
const global = useGlobelProperties();
const loader = ref(0)

const chainAssetsData = ref<any[]>([]);
const amounts = ref<any>({});
const userStore = useGlobalStore();
const address = ref<string>(userStore.userInfo ? userStore.userInfo.addr : "");

userStore.$subscribe((mutation, state) => {
  if (!state.userInfo) {
    address.value = "";
    initData();
  } else if (address.value != state.userInfo.addr) {
    address.value = state.userInfo.addr;

    initData();
  }
}, { detached: true })

const crossIn = (item: any) => {
  global.$CrossIn({
    asset_id: item.id,
    symbol: item.metadata.symbol.replaceAll(' ', ''),
    // para_id: item.paraId,
  }, () => {
    startInit();
  })
}

const crossOut = (item: any) => {
  window.$app.$CrossOut({
    asset_id: item.id,
    symbol: item.metadata.symbol.replaceAll(' ', ''),
    // para_id: item.paraId,
  }, () => {
    startInit();
  })
}

const startInit = async () => {
  await initData();
  setTimeout(() => {
    initData();
  }, 6000)
}

onMounted(async () => {
  await initData();
})

onUnmounted(async () => {

})

const initData = async () => {
  // 获取资产信息 
  let assetsList = await getHttpApi().entries("asset", "assetInfos", []);
  let assets: any = {};
  assetsList.forEach(({ keys, value }: any) => {
    assets[getNumstrfromChain(keys[0])] = value;
  });

  // 获取链上资产 ParaId
  let assetParaIds = await getHttpApi().entries("asset", "assetParaIds", []);
  let cassets: any[] = [];
  assetParaIds.forEach(({ keys, value }: any) => {
    let assetId = getNumstrfromChain(keys[0]);
    cassets.push({ id: assetId, paraId: getNumstrfromChain(value), ...assets[assetId] })
  });
  chainAssetsData.value = cassets;
  loader.value = 1;

  // 获取链上资产
  let camounts: any = {};
  for (let i = 0; i < cassets.length; i++) {
    let item = cassets[i];
    let t = await getHttpApi().query("tokens", "accounts", [userStore.userInfo.addr, parseInt(item.id)]);
    camounts[item.id] = t.free.toString();
  }
  amounts.value = camounts;
}

</script>

<style lang="scss" scoped>
.tokens {
  padding-top: 100px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.page-title {
  font-size: 30px !important;
  margin-top: -6px;
}

.cross-box {
  padding: 25px 15px;
  margin-bottom: 20px;
  background-color: rgba(33, 33, 33, 0.5);
  font-size: 16px;
  min-width: 800px;

  &.bg-transparent {
    background-color: transparent;
    margin-bottom: -30px;
    margin-top: -10px;
    color: #878787;
    font-size: 18px;
  }
}

.cross-icon {
  padding-left: 0;
  margin-right: 20px;
  background-color: rgba($secondary-text-rgb, 0.04);

  svg {
    margin: 15px;
    width: 60px;
    height: 60px;
  }
}

.icon {
  margin-left: 8px;
  margin-right: 20px;
  width: 45px;
  height: 45px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

.title {
  h1 {
    font-size: 17px;
    font-weight: bold;
  }

  p {
    font-size: 14px;
    line-height: 14px;
    color: rgba($secondary-text-rgb, 0.6);
  }
}

.unit {
  margin-left: 4px;
  color: #ffffff;
  font-size: 12px;
  line-height: 1;
  font-weight: bold;
  padding: 3px 4px;
  background-color: #5b4600;
  border-radius: 3px;
}

.total_unit {
  color: #ffde71;
}

.action {
  background-color: rgba($primary-text-rgb, 0.6);
  padding: 5px;
  cursor: pointer;
  width: 110px;

  .iconfont {
    font-size: 12px;
    margin-left: 3px;
  }
}

.uncross {
  background-color: rgba($accent-color, 0.3);
  margin-left: 10px;
}


.bottom {
  height: 30px;
  width: 100%;
}

.loader-wrapper {
  font-size: 5.2px;
  height: 80px;
  margin-top: -30px;
}
</style>