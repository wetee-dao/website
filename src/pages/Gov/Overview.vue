<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-6">
      <GovSidebar />

      <main class="gov-main flex-1 min-w-0">
        <div class="chain-box main-box">
          <div class="title-wrap flex flex-wrap justify-between items-center gap-4">
            <div>
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
import { SecretContractApi } from '@/apis/contract'
import { parseHumanNumber } from '@/utils/parseHumanNumber'
import { proposalStateToGovUi, readProposalStateCode, type GovProposalUiStatus } from '@/utils/proposalState'
import ReferendaList, { type ReferendaListItem } from './ReferendaList.vue'

const { t } = useI18n()

type Status = GovProposalUiStatus

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
  const map: Record<Status, string> = {
    Deciding: 'status-deciding',
    Preparing: 'status-preparing',
    Executed: 'status-executed',
    TimedOut: 'status-timedout',
    Rejected: 'status-rejected',
  }
  return map[status] || ''
}

function statusLabel(status: Status): string {
  const map: Record<Status, string> = {
    Deciding: t('gov.statusDeciding'),
    Preparing: t('gov.statusPreparing'),
    Executed: t('gov.statusExecuted'),
    TimedOut: t('gov.statusTimedOut'),
    Rejected: t('gov.statusRejected'),
  }
  return map[status] || status
}

function formatAddress(addr: string): string {
  if (addr.length <= 12) return addr
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

function bytesToString(bytes: unknown): string {
  if (!bytes) return ''
  if (typeof bytes === 'string') return bytes
  if (Array.isArray(bytes)) return String.fromCharCode(...bytes.filter((b: number) => b !== 0))
  return String(bytes)
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
    const mapped: Proposal[] = list
      .filter((x) => x && typeof x === 'object')
      .map((p: any) => {
        const id = parseHumanNumber(p.id)
        const trackId = parseHumanNumber(p.trackID)
        const trackLabel = trackNameById.get(trackId) ?? `#${trackId}`
        const submitBlock = parseHumanNumber(p.submitBlock)
        const code = readProposalStateCode(p.status)
        const status = proposalStateToGovUi(code)
        const { callLabel, callAmount } = formatProposalCall(p.call, methodBySelector)
        return { id, callLabel, callAmount, trackId, trackLabel, submitBlock, status }
      })
      .sort((a, b) => b.id - a.id)

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
    stats.value.activeProposals = mapped.filter((p) => p.status === 'Deciding' || p.status === 'Preparing').length

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
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  .stat-card {
    padding: 20px;
    background: rgba(255, 255, 255, 0.02);
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
      color: $primary-text;
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
      color: $primary-text;
      font-family: monospace;
    }

    .member-balance {
      font-size: 13px;
      color: rgba($secondary-text-rgb, 0.6);
    }
  }
}
</style>
