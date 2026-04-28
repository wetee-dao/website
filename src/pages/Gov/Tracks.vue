<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-4">
      <GovSidebar />

      <main class="gov-main flex-1 min-w-0">
        <div class="chain-box main-box">
          <div class="title-wrap title-wrap--pixel flex flex-wrap justify-between items-center gap-4">
            <div class="title-pixel-bg" aria-hidden="true">
              <PixelBg :tile-size="6" :gap="4" :max-opacity="0.08" :density="0.18" :wave-speed="0.0014" />
            </div>
            <div class="relative z-[1]">
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
                @click="handleAddTrack"
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
                
                <!-- 投票曲线 -->
                <div class="track-curves">
                  <div class="curve-item">
                    <div class="curve-header">
                      <span class="curve-label">Min Approval</span>
                      <span class="curve-type">{{ formatCurveType(track.minApproval.Type) }}</span>
                    </div>
                    <div class="curve-range">
                      <span class="curve-start">{{ track.minApprovalStart }}</span>
                      <svg class="curve-arrow" width="20" height="8" viewBox="0 0 40 8">
                        <path d="M0 4h36M32 1l4 3-4 3" stroke="currentColor" fill="none" stroke-width="1.5"/>
                      </svg>
                      <span class="curve-end">{{ track.minApprovalEnd }}</span>
                    </div>
                  </div>
                  <div class="curve-item">
                    <div class="curve-header">
                      <span class="curve-label">Min Support</span>
                      <span class="curve-type">{{ formatCurveType(track.minSupport.Type) }}</span>
                    </div>
                    <div class="curve-range">
                      <span class="curve-start">{{ track.minSupportStart }}</span>
                      <svg class="curve-arrow" width="20" height="8" viewBox="0 0 40 8">
                        <path d="M0 4h36M32 1l4 3-4 3" stroke="currentColor" fill="none" stroke-width="1.5"/>
                      </svg>
                      <span class="curve-end">{{ track.minSupportEnd }}</span>
                    </div>
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
            <p>{{ t('govTracks.empty') }}</p>
          </div>
        </div>
      </main>
    </div>
    <div class="pb-4" />

    <!-- 提交公投弹窗 -->
    <SubmitProposal 
      :show="showProposalModal" 
      :default-action="proposalDefaultAction"
      :default-track-id="proposalDefaultTrackId"
      @close="showProposalModal = false"
      @submitted="loadData"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GovSidebar from './GovSidebar.vue'
import PixelBg from '@/components/anim/PixelBg.vue'
import SubmitProposal from './submit-proposal'
import { SecretContractApi } from '@/apis/contract'
import { bytesToString } from '@/utils/gov'
import { parseHumanNumber } from '@/utils/parseHumanNumber'
import { parseCurveFromApi, type Curve, curveY, formatCurveType, permilleToPercent } from '@/utils/curve'

const { t } = useI18n()

interface Track {
  id: number
  name: string
  preparePeriod: string
  decisionPeriod: string
  confirmPeriod: string
  decisionDeposit: string
  maxBalance: string
  // 投票曲线
  minApproval: Curve
  minSupport: Curve
  minApprovalStart: string
  minApprovalEnd: string
  minSupportStart: string
  minSupportEnd: string
}

const tracks = ref<Track[]>([])
const defaultTrackId = ref(0)
const showProposalModal = ref(false)
const proposalDefaultAction = ref<string>('addTrack')
const proposalDefaultTrackId = ref<number | undefined>(undefined)

/** tracks() 单条：{ id, track } 或 [id, track] */
function normalizeTrackEntry(item: any, index: number): { id: number; data: any } {
  if (item == null) return { id: index, data: {} }
  if (Array.isArray(item)) {
    return { id: parseHumanNumber(item[0]), data: item[1] ?? {} }
  }
  return { id: parseHumanNumber(item.id), data: item.track ?? {} }
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
    if (tracksResult && Array.isArray(tracksResult)) {
      tracks.value = tracksResult.map((item: any, index: number) => {
        const { id: tid, data: trackData } = normalizeTrackEntry(item, index)
        const prepareBlocks = parseHumanNumber(trackData.preparePeriod)
        const decisionBlocks = parseHumanNumber(trackData.decisionPeriod)
        const confirmBlocks = parseHumanNumber(trackData.confirmPeriod)

        const minApproval = parseCurveFromApi(trackData.minApproval)
        const minSupport = parseCurveFromApi(trackData.minSupport)

        return {
          id: tid,
          name: bytesToString(trackData.name) || `Track ${index}`,
          preparePeriod: t('gov.blockCount', { count: prepareBlocks }),
          decisionPeriod: t('gov.blockCount', { count: decisionBlocks }),
          confirmPeriod: t('gov.blockCount', { count: confirmBlocks }),
          decisionDeposit: `${parseHumanNumber(trackData.decisionDeposit)} VOTE`,
          maxBalance: `${parseHumanNumber(trackData.maxBalance)} VOTE`,
          minApproval,
          minSupport,
          minApprovalStart: permilleToPercent(curveY(minApproval, 0)),
          minApprovalEnd: permilleToPercent(curveY(minApproval, decisionBlocks)),
          minSupportStart: permilleToPercent(curveY(minSupport, 0)),
          minSupportEnd: permilleToPercent(curveY(minSupport, decisionBlocks)),
        }
      })
    }
  } catch (error) {
    console.error('Failed to load tracks data:', error)
  }
}

async function handleSetDefault(trackId: number) {
  // 设为默认需要走公投：打开 submit-proposal 弹窗
  proposalDefaultAction.value = 'setDefaultTrack'
  proposalDefaultTrackId.value = trackId
  showProposalModal.value = true
}

function handleAddTrack() {
  proposalDefaultAction.value = 'addTrack'
  proposalDefaultTrackId.value = undefined
  showProposalModal.value = true
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
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 1px;
}

.tracks-list {
  padding: 0;
}

.track-card {
  min-width: 0;
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
    min-width: 0;

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
    
    .track-curves {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1px;
      background: rgba(255, 255, 255, 0.04);
      margin-top: 2px;
      max-width: 100%;
      box-sizing: border-box;

      @media (max-width: 520px) {
        grid-template-columns: 1fr;
      }

      .curve-item {
        min-width: 0;
        padding: 16px 20px;
        background: rgba($primary-bg-rgb, 0.95);

        .curve-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;

          .curve-label {
            font-size: 11px;
            color: rgba($secondary-text-rgb, 0.6);
            font-weight: 500;
            min-width: 0;
          }

          .curve-type {
            flex-shrink: 0;
            max-width: 100%;
            font-size: 9px;
            color: rgba($secondary-text-rgb, 0.4);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 2px 6px;
            background: rgba(255, 255, 255, 0.04);
          }
        }

        .curve-range {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 0;

          .curve-start {
            min-width: 0;
            font-size: 15px;
            font-weight: 500;
            color: rgba($secondary-text-rgb, 0.9);
            overflow-wrap: anywhere;
            text-align: center;
          }

          .curve-arrow {
            flex-shrink: 0;
            color: rgba($secondary-text-rgb, 0.3);
          }

          .curve-end {
            min-width: 0;
            font-size: 15px;
            font-weight: 500;
            color: rgba($secondary-text-rgb, 0.6);
            overflow-wrap: anywhere;
            text-align: center;
          }
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
