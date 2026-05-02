<template>
  <div class="page gradient-body">
    <div class="gov-layout container mb-4 flex gap-0 flex-row">
      <GovSidebar />

      <main class="gov-main min-w-0 flex-1">
        <div class="chain-box main-box">
          <div class="title-wrap title-wrap--pixel flex flex-wrap items-center justify-between gap-4">
            <div class="title-pixel-bg pointer-events-none" aria-hidden="true">
              <PixelBg :tile-size="6" :gap="4" :max-opacity="0.28" :density="0.18" :wave-speed="0.0014" />
            </div>
            <div class="relative z-[1] min-w-0 flex-1">
              <h1 class="page-title">{{ t('govTreasuryTokens.title') }}</h1>
              <p class="page-subtitle">{{ t('govTreasuryTokens.subtitle') }}</p>
            </div>
            <div v-if="chainSelectItems.length" class="relative z-[1] w-full shrink-0 sm:w-72">
              <div class="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                {{ t('govTreasuryTokens.selectChain') }}
              </div>
              <USelect
                v-model="selectedChainId"
                class="w-full p-3"
                :items="chainSelectItems"
                value-key="id"
                label-key="name"
                size="lg"
              />
            </div>
          </div>

          <p v-if="loadError" class="error-banner px-5 py-3 text-sm lg:px-8" role="alert">
            {{ t('govTreasuryTokens.errorLoad') }}: {{ loadError }}
          </p>
          <p v-else-if="noCloudAddress" class="hint-banner px-5 py-3 text-sm lg:px-8">
            {{ t('govTreasuryTokens.noCloudAddress') }}
          </p>

          <!-- 桌面表格 -->
          <div class="hidden md:block token-table-wrap px-5 pb-8 lg:px-8">
            <table class="token-table w-full border-collapse text-left">
              <thead>
                <tr>
                  <th scope="col">{{ t('govTreasuryTokens.colSymbol') }}</th>
                  <th scope="col">{{ t('govTreasuryTokens.colAsset') }}</th>
                  <th scope="col">{{ t('govTreasuryTokens.colNetwork') }}</th>
                  <th scope="col" class="text-end">{{ t('govTreasuryTokens.colBalance') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="4" class="token-loading">{{ t('govTreasuryTokens.loading') }}</td>
                </tr>
                <tr v-else-if="!tokenRows.length && !noCloudAddress">
                  <td colspan="4" class="token-empty">{{ t('govTreasuryTokens.emptyTokens') }}</td>
                </tr>
                <template v-else>
                  <tr v-for="row in tokenRows" :key="row.id">
                    <td>
                      <span class="token-symbol">{{ row.symbol }}</span>
                    </td>
                    <td class="token-asset">{{ row.assetLabel }}</td>
                    <td>
                      <UBadge color="neutral" variant="subtle" size="sm" class="network-badge">
                        {{ row.networkLabel }}
                      </UBadge>
                    </td>
                    <td class="token-balance text-end font-mono">{{ row.balance }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <!-- 移动端卡片 -->
          <div class="grid gap-3 px-5 pb-8 md:hidden lg:px-8">
            <template v-if="loading">
              <div class="token-card token-card--muted">{{ t('govTreasuryTokens.loading') }}</div>
            </template>
            <template v-else-if="!tokenRows.length && !noCloudAddress">
              <div class="token-card token-card--muted">{{ t('govTreasuryTokens.emptyTokens') }}</div>
            </template>
            <template v-else>
              <div v-for="row in tokenRows" :key="row.id" class="token-card">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="token-symbol text-lg">{{ row.symbol }}</div>
                    <div class="token-asset mt-1 text-sm">{{ row.assetLabel }}</div>
                  </div>
                  <UBadge color="neutral" variant="subtle" size="sm" class="network-badge shrink-0">
                    {{ row.networkLabel }}
                  </UBadge>
                </div>
                <div class="mt-4 flex items-baseline justify-between border-t border-white/[0.06] pt-3">
                  <span class="label-muted">{{ t('govTreasuryTokens.colBalance') }}</span>
                  <span class="token-balance font-mono">{{ row.balance }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </main>
    </div>
    <div class="pb-4" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import GovSidebar from './GovSidebar.vue'
import PixelBg from '@/components/anim/PixelBg.vue'
import { fetchChainContractsSlice, type ChainContractsSlice } from '@/apis/chain-info'
import { fetchCloudTreasuryTokenRows, type TreasuryTokenRow } from '@/apis/treasury-polkadot-tokens'

const { t } = useI18n()

const chains = ref<ChainContractsSlice[]>([])
const selectedChainId = ref('0')
const tokenRows = ref<TreasuryTokenRow[]>([])
const loading = ref(false)
const loadError = ref<string | null>(null)

const chainSelectItems = computed(() =>
  chains.value.map((c, i) => ({
    id: String(i),
    name: c.network_label,
  })),
)

const currentChain = computed(() => {
  const i = Number.parseInt(selectedChainId.value, 10)
  if (Number.isNaN(i) || i < 0 || i >= chains.value.length) return undefined
  return chains.value[i]
})

const noCloudAddress = computed(() => {
  const c = currentChain.value
  if (!c) return false
  return !String(c.cloud_contract ?? '').trim()
})

async function loadTokens() {
  const c = currentChain.value
  loadError.value = null
  if (!c || !String(c.cloud_contract ?? '').trim()) {
    tokenRows.value = []
    return
  }
  loading.value = true
  try {
    tokenRows.value = await fetchCloudTreasuryTokenRows({
      cloudAddress: c.cloud_contract,
      networkLabel: c.network_label,
      tAssetKind: (key: string) => t(`govTreasuryTokens.assetKind.${key}`),
    })
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : String(e)
    tokenRows.value = []
  } finally {
    loading.value = false
  }
}

watch([selectedChainId, chains], () => {
  void loadTokens()
})

watch(
  chainSelectItems,
  (items) => {
    if (!items.length) return
    if (!items.some((x) => x.id === selectedChainId.value)) {
      selectedChainId.value = items[0].id
    }
  },
  { immediate: true },
)

onMounted(async () => {
  try {
    chains.value = await fetchChainContractsSlice()
  } catch {
    chains.value = []
  }
  await loadTokens()
})
</script>

<style lang="scss" scoped>
.page {
  padding-top: 100px;
}

.gov-layout {
  min-height: calc(100vh - 230px);
}

.chain-box {
  background-color: rgba($primary-bg-rgb, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.main-box {
  .title-wrap {
    padding: 28px 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .title-wrap--pixel {
    position: relative;
    overflow: hidden;
  }

  .title-pixel-bg {
    position: absolute;
    inset: 0;
    opacity: 0.65;
    filter: blur(0.15px);
    -webkit-mask-image: radial-gradient(90% 140% at 50% 0%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 72%);
    mask-image: radial-gradient(90% 140% at 50% 0%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 72%);
  }

  .page-title {
    margin: 0 0 6px;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: rgba($secondary-text-rgb, 0.92);
  }

  .page-subtitle {
    margin: 0;
    font-size: 13px;
    font-weight: 400;
    color: rgba($secondary-text-rgb, 0.6);
  }
}

.error-banner {
  border-bottom: 1px solid rgba(255, 80, 80, 0.2);
  background: rgba(255, 80, 80, 0.06);
  color: rgba(255, 200, 200, 0.9);
}

.hint-banner {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: rgba($secondary-text-rgb, 0.55);
}

.token-table-wrap {
  padding-top: 24px;
}

.token-table {
  th {
    padding: 10px 12px 12px 0;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba($secondary-text-rgb, 0.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  td {
    padding: 18px 12px 18px 0;
    vertical-align: middle;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}

.token-loading,
.token-empty {
  font-size: 14px;
  color: rgba($secondary-text-rgb, 0.55);
}

.token-symbol {
  font-size: 15px;
  font-weight: 600;
  color: rgba($secondary-text-rgb, 0.92);
}

.token-asset {
  font-size: 14px;
  color: rgba($secondary-text-rgb, 0.75);
}

.token-balance {
  font-size: 14px;
  color: rgba($secondary-text-rgb, 0.85);
}

.network-badge {
  font-weight: 500;
}

.token-card {
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}

.token-card--muted {
  color: rgba($secondary-text-rgb, 0.55);
  font-size: 14px;
}

.label-muted {
  font-size: 11px;
  color: rgba($secondary-text-rgb, 0.45);
}
</style>
