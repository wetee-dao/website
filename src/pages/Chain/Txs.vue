<template>
  <div class="page gradient-body">
    <div class="blocks container flex mb-2 flex-col lg:flex-row">
      <div class="chain-box flex lg:mb-0 flex-col flex-1">
        <div class="title-wrap flex p-6 lg:p-8 flex-wrap justify-between items-center" style="position: relative; height: 120px;">
          <PixelBg :tileSize="6" :gap="4" :maxOpacity="0.12" :density="0.4" />
          <div class="title flex overflow-hidden relative z-5">
            <Svgimg class="chain-logo mr-3 flex-shrink-0"  name="transfer" />
            <div class="inline truncate text-xl lg:text-2xl font-semibold">{{ t('chain.txs') }}</div>
          </div>
        </div>
        <div class="flex flex-col divide-y w-full">
          <div class="flex justify-between p-3 lg:p-4 block" v-for="tx in txs">
            <div class="flex flex-col">
              <div class="flex space-x-2 mb-1 items-center">
                <div class="text-sm inline">{{ t('common.tx') }}</div>
                <RouterLink
                  class="outline-none text-sm whitespace-nowrap font-semibold !text-base number link"
                  :to="`/chain/tx/${tx.hash}`">{{ tx.height }}-{{ tx.index }}</RouterLink>
              </div>
              <div class="flex flex-col md:space-x-2 md:items-center md:flex-row">
                <div class="flex space-x-2 items-center">
                  <div class="text-sm inline">{{ t('common.hash') }}</div>
                  <RouterLink :to="`/chain/tx/${tx.hash}`" class="text-sm link mono truncate max-w-[200px] lg:max-w-[400px]">{{ tx.hash }}</RouterLink>
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
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Footer from '@/components/Footer.vue'
import Svgimg from '@/components/svg/SvgImg.vue'
import PixelBg from '@/components/anim/PixelBg.vue'
import { GetNowBlocks, GetNowTx, GetTxByHeight } from '@/apis/side'

const { t } = useI18n()
const route = useRoute()
const blocks = ref<any[]>([])
const txs = ref<any[]>([])

// Pagination
const pageSize = 10
const currentPage = ref(1)
const totalCount = ref(0)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalCount.value / pageSize))
)

// Watch page changes to reload data
watch(currentPage, () => {
  loadTxs(false)
})

function loadTxs(resetPage: boolean = true) {
  if (resetPage) {
    currentPage.value = 1
  }
  const height = route.query.height ?? route.params.height
  if (height != null && String(height).trim() !== '') {
    GetTxByHeight(String(height).trim(), currentPage.value, pageSize).then((res) => {
      txs.value = res?.txs ?? []
      totalCount.value = res?.total_count ?? 0
    })
  } else {
    GetNowBlocks().then(async (datas) => {
      blocks.value = datas.block_metas
      const txResult = await GetNowTx(datas.last_height, currentPage.value, pageSize)
      txs.value = txResult?.txs ?? []
      totalCount.value = txResult?.total_count ?? 0
    })
  }
}

onMounted(loadTxs)
watch(() => [route.query.height, route.params.height], () => loadTxs())

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
  border-color: #ffffff0f;
}

.chain-box {
  background-color: rgba($primary-bg-rgb, 0.5);
  border-radius: 4px;

  .title-wrap {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

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
    color: rgba($primary-text-rgb, 0.6);
    text-decoration: none;

    &:hover {
      color: $primary-text;
    }
  }

  .mono {
    font-family: ui-monospace, monospace;
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