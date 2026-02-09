<template>
  <div class="home gradient-body">
    <div class="border-rgb container mt-6 mb-4">
      <div class="chain-box top  p-[15px] lg:p-5 overflow-hidden  flex justify-between flex-row">
        <div class="chain wetee flex lg:mb-0 flex-row flex-1">
          <div class="w-full flex-1 flex-col flex items-stretch justify-center gap-2.5">
            <div class="title flex flex-wrap justify-between items-center">
              <div class="flex overflow-hidden items-center">
                <LogoMini class="chain-logo mr-3" />
                <div class="inline truncate">{{ t('home.tagline') }}</div>
              </div>
              <div class="flex"></div>
            </div>
            <WeTEE :key="block_t" />
          </div>
        </div>
        <Chip class="chip">
          <div class="chip-text flex flex-col justify-center items-center">
            <div class="text">WEB3</div>
            <div class="text">+</div>
            <div class="text">WEB2</div>
          </div>
        </Chip>
        <div class="chain polkadot flex lg:mb-0 flex-row flex-1">
          <div class="w-full flex-1 flex-col flex items-stretch justify-center gap-2.5">
            <div class="flex flex-wrap justify-between items-center">
              <div class="flex"></div>
              <div class="title flex overflow-hidden items-center">
                <div class="inline truncate">{{ t('home.polkadot') }}</div>
                <img class="chain-logo ml-3" src="/imgs/polkadot_mini.svg" />
              </div>
            </div>
            <Polkadot />
          </div>
        </div>
      </div>
    </div>
    <div class="container border-rgb flex mb-4 flex-col lg:flex-row">
      <div class="chain-box flex lg:mb-0 flex-col flex-1 border-r overflow-y-auto">
        <div class="title-wrap flex p-[15px] lg:p-5 flex-wrap justify-between items-center">
          <div class="title flex">
            <Svgimg class="chain-logo animate-ping-rotate mr-2 flex-shrink-0" name="lineblock" />
            <div class="inline opacity-50 truncate">{{ t('home.latestBlocks') }}</div>
          </div>
          <div class="flex">
            <a class="outline-none" href="/chain/blocks">
              <button type="button"
                class=" border outline-none whitespace-nowrap border-none px-[10px] py-[10px] text-xs clickable link-bg">
                {{ t('common.viewAll') }}
              </button>
            </a>
          </div>
        </div>
        <div class="flex flex-col divide-y w-full h-[390px] overflow-y-auto overflow-x-hidden">
          <div class="flex justify-between p-5 block" v-for="block in blocks">
            <div class="flex flex-col">
              <div class="flex space-x-2 mb-1 items-center">
                <div class="text-sm inline">{{ t('common.block') }}</div><a class="outline-none font-semibold !text-base number"
                  :href="`/chain/block/${block.header.height}`">{{ block.header.height }}</a>
              </div>
              <div class="flex space-x-2">
                <div class="text-sm inline">{{ t('common.includes') }}</div><a class="outline-none text-sm link"
                  :href="`/chain/txs?height=${block.header.height}`">{{ block.num_txs }} {{ t('common.txs') }}</a>
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
          <div class="title flex">
            <Svgimg class="chain-logo mr-2 flex-shrink-0" name="transfer" />
            <div class="inline opacity-50 truncate">{{ t('home.transfers') }}</div>
          </div>
          <div class="flex">
            <div class="flex space-x-3">
              <a class="outline-none text-sm" href="/chain/txs">
                <button type="button"
                  class="outline-none whitespace-nowrap border-none px-[10px] py-[10px] text-xs clickable link-bg">
                  {{ t('common.viewAll') }}
                </button>
              </a>
            </div>
          </div>
        </div>
        <div class="flex flex-col divide-y w-full h-[390px] overflow-y-auto overflow-x-hidden">
          <div class="flex justify-between p-5 block" v-key="tx.height + '-' + tx.index" v-for="tx in txs">
            <div class="flex flex-1 flex-col">
              <div class="flex space-x-2 mb-1 items-center">
                <div class="text-sm inline">{{ t('common.tx') }}</div><a
                  class="outline-none text-sm whitespace-nowrap font-semibold !text-base number" href="/">{{ tx.height
                  }}-{{ tx.index }}</a>
              </div>
              <div class="flex flex-col md:space-x-2 md:items-center md:flex-row">
                <div class="flex space-x-2 items-center">
                  <div class="text-sm">{{ t('common.hash') }}</div>
                  <div class="text-sm hash flex-1">{{ tx.hash }}</div>
                </div>
              </div>
            </div>
            <div class="flex flex-col ml-4 items-end justify-center">
              <div class="flex items-center">
                <Svgimg class="w-6 h-6 status-ok" name="success" />
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
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Footer from '@/components/Footer.vue'
import Chip from '@/components/anim/Chip.vue'
import Svgimg from '@/components/svg/SvgImg.vue'
import LogoMini from '@/components/svg/LogoMini.vue'
import Polkadot from '@/components/chains/polkadot.vue'
import WeTEE from '@/components/chains/wetee.vue'
import { GetNowBlocks, GetNowTx, SubNewBlock } from '@/apis/side'
import { formatTimeDiff } from '@/utils/time'
import { ReconnectingWebSocket } from '@/utils/ws'

const { t } = useI18n()
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
  background-color: rgba($primary-bg-rgb,0.55);
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
      color: $primary-text;
    }
  }

  .status-ok {
    color: $primary-text;
  }
}

.chip {
  display: inline-flex;
  margin: auto 3.3vw;
  font-size: 0.263vw;
  // border: 1Px solid rgba($secondary-text-rgb, 0.05);
  box-shadow: inset 0 0 0 5Px rgba($secondary-text-rgb, 0.05);
  background-color: transparent;

  .chip-text {
    color: $primary-text;
    font-size: min(30px, 2.2vw);
    line-height: 1;
    text-align: center;
    font-family: "letter-font";
    width: 100%;
  }

  .text {
    position: relative;
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
      color: $primary-text;
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
    color: rgba($primary-text-rgb, 0.4);
  }

  .link {
    color: rgba($primary-text-rgb, 0.4)
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