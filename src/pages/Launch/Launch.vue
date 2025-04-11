<template>
  <div class="tokens gradient-body">
    <div class="container section-first">
      <div class="flex items-center staking-box !m-0">
        <div class="staking-icon flex items-center">
          <img src="/imgs/staking.svg"></img>
        </div>
        <div class="title flex-1">
          <h1 class="page-title">Token staking</h1>
          <p>100% fair launch economics, to fairly obtain WTE rewards.</p>
        </div>
        <div class="tstaking flex">
          <i class="iconfont">&#xe62b;</i>
          <div class="flex flex-col">
            <h1>Time till reward</h1>
            <p>{{ formatCountdown(utilTime) }}</p>
          </div>
        </div>
        <div class="daily flex pl-10">
          <i class="iconfont">&#xe60d;</i>
          <div class="flex flex-col">
            <h1>My Daily Reward</h1>
            <p>
              {{ showWTE(getTotalStakingReward(economicsData, stakingsData, blockRewardData)) }}
              <span class="total_unit">WTE</span>
            </p>
          </div>
        <div class="tstaking flex pl-10">
          <i class="iconfont">&#xe68a;</i>
          <div class="flex flex-col">
            <h1>My total WTE</h1>
            <p>{{ showWTE(getBnFromChain(amount.free)) }} <span class="total_unit">WTE</span></p>
          </div>
        </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="flex staking-box bg-transparent items-center">
        <div class="icon flex items-center">
          <!-- <img src="/imgs/vDOT.svg" alt="" /> -->
        </div>
        <div class="title min-w-[100px] flex-[2_2_0%] flex flex-col justify-center items-center"></div>
        <div class="staking min-w-[120px] flex-1  flex flex justify-start items-center">
          Staking progress
        </div>
        <div class="title min-w-[100px] flex-1 flex flex-col justify-center items-center">
          Reward Ratio
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
      <loadingBox class="loader-wrapper" text="Loading stakings ..." v-if="loader == 0" />
      <div class="flex staking-box items-center" v-for="(economic, _) in economicsData">
        <div class="icon flex items-center"
          :style="'background-image: url(\'/imgs/vStaking/' + economic.metadata.symbol + '.svg\')'">
        </div>
        <div class="title flex-[2_2_0%] min-w-[100px] flex flex-col justify-center ">
          <h1>{{ economic.metadata.name }}</h1>
          <p>{{ StakeDesc[economic.metadata.symbol] }}</p>
        </div>
        <div class="staking min-w-[120px] flex-1 flex justify-start items-center" v-if="economic.id >= 5000">
          <div class="lanch-line flex justify-start items-center">
            &nbsp;{{ showToken(new BN(totalData[economic.id] || 0), economic.metadata.decimals) }}<span class="text-split">/</span>{{
              showToken(new BN(quotaData[economic.id] || 0), economic.metadata.decimals) }}&nbsp;{{
              economic.metadata.staking_symbol }}
            <div class="inner"
              :style="'width: ' + new BN(totalData[economic.id]).mul(new BN(100)).div(new BN(quotaData[economic.id])).toString() + '%'"
              v-if="quotaData[economic.id] && totalData[economic.id]">
            </div>
          </div>
        </div>
        <div class="staking min-w-[100px] flex-1 flex justify-center items-center" v-if="economic.id < 5000">
          -
        </div>
        <div class="title min-w-[100px] flex-1">
          <h1 class="!text-center">{{ economic.v }}%</h1>
        </div>
        <div class="mstaking min-w-[140px] flex-1 flex justify-center items-center">
          {{ showToken(getStaking(economic.id, stakingsData), economic.metadata.decimals) }}<span class="text-split">/</span>{{
            showToken(getStaking(economic.id, toStakingsData), economic.metadata.decimals) }}
          <span v-if="economic.metadata.staking_symbol" class="unit">{{
            economic.metadata.staking_symbol }}</span>
        </div>
        <div class="daily min-w-[150px] flex-1 flex justify-center items-center">
          {{ showWTE(getStakingReward(economic, stakingsData, blockRewardData, totalData[economic.id])) }} <span
            class="unit">WTE</span>
        </div>
        <div class="min-w-[105px] flex-1 flex flex-col justify-center items-center" v-if="economic.id == 0">
          <div class="action flex justify-center items-center" @click="action(economic)">
            Mint
            <i class="iconfont">&#xe602;</i>
          </div>
        </div>
        <div class="min-w-[105px] flex-1 flex flex-col justify-center items-center" v-if="economic.id == 1">
          <div class="action flex justify-center items-center" @click="action(economic)">
            Mint
            <i class="iconfont">&#xe602;</i>
          </div>
        </div>
        <div class="min-w-[105px] flex-1 flex flex-col justify-center items-center" v-if="economic.id == 2">
          <div class="action flex justify-center items-center" @click="action(economic)">
            Mint
            <i class="iconfont">&#xe602;</i>
          </div>
        </div>
        <div class="min-w-[105px] flex-1 flex flex-col justify-center items-center" v-if="economic.id > 5000">
          <div class="action flex justify-center items-center" @click="action(economic)">
            Stake
            <i class="iconfont">&#xe602;</i>
          </div>
          <div v-if="parseInt(economic.id) > 5000" class="unstaking action flex justify-center items-center"
            @click="unStake(economic)">
            Unstake
            <i class="iconfont">&#xe602;</i>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { getBnFromChain, getNumstrfromChain, showWTE, showToken } from '@/utils/chain';
import { BN } from '@polkadot/util';
import { onMounted, onUnmounted, ref } from 'vue';

import loadingBox from "@/components/loading-box.vue";
import { getHttpApi } from '@/plugins/chain';
import useGlobelProperties from '@/plugins/globel';
import { useGlobalStore } from '@/stores/global';
const loader = ref(0)

const global = useGlobelProperties();
const economicsData = ref<any[]>([
  { "id": "0", "metadata": { "name": "Chain mint", "symbol": "Chain mint", "decimals": 12, "total": "-", "staking_symbol": "", "action": "Chain Mint" }, "v": "10" },
]);
const blockRewardData = ref<BN>(new BN(0));
const stakingsData = ref<any>({});
const toStakingsData = ref<any>({});
const totalData = ref<any>({});
const vtoken2token = ref<any>([])
const quotaData = ref<any>({});
const userStore = useGlobalStore();
const address = ref<string>(userStore.userInfo ? userStore.userInfo.addr : "");
const StakeDesc = ref<any>({
  "wDOT": "Staking vDOT to earn WTE rewards",
  "Chain mint": "Joining the consensus network to earn WTE rewards",
  "TEE mint": "Providing TEE computing power to earn TOKEN",
  "wAPP": "Upload container to earn WTE rewards",
});
const amount = ref<any>({
  free: "0"
});
const utilTime = ref<number>(0)

userStore.$subscribe((mutation, state) => {
  if (!state.userInfo) {
    address.value = "";
    initData();
  } else if (address.value != state.userInfo.addr) {
    address.value = state.userInfo.addr;

    initData();
  }
}, { detached: true })

const getStaking = (id: string, stakings: any) => {
  if (stakings[id]) {
    return getBnFromChain(stakings[id]);
  }
  return new BN(0);
}

const getStakingReward = (economic: any, stakings: any, reward: BN, total: string) => {
  const id = economic.id;
  if (!total) {
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
    all = all.add(new BN(getStakingReward(economics[i], stakings, reward, totalData.value[economics[i].id])))
  }

  return all
}

const action = (item: any) => {
  switch (item.id) {
    case "0":
      window.open("https://wetee.gitbook.io/docment/mint/blockchain-mint", "_blank");
      break;
    case "1":
      window.open("https://wetee.gitbook.io/docment/mint/tee-computing-mint", "_blank");
      break;
    case "2":
      window.open("https://wetee.gitbook.io/docment/mint/tee-computing-mint", "_blank");
      break;
    default:
      let vstakeItem = vtoken2token.value.find((v: any) => {
        return getNumstrfromChain(v.value[0]) == item.id
      })
      if (vstakeItem) {
        global.$CheckLogin(() => {
          global.$VStake({
            vassetId: getNumstrfromChain(vstakeItem.keys[0])
          }, () => {
            startInit();
          })
        })
      }
      break;
  }
}

const unStake = (item: any) => {
  global.$UnStake({
    assetId: getNumstrfromChain(item.id),
  }, () => {
    startInit();
  })
}

let timer: any = null;
const startInit = () => {
  initData();
}

onMounted(async () => {
  await initData();
  timer = setInterval(() => {
    utilTime.value = utilTime.value - 1
  }, 1000)
})

onUnmounted(async () => {
  if (timer) {
    clearInterval(timer);
  }
})

const initData = async () => {
  // 获取资产信息 
  const assetsList = await getHttpApi().entries("asset", "assetInfos", []);
  let assets: any = {};
  assetsList.forEach(({ keys, value }: any) => {
    assets[getNumstrfromChain(keys[0])] = value;
  });

  // 获取链上经济模型
  const economicsList = await getHttpApi().entries("fairlanch", "economics", []);
  let economics: any[] = [];
  economicsList.forEach(({ keys, value }: any) => {
    let id = getNumstrfromChain(keys[0]);
    const metadata = getAssetInfo(id, assets);
    economics.push({
      id: id,
      metadata: metadata,
      v: value,
    })
  });
  economicsData.value = economics.reverse();
  loader.value = 1;

  const cvtoken2token: any = await getHttpApi().entries("fairlanch", "vtoken2token", []);
  vtoken2token.value = cvtoken2token;

  // 获取资产总量
  const totalList = await getHttpApi().entries("fairlanch", "stakingTotal", []);
  let totals: any = {};
  totalList.forEach(({ keys, value }: any) => {
    totals[getNumstrfromChain(keys[0])] = getNumstrfromChain(value);
  });
  totalData.value = totals;

  // 获取质押列表
  const stakingsList = await getHttpApi().entries("fairlanch", "stakings", [address.value]);
  let stakings: any = {};
  stakingsList.forEach(({ keys, value }: any) => {
    const id = getNumstrfromChain(keys[1]);
    stakings[id] = getNumstrfromChain(value);
  });
  stakingsData.value = stakings;

  // 获取待质押列表
  const toStakingsList = await getHttpApi().entries("fairlanch", "toStakings", [address.value]);
  let toStakings: any = {};
  toStakingsList.forEach(({ keys, value }: any) => {
    const id = getNumstrfromChain(keys[1]);
    toStakings[id] = getNumstrfromChain(value);
  });
  toStakingsData.value = toStakings;

  // 获取用户 WTE 余额
  amount.value = (await getHttpApi().query("system", "account", [address.value])).data;

  // 获取每个区块的奖励
  const blockReward: any = await getHttpApi().query("fairlanch", "blockReward", []);
  blockRewardData.value = getBnFromChain(blockReward[2]).mul(new BN(14400));

  // 获取质押限制
  const quotaList: any = await getHttpApi().entries("fairlanch", "stakingQuota", []);
  let quota: any = {};
  quotaList.forEach(({ keys, value }: any) => {
    quota[getNumstrfromChain(keys[0])] = getNumstrfromChain(value);
  })
  quotaData.value = quota;

  // 获取最新区块
  const lastBlock = await getHttpApi().lastBlock();

  utilTime.value = (14400 - new BN(lastBlock.number).mod(new BN(14400)).toNumber()) * 6;
}

function formatCountdown(seconds: number): string {
  // 计算小时、分钟和秒数
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // 格式化为两位数
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

const getAssetInfo = (id: string, assets: any) => {
  if (id == "0") {
    return {
      "name": "Chain mint",
      "symbol": "Chain mint",
      "decimals": 12,
      "total": "-",
      "staking_symbol": "",
      "action": "Chain Mint",
    }
  }

  if (id == "1") {
    return {
      "name": "TEE mint",
      "symbol": "TEE mint",
      "decimals": 12,
      "total": "-",
      "staking_symbol": "",
      "action": "TEE mint",
    }
  }

  let meta = assets[id].metadata;
  return {
    ...assets[id].metadata,
    "staking_symbol": meta.symbol,
    "action": "Stake"
  };
}
</script>

<style lang="scss" scoped>
.tokens {
  padding-top: 100px;
}

.page-title {
  font-size: 24px !important;
}

.text-split{
  display: inline-block;
  margin: 0 3px;
}

.staking-box {
  padding: 25px 20px;
  margin-bottom: 20px;
  background-color: rgba(33, 33, 33, 0.5);
  font-size: 16px;
  min-width: 800px;

  .lanch-line {
    background: rgba($secondary-text-rgb, 0.1);
    font-size: 16px;
    padding: 2px;
    width: 100%;
    border-radius: 2px;
    position: relative;

    .inner {
      background: rgba($primary-text-rgb, 0.5);
      position: absolute;
      left: 0;
      right: 0;
      height: 100%;
      border-radius: 2px;
    }
  }

  &.bg-transparent {
    background-color: transparent;
    margin-bottom: 0;
    padding: 20px 20px;
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
    margin-left: 7px;
    margin-right: 10px;
    width: 65px;
    height: 65px;
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
      font-size: 13px;
      line-height: 14px;
      color: rgba($secondary-text-rgb, 0.6);
    }
  }

  .tstaking,
  .daily {
    .iconfont {
      font-size: 17px;
      line-height: 1.8;
      text-align: center;
      display: block;
      padding: 4px;
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
    border-radius: 2px;
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

  .unstaking {
    background-color: rgba($accent-color, 0.3);
    margin-top: 5px;
  }
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