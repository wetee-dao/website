<template>
  <div class="home gradient-body">
    <!-- <Banner /> -->
    <div
      class="chain-box top p-[15px] lg:p-5 border-rgb overflow-hidden container flex justify-between flex-row mt-6 mb-4">
      <div class="chain wetee flex lg:mb-0 flex-row flex-1">
        <div class="w-full flex-1 flex-col flex items-stretch justify-center gap-2.5">
          <div class="title flex flex-wrap justify-between items-center">
            <div class="flex overflow-hidden items-center">
              <LogoMini class="chain-logo mr-3" />
              <div class="inline truncate">Trusted Trustless Computing Network</div>
            </div>
            <div class="flex"></div>
          </div>
          <WeTEE :key="block_t" />
        </div>
      </div>
      <Chip class="chip">
        <div class="chip-text">Network for WEB5</div>
      </Chip>
      <div class="chain polkadot flex lg:mb-0 flex-row flex-1">
        <div class="w-full flex-1 flex-col flex items-stretch justify-center gap-2.5">
          <div class="flex flex-wrap justify-between items-center">
            <div class="flex"></div>
            <div class="title flex overflow-hidden items-center">
              <div class="inline truncate">Polkadot network</div>
              <img class="chain-logo ml-3" src="/imgs/polkadot_mini.svg" />
            </div>
          </div>
          <Polkadot />
        </div>
      </div>
    </div>
    <div class="container border-rgb flex mb-4 flex-col lg:flex-row">
      <div class="chain-box flex lg:mb-0 flex-col flex-1 border-r overflow-y-auto">
        <div class="title-wrap flex p-[15px] lg:p-5 flex-wrap justify-between items-center">
          <div class="title flex overflow-hidden">
            <Svgimg class="chain-logo animate-ping-rotate mr-2 flex-shrink-0" color="#50fa82" name="block" />
            <div class="inline truncate">Latest Blocks</div>
          </div>
          <div class="flex">
            <a class="outline-none" href="/chain/blocks">
              <button type="button"
                class=" border outline-none whitespace-nowrap border-none px-[10px] py-[10px] text-xs clickable link-bg">
                View All
              </button>
            </a>
          </div>
        </div>
        <div class="flex flex-col divide-y w-full h-[390px] overflow-y-auto overflow-x-hidden">
          <div class="flex justify-between p-5 block" v-for="block in blocks">
            <div class="flex flex-col">
              <div class="flex space-x-2 mb-1 items-center">
                <div class="text-sm inline">Block#</div><a class="outline-none font-semibold !text-base number"
                  href="/block/31157453">{{ block.header.height }}</a>
              </div>
              <div class="flex space-x-2">
                <div class="text-sm inline">Includes</div><a class="outline-none text-sm link"
                  href="/block/31157453?tab=extrinsic">{{ block.num_txs }} Txs</a>
              </div>
            </div>
            <div class="flex items-center">
              <div class="flex whitespace-nowrap text-sm">
                <div data-state="closed" class="inline-block leading-none">{{ formatTimeDiff(block.header.time, now) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chain-box flex  lg:mb-0 flex-col flex-1 overflow-y-auto">
        <div class="title-wrap flex p-[15px] lg:p-5 flex-wrap justify-between items-center">
          <div class="title flex overflow-hidden">
            <Svgimg class="chain-logo mr-2 flex-shrink-0" color="#50fa82" name="transfer" />
            <div class="inline truncate">Transfers</div>
          </div>
          <div class="flex">
            <div class="flex space-x-3">
              <a class="outline-none text-sm" href="/chain/txs">
                <button type="button"
                  class="outline-none whitespace-nowrap border-none px-[10px] py-[10px] text-xs clickable link-bg">
                  View All
                </button>
              </a>
            </div>
          </div>
        </div>
        <div class="flex flex-col divide-y w-full h-[390px] overflow-y-auto overflow-x-hidden">
          <div class="flex justify-between p-5 block" v-key="tx.height + '-' + tx.index" v-for="tx in txs">
            <div class="flex flex-1 flex-col">
              <div class="flex space-x-2 mb-1 items-center">
                <div class="text-sm inline">Tx#</div><a
                  class="outline-none text-sm whitespace-nowrap font-semibold !text-base number" href="/">{{ tx.height
                  }}-{{ tx.index }}</a>
              </div>
              <div class="flex flex-col md:space-x-2 md:items-center md:flex-row">
                <div class="flex space-x-2 items-center">
                  <div class="text-sm">Hash</div>
                  <div class="text-sm hash flex-1">{{ tx.hash }}</div>
                </div>
              </div>
            </div>
            <div class="flex flex-col ml-4 items-end justify-center">
              <div class="flex items-center">
                <svg viewBox="0 0 30 30" fill="currentColor" aria-hidden="true" class="w-6 textsuccess">
                  <circle cx="15" cy="15" r="15" opacity="0.1"
                    style="fill: color(display-p3 0.4196 0.7569 0.0549); fill-opacity: 1;">
                  </circle>
                  <path
                    d="M21.4218 9.95697C21.9978 9.36173 22.9475 9.3459 23.5429 9.92181C24.1381 10.4979 24.1539 11.4476 23.578 12.0429L14.8681 21.0429C14.5855 21.3349 14.1963 21.4999 13.7899 21.4999C13.3837 21.4999 12.9953 21.3348 12.7128 21.0429L7.92176 16.0927C7.34595 15.4974 7.36171 14.5476 7.95692 13.9716C8.55225 13.3958 9.502 13.4116 10.078 14.0068L13.7899 17.8427L21.4218 9.95697Z"
                    style="fill: color(display-p3 0.4196 0.7569 0.0549); fill-opacity: 1;">
                  </path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-4"></div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Footer from '@/components/Footer.vue'
import Chip from '@/components/anim/Chip.vue';
import Svgimg from "@/components/svg/SvgImg.vue"
import LogoMini from '@/components/svg/LogoMini.vue';
import Polkadot from '@/components/chains/polkadot.vue';
import WeTEE from '@/components/chains/wetee.vue';
import { GetNowBlocks, GetNowTx, SubNewBlock } from '@/apis/side';
import { formatTimeDiff } from "@/utils/time"
import { ReconnectingWebSocket } from "@/utils/ws"
import { CurrentChainNode } from '@/plugins/chain';

const blocks = ref<any[]>([])
const txs = ref<any[]>([])
const now = ref(new Date().getTime())
const block_t = ref(new Date().getTime())

let ws: ReconnectingWebSocket
let timeIns: any

onMounted(() => {
  timeIns = setInterval(() => {
    now.value = new Date().getTime()
  }, 6000)

  GetNowBlocks().then(async datas => {
    blocks.value = datas.block_metas
    const txResult = await GetNowTx(datas.last_height)
    txs.value = txResult.txs
  })

  ws = SubNewBlock(async (e) => {
    const result = JSON.parse(e.data)
    if (!result.result.data) {
      return
    }
    const block = result.result.data.value.block
    blocks.value.unshift({
      header: block.header,
      num_txs: block.data.txs.length
    })
    block_t.value = new Date().getTime()

    const txResult = await GetNowTx(block.header.height)
    txs.value = txResult.txs
  })
})

onUnmounted(() => {
  ws.close()
  if (timeIns != null) {
    clearInterval(timeIns)
  }
})
</script>

<style lang="scss" scoped>
.home {
  padding-top: 80px;
}

.border-rgb {
  border-width: 4px;
  border-color: #ffffff0f;
}

.chain-box {
  background-color: $primary-bg;
  // border: 1Px solid rgba($primary-text-rgb, 0.3);
  border-color: #ffffff0f;

  .title-wrap {
    border-bottom: 1px solid rgba(255, 255, 255, 0.0588235294);
  }

  .title {
    font-size: 16px;
    font-weight: bold;

    &>.inline {
      line-height: 31px;
    }

    .chain-logo {
      width: 30px;
      height: 30px;
    }
  }
}

.chip {
  display: inline-flex;
  margin: auto 3.3vw;
  font-size: 0.263vw;
  border: 1Px solid rgba($secondary-text-rgb, 0.1);
  background-color: transparent;

  .chip-text {
    color: $primary-text;
    font-size: 2vw;
    text-align: center;
    font-family: "letter-font";
    font-weight: bold;
  }
}

.link-bg {
  background-color: #ffffff1f;
}

.chain {
  display: inline-flex;
  max-width: calc(50% - 12vw);

  .title {
    font-size: 16px;
    font-weight: bold;

    .chain-logo {
      width: 20px;
      height: 20px;
    }
  }

  &.wetee {
    .title {
      color: #00d37a;
    }
  }

  &.polkadot {
    .title {
      color: #e6007a;
    }
  }
}

.block {
  color: #858585;
  border-color: #ffffff08;

  .number {
    color: $primary-text;
  }

  .link {
    color: rgba($primary-text-rgb, 0.5)
  }

  .hash {
    height: 20px;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
}

@keyframes pingrotate {
  0% {
    transform: rotate(0deg)
  }

  25% {
    transform: rotate(90deg)
  }

  50% {
    transform: rotate(180deg)
  }

  75% {
    transform: rotate(270deg)
  }

  to {
    transform: rotate(1turn)
  }
}

.animate-ping-rotate {
  animation: pingrotate 4s infinite;
}

@media (max-width: 600px) {
  .top {
    flex-direction: column;
    padding: 10px 0;
  }

  .chain {
    max-width: 100%;
    padding: 15px;
  }

  .chip {
    font-size: 1.4vw;
    margin: 25vw auto;

    .chip-text {
      font-size: 10vw;
    }
  }
}
</style>