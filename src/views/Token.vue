<template>
  <div class="tokens">
    <div class="container section-first">
      <div class="flex items-center staking-box !m-0">
        <div class="staking-icon flex items-center">
          <img src="/imgs/staking.svg" alt=""></img>
        </div>
        <div class="title flex-1">
          <h1>Token staking</h1>
          <p>100% fair launch staking, to fairly obtain WTE rewards.</p>
        </div>
        <!-- <div class="tstaking flex">
                    <i class="iconfont">&#xe68a;</i>
                    <div class="flex flex-col">
                        <h1>My total Staking</h1>
                        <p>1000 wDOT</p>
                    </div>
                </div> -->
        <div class="daily flex pl-10">
          <i class="iconfont">&#xe60d;</i>
          <div class="flex flex-col">
            <h1>Est. Daily Reward</h1>
            <p>{{ blockRewardData.div(new BN(1_000_000_000_000)) }} WTE</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
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
          Est. Daily Reward
        </div>
        <div class="min-w-[100px]  flex-1 flex justify-around items-center">
          action
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
          {{ economic.metadata.total }} <span v-if="economic.metadata.staking_symbol" class="unit">{{
            economic.metadata.staking_symbol }}</span>
        </div>
        <div class="mstaking min-w-[140px] flex-1 flex justify-center items-center">
          {{ getStaking(economic.id, stakingsData) }}/{{ getStaking(economic.id, toStakingsData) }}
          <span v-if="economic.metadata.staking_symbol" class="unit">{{
            economic.metadata.staking_symbol }}</span>
        </div>
        <div class="daily min-w-[150px] flex-1 flex justify-center items-center">
          {{ getStakingReward(economic, stakingsData, blockRewardData) }} <span class="unit">WTE</span>
        </div>
        <div class="min-w-[105px] flex-1 flex justify-center items-center">
          <div class="action flex justify-around items-center" @click="action(economic)">
            {{ economic.metadata.action }}
            <i class="iconfont">&#xe602;</i>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom">
    </div>
  </div>
</template>

<script setup lang="ts">
import useGlobelProperties from '@/plugins/globel';
import { useGlobalStore } from '@/stores/global';
import { getNumberfromChain, getNumstrfromChain } from '@/utils/chain';
import { sleep } from '@/utils/time';
import type { ApiPromise } from '@polkadot/api';
import { BN } from '@polkadot/util';
import { inject, onMounted, ref, watch } from 'vue';
const wetee: any = inject('wetee');

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

watch(userStore.userInfo, (newS: any, oldS: any) => {
  address.value = newS.addr;
});

const getStaking = (id: string, stakings: any) => {
  if (stakings[id]) {
    return getNumberfromChain(stakings[id]).toString();
  }
  return "0"
}

const getStakingReward = (economic: any, stakings: any, reward: BN) => {
  const id = economic.id;
  const total = economic.metadata.total;
  if (total == 0) {
    return "0"
  }
  if (stakings[id]) {
    return reward.mul(new BN(stakings[id])).div(total).toString()
  }

  return "0"
}

const action = (item: any) => {
  switch (item.id) {
    case "0":
      break;
    case "1":
      break;
    default:
      global.$VStake()
      break;
  }
}

onMounted(async () => {
  await initData();
})

const initData = async () => {
  if (!wetee().client) {
    sleep(1000);
    initData();
  }

  let api: ApiPromise = wetee().client;

  // 获取每个区块的奖励
  let blockReward: any = (await api.query.fairlanch.blockReward()).toHuman();
  blockRewardData.value = getNumberfromChain(blockReward[2]).mul(new BN(14400));

  // 获取资产信息
  let assetsList = await api.query.asset.assetsInfo.entries();
  let assets: any = {};
  assetsList.forEach(([key, exposure]: any) => {
    const item = exposure.toHuman();
    assets[getNumstrfromChain(key.toHuman()[0])] = item;
  });

  // 获取资产总量
  let totalList = await api.query.fairlanch.stakingTotal.entries();
  let totals: any = {};
  totalList.forEach(([key, exposure]: any) => {
    const item = exposure.toHuman();
    totals[getNumstrfromChain(key.toHuman()[0])] = item;
  });

  // 获取质押列表
  let stakingsList = await api.query.fairlanch.stakings.entries(address.value);
  let stakings: any = {};
  stakingsList.forEach(([key, exposure]: any) => {
    let item = exposure.toHuman();
    let id = getNumstrfromChain(key.toHuman()[1]);
    stakings[id] = item;
  });
  stakingsData.value = stakings;

  // 获取链上经济模型
  let economicsList = await api.query.fairlanch.economics.entries();
  let economics: any[] = [];
  economicsList.forEach(([key, exposure]: any) => {
    let item = exposure.toHuman();
    let id = getNumstrfromChain(key.toHuman()[0]);
    const metadata = getAssetInfo(id, assets, totals);
    economics.push({
      id: id,
      metadata: metadata,
      v: item,
      staking: stakings[id],
    })
  });
  economicsData.value = economics.reverse();

  // 获取待质押列表
  let toStakingsList = await api.query.fairlanch.toStakings.entries(address.value);
  let toStakings: any = {};
  toStakingsList.forEach(([key, exposure]: any) => {
    let item = exposure.toHuman();
    let id = getNumstrfromChain(key.toHuman()[1]);
    toStakings[id] = item;
  });
  toStakingsData.value = toStakings;
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
    "total": total[id] ?? "0 ",
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
    width: 45px;
    height: 45px;
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