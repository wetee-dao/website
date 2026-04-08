<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-6">
      <GovSidebar />

      <main class="gov-main flex-1 min-w-0">
        <div class="chain-box main-box">
          <div class="title-wrap flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 class="page-title">{{ t('govSpends.title') }}</h1>
              <p class="page-subtitle">{{ t('govSpends.subtitle') }}</p>
            </div>
            <button class="btn btn--primary" type="button" @click="showCreateModal = true">
              {{ t('govSpends.create') }}
            </button>
          </div>

          <!-- Spends 列表 -->
          <div class="spends-list">
            <div v-for="s in spends" :key="s.id" class="spend-item">
              <div class="spend-header">
                <span class="spend-id">#{{ s.id }}</span>
                <span class="spend-status" :class="statusClass(s.status)">{{ statusLabel(s.status) }}</span>
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
                <button 
                  v-if="s.status === 'Pending'" 
                  class="btn btn--small" 
                  @click="handlePayout(s.id)"
                >
                  {{ t('govSpends.payout') }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="spends.length === 0" class="empty-state">
            {{ t('govSpends.empty') }}
          </div>
        </div>
      </main>
    </div>

    <!-- 创建支出弹窗 -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content">
        <h3 class="modal-title">{{ t('govSpends.createTitle') }}</h3>
        <div class="form-group">
          <label>{{ t('govSpends.formTo') }}</label>
          <input v-model="newSpend.to" type="text" placeholder="0x..." />
        </div>
        <div class="form-group">
          <label>{{ t('govSpends.formAmount') }}</label>
          <input v-model="newSpend.amount" type="text" placeholder="1000" />
        </div>
        <div class="form-group">
          <label>{{ t('govSpends.formTrack') }}</label>
          <select v-model="newSpend.trackId">
            <option v-for="t in tracks" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="showCreateModal = false">{{ t('common.cancel') }}</button>
          <button class="btn btn--primary" @click="handleCreate">{{ t('common.submit') }}</button>
        </div>
      </div>
    </div>

    <div class="pb-4" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GovSidebar from './GovSidebar.vue'
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

interface Track {
  id: number
  name: string
}

const spends = ref<Spend[]>([])
const tracks = ref<Track[]>([])
const showCreateModal = ref(false)
const newSpend = ref({
  to: '',
  amount: '',
  trackId: 0,
})

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
    // 加载 tracks
    const tracksResult = await SecretContractApi.tracks()
    if (tracksResult && Array.isArray(tracksResult)) {
      tracks.value = tracksResult.map((t: any, index: number) => ({
        id: t.id || index,
        name: t.name || `Track ${index}`,
      }))
    }
  } catch (error) {
    console.error('Failed to load spends data:', error)
  }
}

async function handleCreate() {
  try {
    await $getTxProvider(async (wallet: WalletWrap) => {
      await SecretContractApi.spend(wallet, newSpend.value.to, newSpend.value.amount, newSpend.value.trackId)
    })
    showCreateModal.value = false
    newSpend.value = { to: '', amount: '', trackId: 0 }
    loadData()
  } catch (error) {
    console.error('Failed to create spend:', error)
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

  .page-title {
    font-size: 18px;
    font-weight: 500;
    color: $primary-text;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }

  .page-subtitle {
    font-size: 13px;
    color: rgba($secondary-text-rgb, 0.6);
    margin: 0;
    font-weight: 400;
  }

  .btn {
    font-size: 13px;
    border-radius: 2px;
    border: 1px solid rgba($secondary-text-rgb, 0.2);
    background: transparent;
    color: rgba($secondary-text-rgb, 0.7);
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 400;

    &:hover {
      border-color: rgba($secondary-text-rgb, 0.4);
      color: $primary-text;
    }

    &--primary {
      background: rgba(255, 255, 255, 0.08);
      color: $primary-text;
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
        border-radius: 2px;
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
          color: $primary-text;
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  .modal-content {
    background: rgba($primary-bg-rgb, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 24px;
    width: 90%;
    max-width: 480px;

    .modal-title {
      font-size: 16px;
      font-weight: 500;
      color: $primary-text;
      margin: 0 0 20px;
    }

    .form-group {
      margin-bottom: 16px;

      label {
        display: block;
        font-size: 12px;
        color: rgba($secondary-text-rgb, 0.6);
        margin-bottom: 6px;
      }

      input,
      select {
        width: 100%;
        padding: 10px 12px;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        color: $primary-text;

        &:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
  }
}
</style>
