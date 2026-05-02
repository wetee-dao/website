<template>
  <div class="page gradient-body">
    <div class="blocks container flex mb-2 flex-col lg:flex-row">
      <div class="chain-box flex lg:mb-0 flex-col flex-1">
        <div class="title-wrap flex p-6 lg:p-8 flex-wrap justify-between items-center border-b border-white/5" style="position: relative; height: 120px;">
          <PixelBg :tileSize="6" :gap="4" :maxOpacity="0.12" :density="0.4" />
          <div class="title flex relative z-5">
            <Svgimg class="chain-logo animate-ping-rotate mr-3 flex-shrink-0"  name="lineblock" />
            <div class="inline truncate text-xl lg:text-2xl font-semibold">{{ t('chain.blocks') }}</div>
          </div>
        </div>
        <div class="flex flex-col divide-y w-full">
          <div class="flex justify-between p-3 lg:p-4 block" v-for="block in paginatedBlocks">
            <div class="flex flex-col">
              <div class="flex space-x-2 mb-1 items-center">
                <div class="text-sm inline">{{ t('common.block') }}</div><RouterLink class="outline-none font-semibold !text-base number"
                  :to="`/chain/block/${block.header.height}`">{{ block.header.height }}</RouterLink>
              </div>
              <div class="flex space-x-2">
                <div class="text-sm inline">{{ t('common.includes') }}</div><RouterLink class="outline-none text-sm link"
                  :to="`/chain/txs?height=${block.header.height}`">{{ block.num_txs }} {{ t('common.txs') }}</RouterLink>
              </div>
            </div>
            <div class="flex items-center">
              <div class="flex whitespace-nowrap text-xs mr-2">
                <div data-state="closed" class="inline-block leading-none">{{ formatTimeDiff(block.header.time,now) }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button type="button" class="pagination-btn iconfont" :disabled="currentPage <= 1" @click="currentPage = Math.max(1, currentPage - 1)">
            &#xe602;
          </button>
          <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
          <button type="button" class="pagination-btn iconfont" :disabled="currentPage >= totalPages" @click="currentPage = Math.min(totalPages, currentPage + 1)">
            &#xe602;
          </button>
        </div>
      </div>
    </div>
    <div class="mb-4"></div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Footer from '@/components/Footer.vue'
import Svgimg from '@/components/svg/SvgImg.vue'
import PixelBg from '@/components/anim/PixelBg.vue'
import { GetNowBlocks, GetNowTx } from '@/apis/side'
import { formatTimeDiff } from '@/utils/time'

const { t } = useI18n()
const now = ref(new Date().getTime())
const blocks = ref<any[]>([])
const txs = ref<any[]>([])

// Pagination
const pageSize = 10
const currentPage = ref(1)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(blocks.value.length / pageSize))
)
const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const endIndex = computed(() =>
  Math.min(currentPage.value * pageSize, blocks.value.length)
)
const paginatedBlocks = computed(() =>
  blocks.value.slice(startIndex.value, endIndex.value)
)

watch(totalPages, (total) => {
  if (currentPage.value > total) currentPage.value = Math.max(1, total)
})

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
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-height: calc(100vh - 140px);
}

.border-rgb {
  border-width: 4px;
  border-color: #ffffff23;
}

.chain-box {
  background-color: rgba($primary-bg-rgb, 0.5);

  .title {
    font-size: 14px;
    font-weight: 500;

    &>.inline {
      line-height: 24px;
    }

    .chain-logo {
      width: 24px;
      height: 24px;
      color: $primary-text;
    }
  }
}

.block {
  color: #858585;
  border-color: rgba(255, 255, 255, 0.09);

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

/* Pagination — prominent */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.pagination-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: all 0.2s ease;
  min-width: 40px;
}

.pagination-btn:first-child {
  transform: rotate(180deg);
}

.pagination-btn:hover:not(:disabled) {
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.pagination-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.02);
}

.pagination-info {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  min-width: 80px;
  text-align: center;
}
</style>