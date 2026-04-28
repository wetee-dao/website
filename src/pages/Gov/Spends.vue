<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-0">
      <GovSidebar />

      <main class="gov-main flex-1 min-w-0">
        <div class="chain-box main-box">
          <div class="title-wrap title-wrap--pixel flex flex-wrap justify-between items-center gap-4">
            <div class="title-pixel-bg" aria-hidden="true">
              <PixelBg :tile-size="6" :gap="4" :max-opacity="0.28" :density="0.18" :wave-speed="0.0014" />
            </div>
            <div class="relative z-[1]">
              <h1 class="page-title">{{ t('govSpends.title') }}</h1>
              <p class="page-subtitle">{{ t('govSpends.subtitle') }}</p>
            </div>
            <UButton class="mbtn mbtn--primary" color="neutral" variant="solid" size="sm" type="button" @click="showProposalModal = true">
              {{ t('govSpends.create') }}
            </UButton>
          </div>

          <!-- Spends 列表 -->
          <div class="spends-list">
            <div v-for="s in spends" :key="s.id" class="spend-item">
              <div class="spend-header">
                <span class="spend-id">#{{ s.id }}</span>
                <UBadge class="spend-status" :class="statusClass(s.status)" color="neutral" variant="subtle" size="sm">
                  {{ statusLabel(s.status) }}
                </UBadge>
              </div>
              <div class="spend-body">
                <div class="spend-info">
                  <span class="spend-label">{{ t('govSpends.to') }}</span>
                  <span class="spend-value">{{ formatAddress(s.to) }}</span>
                </div>
                <div class="spend-info">
                  <span class="spend-label">{{ t('govSpends.amount') }}</span>
                  <span class="spend-value">{{ s.amount }}</span>
                </div>
                <div class="spend-info">
                  <span class="spend-label">{{ t('govSpends.track') }}</span>
                  <span class="spend-value">{{ s.trackId }}</span>
                </div>
              </div>
              <div class="spend-actions">
                <UButton
                  v-if="s.status === 'Pending'" 
                  class="mbtn mbtn--small" 
                  color="neutral"
                  variant="outline"
                  size="sm"
                  type="button"
                  @click="handlePayout(s.id)"
                >
                  {{ t('govSpends.payout') }}
                </UButton>
              </div>
            </div>
          </div>

          <div v-if="spends.length === 0" class="empty-state">
            {{ t('govSpends.empty') }}
          </div>
        </div>
      </main>
    </div>

    <!-- 提交公投弹窗 -->
    <SubmitProposal 
      :show="showProposalModal" 
      default-action="spend"
      @close="showProposalModal = false"
      @submitted="loadData"
    />

    <div class="pb-4" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GovSidebar from './GovSidebar.vue'
import PixelBg from '@/components/anim/PixelBg.vue'
import SubmitProposal from './submit-proposal'
import { SecretContractApi } from '@/apis/contract'
import { $getTxProvider } from '@/plugins/chain'
import type { WalletWrap } from '@/providers'

const { t } = useI18n()
type Status = 'Pending' | 'Paid' | 'Expired'

interface Spend {
  id: number
  to: string
  amount: string
  trackId: number
  status: Status
}

const spends = ref<Spend[]>([])
const showProposalModal = ref(false)

function statusClass(status: Status): string {
  const map: Record<Status, string> = {
    Pending: 'status-pending',
    Paid: 'status-paid',
    Expired: 'status-expired',
  }
  return map[status] || ''
}

function statusLabel(status: Status): string {
  const map: Record<Status, string> = {
    Pending: t('govSpends.statusPending'),
    Paid: t('govSpends.statusPaid'),
    Expired: t('govSpends.statusExpired'),
  }
  return map[status] || status
}

function formatAddress(addr: string): string {
  if (addr.length <= 12) return addr
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

async function loadData() {
  try {
    // TODO: 加载支出列表
  } catch (error) {
    console.error('Failed to load spends data:', error)
  }
}

async function handlePayout(spendId: number) {
  try {
    await $getTxProvider(async (wallet: WalletWrap) => {
      await SecretContractApi.payout(wallet, spendId)
    })
    loadData()
  } catch (error) {
    console.error('Failed to payout:', error)
  }
}

onMounted(() => {
  loadData()
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
    font-size: 18px;
    font-weight: 500;
    color: rgba($secondary-text-rgb, 0.92);
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }

  .page-subtitle {
    font-size: 13px;
    color: rgba($secondary-text-rgb, 0.6);
    margin: 0;
    font-weight: 400;
  }

  .mbtn {
    font-size: 13px;
    
    border: 1px solid rgba($secondary-text-rgb, 0.2);
    background: transparent;
    color: rgba($secondary-text-rgb, 0.7);
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 400;

    &:hover {
      border-color: rgba($secondary-text-rgb, 0.4);
      color: rgba($secondary-text-rgb, 0.92);
    }

    &--primary {
      background: rgba(255, 255, 255, 0.08);
      color: rgba($secondary-text-rgb, 0.92);
      border-color: transparent;
    }

    &--small {
      padding: 4px 12px;
      font-size: 12px;
    }
  }
}

.spends-list {
  .spend-item {
    padding: 20px 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);

    &:last-child {
      border-bottom: none;
    }

    .spend-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .spend-id {
        font-size: 14px;
        font-weight: 500;
        color: rgba($secondary-text-rgb, 0.5);
      }

      .spend-status {
        padding: 3px 10px;
        font-size: 11px;
        
        font-weight: 500;

        &.status-pending {
          background: rgba(255, 255, 255, 0.06);
          color: rgba($secondary-text-rgb, 0.8);
        }

        &.status-paid {
          background: rgba(255, 255, 255, 0.06);
          color: rgba($secondary-text-rgb, 0.6);
        }

        &.status-expired {
          background: rgba(255, 255, 255, 0.06);
          color: rgba($secondary-text-rgb, 0.4);
        }
      }
    }

    .spend-body {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 16px;

      .spend-info {
        .spend-label {
          display: block;
          font-size: 11px;
          color: rgba($secondary-text-rgb, 0.4);
          margin-bottom: 4px;
        }

        .spend-value {
          font-size: 14px;
          color: rgba($secondary-text-rgb, 0.85);
          font-family: monospace;
        }
      }
    }
  }
}

.empty-state {
  padding: 60px 32px;
  text-align: center;
  font-size: 14px;
  color: rgba($secondary-text-rgb, 0.5);
}
</style>
