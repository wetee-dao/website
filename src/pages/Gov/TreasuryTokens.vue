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
            <div class="relative z-[1]">
              <h1 class="page-title">{{ t('govTreasuryTokens.title') }}</h1>
              <p class="page-subtitle">{{ t('govTreasuryTokens.subtitle') }}</p>
            </div>
          </div>

          <div class="mock-banner px-5 py-3 lg:px-8">
            <p class="mock-banner-text">{{ t('govTreasuryTokens.mockHint') }}</p>
          </div>

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
              </tbody>
            </table>
          </div>

          <!-- 移动端卡片 -->
          <div class="grid gap-3 px-5 pb-8 md:hidden lg:px-8">
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
          </div>
        </div>
      </main>
    </div>
    <div class="pb-4" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import GovSidebar from './GovSidebar.vue'
import PixelBg from '@/components/anim/PixelBg.vue'

const { t } = useI18n()

interface TokenRow {
  id: string
  symbol: string
  assetLabel: string
  networkLabel: string
  balance: string
}

/** 接口未就绪：占位数据，后续替换为 API 响应 */
const tokenRows = computed<TokenRow[]>(() => [
  {
    id: 'dot',
    symbol: t('govTreasuryTokens.dotSymbol'),
    assetLabel: t('govTreasuryTokens.dotAsset'),
    networkLabel: t('govTreasuryTokens.dotNetwork'),
    balance: t('govTreasuryTokens.balancePlaceholder'),
  },
  {
    id: 'ksm',
    symbol: t('govTreasuryTokens.ksmSymbol'),
    assetLabel: t('govTreasuryTokens.ksmAsset'),
    networkLabel: t('govTreasuryTokens.ksmNetwork'),
    balance: t('govTreasuryTokens.balancePlaceholder'),
  },
])
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

.mock-banner {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(255, 255, 255, 0.02);
}

.mock-banner-text {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: rgba($secondary-text-rgb, 0.45);
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

.label-muted {
  font-size: 11px;
  color: rgba($secondary-text-rgb, 0.45);
}
</style>
