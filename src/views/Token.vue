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
                <div class="tstaking flex">
                    <i class="iconfont">&#xe68a;</i>
                    <div class="flex flex-col">
                        <h1>My total Staking</h1>
                        <p>1000 wDOT</p>
                    </div>
                </div>
                <div class="daily flex pl-10">
                    <i class="iconfont">&#xe60d;</i>
                    <div class="flex flex-col">
                        <h1>Est. Daily Reward</h1>
                        <p>100WTE</p>
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
                <div class="mstaking min-w-[100px] flex-1 flex flex-col justify-center items-center">
                    My Staking
                </div>
                <div class="daily min-w-[150px] flex-1 flex flex-col justify-center items-center">
                    Est. Daily Reward
                </div>
                <div class="min-w-[100px]  flex-1 flex justify-around items-center">
                    action
                </div>
            </div>
            <div class="flex staking-box items-center" v-for="(item, _) in economicsData">
                <div class="icon flex items-center"
                    :style="'background-image: url(\'/imgs/' + item.metadata.name + '.svg\')'">
                </div>
                <div class="title flex-[2_2_0%] min-w-[100px] flex flex-col justify-center ">
                    <h1>{{ item.metadata.name }}</h1>
                    <p>{{ StakeDesc[item.metadata.name] }}</p>
                </div>
                <div class="title min-w-[100px] flex-1">
                    <h1 class="!text-center">{{ item.v }}%</h1>
                    <!-- <p class="!text-center">-</p> -->
                </div>
                <div class="staking min-w-[100px] flex-1 flex justify-center items-center">
                    {{ item.metadata.total }} <span v-if="item.metadata.staking_symbol" class="unit">{{
                        item.metadata.staking_symbol }}</span>
                </div>
                <div class="mstaking min-w-[100px] flex-1 flex justify-center items-center">
                    0 <span v-if="item.metadata.staking_symbol" class="unit">{{
                        item.metadata.staking_symbol }}</span>
                </div>
                <div class="daily min-w-[150px] flex-1 flex justify-center items-center">
                    0 <span class="unit">WTE</span>
                </div>
                <div class="min-w-[105px] flex-1 flex justify-center items-center">
                    <div class="action flex justify-around items-center" @click="action(item)">
                        {{ item.metadata.action }}
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
import type { ApiPromise } from '@polkadot/api';
import { inject, onMounted, ref } from 'vue';
const wetee: any = inject('wetee');

const global = useGlobelProperties();
const economicsData = ref<any[]>([]);
const vTokenMap: any = {
    "vDOT": "wDOT",
}
const StakeDesc = ref<any>({
    "vDOT": "Staking vDOT to earn WTE rewards",
    "Consensus": "Joining the consensus network to earn rewards",
    "TEE mint": "Providing TEE computing power to earn TOKEN",
});

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
    let api: ApiPromise = wetee().client;

    let assetsList = await api.query.asset.assetsInfo.entries();
    let assets: any = {};
    assetsList.forEach(([key, exposure]: any) => {
        const item = exposure.toHuman();
        assets[key.toHuman()[0]] = item;
    });

    let totalList = await api.query.fairlanch.stakingTotal.entries();
    let total: any = {};
    totalList.forEach(([key, exposure]: any) => {
        const item = exposure.toHuman();
        total[key.toHuman()[0]] = item;
    });


    // 获取链上经济模型
    let economicsList = await api.query.fairlanch.economics.entries();
    let economics: any[] = [];
    economicsList.forEach(([key, exposure]: any) => {
        let item = exposure.toHuman();
        let id = key.toHuman()[0];
        const metadata = getAssetInfo(id, assets, total);
        economics.push({
            id: id,
            metadata: metadata,
            v: item
        })
    });
    economicsData.value = economics.reverse();
})

const getAssetInfo = (id: any, assets: any, total: any) => {
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
        "staking_symbol": vTokenMap[meta.name],
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
        margin-left: 8px;
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