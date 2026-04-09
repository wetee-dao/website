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
            <div class="header-actions">
              <UButton
                class="btn-add-track p-3"
                color="neutral"
                variant="outline"
                size="lg"
                type="button"
                @click="showProposalModal = true"
              >
                {{ t('govTracks.addTrack') }}
              </UButton>
              <div class="track-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ tracks.length }}</span>
                  <span class="stat-label">Tracks</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tracks 列表 -->
          <div v-if="tracks.length > 0" class="tracks-grid">
            <div v-for="track in tracks" :key="track.id" class="track-card" :class="{ 'is-default': track.id === defaultTrackId }">
              <div class="track-card-header">
                <div class="track-title-row">
                  <span class="track-id">#{{ track.id }}</span>
                  <h3 class="track-name">{{ track.name }}&nbsp;&nbsp;</h3>
                  <UBadge v-if="track.id === defaultTrackId" class="default-badge" color="neutral" variant="subtle" size="sm">
                    {{ t('govTracks.default') }}
                  </UBadge>
                </div>
              </div>
              
              <div class="track-card-body">
                <div class="track-meta">
                  <div class="meta-item">
                    <span class="meta-label">{{ t('govTracks.preparePeriod') }}</span>
                    <span class="meta-value">{{ track.preparePeriod }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">{{ t('govTracks.decisionPeriod') }}</span>
                    <span class="meta-value">{{ track.decisionPeriod }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">{{ t('govTracks.confirmPeriod') }}</span>
                    <span class="meta-value">{{ track.confirmPeriod }}</span>
                  </div>
                </div>
                
                <div class="track-deposits">
                  <div class="deposit-item">
                    <span class="deposit-label">{{ t('govTracks.decisionDeposit') }}</span>
                    <span class="deposit-value">{{ track.decisionDeposit }}</span>
                  </div>
                  <div class="deposit-item">
                    <span class="deposit-label">{{ t('govTracks.maxBalance') }}</span>
                    <span class="deposit-value">{{ track.maxBalance }}</span>
                  </div>
                </div>
              </div>
              
              <div v-if="track.id !== defaultTrackId" class="track-card-footer">
                <UButton
                  class="btn-set-default"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  type="button"
                  @click="handleSetDefault(track.id)"
                >
                  {{ t('govTracks.setDefault') }}
                </UButton>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p>{{ t('govTracks.empty') }}</p>
          </div>
        </div>
      </main>
    </div>
    <div class="pb-4" />

    <!-- 提交公投弹窗 -->
    <SubmitProposal 
      :show="showProposalModal" 
      default-action="addTrack"
      @close="showProposalModal = false"
      @submitted="loadData"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GovSidebar from './GovSidebar.vue'
import SubmitProposal from './SubmitProposal.vue'
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
const showProposalModal = ref(false)

// 将字节数组转换为字符串
function bytesToString(bytes: any): string {
  if (!bytes) return ''
  if (typeof bytes === 'string') return bytes
  if (Array.isArray(bytes)) {
    return String.fromCharCode(...bytes.filter((b: number) => b !== 0))
  }
  return String(bytes)
}

// 格式化块数为可读时间
function formatBlocks(blocks: number): string {
  if (!blocks) return '0 blocks'
  // 假设每块约6秒
  const seconds = blocks * 6
  if (seconds < 60) return `${blocks} blocks`
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
  return `${Math.round(seconds / 86400)} days`
}

async function loadData() {
  try {
    // 加载默认track
    const defaultResult = await SecretContractApi.defaultTrack()
    if (defaultResult !== undefined) {
      defaultTrackId.value = Number(defaultResult)
    }

    // 加载所有tracks
    const tracksResult = await SecretContractApi.tracks()
    console.log('tracksResult:', tracksResult)
    if (tracksResult && Array.isArray(tracksResult)) {
      tracks.value = tracksResult.map((item: any, index: number) => {
        const trackData = item[1] || item
        return {
          id: item[0] ?? trackData.id ?? index,
          name: bytesToString(trackData.name) || `Track ${index}`,
          preparePeriod: formatBlocks(Number(trackData.prepare_period || trackData.preparePeriod || 0)),
          decisionPeriod: formatBlocks(Number(trackData.decision_period || trackData.decisionPeriod || 0)),
          confirmPeriod: formatBlocks(Number(trackData.confirm_period || trackData.confirmPeriod || 0)),
          decisionDeposit: `${trackData.decision_deposit || trackData.decisionDeposit || 0} VOTE`,
          maxBalance: `${trackData.max_balance || trackData.maxBalance || 0} VOTE`,
        }
      })
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

  .header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .btn-add-track {
    padding: 10px 20px;
    font-size: 12px;
    font-weight: 400;
    color: rgba($secondary-text-rgb, 0.7);
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.08em;

    &:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.15);
      color: $primary-text;
    }
  }

  .track-stats {
    .stat-item {
      text-align: right;
      
      .stat-value {
        display: block;
        font-size: 28px;
        font-weight: 300;
        color: $primary-text;
        line-height: 1;
        letter-spacing: -0.02em;
      }
      
      .stat-label {
        font-size: 10px;
        color: rgba($secondary-text-rgb, 0.4);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
    }
  }
}

.tracks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1px;
}

.tracks-list {
  padding: 0;
}

.track-card {
  background: rgba($primary-bg-rgb, 0.95);
  padding: 16px;
  margin: 12px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  background: rgba(255, 255, 255, 0.02);

  &.is-default {
    .track-card-header {
      .track-id {
        color: rgba(255, 255, 255, 0.5);
      }
      
      .track-name {
        color: #fff;
      }
    }
  }

  .track-card-header {
    margin-bottom: 24px;
    
    .track-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .track-id {
      font-size: 16px;
      line-height: 14px;
      color: rgba($secondary-text-rgb, 0.4);
      font-family: monospace;
      font-weight: 400;
    }
    
    .track-name {
      font-size: 16px;
      font-weight: 500;
      color: $primary-text;
      margin: 0;
      letter-spacing: -0.01em;
    }
    
    .default-badge {
      padding: 3px 10px;
      font-size: 9px;
      line-height: 16px;
      height: 22px;
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.7);
      border: none;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 500;
    }
  }

  .track-card-body {
    .track-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: rgba(255, 255, 255, 0.04);
      margin-bottom: 2px;
      
      .meta-item {
        text-align: center;
        padding: 20px 16px;
        background: rgba($primary-bg-rgb, 0.95);
        
        .meta-label {
          display: block;
          font-size: 10px;
          color: rgba($secondary-text-rgb, 0.35);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        
        .meta-value {
          font-size: 13px;
          color: $primary-text;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
      }
    }
    
    .track-deposits {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
      background: rgba(255, 255, 255, 0.04);
      
      .deposit-item {
        padding: 20px;
        background: rgba($primary-bg-rgb, 0.95);
        text-align: center;
        
        .deposit-label {
          display: block;
          font-size: 10px;
          color: rgba($secondary-text-rgb, 0.35);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        
        .deposit-value {
          font-size: 14px;
          color: $primary-text;
          font-weight: 500;
          font-family: monospace;
          letter-spacing: -0.02em;
        }
      }
    }
  }

  .track-card-footer {
    margin-top: 24px;
    
    .btn-set-default {
      width: 100%;
      padding: 12px 18px;
      font-size: 11px;
      font-weight: 400;
      color: rgba($secondary-text-rgb, 0.6);
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.08);
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      
      &:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.15);
        color: $primary-text;
      }
    }
  }
}

.empty-state {
  padding: 100px 32px;
  text-align: center;
  
  .empty-icon {
    margin-bottom: 20px;
    color: rgba($secondary-text-rgb, 0.2);
  }
  
  p {
    font-size: 13px;
    color: rgba($secondary-text-rgb, 0.4);
    margin: 0;
    letter-spacing: 0.02em;
  }
}
</style>
