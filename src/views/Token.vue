<template>
  <div class="tokens">
    <div class="container section-first">
      <div class="flex items-center staking-box !m-0">
        <div class="staking-icon flex items-center">
          <img src="/imgs/staking.svg"></img>
        </div>
        <div class="title flex-1">
          <h1>Token staking</h1>
          <p>100% fair launch staking, to fairly obtain WTE rewards.</p>
        </div>
        <div class="tstaking flex">
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
            <p>{{ showWTE(getTotalStakingReward(economicsData, stakingsData, blockRewardData)) }} <span
                class="total_unit">WTE</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container" v-if="loader != 0">
      <div class="flex staking-box bg-transparent items-center">
        <div class="icon flex items-center">
          <!-- <img src="/imgs/vDOT.svg" alt="" /> -->
        </div>
        <div class="title min-w-[100px] flex-[2_2_0%] flex flex-col justify-center items-center">

        </div>
        <div class="title min-w-[100px] flex-1 flex flex-col justify-center items-center">
          Reward Ratio
        </div>
        <div class="staking min-w-[100px] flex-1  flex flex-col justify-center items-center">
          TVS
        </div>
        <div class="mstaking min-w-[150px] flex-1 flex flex-col justify-center items-center text-center">
          My Staking / Pending Staking
        </div>
        <div class="daily min-w-[150px] flex-1 flex flex-col justify-center items-center">
          Daily Reward
        </div>
        <div class="min-w-[100px]  flex-1 flex justify-around items-center">
          Action
        </div>
      </div>
      <div class="flex staking-box items-center" v-for="(economic, _) in economicsData">
        <div class="icon flex items-center"
          :style="'background-image: url(\'/imgs/vStaking/' + economic.metadata.name + '.svg\')'">
        </div>
        <div class="title flex-[2_2_0%] min-w-[100px] flex flex-col justify-center ">
          <h1>{{ economic.metadata.name }}</h1>
          <p>{{ StakeDesc[economic.metadata.name] }}</p>
        </div>
        <div class="title min-w-[100px] flex-1">
          <h1 class="!text-center">{{ economic.v }}%</h1>
          <!-- <p class="!text-center">-</p> -->
        </div>
        <div class="staking min-w-[100px] flex-1 flex justify-center items-center">
          {{ showWTE(new BN(economic.metadata.total)) }} <span v-if="economic.metadata.staking_symbol" class="unit">{{
            economic.metadata.staking_symbol }}</span>
        </div>
        <div class="mstaking min-w-[140px] flex-1 flex justify-center items-center">
          {{ showWTE(getStaking(economic.id, stakingsData)) }} / {{ showWTE(getStaking(economic.id, toStakingsData)) }}
          <span v-if="economic.metadata.staking_symbol" class="unit">{{
            economic.metadata.staking_symbol }}</span>
        </div>
        <div class="daily min-w-[150px] flex-1 flex justify-center items-center">
          {{ showWTE(getStakingReward(economic, stakingsData, blockRewardData)) }} <span class="unit">WTE</span>
        </div>
        <div class="min-w-[105px] flex-1 flex justify-center items-center">
          <div class="action flex justify-around items-center" @click="action(economic)">
            {{ economic.metadata.action }}
            <i class="iconfont">&#xe602;</i>
          </div>
        </div>
      </div>
    </div>
    <loadingBox class="loader-wrapper" v-if="loader == 0" />
    <div class="bottom">
    </div>
  </div>
</template>

<script setup lang="ts">
import { getBnFromChain, getNumstrfromChain, showWTE } from '@/utils/chain';
import { BN } from '@polkadot/util';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import loadingBox from "@/components/loading-box.vue";
import { getHttpApi } from '@/plugins/chain';
import useGlobelProperties from '@/plugins/globel';
import { useGlobalStore } from '@/stores/global';
import router from '@/router';
const loader = ref(0)

const global = useGlobelProperties();
const economicsData = ref<any[]>([]);
const blockRewardData = ref<BN>(new BN(0));
const stakingsData = ref<any>({});
const toStakingsData = ref<any>({});
const userStore = useGlobalStore();
const address = ref<string>(userStore.userInfo ? userStore.userInfo.addr : "");
const StakeDesc = ref<any>({
  "wDOT": "Staking vDOT to earn WTE rewards",
  "Consensus": "Joining the consensus network to earn rewards",
  "TEE mint": "Providing TEE computing power to earn TOKEN",
});
const amount = ref<any>({
  free: "0"
});

watch(userStore.userInfo, (newS: any, oldS: any) => {
  address.value = newS.addr;
});

const getStaking = (id: string, stakings: any) => {
  if (stakings[id]) {
    return getBnFromChain(stakings[id]);
  }
  return new BN(0);
}

const getStakingReward = (economic: any, stakings: any, reward: BN) => {
  const id = economic.id;
  const total = economic.metadata.total;
  if (total == 0) {
    return new BN(0);
  }

  if (stakings[id]) {
    const staking = getBnFromChain(stakings[id]);
    return reward.mul(new BN(staking)).mul(new BN(economic.v)).div(new BN(100)).div(new BN(total))
  }
  return new BN(0);
}

const getTotalStakingReward = (economics: any, stakings: any, reward: BN) => {
  let all = new BN(0);
  for (let i = 0; i < economics.length; i++) {
    all = all.add(new BN(getStakingReward(economics[i], stakings, reward)))
  }

  return all
}

const action = (item: any) => {
  switch (item.id) {
    case "0":
      break;
    case "1":
      break;
    default:
      global.$VStake(router, {}, () => {
        startInit();
      })
      break;
  }
}

let timer: any = null;
const startInit = () => {
  // 设置新的定时器
  timer = setInterval(async () => {
    await initData();
  }, 6000);
}

onMounted(async () => {
  // await initData();
  startInit();
})

onUnmounted(async () => {
  clearInterval(timer);
})

const initData = async () => {
  // 获取每个区块的奖励
  let blockReward: any = await getHttpApi().query("fairlanch", "blockReward", []);
  blockRewardData.value = getBnFromChain(blockReward[2]).mul(new BN(14400));

  // 获取资产信息 
  let assetsList = await getHttpApi().entries("asset", "assetsInfo", []);
  let assets: any = {};
  assetsList.forEach(({ keys, value }: any) => {
    assets[getNumstrfromChain(keys[0])] = value;
  });

  // 获取资产总量
  let totalList = await getHttpApi().entries("fairlanch", "stakingTotal", []);
  let totals: any = {};
  totalList.forEach(({ keys, value }: any) => {
    totals[getNumstrfromChain(keys[0])] = value;
  });

  // 获取质押列表
  let stakingsList = await getHttpApi().entries("fairlanch", "stakings", [address.value]);
  let stakings: any = {};
  stakingsList.forEach(({ keys, value }: any) => {
    let id = getNumstrfromChain(keys[1]);
    stakings[id] = value;
  });
  stakingsData.value = stakings;

  // 获取链上经济模型
  let economicsList = await getHttpApi().entries("fairlanch", "economics", []);
  let economics: any[] = [];
  economicsList.forEach(({ keys, value }: any) => {
    let id = getNumstrfromChain(keys[0]);
    const metadata = getAssetInfo(id, assets, totals);
    economics.push({
      id: id,
      metadata: metadata,
      v: value,
      staking: stakings[id],
    })
  });
  economicsData.value = economics.reverse();

  // 获取待质押列表
  let toStakingsList = await getHttpApi().entries("fairlanch", "toStakings", [address.value]);
  let toStakings: any = {};
  toStakingsList.forEach(({ keys, value }: any) => {
    let id = getNumstrfromChain(keys[1]);
    toStakings[id] = value;
  });
  toStakingsData.value = toStakings;
  loader.value = 1;

  amount.value = (await getHttpApi().query("system", "account", [userStore.userInfo.addr])).data;
}

const getAssetInfo = (id: string, assets: any, total: any) => {
  if (id == "0") {
    return {
      "name": "Consensus",
      "symbol": "WTE",
      "decimals": 12,
      "total": "-",
      "staking_symbol": "",
      "action": "Chain Mint",
    }
  }
  if (id == "1") {
    return {
      "name": "TEE mint",
      "symbol": "WTE",
      "decimals": 12,
      "total": "-",
      "staking_symbol": "",
      "action": "TEE mint",
    }
  }

  let meta = assets[id].metadata;
  return {
    ...assets[id].metadata,
    "total": getNumstrfromChain(total[id] ?? "0"),
    "staking_symbol": meta.name,
    "action": "Stake"
  };
}
</script>

<style lang="scss" scoped>
.tokens {
  padding-top: 100px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.staking-box {
  padding: 30px 20px;
  margin-bottom: 20px;
  background-color: rgba(33, 33, 33, 0.5);
  font-size: 16px;
  min-width: 800px;


  &.bg-transparent {
    background-color: transparent;
    margin-bottom: 0;
    color: #878787;
  }

  .staking-icon {
    height: 60px;
    padding-left: 0;
    padding-right: 20px;

    img {
      height: 100%;
    }
  }

  .icon {
    margin-left: 16px;
    margin-right: 15px;
    width: 40px;
    height: 40px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .title {
    h1 {
      font-size: 16px;
      font-weight: bold;
    }

    p {
      font-size: 12px;
      line-height: 14px;
      color: rgba($secondary-text-rgb, 0.6);
    }
  }

  .tstaking,
  .daily {
    .iconfont {
      font-size: 14px;
      line-height: 1.8;
      text-align: center;
      display: block;
      padding: 5px;
      background-color: rgba($primary-text-rgb, 0.6);
      margin-right: 6px;
    }

    h1 {
      font-size: 12px;
      color: rgba($secondary-text-rgb, 0.6);
      margin-bottom: 3px;
    }

    p {
      font-size: 14px;
      line-height: 14px;
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
    }
  }
}

.bottom {
  height: 30px;
  width: 100%;
}
</style>