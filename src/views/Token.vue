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
                <div class="tstaking">
                    <i class="iconfont"></i>
                    <div class="flex flex-col">
                        <h1>My total Staking</h1>
                        <p>1000 wDOT</p>
                    </div>
                </div>
                <div class="daily  pl-10">
                    <i class="iconfont"></i>
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
                <div class="title min-w-[100px] flex-1 flex flex-col justify-center items-center">

                </div>
                <div class="title min-w-[100px] flex flex-col justify-center items-center">
                    APY
                </div>
                <div class="staking min-w-[100px]  flex flex-col justify-center items-center">
                    TVS
                </div>
                <div class="mstaking min-w-[100px] flex flex-col justify-center items-center">
                    My Staking
                </div>
                <div class="daily min-w-[150px] flex flex-col justify-center items-center">
                    Est. Daily Reward
                </div>
                <div class="min-w-[100px] flex justify-around items-center">
                    action
                </div>
            </div>
            <div class="flex staking-box items-center">
                <div class="icon flex items-center">
                    <img src="/imgs/vDOT.svg" alt=""></img>
                </div>
                <div class="title min-w-[100px] flex-1 flex flex-col justify-center ">
                    <h1>wDOT</h1>
                    <p>Polkdot .</p>
                </div>
                <div class="title min-w-[100px] ">
                    <h1 class="!text-center">15%</h1>
                    <!-- <p class="!text-center">-</p> -->
                </div>
                <div class="staking min-w-[100px]  flex flex-col justify-center items-center">
                    $1000
                </div>
                <div class="mstaking min-w-[100px] flex flex-col justify-center items-center">
                    100 vDOT
                </div>
                <div class="daily min-w-[150px] flex flex-col justify-center items-center">
                    100 WTE
                </div>
                <div class="action min-w-[100px] flex justify-around items-center">
                    Stake
                    <i class="iconfont">&#xe602;</i>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


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
        margin-left: 15px;
        margin-right: 38px;
        width: 50px;

        img {
            width: 100%
        }
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

    .action {
        background-color: rgba($primary-text-rgb, 0.6);
        padding: 5px;
        cursor: pointer;

        .iconfont {
            font-size: 12px;
        }
    }

}
</style>