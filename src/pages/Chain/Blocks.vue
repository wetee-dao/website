<template>
  <div class="page gradient-body">
    <div class="blocks container flex mb-4 flex-col lg:flex-row">
      <div class="chain-box flex lg:mb-0 flex-col flex-1">
        <div class="title-wrap flex p-[15px] lg:p-5 flex-wrap justify-between items-center">
          <div class="title flex">
            <Svgimg class="chain-logo animate-ping-rotate mr-2 flex-shrink-0"  name="lineblock" />
            <div class="inline truncate">Blocks</div>
          </div>
        </div>
        <div class="flex flex-col divide-y w-full">
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
              <div class="flex whitespace-nowrap text-sm mr-2">
                <div data-state="closed" class="inline-block leading-none">{{ formatTimeDiff(block.header.time,now) }}</div>
              </div>
              <div class="flex items-center">
                <div class="flex w-[21.34px] h-[21.34px] justify-center items-center">
                  <div class="Waiting_loader__jL6XM" style="width: 20px; aspect-ratio: 1 / 1;"></div>
                </div>
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
import { onMounted, ref } from 'vue';
import Footer from '@/components/Footer.vue'
import Svgimg from "@/components/svg/SvgImg.vue"
import { GetNowBlocks, GetNowTx } from '@/apis/side';
import { formatTimeDiff } from "@/utils/time"

const now = ref(new Date().getTime())
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
      color: $primary-text;
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