<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-6">
      <GovSidebar />

      <!-- 主内容区 -->
      <main class="gov-main flex-1 min-w-0">
        <div class="chain-box main-box">
          <div class="title-wrap flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 class="page-title">OpenGov Referenda</h1>
              <p class="page-subtitle">Subscribe on-chain events · All active and history referenda</p>
            </div>
            <div class="flex items-center">
              <button class="btn btn--outline px-4" type="button">Delegate</button>
              <button class="btn btn--outline px-4" type="button">Subscribe</button>
            </div>
          </div>

          <!-- Tracks 筛选 -->
          <div class="tracks-wrap flex items-center">
            <div class="tracks-label mr-2">Referenda Tracks</div>
            <div class="tracks-tabs flex flex-wrap gap-2">
              <button
                v-for="t in trackOptions"
                :key="t.value"
                type="button"
                class="track-tab"
                :class="{ active: trackFilter === t.value }"
                @click="trackFilter = t.value"
              >
                {{ t.label }}
              </button>
            </div>
          </div>

          <!-- Referenda 列表 -->
          <div class="referenda-list divide-y">
            <RouterLink
              v-for="r in filteredReferenda"
              :key="r.id"
              :to="`/gov/referenda/${r.id}`"
              class="referendum-item flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
            >
              <div class="referendum-id">#{{ r.id }}</div>
              <div class="referendum-body flex-1 min-w-0">
                <h3 class="referendum-title">{{ r.title }}</h3>
                <div class="referendum-meta flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary">
                  <span v-if="r.amount" class="amount">{{ r.amount }}</span>
                  <span class="proposer">{{ r.proposer }}</span>
                  <span class="track-badge">{{ r.track }}</span>
                  <span class="time-ago">{{ timeAgo(r.createdAt) }}</span>
                </div>
              </div>
              <div class="referendum-right flex items-center gap-3 shrink-0">
                <span v-if="r.comments !== undefined" class="comments">{{ r.comments }}</span>
                <span class="status-badge" :class="statusClass(r.status)">{{ r.status }}</span>
              </div>
            </RouterLink>
          </div>

          <div v-if="filteredReferenda.length === 0" class="empty-state p-10 text-center text-secondary">
            No referenda match the current filter.
          </div>
        </div>
      </main>
    </div>
    <div class="pb-4" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import GovSidebar from './GovSidebar.vue'
import { timeAgo } from '@/utils/time'

type Status = 'Deciding' | 'Preparing' | 'Executed' | 'TimedOut' | 'Rejected'

interface Referendum {
  id: number
  title: string
  amount?: string
  proposer: string
  track: string
  createdAt: string | number
  status: Status
  comments?: number
}

const trackFilter = ref<string>('all')
const filterNewOnly = ref(false)

const trackOptions = [
  { value: 'all', label: 'All' },
  { value: 'system', label: 'System' },
  { value: 'treasury', label: 'Treasury' },
  { value: 'others', label: 'Others' },
]

// 模拟数据（参考 Subsquare Polkadot Referenda）
const referenda = ref<Referendum[]>([
  {
    id: 1836,
    title: 'Polkadot-API 2026 Development Funding through Polkadot Community Foundation',
    amount: '≈955.21K USDC',
    proposer: '16JG...pr9J',
    track: 'Medium Spender',
    createdAt: Date.now() - 12 * 60 * 60 * 1000,
    status: 'Deciding',
    comments: 0,
  },
  {
    id: 1833,
    title: 'Polkadot Moderation Team Bounty Top-up',
    amount: '82,118 DOT',
    proposer: '12Gk...QKp5',
    track: 'Medium Spender',
    createdAt: Date.now() - 15 * 60 * 60 * 1000,
    status: 'Deciding',
    comments: 3,
  },
  {
    id: 1832,
    title: 'System Collator Bounty - Topup',
    amount: '≈70.2K DOT',
    proposer: '15D2...KwVb',
    track: 'Medium Spender',
    createdAt: Date.now() - 7 * 60 * 60 * 1000,
    status: 'Deciding',
    comments: 4,
  },
  {
    id: 1837,
    title: 'Deploy Universal Deterministic Deployment Proxy (CREATE2 Factory) on Asset Hub',
    proposer: '15PC...irSY',
    track: 'Whitelisted Caller',
    createdAt: Date.now() - 15 * 60 * 60 * 1000,
    status: 'Preparing',
    comments: 0,
  },
  {
    id: 1835,
    title: 'Cancelled: Let this proposal time out',
    proposer: '15PC...irSY',
    track: 'Root',
    createdAt: Date.now() - 15 * 60 * 60 * 1000,
    status: 'Preparing',
    comments: 0,
  },
  {
    id: 1828,
    title: 'Polkadot Upgrade 2.0.5',
    proposer: '13TR...wxUE',
    track: 'Whitelisted Caller',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    status: 'Executed',
    comments: 9,
  },
  {
    id: 1827,
    title: '[Wish For Change] The Dynamic Allocation Pool (DAP) and the future of staking: Phase 1',
    proposer: '13b1...aAUN',
    track: 'Wish For Change',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000 - 15 * 60 * 60 * 1000,
    status: 'Executed',
    comments: 7,
  },
  {
    id: 1826,
    title: '[Root] Referendum #1826',
    proposer: '16MP...gt9R',
    track: 'Root',
    createdAt: Date.now() - 26 * 24 * 60 * 60 * 1000,
    status: 'TimedOut',
    comments: 3,
  },
  {
    id: 1825,
    title: '[Small Spender] Squidsway Governance Report and Tool',
    amount: '8,000 USDT',
    proposer: '13id...Cs2M',
    track: 'Small Spender',
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    status: 'Rejected',
    comments: 5,
  },
])

function trackGroup(track: string): string {
  const t = track.toLowerCase()
  if (t.includes('root') || t.includes('wish for change')) return 'system'
  if (t.includes('tipper') || t.includes('spender') || t.includes('treasurer')) return 'treasury'
  if (t.includes('admin') || t.includes('canceller') || t.includes('killer')) return 'governance'
  if (t.includes('whitelisted') || t.includes('fellowship')) return 'fellowship'
  return 'others'
}

const filteredReferenda = computed(() => {
  let list = referenda.value
  if (trackFilter.value !== 'all') {
    list = list.filter((r) => trackGroup(r.track) === trackFilter.value)
  }
  if (filterNewOnly.value) {
    const oneDay = 24 * 60 * 60 * 1000
    list = list.filter((r) => {
      const t = typeof r.createdAt === 'number' ? r.createdAt : new Date(r.createdAt).getTime()
      return Date.now() - t < oneDay
    })
  }
  return list
})

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
    height: 36px;
    line-height: 34px;
    border-radius: 2px;
    border: 1px solid rgba($secondary-text-rgb, 0.2);
    background: transparent;
    color: rgba($secondary-text-rgb, 0.7);
    cursor: pointer;
    white-space: nowrap;
    font-weight: 400;
    transition: all 0.2s ease;

    &:hover {
      border-color: rgba($secondary-text-rgb, 0.35);
      color: $primary-text;
    }

    &--outline {
      border-color: rgba($secondary-text-rgb, 0.2);
    }
  }
}

.tracks-wrap {
  padding: 16px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  
  .tracks-label {
    font-size: 11px;
    font-weight: 500;
    color: rgba($secondary-text-rgb, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .track-tab {
    padding: 6px 14px;
    font-size: 13px;
    border-radius: 2px;
    border: none;
    background: transparent;
    color: rgba($secondary-text-rgb, 0.6);
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 400;

    &:hover {
      color: $primary-text;
      background: rgba(255, 255, 255, 0.03);
    }

    &.active {
      background: rgba(255, 255, 255, 0.06);
      color: $primary-text;
    }
  }
}

.filter-wrap {
  .filter-check {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: $secondary-text;
    cursor: pointer;

    input {
      accent-color: $secondary-text;
    }
  }
}

.referenda-list {
  border-color: rgba(255, 255, 255, 0.04);
}

.referendum-item {
  display: flex;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s ease;
  border-color: rgba(255, 255, 255, 0.04);
  padding: 20px 32px;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
}

.referendum-id {
  font-size: 14px;
  font-weight: 500;
  color: rgba($secondary-text-rgb, 0.5);
  min-width: 48px;
}

.referendum-title {
  font-size: 14px;
  font-weight: 500;
  color: $primary-text;
  margin: 0 0 8px;
  line-height: 1.5;
}

.referendum-meta {
  .amount {
    color: rgba($secondary-text-rgb, 0.6);
  }

  .track-badge {
    padding: 3px 10px;
    font-size: 11px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.04);
    color: rgba($secondary-text-rgb, 0.6);
    font-weight: 400;
  }
}

.referendum-right {
  .comments {
    font-size: 13px;
    color: rgba($secondary-text-rgb, 0.5);
  }
}

.status-badge {
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 2px;
  white-space: nowrap;
  letter-spacing: 0.02em;

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

  &.status-timedout {
    background: rgba(255, 255, 255, 0.06);
    color: rgba($secondary-text-rgb, 0.6);
  }

  &.status-rejected {
    background: rgba(255, 255, 255, 0.06);
    color: rgba($secondary-text-rgb, 0.6);
  }
}

.empty-state {
  font-size: 14px;
  padding: 60px 32px;
}

.text-secondary {
  color: $secondary-text;
}
</style>
