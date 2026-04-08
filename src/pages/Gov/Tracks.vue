<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-6">
      <GovSidebar />

      <main class="gov-main flex-1 min-w-0">
        <div class="chain-box main-box">
          <div class="title-wrap flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 class="page-title">{{ t('govTracks.title') }}</h1>
              <p class="page-subtitle">{{ t('govTracks.subtitle') }}</p>
            </div>
          </div>

          <!-- Tracks 列表 -->
          <div class="tracks-list">
            <div v-for="track in tracks" :key="track.id" class="track-item">
              <div class="track-header">
                <div class="track-info">
                  <span class="track-name">{{ track.name }}</span>
                  <span v-if="track.id === defaultTrackId" class="track-badge">{{ t('govTracks.default') }}</span>
                </div>
                <button 
                  v-if="track.id !== defaultTrackId" 
                  class="btn btn--small" 
                  @click="handleSetDefault(track.id)"
                >
                  {{ t('govTracks.setDefault') }}
                </button>
              </div>
              <div class="track-details">
                <div class="detail-row">
                  <span class="detail-label">{{ t('govTracks.preparePeriod') }}</span>
                  <span class="detail-value">{{ track.preparePeriod }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">{{ t('govTracks.decisionPeriod') }}</span>
                  <span class="detail-value">{{ track.decisionPeriod }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">{{ t('govTracks.confirmPeriod') }}</span>
                  <span class="detail-value">{{ track.confirmPeriod }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">{{ t('govTracks.decisionDeposit') }}</span>
                  <span class="detail-value">{{ track.decisionDeposit }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">{{ t('govTracks.maxBalance') }}</span>
                  <span class="detail-value">{{ track.maxBalance }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="tracks.length === 0" class="empty-state">
            {{ t('govTracks.empty') }}
          </div>
        </div>
      </main>
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

interface Track {
  id: number
  name: string
  preparePeriod: string
  decisionPeriod: string
  confirmPeriod: string
  decisionDeposit: string
  maxBalance: string
}

const tracks = ref<Track[]>([])
const defaultTrackId = ref(0)

async function loadData() {
  try {
    // 加载默认track
    const defaultResult = await SecretContractApi.defaultTrack()
    if (defaultResult !== undefined) {
      defaultTrackId.value = Number(defaultResult)
    }

    // 加载所有tracks
    const tracksResult = await SecretContractApi.tracks()
    if (tracksResult && Array.isArray(tracksResult)) {
      tracks.value = tracksResult.map((t: any, index: number) => ({
        id: t.id || index,
        name: t.name ? String.fromCharCode(...t.name) : `Track ${index}`,
        preparePeriod: `${t.prepare_period || 0} blocks`,
        decisionPeriod: `${t.decision_period || 0} blocks`,
        confirmPeriod: `${t.confirm_period || 0} blocks`,
        decisionDeposit: `${t.decision_deposit || 0} DOT`,
        maxBalance: `${t.max_balance || 0} DOT`,
      }))
    }
  } catch (error) {
    console.error('Failed to load tracks data:', error)
  }
}

async function handleSetDefault(trackId: number) {
  try {
    await $getTxProvider(async (wallet: WalletWrap) => {
      await SecretContractApi.setDefaultTrack(wallet, trackId)
    })
    loadData()
  } catch (error) {
    console.error('Failed to set default track:', error)
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
    font-size: 12px;
    padding: 6px 12px;
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

    &--small {
      padding: 4px 10px;
      font-size: 11px;
    }
  }
}

.tracks-list {
  .track-item {
    padding: 24px 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);

    &:last-child {
      border-bottom: none;
    }

    .track-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .track-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .track-name {
          font-size: 16px;
          font-weight: 500;
          color: $primary-text;
        }

        .track-badge {
          padding: 2px 8px;
          font-size: 10px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba($secondary-text-rgb, 0.6);
          border-radius: 2px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
    }

    .track-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;

      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;

        .detail-label {
          font-size: 12px;
          color: rgba($secondary-text-rgb, 0.5);
        }

        .detail-value {
          font-size: 12px;
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
</style>
