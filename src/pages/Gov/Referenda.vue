<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-6">
      <GovSidebar />

      <!-- 主内容区 -->
      <main class="gov-main flex-1 min-w-0">
        <div class="chain-box main-box">
          <div class="title-wrap flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 class="page-title">{{ t('gov.pageTitle') }}</h1>
              <p class="page-subtitle">{{ t('gov.pageSubtitle') }}</p>
            </div>
            <div class="flex items-center gap-3">
              <UButton
                class="p-3"
                color="neutral"
                variant="solid"
                size="lg"
                type="button"
                @click="showProposalModal = true"
              >
                {{ t('gov.submitProposal') }}
              </UButton>
            </div>
          </div>

          <!-- Tracks 筛选 -->
          <div class="tracks-wrap flex items-center">
            <div class="tracks-label mr-2">{{ t('gov.tracks') }}</div>
            <div class="tracks-tabs flex flex-wrap gap-2">
              <UButton
                v-for="t in trackOptions"
                :key="t.value"
                type="button"
                class="track-tab p-3"
                :class="{ active: trackFilter === t.value }"
                @click="trackFilter = t.value"
                color="neutral"
                variant="ghost"
                size="lg"
              >
                {{ t.label }}
              </UButton>
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
                <h3 class="referendum-title">{{ t(r.titleKey) }}</h3>
                <div class="referendum-meta flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary">
                  <span v-if="r.amount" class="amount">{{ r.amount }}</span>
                  <span class="proposer">{{ r.proposer }}</span>
                  <span class="track-badge">{{ t(r.trackKey) }}</span>
                  <span class="time-ago">{{ timeAgo(r.createdAt) }}</span>
                </div>
              </div>
              <div class="referendum-right flex items-center gap-3 shrink-0">
                <span v-if="r.comments !== undefined" class="comments">{{ r.comments }}</span>
                <UBadge class="status-badge" :class="statusClass(r.status)" color="neutral" variant="subtle" size="sm">
                  {{ statusLabel(r.status) }}
                </UBadge>
              </div>
            </RouterLink>
          </div>

          <div v-if="filteredReferenda.length === 0" class="empty-state p-10 text-center text-secondary">
            {{ t('gov.empty') }}
          </div>
        </div>
      </main>
    </div>
    <div class="pb-4" />

    <!-- 提交公投弹窗 -->
    <SubmitProposal 
      :show="showProposalModal" 
      @close="showProposalModal = false"
      @submitted="loadData"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GovSidebar from './GovSidebar.vue'
import SubmitProposal from './SubmitProposal.vue'
import { timeAgo } from '@/utils/time'
import { SecretContractApi } from '@/apis/contract'

type Status = 'Deciding' | 'Preparing' | 'Executed' | 'TimedOut' | 'Rejected'

interface Referendum {
  id: number
  titleKey: string
  amount?: string
  proposer: string
  trackKey: string
  createdAt: string | number
  status: Status
  comments?: number
}

const { t } = useI18n()
const trackFilter = ref<string>('all')
const filterNewOnly = ref(false)
const showProposalModal = ref(false)

const trackOptions = computed(() => [
  { value: 'all', label: t('gov.all') },
  { value: 'system', label: t('gov.system') },
  { value: 'treasury', label: t('gov.treasury') },
  { value: 'others', label: t('gov.others') },
])

// 模拟数据（参考 Subsquare Polkadot Referenda）
const referenda = ref<Referendum[]>([])

function trackGroup(trackKey: string): string {
  const track = t(trackKey).toLowerCase()
  if (track.includes('root') || track.includes('wish for change') || track.includes('变更意愿')) return 'system'
  if (track.includes('tipper') || track.includes('spender') || track.includes('treasurer') || track.includes('支出') || track.includes('国库')) return 'treasury'
  if (track.includes('whitelisted') || track.includes('fellowship') || track.includes('白名单')) return 'others'
  return 'others'
}

const filteredReferenda = computed(() => {
  let list = referenda.value
  if (trackFilter.value !== 'all') {
    list = list.filter((r) => trackGroup(r.trackKey) === trackFilter.value)
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

async function loadData() {
  // TODO: 加载公投列表
}

onMounted(()=>{
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

  .mbtn {
    font-size: 13px;
    height: 36px;
    line-height: 34px;
    
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

    &--primary {
      background: rgba(255, 255, 255, 0.08);
      color: $primary-text;
      border-color: transparent;

      &:hover {
        background: rgba(255, 255, 255, 0.12);
      }
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
