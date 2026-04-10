<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-6">
      <GovSidebar />

      <main class="gov-main flex-1 min-w-0">
        <div v-if="loading" class="chain-box main-box p-10 text-center text-secondary">
          {{ t('gov.loadingReferenda') }}
        </div>
        <div v-else-if="!detail" class="chain-box main-box p-10 text-center text-secondary">
          {{ t('govDetail.notFound', { id }) }}
          <RouterLink to="/gov" class="link-back">{{ t('govDetail.backToReferenda') }}</RouterLink>
        </div>

        <template v-else>
          <!-- Breadcrumb: Referenda / Track / #id -->
          <nav class="breadcrumb flex flex-wrap items-center gap-1 text-sm mb-4">
            <RouterLink to="/gov" class="breadcrumb-link">{{ t('govDetail.referenda') }}</RouterLink>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-current">#{{ detail.id }}</span>
          </nav>

          <div class="chain-box main-box">
            <!-- 标题 + 元信息 -->
            <div class="detail-header border-b border-white-4">
              <div class="detail-title-row">
                <h1 class="detail-title">{{ detail.title }}</h1>
                <div class="header-actions">
                  <UButton
                    v-if="showDepositBtn"
                    type="button"
                    color="neutral"
                    variant="solid"
                    size="sm"
                    :loading="depositing"
                    @click="openDepositModal"
                  >
                    {{ t('govDetail.deposit') }}
                  </UButton>
                  <UButton
                    v-if="showCancelBtn"
                    type="button"
                    color="neutral"
                    variant="outline"
                    size="sm"
                    :loading="canceling"
                    @click="handleCancel"
                  >
                    {{ t('govDetail.cancel') }}
                  </UButton>
                  <UButton
                    v-if="showExecuteBtn"
                    type="button"
                    color="neutral"
                    variant="outline"
                    size="sm"
                    :loading="executing"
                    @click="handleExecute"
                  >
                    {{ t('govDetail.execute') }}
                  </UButton>
                </div>
              </div>
              <div class="detail-meta flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                <span class="meta-proposer">{{ detail.proposer }}</span>
                <span class="meta-time">{{ t('gov.atBlock', { block: detail.submitBlock }) }}</span>
                <span v-if="detail.comments !== undefined" class="meta-comments">{{ detail.comments }}</span>
                <UBadge class="status-badge" :class="statusClass(detail.status)" color="neutral" variant="subtle" size="sm">
                  {{ statusLabel(detail.status) }}
                </UBadge>
              </div>
            </div>

            <!-- Deposit 弹窗 -->
            <UModal
              :open="depositModalOpen"
              :title="t('govDetail.deposit')"
              :dismissible="true"
              @update:open="(v: boolean) => (depositModalOpen = v)"
            >
              <template #body>
                <div class="space-y-3">
                  <div class="text-sm text-secondary">
                    {{ t('govDetail.depositAmount') }}
                  </div>
                  <UInput class="w-full" v-model="depositAmount" size="lg" color="neutral" />
                </div>
              </template>
              <template #footer>
                <div class="flex w-full justify-end gap-3">
                  <UButton color="neutral" variant="outline" size="lg" type="button" @click="depositModalOpen = false">
                    {{ t('common.cancel') }}
                  </UButton>
                  <UButton
                    color="neutral"
                    variant="solid"
                    size="lg"
                    type="button"
                    :loading="depositing"
                    :disabled="!depositAmount"
                    @click="handleDeposit"
                  >
                    {{ t('common.submit') }}
                  </UButton>
                </div>
              </template>
            </UModal>

            <!-- Track 信息 -->
            <div v-if="detail.track" class="track-section p-5 lg:p-8 border-b border-white-4">
              <h3 class="section-title">{{ t('gov.tracks') }}</h3>
              <div class="track-grid">
                <div class="track-kv">
                  <span class="track-k">ID</span>
                  <span class="track-v">#{{ detail.track.id }}</span>
                </div>
                <div class="track-kv">
                  <span class="track-k">Name</span>
                  <span class="track-v">{{ detail.track.name }}</span>
                </div>
                <div class="track-kv">
                  <span class="track-k">{{ t('govTracks.preparePeriod') }}</span>
                  <span class="track-v">{{ detail.track.preparePeriod }}</span>
                </div>
                <div class="track-kv">
                  <span class="track-k">{{ t('govTracks.decisionPeriod') }}</span>
                  <span class="track-v">{{ detail.track.decisionPeriod }}</span>
                </div>
                <div class="track-kv">
                  <span class="track-k">{{ t('govTracks.confirmPeriod') }}</span>
                  <span class="track-v">{{ detail.track.confirmPeriod }}</span>
                </div>
                <div class="track-kv">
                  <span class="track-k">{{ t('govTracks.decisionDeposit') }}</span>
                  <span class="track-v">{{ detail.track.decisionDeposit }}</span>
                </div>
                <div class="track-kv">
                  <span class="track-k">{{ t('govTracks.maxBalance') }}</span>
                  <span class="track-v">{{ detail.track.maxBalance }}</span>
                </div>
              </div>
            </div>

            <!-- Tabs: Content | AI Summary | Translations -->
            <div class="tabs-wrap pt-3">
              <div class="tabs flex gap-4 border-b border-white-4">
                <UButton
                  v-for="tab in contentTabs"
                  :key="tab.key"
                  type="button"
                  :class="{ active: activeTab === tab.key } + ' p-4 tab-btn'"
                  @click="activeTab = tab.key"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                >
                  {{ t(tab.labelKey) }}
                </UButton>
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
            <div class="status-section p-5 lg:p-8 border-t border-white-4">
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
            <div class="tally-section p-5 lg:p-8 border-t border-white-4">
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
            <div class="votes-section p-5 lg:p-8 border-t border-white-4">
              <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h3 class="section-title mb-0">{{ t('govDetail.votes') }}</h3>
                <div class="votes-view-toggle flex gap-2">
                  <UButton
                    type="button"
                    class="toggle-btn"
                    :class="{ active: votesView === 'nested' }"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    @click="votesView = 'nested'"
                  >
                    {{ t('govDetail.nested') }}
                  </UButton>
                  <UButton
                    type="button"
                    class="toggle-btn"
                    :class="{ active: votesView === 'flattened' }"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    @click="votesView = 'flattened'"
                  >
                    {{ t('govDetail.flattened') }}
                  </UButton>
                </div>
              </div>
              <div class="votes-placeholder text-secondary text-sm">
                {{ t('govDetail.voteListPlaceholder') }}
              </div>
            </div>

            <!-- Actions -->
            <div class="actions-section p-5 lg:p-8 border-t border-white-4">
              <h3 class="section-title">{{ t('govDetail.actions') }}</h3>
              <div class="actions-btns flex flex-wrap items-center gap-3">
                <UButton
                  v-if="showDepositBtn"
                  type="button"
                  class="mbtn mbtn--primary"
                  color="neutral"
                  variant="solid"
                  size="sm"
                  :loading="depositing"
                  @click="openDepositModal"
                >
                  {{ t('govDetail.deposit') }}
                </UButton>
                <UButton
                  v-if="showCancelBtn"
                  type="button"
                  class="mbtn"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  :loading="canceling"
                  @click="handleCancel"
                >
                  {{ t('govDetail.cancel') }}
                </UButton>
                <UButton
                  v-if="showExecuteBtn"
                  type="button"
                  class="mbtn"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  :loading="executing"
                  @click="handleExecute"
                >
                  {{ t('govDetail.execute') }}
                </UButton>
              </div>
              <div class="text-secondary text-sm mt-3">
                {{ t('govDetail.voteOrDelegation') }}
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Footer from '@/components/Footer.vue'
import GovSidebar from './GovSidebar.vue'
import { SecretContractApi } from '@/apis/contract'
import { hexToSS58 } from '@/utils/chain'
import { parseHumanNumber } from '@/utils/parseHumanNumber'
import { ProposalState, proposalStateToGovUi, readProposalStateCode, type GovProposalUiStatus } from '@/utils/proposalState'
import { $getTxProvider } from '@/plugins/chain'
import type { WalletWrap } from '@/providers'

const { t } = useI18n()

type Status = GovProposalUiStatus

interface ReferendumDetail {
  id: number
  title: string
  proposer: string
  trackId: number
  trackLabel: string
  track?: {
    id: number
    name: string
    preparePeriod: string
    decisionPeriod: string
    confirmPeriod: string
    decisionDeposit: string
    maxBalance: string
  }
  submitBlock: number
  status: Status
  stateCode: number
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
  { key: 'translations' as const, labelKey: 'govDetail.tabTranslations' },
]

const loading = ref(false)
const detail = ref<ReferendumDetail | null>(null)
const depositAmount = ref('')
const depositing = ref(false)
const canceling = ref(false)
const executing = ref(false)
const depositModalOpen = ref(false)

const showDepositBtn = computed(() => {
  if (!detail.value) return false
  return detail.value.stateCode === ProposalState.Pending
})

const showCancelBtn = computed(() => {
  if (!detail.value) return false
  return (
    detail.value.stateCode === ProposalState.Pending ||
    detail.value.stateCode === ProposalState.Ongoing ||
    detail.value.stateCode === ProposalState.Confirming
  )
})

const showExecuteBtn = computed(() => {
  if (!detail.value) return false
  return detail.value.stateCode === ProposalState.Approved
})

function bytesToString(bytes: unknown): string {
  if (!bytes) return ''
  if (typeof bytes === 'string') return bytes
  if (Array.isArray(bytes)) return String.fromCharCode(...bytes.filter((b: number) => b !== 0))
  return String(bytes)
}

function formatBlocks(blocks: number): string {
  if (!blocks) return '0'
  const seconds = blocks * 6
  if (seconds < 60) return `${blocks} blocks`
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
  return `${Math.round(seconds / 86400)} days`
}

function callerToSs58(caller: { t?: string | number; v?: string } | null | undefined): string {
  if (!caller?.v) return '—'
  if (String(caller.t) !== '1') return '—'
  return hexToSS58(caller.v)
}

function normalizeSelectorHex(s: string): string {
  const t = s.toLowerCase().trim()
  if (!t) return ''
  return t.startsWith('0x') ? t : `0x${t}`
}

function formatProposalCall(
  call: unknown,
  methodBySelector: Map<string, string>,
): { callLabel: string; callAmount: string } {
  if (!call || typeof call !== 'object') return { callLabel: '', callAmount: '' }
  let c = call as Record<string, unknown>
  if ('Some' in c && c.Some && typeof c.Some === 'object') c = c.Some as Record<string, unknown>
  const selector = normalizeSelectorHex(String(c.selector ?? ''))
  const contract = String(c.contract ?? 'gov')
  const amountRaw = c.amount
  const amount = amountRaw == null ? '' : String(amountRaw).replace(/,/g, '')
  if (!selector) return { callLabel: '', callAmount: amount }
  const method = methodBySelector.get(selector) ?? selector
  return { callLabel: `${contract}.${method}`, callAmount: amount }
}

async function loadDetail() {
  const rid = id.value
  if (!Number.isFinite(rid)) return
  loading.value = true
  try {
    const [proposalResult, tracksResult, methodBySelector] = await Promise.all([
      SecretContractApi.proposal(rid),
      SecretContractApi.tracks(),
      SecretContractApi.getGovSelectorMethodMap(),
    ])

    const p = (proposalResult as any)?.Some ?? proposalResult
    if (!p || typeof p !== 'object') {
      detail.value = null
      return
    }

    const trackId = parseHumanNumber((p as any).trackID)
    let trackLabel = `#${trackId}`
    let trackDetail: ReferendumDetail['track'] | undefined = undefined
    if (Array.isArray(tracksResult)) {
      for (const item of tracksResult) {
        const row = item as any[]
        const id0 = parseHumanNumber(row?.[0])
        if (id0 === trackId) {
          const data = (row?.[1] ?? {}) as Record<string, unknown>
          const name = bytesToString((data as any).name)
          if (name) trackLabel = name
          trackDetail = {
            id: trackId,
            name: name || trackLabel,
            preparePeriod: formatBlocks(parseHumanNumber((data as any).prepare_period ?? (data as any).preparePeriod)),
            decisionPeriod: formatBlocks(parseHumanNumber((data as any).decision_period ?? (data as any).decisionPeriod)),
            confirmPeriod: formatBlocks(parseHumanNumber((data as any).confirm_period ?? (data as any).confirmPeriod)),
            decisionDeposit: `${String((data as any).decision_deposit ?? (data as any).decisionDeposit ?? '0')} VOTE`,
            maxBalance: `${String((data as any).max_balance ?? (data as any).maxBalance ?? '0')} VOTE`,
          }
          break
        }
      }
    }

    const code = readProposalStateCode((p as any).status)
    const { callLabel, callAmount } = formatProposalCall((p as any).call, methodBySelector)

    const content = [
      callLabel ? `Call: ${callLabel}` : 'Call: -',
      callAmount !== '' ? `Amount: ${callAmount} VOTE` : 'Amount: -',
      `TrackID: ${trackId}`,
    ]

    detail.value = {
      id: parseHumanNumber((p as any).id),
      title: t('gov.proposalTitle', { id: rid }),
      proposer: callerToSs58((p as any).caller),
      trackId,
      trackLabel,
      track: trackDetail,
      submitBlock: parseHumanNumber((p as any).submitBlock),
      status: proposalStateToGovUi(code),
      stateCode: code,
      contentParagraphs: content,
      aiSummary: [],
      decisionPeriod: '-',
      confirmationPeriod: '-',
      attempts: 0,
      tally: {
        ayePct: 0,
        nayPct: 0,
        ayeAmount: '-',
        nayAmount: '-',
        support: '0',
        threshold: '0',
        issuance: '-',
      },
    }
  } catch (e) {
    console.error('Failed to load referendum detail:', e)
    detail.value = null
  } finally {
    loading.value = false
  }
}

watch(id, () => loadDetail(), { immediate: true })

function openDepositModal() {
  depositAmount.value = ''
  depositModalOpen.value = true
}

async function handleDeposit() {
  if (!detail.value || depositing.value) return
  depositing.value = true
  try {
    await $getTxProvider(async (wallet: WalletWrap) => {
      await SecretContractApi.depositProposalTx(wallet, detail.value!.id, depositAmount.value)
    })
    depositModalOpen.value = false
    await loadDetail()
  } catch (e) {
    console.error('DepositProposal failed:', e)
  } finally {
    depositing.value = false
  }
}

async function handleCancel() {
  if (!detail.value || canceling.value) return
  canceling.value = true
  try {
    await $getTxProvider(async (wallet: WalletWrap) => {
      await SecretContractApi.cancelProposal(wallet, detail.value!.id)
    })
    await loadDetail()
  } catch (e) {
    console.error('CancelProposal failed:', e)
  } finally {
    canceling.value = false
  }
}

async function handleExecute() {
  if (!detail.value || executing.value) return
  executing.value = true
  try {
    await $getTxProvider(async (wallet: WalletWrap) => {
      await SecretContractApi.execProposal(wallet, detail.value!.id)
    })
    await loadDetail()
  } catch (e) {
    console.error('ExecProposal failed:', e)
  } finally {
    executing.value = false
  }
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

.border-white-4 {
  border-color: rgba(255, 255, 255, 0.04);
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
      
      background: rgba(255, 255, 255, 0.04);
      color: rgba($secondary-text-rgb, 0.6);
      font-weight: 400;
    }
  }
}

.detail-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.tabs-wrap {
  padding: 0 32px;
  
  .tabs {
    .tab-btn {
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

.actions-btns .mbtn {
  
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

.track-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px 18px;
  margin-top: 12px;
}

.track-kv {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.track-k {
  color: rgba($secondary-text-rgb, 0.55);
  font-size: 12px;
  white-space: nowrap;
}

.track-v {
  color: $primary-text;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
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
