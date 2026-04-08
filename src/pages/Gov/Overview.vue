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
          <div class="section p-5 lg:p-8 border-t border-white-4">
            <h3 class="section-title">{{ t('govOverview.latestProposals') }}</h3>
            <div class="proposals-list">
              <RouterLink
                v-for="p in latestProposals"
                :key="p.id"
                :to="`/gov/referenda/${p.id}`"
                class="proposal-item"
              >
                <span class="proposal-id">#{{ p.id }}</span>
                <span class="proposal-title">{{ p.title }}</span>
                <span class="proposal-status" :class="statusClass(p.status)">{{ statusLabel(p.status) }}</span>
              </RouterLink>
            </div>
          </div>

          <!-- 成员列表 -->
          <div class="section p-5 lg:p-8 border-t border-white-4">
            <h3 class="section-title">{{ t('govOverview.recentMembers') }}</h3>
            <div class="members-list">
              <div v-for="m in recentMembers" :key="m.address" class="member-item">
                <span class="member-address">{{ formatAddress(m.address) }}</span>
                <span class="member-balance">{{ m.balance }}</span>
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
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GovSidebar from './GovSidebar.vue'
import { SecretContractApi } from '@/apis/contract'

const { t } = useI18n()

type Status = 'Deciding' | 'Preparing' | 'Executed' | 'TimedOut' | 'Rejected'

interface Proposal {
  id: number
  title: string
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

async function loadData() {
  try {
    // 加载提案
    const proposalsResult = await SecretContractApi.proposals()
    if (proposalsResult && Array.isArray(proposalsResult)) {
      latestProposals.value = proposalsResult.slice(0, 5).map((p: any) => ({
        id: p.id,
        title: p.title || `Proposal #${p.id}`,
        status: p.status?.state || 'Preparing',
      }))
      stats.value.activeProposals = proposalsResult.filter((p: any) => 
        p.status?.state === 'Deciding' || p.status?.state === 'Preparing'
      ).length
    }

    // 加载成员
    const membersResult = await SecretContractApi.members()
    if (membersResult && Array.isArray(membersResult)) {
      recentMembers.value = membersResult.slice(0, 5).map((m: any) => ({
        address: m[0] || m.address || '',
        balance: m[1] || m.balance || '0',
      }))
      stats.value.totalMembers = membersResult.length
    }

    // 加载Tracks
    const tracksResult = await SecretContractApi.tracks()
    if (tracksResult && Array.isArray(tracksResult)) {
      stats.value.totalTracks = tracksResult.length
    }
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
    border-radius: 2px;

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
    margin: 0 0 16px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
}

.proposals-list {
  .proposal-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    text-decoration: none;
    color: inherit;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    &:last-child {
      border-bottom: none;
    }

    .proposal-id {
      font-size: 13px;
      color: rgba($secondary-text-rgb, 0.5);
      min-width: 50px;
    }

    .proposal-title {
      flex: 1;
      font-size: 14px;
      color: $primary-text;
    }

    .proposal-status {
      padding: 3px 10px;
      font-size: 11px;
      border-radius: 2px;
      font-weight: 500;

      &.status-deciding {
        background: rgba(255, 255, 255, 0.06);
        color: rgba($secondary-text-rgb, 0.8);
      }

      &.status-preparing {
        background: rgba(255, 255, 255, 0.06);
        color: rgba($secondary-text-rgb, 0.8);
      }

      &.status-executed {
        background: rgba(255, 255, 255, 0.06);
        color: rgba($secondary-text-rgb, 0.8);
      }
    }
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
