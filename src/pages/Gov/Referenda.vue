<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-6">
      <GovSidebar />

      <!-- 主内容区 -->
      <main class="gov-main flex-1 min-w-0">
        <div class="chain-box main-box">
          <div class="title-wrap flex p-4 lg:p-5 flex-wrap justify-between items-center gap-4">
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
          <div class="tracks-wrap flex items-center px-4 lg:px-5 pb-3">
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
              class="referendum-item flex flex-col md:flex-row md:items-center p-4 lg:p-5 gap-3 md:gap-4"
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
  background-color: $primary-bg;
  background-color: rgba($primary-bg-rgb, 0.68);
  border: 4px solid rgba(255, 255, 255, 0.06);
}

.main-box {
  .title-wrap {
    border-bottom: 2px solid rgba(255, 255, 255, 0.06);
  }

  .page-title {
    font-size: 20px;
    font-weight: 700;
    color: $primary-text;
    margin: 0 0 4px;
  }

  .page-subtitle {
    font-size: 13px;
    color: $secondary-text;
    margin: 0;
  }

  .btn {
    font-size: 14px;
    height: 40px;
    line-height: 38px;
    border-radius: 2px;
    border: 1px solid rgba($secondary-text-rgb, 0.5);
    background: transparent;
    color: $secondary-text;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    &--outline {
      border-color: rgba($secondary-text-rgb, 0.5);
    }
  }
}

.tracks-wrap {
  padding-top: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  .tracks-label {
    font-size: 12px;
    font-weight: 600;
    color: $secondary-text;
  }

  .track-tab {
    padding: 6px 12px;
    font-size: 13px;
    border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: $secondary-text;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    &.active {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0);
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
  border-color: rgba(255, 255, 255, 0.06);
}

.referendum-item {
  display: flex;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s;
  border-color: #282828;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
}

.referendum-id {
  font-size: 15px;
  font-weight: 600;
  color: $secondary-text;
  min-width: 52px;
}

.referendum-title {
  font-size: 15px;
  font-weight: 600;
  color: $primary-text;
  margin: 0 0 6px;
  line-height: 1.4;
}

.referendum-meta {
  .amount {
    color: $secondary-text;
  }

  .track-badge {
    padding: 2px 8px;
    font-size: 11px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.08);
    color: $secondary-text;
  }
}

.referendum-right {
  .comments {
    font-size: 13px;
    color: $secondary-text;
  }
}

.status-badge {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 2px;
  white-space: nowrap;

  &.status-deciding {
    background: rgba(11, 175, 255, 0.2);
    color: #6ec8ff;
  }

  &.status-preparing {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
  }

  &.status-executed {
    background: rgba(67, 160, 71, 0.25);
    color: #81c784;
  }

  &.status-timedout {
    background: rgba(158, 158, 158, 0.25);
    color: #bdbdbd;
  }

  &.status-rejected {
    background: rgba(244, 67, 54, 0.2);
    color: #ef5350;
  }
}

.empty-state {
  font-size: 14px;
}

.text-secondary {
  color: $secondary-text;
}
</style>
