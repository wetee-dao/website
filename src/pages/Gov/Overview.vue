<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-row gap-0 overflow-x-auto">
      <GovSidebar />

      <main class="gov-main flex-1 min-w-0">
        <div class="chain-box main-box">
          <div class="title-wrap title-wrap--pixel flex flex-wrap justify-between items-center gap-4">
            <div class="title-pixel-bg" aria-hidden="true">
              <PixelBg :tile-size="6" :gap="4" :max-opacity="0.28" :density="0.18" :wave-speed="0.0014" />
            </div>
            <div class="relative z-[1]">
              <h1 class="page-title">{{ t('govOverview.title') }}</h1>
              <p class="page-subtitle">{{ t('govOverview.subtitle') }}</p>
            </div>
          </div>

          <!-- 统计卡片 -->
          <div class="stats-grid p-5 lg:p-8">
            <div class="stat-card">
              <span class="stat-label">{{ t('govOverview.activeProposals') }}</span>
              <span class="stat-value">{{ stats.activeProposals }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">{{ t('govOverview.totalMembers') }}</span>
              <span class="stat-value">{{ stats.totalMembers }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">{{ t('govOverview.treasuryBalance') }}</span>
              <span class="stat-value">{{ stats.treasuryBalance }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">{{ t('govOverview.totalTracks') }}</span>
              <span class="stat-value">{{ stats.totalTracks }}</span>
            </div>
          </div>

          <!-- 最新提案 -->
          <div class="section border-t border-white-4">
            <h3 class="section-title p-5 lg:p-8">{{ t('govOverview.latestProposals') }}</h3>
            <ReferendaList :items="latestListItems" />
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
import PixelBg from '@/components/anim/PixelBg.vue'
import { SecretContractApi } from '@/apis/contract'
import { bytesToString } from '@/utils/gov'
import { parseHumanNumber } from '@/utils/parseHumanNumber'
import { ProposalState, proposalStatusKey, type ProposalStatusKey } from '@/utils/proposalState'
import { parseProposalStatusResult } from '@/utils/parseProposalStatus'
import ReferendaList, { type ReferendaListItem } from './ReferendaList.vue'

const { t } = useI18n()

type Status = ProposalStatusKey

interface Proposal {
  id: number
  callLabel: string
  callAmount: string
  trackId: number
  trackLabel: string
  submitBlock: number
  status: Status
}

interface Member {
  address: string
  balance: string
}

const stats = ref({
  activeProposals: 0,
  totalMembers: 0,
  treasuryBalance: '0 DOT',
  totalTracks: 0,
})

const latestProposals = ref<Proposal[]>([])
const recentMembers = ref<Member[]>([])

const latestListItems = ref<ReferendaListItem[]>([])

function statusClass(status: Status): string {
  return `status-${status.toLowerCase()}`
}

function statusLabel(status: Status): string {
  const map: Record<Status, string> = {
    Pending: t('gov.statusPending'),
    Ongoing: t('gov.statusOngoing'),
    Confirming: t('gov.statusConfirming'),
    Confirmed: t('gov.statusConfirmed'),
    Approved: t('gov.statusApproved'),
    Rejected: t('gov.statusRejected'),
    Canceled: t('gov.statusCanceled'),
  }
  return map[status] ?? status
}

function formatAddress(addr: string): string {
  if (addr.length <= 12) return addr
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

function normalizeSelectorHex(s: string): string {
  const x = s.toLowerCase().trim()
  if (!x) return ''
  return x.startsWith('0x') ? x : `0x${x}`
}

function formatProposalCall(
  call: unknown,
  methodBySelector: Map<string, string>,
): { callLabel: string; callAmount: string } {
  if (!call || typeof call !== 'object') return { callLabel: '-', callAmount: '' }
  let c = call as Record<string, unknown>
  if ('Some' in c && c.Some && typeof c.Some === 'object') c = c.Some as Record<string, unknown>
  const selector = normalizeSelectorHex(String(c.selector ?? ''))
  const contract = String(c.contract ?? 'gov')
  const amountRaw = c.amount
  const callAmount = amountRaw == null ? '' : String(amountRaw).replace(/,/g, '')
  const method = selector ? methodBySelector.get(selector) ?? selector : ''
  return {
    callLabel: method ? `${contract}.${method}` : contract,
    callAmount,
  }
}

async function loadData() {
  try {
    // 加载提案（公投列表）
    const [tracksResult, proposalsResult, methodBySelector] = await Promise.all([
      SecretContractApi.tracks(),
      SecretContractApi.proposals(),
      SecretContractApi.getGovSelectorMethodMap(),
    ])

    const trackNameById = new Map<number, string>()
    if (Array.isArray(tracksResult)) {
      for (const item of tracksResult) {
        const row = item as any[]
        const id = parseHumanNumber(row?.[0])
        const data = (row?.[1] ?? {}) as Record<string, unknown>
        const name = bytesToString((data as any).name) || `#${id}`
        trackNameById.set(id, name)
      }
    }

    const list = Array.isArray(proposalsResult) ? proposalsResult : []
    const rows = list.filter((x) => x && typeof x === 'object')
    const mapped: Proposal[] = (
      await Promise.all(
        rows.map(async (p: any) => {
          const id = parseHumanNumber(p.id)
          const stRaw = await SecretContractApi.proposalStatus(id).catch(() => null)
          const parsed = parseProposalStatusResult(stRaw)
          const code = parsed?.stateCode ?? ProposalState.Pending
          const trackId = parseHumanNumber(p.trackID)
          const trackLabel = trackNameById.get(trackId) ?? `#${trackId}`
          const submitBlock = parseHumanNumber(p.submitBlock)
          const status = proposalStatusKey(code)
          const { callLabel, callAmount } = formatProposalCall(p.call, methodBySelector)
          return { id, callLabel, callAmount, trackId, trackLabel, submitBlock, status }
        }),
      )
    ).sort((a, b) => b.id - a.id)

    latestProposals.value = mapped.slice(0, 5)
    latestListItems.value = latestProposals.value.map((p) => ({
      id: p.id,
      submitBlock: p.submitBlock,
      proposer: '',
      trackLabel: p.trackLabel,
      status: p.status,
      callLabel: p.callLabel,
      callContract: p.callLabel.split('.')[0] || 'gov',
      callMethod: p.callLabel.split('.').slice(1).join('.') || p.callLabel,
      callAmount: p.callAmount,
    }))
    stats.value.activeProposals = mapped.filter(
      (p) =>
        p.status === 'Ongoing' ||
        p.status === 'Confirming' ||
        p.status === 'Confirmed' ||
        p.status === 'Pending',
    ).length

    // 加载成员
    const membersResult = await SecretContractApi.members()
    if (membersResult && Array.isArray(membersResult)) {
      recentMembers.value = membersResult.slice(0, 5).map((m: any) => ({
        address: m[0] || m.address || '',
        balance: m[1] || m.balance || '0',
      }))
      stats.value.totalMembers = membersResult.length
    }

    // Track 数量（复用上面 tracksResult）
    stats.value.totalTracks = Array.isArray(tracksResult) ? tracksResult.length : 0
  } catch (error) {
    console.error('Failed to load overview data:', error)
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
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  .stat-card {
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.04);
    

    .stat-label {
      display: block;
      font-size: 11px;
      color: rgba($secondary-text-rgb, 0.4);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 500;
      color: rgba($secondary-text-rgb, 0.92);
    }
  }
}

.section {
  .section-title {
    font-size: 11px;
    font-weight: 500;
    color: rgba($secondary-text-rgb, 0.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
}


.border-white-4 {
  border-color: rgba(255, 255, 255, 0.04);
}

.members-list {
  .member-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);

    &:last-child {
      border-bottom: none;
    }

    .member-address {
      font-size: 14px;
      color: rgba($secondary-text-rgb, 0.85);
      font-family: monospace;
    }

    .member-balance {
      font-size: 13px;
      color: rgba($secondary-text-rgb, 0.6);
    }
  }
}
</style>
