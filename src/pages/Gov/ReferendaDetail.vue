<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-6">
      <GovSidebar />

      <main class="gov-main flex-1 min-w-0">
        <div v-if="!detail" class="chain-box main-box p-10 text-center text-secondary">
          {{ t('govDetail.notFound', { id }) }}
          <RouterLink to="/gov" class="link-back">{{ t('govDetail.backToReferenda') }}</RouterLink>
        </div>

        <template v-else>
          <!-- Breadcrumb: Referenda / Track / #id -->
          <nav class="breadcrumb flex flex-wrap items-center gap-1 text-sm mb-4">
            <RouterLink to="/gov" class="breadcrumb-link">{{ t('govDetail.referenda') }}</RouterLink>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-link">{{ detail.track }}</span>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-current">#{{ detail.id }}</span>
          </nav>

          <div class="chain-box main-box">
            <!-- 标题 + 元信息 -->
            <div class="detail-header border-b border-white/6">
              <h1 class="detail-title">{{ detail.title }}</h1>
              <div class="detail-meta flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                <span class="meta-proposer">{{ detail.proposer }}</span>
                <span class="track-badge">{{ detail.track }}</span>
                <span class="meta-time">{{ timeAgo(detail.createdAt) }}</span>
                <span v-if="detail.comments !== undefined" class="meta-comments">{{ detail.comments }}</span>
                <span class="status-badge" :class="statusClass(detail.status)">{{ detail.status }}</span>
              </div>
            </div>

            <!-- Tabs: Content | AI Summary | Translations -->
            <div class="tabs-wrap pt-3">
              <div class="tabs flex gap-4 border-b border-white/6">
                <button
                  v-for="tab in contentTabs"
                  :key="tab.key"
                  type="button"
                  class="tab-btn"
                  :class="{ active: activeTab === tab.key }"
                  @click="activeTab = tab.key"
                >
                  {{ t(tab.labelKey) }}
                </button>
              </div>
            </div>

            <!-- Content 区域 -->
            <div class="content-wrap">
              <div v-show="activeTab === 'content'" class="proposal-content prose">
                <p v-for="(p, i) in detail.contentParagraphs" :key="i">{{ p }}</p>
              </div>
              <div v-show="activeTab === 'summary'" class="proposal-summary prose">
                <ul>
                  <li v-for="(s, i) in detail.aiSummary" :key="i">{{ s }}</li>
                </ul>
              </div>
              <div v-show="activeTab === 'translations'" class="proposal-translations text-secondary">
                {{ t('govDetail.translationsPlaceholder') }}
              </div>
            </div>

            <!-- Status: Decision / Confirmation / Attempts -->
            <div class="status-section p-5 lg:p-8 border-t border-white/6">
              <h3 class="section-title">{{ t('govDetail.status') }}</h3>
              <div class="status-cards flex flex-wrap gap-4">
                <div class="status-card">
                  <span class="status-card-label">{{ t('govDetail.decision') }}</span>
                  <span class="status-card-value">{{ detail.decisionPeriod }}</span>
                </div>
                <div class="status-card">
                  <span class="status-card-label">{{ t('govDetail.confirmation') }}</span>
                  <span class="status-card-value">{{ detail.confirmationPeriod }}</span>
                </div>
                <div class="status-card">
                  <span class="status-card-label">{{ t('govDetail.attempts') }}</span>
                  <span class="status-card-value">{{ detail.attempts }}</span>
                </div>
              </div>
            </div>

            <!-- Tally -->
            <div class="tally-section p-5 lg:p-8 border-t border-white/6">
              <h3 class="section-title">{{ t('govDetail.tally') }}</h3>
              <div class="tally-row flex flex-wrap gap-6 mb-4">
                <div class="tally-aye">
                  <span class="tally-label">{{ t('govDetail.aye') }}</span>
                  <span class="tally-pct">{{ detail.tally.ayePct }}%</span>
                  <span class="tally-amount">{{ detail.tally.ayeAmount }}</span>
                </div>
                <div class="tally-nay">
                  <span class="tally-label">{{ t('govDetail.nay') }}</span>
                  <span class="tally-pct">{{ detail.tally.nayPct }}%</span>
                  <span class="tally-amount">{{ detail.tally.nayAmount }}</span>
                </div>
              </div>
              <div class="tally-extra flex flex-wrap gap-6 text-sm text-secondary">
                <span>{{ t('govDetail.support') }} {{ detail.tally.support }}%</span>
                <span>{{ t('govDetail.threshold') }} {{ detail.tally.threshold }}%</span>
                <span>{{ t('govDetail.issuance') }} {{ detail.tally.issuance }}</span>
              </div>
            </div>

            <!-- Votes -->
            <div class="votes-section p-5 lg:p-8 border-t border-white/6">
              <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h3 class="section-title mb-0">{{ t('govDetail.votes') }}</h3>
                <div class="votes-view-toggle flex gap-2">
                  <button type="button" class="toggle-btn" :class="{ active: votesView === 'nested' }" @click="votesView = 'nested'">
                    {{ t('govDetail.nested') }}
                  </button>
                  <button type="button" class="toggle-btn" :class="{ active: votesView === 'flattened' }" @click="votesView = 'flattened'">
                    {{ t('govDetail.flattened') }}
                  </button>
                </div>
              </div>
              <div class="votes-placeholder text-secondary text-sm">
                {{ t('govDetail.voteListPlaceholder') }}
              </div>
            </div>

            <!-- Actions -->
            <div class="actions-section p-5 lg:p-8 border-t border-white/6">
              <h3 class="section-title">{{ t('govDetail.actions') }}</h3>
              <div class="actions-btns flex flex-wrap gap-3">
                <button type="button" class="btn btn--primary">{{ t('govDetail.vote') }}</button>
                <span class="text-secondary text-sm self-center">{{ t('govDetail.voteOrDelegation') }}</span>
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>
    <div class="mb-4" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Footer from '@/components/Footer.vue'
import GovSidebar from './GovSidebar.vue'
import { timeAgo } from '@/utils/time'

const { t } = useI18n()

type Status = 'Deciding' | 'Preparing' | 'Executed' | 'TimedOut' | 'Rejected'

interface ReferendumDetail {
  id: number
  title: string
  amount?: string
  proposer: string
  track: string
  createdAt: string | number
  status: Status
  comments?: number
  contentParagraphs: string[]
  aiSummary: string[]
  decisionPeriod: string
  confirmationPeriod: string
  attempts: number
  tally: {
    ayePct: number
    nayPct: number
    ayeAmount: string
    nayAmount: string
    support: string
    threshold: string
    issuance: string
  }
}

const route = useRoute()
const id = computed(() => Number(route.params.id) || 0)
const activeTab = ref<'content' | 'summary' | 'translations'>('content')
const votesView = ref<'nested' | 'flattened'>('nested')

const contentTabs = [
  { key: 'content' as const, labelKey: 'govDetail.tabContent' },
  { key: 'summary' as const, labelKey: 'govDetail.tabSummary' },
  { key: 'translations' as const, labelKey: 'govDetail.tabTranslations' },
]

// 根据 id 返回详情（模拟；可替换为 API）
const detail = computed<ReferendumDetail | null>(() => {
  const rid = id.value
  if (!rid) return null
  const base = getReferendumBase(rid)
  if (!base) return null
  return getReferendumDetail(rid, base)
})

function getReferendumBase(rid: number): Record<string, unknown> | null {
  const list: Record<string, unknown>[] = [
    { id: 1836, title: 'Polkadot-API 2026 Development Funding through Polkadot Community Foundation', amount: '≈955.21K USDC', proposer: '16JG...pr9J', track: 'Medium Spender', createdAt: Date.now() - 12 * 60 * 60 * 1000, status: 'Deciding', comments: 0 },
    { id: 1833, title: 'Polkadot Moderation Team Bounty Top-up', amount: '82,118 DOT', proposer: '12Gk...QKp5', track: 'Medium Spender', createdAt: Date.now() - 15 * 60 * 60 * 1000, status: 'Deciding', comments: 3 },
    { id: 1832, title: 'System Collator Bounty - Topup', amount: '≈70.2K DOT', proposer: '15D2...KwVb', track: 'Medium Spender', createdAt: Date.now() - 7 * 60 * 60 * 1000, status: 'Deciding', comments: 4 },
    { id: 1837, title: 'Deploy Universal Deterministic Deployment Proxy (CREATE2 Factory) on Asset Hub', proposer: '15PC...irSY', track: 'Whitelisted Caller', createdAt: Date.now() - 15 * 60 * 60 * 1000, status: 'Preparing', comments: 0 },
    { id: 1835, title: 'Cancelled: Let this proposal time out', proposer: '15PC...irSY', track: 'Root', createdAt: Date.now() - 15 * 60 * 60 * 1000, status: 'Preparing', comments: 0 },
    { id: 1828, title: 'Polkadot Upgrade 2.0.5', proposer: '13TR...wxUE', track: 'Whitelisted Caller', createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, status: 'Executed', comments: 9 },
    { id: 1827, title: '[Wish For Change] The Dynamic Allocation Pool (DAP) and the future of staking: Phase 1', proposer: '13b1...aAUN', track: 'Wish For Change', createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000 - 15 * 60 * 60 * 1000, status: 'Executed', comments: 7 },
    { id: 1826, title: '[Root] Referendum #1826', proposer: '16MP...gt9R', track: 'Root', createdAt: Date.now() - 26 * 24 * 60 * 60 * 1000, status: 'TimedOut', comments: 3 },
    { id: 1825, title: '[Small Spender] Squidsway Governance Report and Tool', amount: '8,000 USDT', proposer: '13id...Cs2M', track: 'Small Spender', createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000, status: 'Rejected', comments: 5 },
  ]
  return list.find((r) => Number(r.id) === rid) || null
}

function getReferendumDetail(rid: number, base: Record<string, unknown>): ReferendumDetail {
  const defaultContent = [
    'This proposal covers the funding for the continued development and the additional efforts of the team.',
    'We are seeking funding for ongoing development and maintenance. You can review all the details in the linked documents.',
    'Once the referendum is approved, the team will go through the following process: Create and sign a contractual agreement; execute each payment per milestone.',
  ]
  const defaultSummary = [
    'This proposal is about funding for development.',
    'The team wants support to continue working on the project.',
    'They will sign a contract and get paid per milestone.',
  ]
  if (rid === 1836) {
    return {
      ...base,
      id: rid,
      title: (base.title as string) || '',
      proposer: (base.proposer as string) || '',
      track: (base.track as string) || '',
      createdAt: base.createdAt as number,
      status: (base.status as Status) || 'Deciding',
      contentParagraphs: [
        'This proposal covers the funding for the continued development of Polkadot-API and the additional efforts of its team for 2026.',
        'Over the past development cycles, we have introduced new features and enhancements to Polkadot-API, along with additional libraries that complement and expand its capabilities. We have also released a series of tech demos that are valuable in their own right, while also showcasing the potential of these libraries.',
        'We are seeking funding for ongoing development and maintenance through the Polkadot Community Foundation, for the months from January 2026 to December 2026. As outlined in their documentation, the beneficiary is their address in AssetHub.',
        'Once the referendum is approved, the PCF and Polkadot-API team will go through the following process: Create and sign a contractual agreement; for each monthly milestone, the team will issue an invoice to the PCF; the PCF will execute each payment.',
      ],
      aiSummary: [
        'Polkadot-API is a tool for developers.',
        'The team wants money to keep working on it in 2026.',
        'They have made new features and cool demos.',
        'They will sign a contract and get paid each month.',
        'Some extra money is set aside for costs.',
      ],
      decisionPeriod: '28d',
      confirmationPeriod: '4d',
      attempts: 0,
      tally: {
        ayePct: 100,
        nayPct: 0,
        ayeAmount: '≈203.73K DOT',
        nayAmount: '0 DOT',
        support: '0.00%',
        threshold: '0.0%',
        issuance: '≈1.64B DOT',
      },
    } as ReferendumDetail
  }
  return {
    ...base,
    id: rid,
    title: (base.title as string) || '',
    proposer: (base.proposer as string) || '',
    track: (base.track as string) || '',
    createdAt: base.createdAt as number,
    status: (base.status as Status) || 'Deciding',
    contentParagraphs: defaultContent,
    aiSummary: defaultSummary,
    decisionPeriod: '28d',
    confirmationPeriod: '4d',
    attempts: 0,
    tally: {
      ayePct: 85,
      nayPct: 15,
      ayeAmount: '≈150K DOT',
      nayAmount: '≈20K DOT',
      support: '5.00%',
      threshold: '50%',
      issuance: '≈1.64B DOT',
    },
  } as ReferendumDetail
}

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

.breadcrumb {
  color: rgba($secondary-text-rgb, 0.5);
  font-size: 13px;

  .breadcrumb-link {
    color: rgba($secondary-text-rgb, 0.5);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: rgba($secondary-text-rgb, 0.8);
    }
  }

  .breadcrumb-sep {
    opacity: 0.4;
    margin: 0 4px;
  }

  .breadcrumb-current {
    color: rgba($secondary-text-rgb, 0.7);
  }
}

.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.border-t {
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.detail-header {
  padding: 28px 32px;
  
  .detail-title {
    font-size: 20px;
    font-weight: 500;
    color: $primary-text;
    margin: 0;
    line-height: 1.4;
    letter-spacing: -0.01em;
  }

  .detail-meta {
    .track-badge {
      padding: 3px 10px;
      font-size: 11px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.04);
      color: rgba($secondary-text-rgb, 0.6);
      font-weight: 400;
    }
  }
}

.tabs-wrap {
  padding: 0 32px;
  
  .tabs {
    .tab-btn {
      padding: 12px 0;
      font-size: 13px;
      color: rgba($secondary-text-rgb, 0.5);
      background: none;
      border: none;
      border-bottom: 1px solid transparent;
      margin-bottom: -1px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 400;
      margin-right: 24px;

      &:hover {
        color: rgba($secondary-text-rgb, 0.8);
      }

      &.active {
        color: $primary-text;
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

.content-wrap {
  padding: 28px 32px;
  
  .prose p,
  .prose ul {
    margin: 0 0 1.25em;
    color: rgba($secondary-text-rgb, 0.7);
    line-height: 1.7;
    font-size: 14px;
  }

  .prose ul {
    padding-left: 1.25em;
  }
}

.section-title {
  font-size: 11px;
  font-weight: 500;
  color: rgba($secondary-text-rgb, 0.4);
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.status-cards {
  .status-card {
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 2px;
    min-width: 120px;
    border: 1px solid rgba(255, 255, 255, 0.04);

    .status-card-label {
      display: block;
      font-size: 10px;
      color: rgba($secondary-text-rgb, 0.4);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-card-value {
      font-size: 15px;
      font-weight: 500;
      color: rgba($secondary-text-rgb, 0.8);
    }
  }
}

.tally-section {
  .tally-row {
    .tally-label {
      display: block;
      font-size: 11px;
      color: rgba($secondary-text-rgb, 0.5);
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .tally-pct {
      font-size: 16px;
      font-weight: 500;
      margin-right: 8px;
    }

    .tally-amount {
      font-size: 13px;
      color: rgba($secondary-text-rgb, 0.5);
    }

    .tally-aye .tally-pct {
      color: rgba($secondary-text-rgb, 0.9);
    }

    .tally-nay .tally-pct {
      color: rgba($secondary-text-rgb, 0.6);
    }
  }
}

.votes-view-toggle .toggle-btn {
  padding: 6px 14px;
  font-size: 12px;
  border-radius: 2px;
  border: none;
  background: transparent;
  color: rgba($secondary-text-rgb, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 400;

  &:hover {
    color: rgba($secondary-text-rgb, 0.8);
  }

  &.active {
    background: rgba(255, 255, 255, 0.05);
    color: $primary-text;
  }
}

.actions-btns .btn {
  font-size: 13px;
  padding: 10px 20px;
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

.link-back {
  display: inline-block;
  margin-top: 8px;
  color: rgba($secondary-text-rgb, 0.5);
}

.text-secondary {
  color: $secondary-text;
}
</style>
