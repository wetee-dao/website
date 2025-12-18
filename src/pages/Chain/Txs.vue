<template>
  <div class="page gradient-body">
    <div class="blocks container flex mb-4 flex-col lg:flex-row">
      <div class="chain-box flex lg:mb-0 flex-col flex-1">
        <div class="title-wrap flex p-[15px] lg:p-5 flex-wrap justify-between items-center">
          <div class="title flex overflow-hidden">
            <Svgimg class="chain-logo mr-2 flex-shrink-0" color="#5dfa50" name="transfer" />
            <div class="inline truncate">Transfers</div>
          </div>
        </div>
        <div class="flex flex-col divide-y w-full">
          <div class="flex justify-between p-5 block" v-for="tx in txs">
            <div class="flex flex-col">
              <div class="flex space-x-2 mb-1 items-center">
                <div class="text-sm inline">Tx#</div><a
                  class="outline-none text-sm whitespace-nowrap font-semibold !text-base number"
                  href="/extrinsic/31119512-2">{{ tx.height }}-{{ tx.index }}</a>
              </div>
              <div class="flex flex-col md:space-x-2 md:items-center md:flex-row">
                <div class="flex space-x-2 items-center">
                  <div class="text-sm inline">Hash</div>
                  <div class="flex items-center space-x-1 text-xs">
                    <div class="flex flex-col ">
                      <div class="flex items-center space-x-1">
                        <div data-state="closed" class="inline-block leading-none">
                          <a class="outline-none text-sm"
                            href="/account/G8rzt5C9NnqvBQuwacuQRj4Pi2WUyV3jEveWgkjp8SDeR3Q">
                            <div class="text-sm inline">{{ tx.hash }}</div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div class="flex flex-col items-end justify-center">
              <div class="flex items-center mb-1">
                <div class="inline-flex whitespace-nowrap items-center mr-2">
                  <div data-state="closed" class="inline-block leading-none">
                    <div class="text-sm inline"></div>
                  </div>
                  <div class="text-sm inline ml-1"></div>
                </div>
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
import Svgimg from "@/components/svg/SvgImg.vue"
import { GetNowBlocks, GetNowTx } from '@/apis/side';
import { formatTimeDiff } from "@/utils/time"

const blocks = ref<any[]>([])
const txs = ref<any[]>([])

onMounted(() => {
  GetNowBlocks().then(async datas => {
    blocks.value = datas.block_metas
    const txResult = await GetNowTx(datas.last_height)
    console.log(txResult)
    txs.value = txResult.txs
  })
})

</script>

<style lang="scss" scoped>
.page {
  padding-top: 100px;
}

.blocks {
  border: 4px solid rgba(255, 255, 255, 0.0588235294);
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

.chain {
  .title {
    font-size: 16px;
    font-weight: bold;

    .chain-logo {
      width: 20px;
      height: 20px;
    }
  }

  .data {
    color: #c0c0c0;

    &>div {
      border: 2px solid rgba(60, 60, 60, 0.25);
      padding-left: 10px;
      padding-right: 10px;
      margin: 5px;
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
</style>