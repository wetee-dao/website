<template>
  <div class="page gradient-body">
    <div class="container flex mb-4 flex-col lg:flex-row">
      <div class="chain-box flex lg:mb-0 flex-col flex-1">
        <div class="title-wrap flex p-6 lg:p-8 flex-wrap justify-between items-center border-b border-white/5" style="position: relative; height: 120px;">
          <PixelBg :tileSize="6" :gap="4" :maxOpacity="0.12" :density="0.4" />
          <div class="title flex overflow-hidden relative z-10">
            <Svgimg class="chain-logo mr-3 flex-shrink-0" name="transfer" />
            <div class="inline truncate text-xl lg:text-2xl font-semibold">{{ t('chainDetail.txTitle') }}</div>
          </div>
          <RouterLink to="/chain/txs" class="text-sm link relative z-10">{{ t('chainDetail.backToTxs') }}</RouterLink>
        </div>

        <template v-if="loading">
          <div class="p-8 flex justify-center items-center">
            <div class="Waiting_loader__jL6XM w-10 h-10"></div>
          </div>
        </template>
        <template v-else-if="error">
          <div class="p-8 text-center text-red-400">{{ error }}</div>
        </template>
        <template v-else-if="tx">
          <div class="detail divide-y">
            <div class="detail-row flex flex-wrap p-4">
              <span class="label">{{ t('chainDetail.txHash') }}</span>
              <span class="value mono hash">{{ hash }}</span>
            </div>
            <div class="detail-row flex flex-wrap p-4">
              <span class="label">{{ t('chainDetail.blockHeight') }}</span>
              <RouterLink :to="`/chain/block/${txHeight}`" class="value number link">{{ txHeight }}</RouterLink>
            </div>
            <div class="detail-row flex flex-wrap p-4">
              <span class="label">{{ t('chainDetail.txIndex') }}</span>
              <span class="value number">{{ txIndex }}</span>
            </div>
            <div class="detail-row flex flex-wrap p-4" v-if="txTime">
              <span class="label">{{ t('chainDetail.txTime') }}</span>
              <span class="value">{{ txTimeFormatted }}</span>
              <span class="value-muted ml-2">({{ timeAgoStr }})</span>
            </div>
            <div class="detail-row flex flex-wrap p-4">
              <span class="label">{{ t('chainDetail.txStatus') }}</span>
              <span class="value" :class="txSuccess ? 'text-green-400' : 'text-red-400'">
                {{ txSuccess ? t('chainDetail.success') : t('chainDetail.failed') }}
              </span>
            </div>
            <div class="detail-row flex flex-wrap p-4" v-if="gasUsed">
              <span class="label">{{ t('chainDetail.gasUsed') }}</span>
              <span class="value number">{{ gasUsed }}</span>
            </div>
            <div class="detail-row flex flex-wrap p-4" v-if="gasWanted">
              <span class="label">{{ t('chainDetail.gasWanted') }}</span>
              <span class="value number">{{ gasWanted }}</span>
            </div>
            <div class="detail-row flex flex-wrap p-4" v-if="txCode !== undefined">
              <span class="label">{{ t('chainDetail.txCode') }}</span>
              <span class="value number" :class="txCode === 0 ? 'text-green-400' : 'text-red-400'">{{ txCode }}</span>
            </div>
          </div>

          <div class="data-section p-4 border-t border-white/10" v-if="txData">
            <div class="section-title mb-3">{{ t('chainDetail.txData') }}</div>
            <pre class="data-content">{{ txDataFormatted }}</pre>
          </div>

          <div class="events-section p-4 border-t border-white/10" v-if="txEvents && txEvents.length > 0">
            <div class="section-title mb-3">{{ t('chainDetail.txEvents') }}</div>
            <pre class="data-content">{{ eventsFormatted }}</pre>
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
import PixelBg from '@/components/anim/PixelBg.vue'
import { getTxByHash } from '@/apis/side'
import { timeAgo } from '@/utils/time'

const { t } = useI18n()
const route = useRoute()
const hash = computed(() => route.params.hash as string)

const loading = ref(true)
const error = ref('')
const tx = ref<any>(null)

const txHeight = computed(() => tx.value?.height ?? '—')
const txIndex = computed(() => tx.value?.index ?? 0)
const txTime = computed(() => tx.value?.tx_result?.time ?? tx.value?.time)
const txSuccess = computed(() => {
  const code = tx.value?.tx_result?.code ?? tx.value?.code ?? 0
  return code === 0
})
const txCode = computed(() => tx.value?.tx_result?.code ?? tx.value?.code)
const gasUsed = computed(() => tx.value?.tx_result?.gas_used ?? tx.value?.gas_used)
const gasWanted = computed(() => tx.value?.tx_result?.gas_wanted ?? tx.value?.gas_wanted)
const txData = computed(() => tx.value?.tx ?? tx.value?.data)
const txEvents = computed(() => tx.value?.tx_result?.events ?? tx.value?.events)

const txTimeFormatted = computed(() => {
  const time = txTime.value
  if (!time) return '—'
  try {
    return new Date(time).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
  } catch {
    return time
  }
})

const timeAgoStr = computed(() => {
  const time = txTime.value
  if (!time) return ''
  return timeAgo(new Date(time).getTime())
})

const txDataFormatted = computed(() => {
  const data = txData.value
  if (!data) return ''
  if (typeof data === 'string') {
    try {
      // Convert base64 to hex
      const bin = atob(data.replace(/-/g, '+').replace(/_/g, '/'))
      const hex = Array.from(bin, (c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
      return hex.toUpperCase()
    } catch {
      return data
    }
  }
  return JSON.stringify(data, null, 2)
})

const eventsFormatted = computed(() => {
  const events = txEvents.value
  if (!events) return ''
  return JSON.stringify(events, null, 2)
})

async function fetchTx() {
  const h = hash.value
  if (!h) return
  loading.value = true
  error.value = ''
  tx.value = null
  try {
    const result = await getTxByHash(h)
    tx.value = result
  } catch (e: any) {
    error.value = e?.message || e?.response?.data?.error || 'Failed to fetch transaction'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTx)
watch(hash, fetchTx)
</script>

<style lang="scss" scoped>
.page {
  padding-top: 100px;
}

.chain-box {
  background-color: rgba($primary-bg-rgb, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  
  min-height: calc(100vh - 140px);


  .title {
    .chain-logo {
      width: 24px;
      height: 24px;
      color: $primary-text;
    }
  }
}

.detail-row {
  color: #858585;
  border-color: rgba(255, 255, 255, 0.05);

  .label {
    flex: 0 0 120px;
    font-size: 13px;
    color: rgba($primary-text-rgb, 0.6);
  }

  .value {
    flex: 1;
    word-break: break-all;
    color: $primary-text;
    font-size: 14px;

    &.number {
      font-weight: 600;
    }

    &.mono {
      font-family: ui-monospace, monospace;
      font-size: 12px;
    }

    &.hash {
      font-size: 11px;
    }
  }

  .value-muted {
    font-size: 12px;
    color: rgba($primary-text-rgb, 0.5);
  }
}

.link {
  color: rgba($primary-text-rgb, 0.6);
  text-decoration: underline;

  &:hover {
    color: $primary-text;
  }
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  color: rgba($primary-text-rgb, 0.7);
}

.data-content {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: rgba($primary-text-rgb, 0.8);
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 300px;
  overflow-y: auto;
}
</style>
