<template>
  <div class="page gradient-body">
    <div class="container flex mb-4 flex-col lg:flex-row">
      <div class="chain-box flex lg:mb-0 flex-col flex-1">
        <div class="title-wrap flex p-[15px] lg:p-5 flex-wrap justify-between items-center">
          <div class="title flex overflow-hidden">
            <Svgimg class="chain-logo mr-2 flex-shrink-0" name="lineblock" />
            <div class="inline truncate">{{ t('chainDetail.blockTitle') }} #{{ height }}</div>
          </div>
          <RouterLink to="/chain/blocks" class="text-sm link">{{ t('chainDetail.backToBlocks') }}</RouterLink>
        </div>

        <template v-if="loading">
          <div class="p-8 flex justify-center items-center">
            <div class="Waiting_loader__jL6XM w-10 h-10"></div>
          </div>
        </template>
        <template v-else-if="error">
          <div class="p-8 text-center text-red-400">{{ error }}</div>
        </template>
        <template v-else-if="block">
          <div class="detail divide-y">
            <div class="detail-row flex flex-wrap p-5">
              <span class="label">{{ t('chainDetail.blockHeight') }}</span>
              <span class="value number">{{ block.block?.header?.height || height }}</span>
            </div>
            <div class="detail-row flex flex-wrap p-5">
              <span class="label">{{ t('chainDetail.blockHash') }}</span>
              <span class="value mono hash">{{ blockIdHash }}</span>
            </div>
            <div class="detail-row flex flex-wrap p-5">
              <span class="label">{{ t('chainDetail.proposer') }}</span>
              <span class="value mono">{{ proposerAddress }}</span>
            </div>
            <div class="detail-row flex flex-wrap p-5">
              <span class="label">{{ t('chainDetail.blockTime') }}</span>
              <span class="value">{{ blockTimeFormatted }}</span>
              <span class="value-muted ml-2">({{ timeAgoStr }})</span>
            </div>
            <div class="detail-row flex flex-wrap p-5">
              <span class="label">{{ t('chainDetail.chainId') }}</span>
              <span class="value mono">{{ chainId }}</span>
            </div>
            <div class="detail-row flex flex-wrap p-5">
              <span class="label">{{ t('chainDetail.transactions') }}</span>
              <span class="value number">{{ numTxs }}</span>
              <RouterLink v-if="numTxs > 0" :to="`/chain/txs?height=${height}`" class="link ml-2">{{ t('chainDetail.viewTransactions') }}</RouterLink>
            </div>
            <div class="detail-row flex flex-wrap p-5" v-if="lastBlockHash">
              <span class="label">{{ t('chainDetail.previousBlockHash') }}</span>
              <RouterLink :to="`/chain/block/${Number(block.block?.header?.height ?? 0) - 1}`" class="value mono link">{{ lastBlockHash }}</RouterLink>
            </div>
            <div class="detail-row flex flex-wrap p-5" v-if="appHash">
              <span class="label">{{ t('chainDetail.appHash') }}</span>
              <span class="value mono small">{{ appHash }}</span>
            </div>
            <div class="detail-row flex flex-wrap p-5" v-if="dataHash">
              <span class="label">{{ t('chainDetail.dataHash') }}</span>
              <span class="value mono small">{{ dataHash }}</span>
            </div>
          </div>

          <div v-if="numTxs > 0" class="txs-section p-5 border-t border-white/10">
            <div class="text-sm text-secondary">
              {{ t('chainDetail.thisBlockHas') }} <span class="number">{{ numTxs }}</span> {{ t('chainDetail.transactionS') }}
              <RouterLink :to="`/chain/txs?height=${height}`" class="link">{{ t('chainDetail.viewTransactionList') }}</RouterLink>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="mb-4"></div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Footer from '@/components/Footer.vue'
import Svgimg from '@/components/svg/SvgImg.vue'
import { GetBlockByHeight } from '@/apis/side'
import { timeAgo } from '@/utils/time'

const { t } = useI18n()
const route = useRoute()
const height = computed(() => route.params.height as string)

const loading = ref(true)
const error = ref('')
const block = ref<{
  block_id?: { hash?: string; parts?: { total?: number; hash?: string } }
  block?: {
    header?: {
      height?: string
      time?: string
      chain_id?: string
      proposer_address?: string
      last_block_id?: { hash?: string }
      app_hash?: string
      data_hash?: string
    }
    data?: { txs?: string[] }
  }
} | null>(null)

const blockIdHash = computed(() => {
  const h = block.value?.block_id?.hash
  return h ? toHex(h) : '—'
})

const proposerAddress = computed(() => {
  const addr = block.value?.block?.header?.proposer_address
  return addr ? toHex(addr) : '—'
})

const blockTimeFormatted = computed(() => {
  const t = block.value?.block?.header?.time
  if (!t) return '—'
  try {
    return new Date(t).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
  } catch {
    return t
  }
})

const timeAgoStr = computed(() => {
  const t = block.value?.block?.header?.time
  if (!t) return ''
  return timeAgo(new Date(t).getTime())
})

const chainId = computed(() => block.value?.block?.header?.chain_id ?? '—')

const numTxs = computed(() => {
  const txs = block.value?.block?.data?.txs
  return txs ? txs.length : 0
})

const lastBlockHash = computed(() => {
  const h = block.value?.block?.header?.last_block_id?.hash
  return h ? toHex(h) : ''
})

const appHash = computed(() => {
  const h = block.value?.block?.header?.app_hash
  return h ? toHex(h) : ''
})

const dataHash = computed(() => {
  const h = block.value?.block?.header?.data_hash
  return h ? toHex(h) : ''
})

function toHex(b64OrHex: string): string {
  if (!b64OrHex) return '—'
  if (/^[0-9A-Fa-f]+$/.test(b64OrHex)) return b64OrHex
  try {
    const bin = atob(b64OrHex.replace(/-/g, '+').replace(/_/g, '/'))
    return Array.from(bin, (c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
  } catch {
    return b64OrHex
  }
}

async function fetchBlock() {
  const h = height.value
  if (!h) return
  loading.value = true
  error.value = ''
  block.value = null
  try {
    const result = await GetBlockByHeight(h)
    block.value = result
  } catch (e: any) {
    error.value = e?.message || e?.response?.data?.error || 'Failed to fetch block'
  } finally {
    loading.value = false
  }
}

onMounted(fetchBlock)
watch(height, fetchBlock)
</script>

<style lang="scss" scoped>
.page {
  padding-top: 100px;
}

.chain-box {
  background-color: $primary-bg;
  background-color: rgba($primary-bg-rgb, 0.68);
  border: 4px solid rgba(255, 255, 255, 0.0588235294);
  min-height: calc(100vh - 230px);

  .title-wrap {
    border-bottom: 1px solid rgba(255, 255, 255, 0.0588235294);
  }

  .title {
    font-size: 16px;
    font-weight: bold;

    .inline {
      line-height: 31px;
    }

    .chain-logo {
      width: 30px;
      height: 30px;
      color: $primary-text;
    }
  }
}

.detail-row {
  color: #858585;
  border-color: rgba(255, 255, 255, 0.05);

  .label {
    flex: 0 0 140px;
    font-size: 14px;
    color: rgba($primary-text-rgb, 0.7);
  }

  .value {
    flex: 1;
    word-break: break-all;
    color: $primary-text;

    &.number {
      font-weight: 600;
    }

    &.mono {
      font-family: ui-monospace, monospace;
      font-size: 13px;
    }

    &.hash {
      font-size: 12px;
    }

    &.small {
      font-size: 11px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .value-muted {
    font-size: 12px;
    color: rgba($primary-text-rgb, 0.5);
  }
}

.link {
  color: rgba($primary-text-rgb, 0.7);
  text-decoration: underline;

  &:hover {
    color: $primary-text;
  }
}

.txs-section {
  .text-secondary {
    color: rgba($primary-text-rgb, 0.6);
  }
}
</style>
