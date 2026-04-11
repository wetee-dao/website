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
              <div class="detail-header-inner">
                <div class="detail-header-main min-w-0">
                  <h1 class="detail-title">{{ detail.title }}</h1>
                  <div class="detail-meta flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span class="meta-proposer">{{ detail.proposer }}</span>
                    <span class="meta-time">{{ t('gov.atBlock', { block: detail.submitBlock }) }}</span>
                    <span v-if="detail.comments !== undefined" class="meta-comments">{{ detail.comments }}</span>
                    <UBadge class="status-badge p-2" :class="statusClass(detail.status)" color="neutral"
                      variant="subtle" size="sm">
                      {{ statusLabel(detail.status) }}
                    </UBadge>
                  </div>
                </div>
                <div class="header-actions">
                  <UButton v-if="showVoteBtn" type="button" color="neutral" variant="solid" size="lg" class="p-2"
                    :loading="voting" @click="openVoteModal">
                    {{ t('govDetail.vote') }}
                  </UButton>
                  <UButton v-if="showDepositBtn" type="button" color="neutral" variant="solid" size="lg" class="p-2"
                    :loading="depositing" @click="openDepositModal">
                    {{ t('govDetail.deposit') }}
                  </UButton>
                  <UButton v-if="showCancelBtn" type="button" color="neutral" variant="outline" size="lg" class="p-2"
                    :loading="canceling" @click="handleCancel">
                    {{ t('govDetail.cancel') }}
                  </UButton>
                  <UButton v-if="showExecuteBtn" type="button" color="neutral" variant="outline" size="lg" class="p-2"
                    :loading="executing" @click="handleExecute">
                    {{ t('govDetail.execute') }}
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Deposit 弹窗 -->
            <UModal :open="depositModalOpen" :title="t('govDetail.deposit')" :dismissible="true"
              @update:open="(v: boolean) => (depositModalOpen = v)">
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
                  <UButton color="neutral" variant="solid" size="lg" type="button" :loading="depositing"
                    :disabled="!depositAmount" @click="handleDeposit">
                    {{ t('common.submit') }}
                  </UButton>
                </div>
              </template>
            </UModal>

            <!-- Vote 弹窗 -->
            <UModal :open="voteModalOpen" :title="t('govDetail.vote')" :dismissible="true"
              @update:open="(v: boolean) => (voteModalOpen = v)">
              <template #body>
                <div class="space-y-4">
                  <div class="flex flex-wrap gap-2">
                    <UButton type="button" color="neutral" size="lg" :variant="voteYes ? 'solid' : 'outline'"
                      @click="voteYes = true">
                      {{ t('govDetail.voteYes') }}
                    </UButton>
                    <UButton type="button" color="neutral" size="lg" :variant="!voteYes ? 'solid' : 'outline'"
                      @click="voteYes = false">
                      {{ t('govDetail.voteNo') }}
                    </UButton>
                  </div>
                  <div class="space-y-2">
                    <div class="text-sm text-secondary">
                      {{ t('govDetail.voteLockAmount') }}
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between text-xs text-white/50">
                        <span>{{ votePercent }}%</span>
                        <span>{{ unlockedBalance.toString() }}</span>
                      </div>
                      <input class="vote-slider" type="range" min="0" max="100" step="1" :value="votePercent"
                        @input="onVotePercentInput" />
                      <UInput class="w-full" v-model="voteLockAmount" size="lg" color="neutral" />
                    </div>
                  </div>
                </div>
              </template>
              <template #footer>
                <div class="flex w-full justify-end gap-3">
                  <UButton color="neutral" variant="outline" size="lg" type="button" @click="voteModalOpen = false">
                    {{ t('common.cancel') }}
                  </UButton>
                  <UButton color="neutral" variant="solid" size="lg" type="button" :loading="voting"
                    :disabled="votePercent <= 0 || !voteLockAmount" @click="handleVote">
                    {{ t('common.submit') }}
                  </UButton>
                </div>
              </template>
            </UModal>

            <GovThresholdCurvesModal v-model:open="curvesModalOpen"
              :decision-period-blocks="detail.decisionPeriodBlocks" :decision-start-block="detail.decisionStartBlock"
              :min-approval="detail.track?.minApproval" :min-support="detail.track?.minSupport" :vote-items="voteItems"
              :total-supply-bn="totalSupplyBn" :votes-loading="votesLoading" />

            <div class="detail-body flex flex-col lg:flex-row lg:items-stretch min-w-0">
              <div class="detail-main flex-1 min-w-0">
                <!-- Track 信息 -->
                <div v-if="detail.track" class="track-section p-5 lg:p-8 border-b border-white-4">
                  <h3 class="section-title">{{ t('gov.tracks') }}</h3>
                  <div class="track-grid">
                    <div class="track-kv">
                      <span class="track-k">Name</span>
                      <span class="track-v">#{{ detail.track.id }} {{ detail.track.name }}</span>
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
                <div class="tabs-wrap pt-3 border-b border-white-4">
                  <div class="tabs flex gap-4">
                    <UButton v-for="tab in contentTabs" :key="tab.key" type="button"
                      :class="{ active: activeTab === tab.key } + ' p-4 tab-btn'" @click="activeTab = tab.key"
                      color="neutral" variant="ghost" size="sm">
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
              </div>

              <aside
                class="gov-detail-side flex flex-col w-full lg:w-[min(22rem,38%)] xl:max-w-[26rem] flex-shrink-0 border-t border-white-4 lg:border-t-0 lg:border-l lg:border-white-4 divide-y divide-white/[0.06]">
                <!-- Status: 决策期进度条 + 确认期 + 尝试次数 -->
                <div class="status-section gov-detail-side-section p-5 lg:p-6">
                  <h3 class="section-title">{{ t('govDetail.status') }}</h3>
                  <div class="status-decision-block">
                    <div class="status-kv-row">
                      <span class="status-k">{{ t('govDetail.decision') }}</span>
                      <span class="status-v">{{ formatDurationShort(detail.decisionPeriodBlocks) }}</span>
                    </div>
                    <div class="status-progress-track" role="progressbar"
                      :aria-valuenow="Math.round(decisionPhaseProgress)" aria-valuemin="0" aria-valuemax="100">
                      <div class="status-progress-fill" :style="{ width: `${decisionPhaseProgress}%` }" />
                    </div>
                  </div>
                  <div class="status-divider" />
                  <div class="status-kv-row">
                    <span class="status-k">{{ t('govDetail.confirmation') }}</span>
                    <span class="status-v">{{ formatDurationShort(detail.confirmPeriodBlocks) }}</span>
                  </div>
                  <div class="status-kv-row">
                    <span class="status-k">{{ t('govDetail.attempts') }}</span>
                    <span class="status-v">{{ detail.attempts }}</span>
                  </div>
                </div>

                <!-- Tally：批准 / 支持 双进度条 + 三指标卡 -->
                <div class="tally-section gov-detail-side-section p-5 lg:p-6">
                  <div class="tally-section-head flex flex-wrap items-center gap-2">
                    <h3 class="section-title tally-title-inline">{{ t('govDetail.tally') }}</h3>
                    <button v-if="detail.track && detail.decisionPeriodBlocks > 0" type="button"
                      class="curve-chart-launch" :title="t('govDetail.thresholdCurvesModalHint')"
                      :aria-label="t('govDetail.thresholdCurvesModalHint')" @click="curvesModalOpen = true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        aria-hidden="true">
                        <path d="M4 19h16M7 15l3-4 3 3 4-6" stroke="currentColor" stroke-width="1.75"
                          stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4 5v14" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"
                          opacity="0.35" />
                      </svg>
                    </button>
                  </div>

                  <p class="gov-subtitle">{{ t('govDetail.approvalSection') }}</p>
                  <div class="gov-stacked-bar gov-stacked-bar--approval">
                    <div class="gov-bar-seg gov-bar-seg--aye" :style="{ flex: `0 0 ${voteTally.ayePct}%` }" />
                    <div class="gov-bar-seg gov-bar-seg--nay" :style="{ flex: `0 0 ${voteTally.nayPct}%` }" />
                    <div class="gov-bar-marker"
                      :style="{ left: `${Math.min(100, Math.max(0, govTallyMetrics.approvalThresholdPct))}%` }" />
                  </div>
                  <div class="gov-pct-row">
                    <span>{{ govTallyMetrics.currentApprovalPct.toFixed(2) }}% {{ t('govDetail.aye') }}</span>
                    <span class="gov-pct-mid">{{ govTallyMetrics.approvalThresholdPct.toFixed(2) }}% {{
                      t('govDetail.threshold')
                      }}</span>
                    <span>{{ voteTally.nayPct.toFixed(2) }}% {{ t('govDetail.nay') }}</span>
                  </div>
                  <div class="gov-amount-rows">
                    <div class="gov-amount-row gov-amount-row--aye">
                      <span class="gov-amount-icon" aria-hidden="true">✓</span>
                      <span>{{ t('govDetail.votesAyeCount') }} ({{ voteSummary.ayeCount }})</span>
                      <span class="gov-amount-amt">{{ formatApproxAmount(voteSummary.ayeTotal) }} VOTE</span>
                    </div>
                    <div class="gov-amount-row gov-amount-row--nay">
                      <span class="gov-amount-icon" aria-hidden="true">✗</span>
                      <span>{{ t('govDetail.votesNayCount') }} ({{ voteSummary.nayCount }})</span>
                      <span class="gov-amount-amt">{{ formatApproxAmount(voteSummary.nayTotal) }} VOTE</span>
                    </div>
                  </div>

                  <p class="gov-subtitle gov-subtitle--spaced">{{ t('govDetail.supportSection') }}</p>
                  <div class="gov-support-track">
                    <div class="gov-support-fill"
                      :style="{ width: `${Math.min(100, Math.max(0, govTallyMetrics.currentSupportPct))}%` }" />
                    <div class="gov-bar-marker"
                      :style="{ left: `${Math.min(100, Math.max(0, govTallyMetrics.supportThresholdPct))}%` }" />
                  </div>
                  <div class="gov-pct-row gov-pct-row--support">
                    <span>{{ govTallyMetrics.currentSupportPct.toFixed(2) }}%</span>
                    <span>{{ govTallyMetrics.supportThresholdPct.toFixed(2) }}% {{ t('govDetail.threshold') }}</span>
                  </div>
                  <div class="gov-amount-rows gov-amount-rows--compact">
                    <div class="gov-amount-row">
                      <span class="gov-amount-icon gov-amount-icon--muted" aria-hidden="true">▣</span>
                      <span>{{ t('govDetail.support') }} {{ govTallyMetrics.currentSupportPct.toFixed(2) }}%</span>
                      <span class="gov-amount-amt">{{ formatApproxAmount(voteSummary.total) }} VOTE</span>
                    </div>
                    <div class="gov-amount-row">
                      <span class="gov-amount-icon gov-amount-icon--muted" aria-hidden="true">▤</span>
                      <span>{{ t('govDetail.issuance') }}</span>
                      <span class="gov-amount-amt">{{ formatApproxAmount(govTallyMetrics.issuance) }} VOTE</span>
                    </div>
                  </div>

                  <div class="gov-metric-cards w-full flex">
                    <div class="gov-metric-card flex-1 gov-metric-card--compact"
                      :class="govTallyMetrics.approvalMet ? 'gov-metric-card--met' : 'gov-metric-card--fail'">
                      <div class="gov-metric-line">
                        <span class="gov-metric-label">{{ t('govDetail.metricCurrentApproval') }}</span>
                        <span class="gov-metric-num">{{ govTallyMetrics.currentApprovalPct.toFixed(2) }}%</span>
                      </div>
                      <div class="gov-metric-line">
                        <span class="gov-metric-label">{{ t('govDetail.threshold') }}</span>
                        <span class="gov-metric-num">{{ govTallyMetrics.approvalThresholdPct.toFixed(2) }}%</span>
                      </div>
                    </div>
                    <div class="gov-metric-card flex-1 gov-metric-card--compact"
                      :class="govTallyMetrics.supportMet ? 'gov-metric-card--met' : 'gov-metric-card--fail'">
                      <div class="gov-metric-line">
                        <span class="gov-metric-label">{{ t('govDetail.metricCurrentSupport') }}</span>
                        <span class="gov-metric-num">{{ govTallyMetrics.currentSupportPct.toFixed(2) }}%</span>
                      </div>
                      <div class="gov-metric-line">
                        <span class="gov-metric-label">{{ t('govDetail.threshold') }}</span>
                        <span class="gov-metric-num">{{ govTallyMetrics.supportThresholdPct.toFixed(2) }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            <!-- Actions -->
            <div class="actions-section p-5 lg:p-8 border-t border-white-4">
              <div class="actions-btns flex flex-wrap items-center gap-3">
                <UButton v-if="showVoteBtn" type="button" class="p-3" color="neutral" variant="solid" size="lg"
                  :loading="voting" @click="openVoteModal">
                  {{ t('govDetail.vote') }}
                </UButton>
                <UButton v-if="showDepositBtn" type="button" class="p-3" color="neutral" variant="solid" size="lg"
                  :loading="depositing" @click="openDepositModal">
                  {{ t('govDetail.deposit') }}
                </UButton>
                <UButton v-if="showCancelBtn" type="button" class="p-3" color="neutral" variant="outline" size="lg"
                  :loading="canceling" @click="handleCancel">
                  {{ t('govDetail.cancel') }}
                </UButton>
                <UButton v-if="showExecuteBtn" type="button" class="p-3" color="neutral" variant="outline" size="lg"
                  :loading="executing" @click="handleExecute">
                  {{ t('govDetail.execute') }}
                </UButton>
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
import axios from 'axios'
import Footer from '@/components/Footer.vue'
import GovSidebar from './GovSidebar.vue'
import GovThresholdCurvesModal from './GovThresholdCurvesModal.vue'
import { SecretContractApi } from '@/apis/contract'
import { CurrentChainNode } from '@/plugins/chain'
import { hexToSS58 } from '@/utils/chain'
import { parseHumanNumber } from '@/utils/parseHumanNumber'
import { ProposalState, proposalStateToGovUi, readProposalStateCode, type GovProposalUiStatus } from '@/utils/proposalState'
import { $getTxProvider } from '@/plugins/chain'
import type { WalletWrap } from '@/providers'
import { BN } from '@polkadot/util'
import { getBnFromChain } from '@/utils/chain'
import { parseCurveFromApi, curveY, type Curve } from '@/utils/curve'

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
    minApproval: Curve
    minSupport: Curve
    maxDeciding: number
  }
  submitBlock: number
  status: Status
  stateCode: number
  comments?: number
  contentParagraphs: string[]
  aiSummary: string[]
  /** 决策期总长度（区块）用于进度条 */
  decisionPeriodBlocks: number
  confirmPeriodBlocks: number
  /** 准备期长度（区块），用于推算决策起点 */
  preparePeriodBlocks: number
  /**
   * 决策期时间起点（区块号），与阈值曲线 x=0 一致。
   * 优先取链上 status.block（已进入 Ongoing/Confirming），否则为 submitBlock + preparePeriod。
   */
  decisionStartBlock: number
  attempts: number
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
const voteModalOpen = ref(false)
const curvesModalOpen = ref(false)
const voting = ref(false)
const voteYes = ref(true)
const voteLockAmount = ref('')
const votePercent = ref(0)
const unlockedBalance = ref<BN>(new BN(0))

type VoteItem = {
  id: number
  voter: string
  yes: boolean
  lockAmount: BN
  weight: number
  voteBlock: number
}

const votesLoading = ref(false)
const voteItems = ref<VoteItem[]>([])
const headBlock = ref<number | null>(null)
const totalSupplyBn = ref<BN>(new BN(0))

const voteSummary = computed(() => {
  let ayeCount = 0
  let nayCount = 0
  let ayeTotal = new BN(0)
  let nayTotal = new BN(0)
  for (const v of voteItems.value) {
    if (v.yes) {
      ayeCount += 1
      ayeTotal = ayeTotal.add(v.lockAmount)
    } else {
      nayCount += 1
      nayTotal = nayTotal.add(v.lockAmount)
    }
  }
  return { ayeCount, nayCount, ayeTotal, nayTotal, total: ayeTotal.add(nayTotal) }
})

function formatBnComma(b: BN): string {
  return b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/** 按 pledge（lockAmount）汇总：占比与展示用金额 */
const voteTally = computed(() => {
  const { ayeTotal, nayTotal, total } = voteSummary.value
  let ayePct = 0
  let nayPct = 0
  if (total.gt(new BN(0))) {
    ayePct = Math.round(ayeTotal.mul(new BN(10000)).div(total).toNumber()) / 100
    nayPct = Math.round(nayTotal.mul(new BN(10000)).div(total).toNumber()) / 100
  }
  return {
    ayePct,
    nayPct,
    ayeAmount: `${formatBnComma(ayeTotal)} VOTE`,
    nayAmount: `${formatBnComma(nayTotal)} VOTE`,
  }
})

function permilleToNum(permille: number): number {
  return Math.round(permille) / 100
}

/** 决策期起点：与图表横轴 0、curveY(x) 的 x 一致 */
function resolveDecisionStartBlock(
  submitBlock: number,
  prepareBlocks: number,
  statusRaw: unknown,
): number {
  const fallback = submitBlock + Math.max(0, prepareBlocks)
  if (statusRaw == null || typeof statusRaw !== 'object') return fallback
  const o = statusRaw as Record<string, unknown>
  const stateBlock = parseHumanNumber(o.block ?? o.Block ?? 0)
  const code = readProposalStateCode(o.state ?? o)
  if (
    stateBlock > 0 &&
    (code === ProposalState.Ongoing || code === ProposalState.Confirming)
  ) {
    return stateBlock
  }
  return fallback
}

/** 链上曲线用的 x：决策期内已过去区块数（不超过决策期长度） */
const curveElapsedBlocks = computed(() => {
  const d = detail.value
  if (!d || d.decisionPeriodBlocks <= 0) return 0
  const start = d.decisionStartBlock
  let head = headBlock.value
  if (head == null || head <= start) {
    let maxVB = 0
    for (const v of voteItems.value) maxVB = Math.max(maxVB, v.voteBlock)
    if (maxVB > start) head = maxVB
    else return 0
  }
  const elapsed = head - start
  if (elapsed < 0) return 0
  return Math.min(d.decisionPeriodBlocks, elapsed)
})

/** 与参考 UI 一致：批准占比、支持占比、动态阈值、发行量 */
const govTallyMetrics = computed(() => {
  const d = detail.value
  const { ayeTotal, nayTotal, total } = voteSummary.value
  const ma = d?.track?.minApproval
  const ms = d?.track?.minSupport
  const x = curveElapsedBlocks.value

  let approvalThresholdPct = 0
  let supportThresholdPct = 0
  if (ma) approvalThresholdPct = permilleToNum(curveY(ma, x))
  if (ms) supportThresholdPct = permilleToNum(curveY(ms, x))

  const sum = ayeTotal.add(nayTotal)
  let currentApprovalPct = 0
  if (sum.gt(new BN(0))) {
    currentApprovalPct = Math.round(ayeTotal.mul(new BN(10000)).div(sum).toNumber()) / 100
  }

  let currentSupportPct = 0
  if (totalSupplyBn.value.gt(new BN(0)) && total.gt(new BN(0))) {
    currentSupportPct = Math.round(total.mul(new BN(1000000)).div(totalSupplyBn.value).toNumber()) / 10000
  }

  const approvalMet = currentApprovalPct >= approvalThresholdPct - 0.0001
  const supportMet = currentSupportPct >= supportThresholdPct - 0.0001

  return {
    approvalThresholdPct,
    supportThresholdPct,
    currentApprovalPct,
    currentSupportPct,
    approvalMet,
    supportMet,
    issuance: totalSupplyBn.value,
  }
})

/** 决策期进度 0–100（用于 Status 条） */
const decisionPhaseProgress = computed(() => {
  const d = detail.value
  if (!d || d.decisionPeriodBlocks <= 0) return 0
  return Math.min(100, (curveElapsedBlocks.value / d.decisionPeriodBlocks) * 100)
})

function formatDurationShort(blocks: number): string {
  if (!blocks) return '0'
  const sec = blocks * 6
  const days = Math.round(sec / 86400)
  if (days >= 1) return `${days}d`
  const hours = Math.round(sec / 3600)
  if (hours >= 1) return `${hours}h`
  const mins = Math.round(sec / 60)
  if (mins >= 1) return `${mins}m`
  return `${blocks} blocks`
}

function formatApproxAmount(b: BN): string {
  const s = b.toString()
  const n = BigInt(s)
  if (n >= 1_000_000_000_000n) return `≈ ${(Number(n) / 1e12).toFixed(2)}T`
  if (n >= 1_000_000_000n) return `≈ ${(Number(n) / 1e9).toFixed(2)}B`
  if (n >= 1_000_000n) return `≈ ${(Number(n) / 1e6).toFixed(2)}M`
  if (n >= 1_000n) return `≈ ${(Number(n) / 1e3).toFixed(2)}K`
  return s
}

/** tracks() 单条：{ id, track } 或 [id, track]，与 Tracks.vue 一致 */
function normalizeTrackEntry(item: any, index: number): { id: number; data: any } {
  if (item == null) return { id: index, data: {} }
  if (Array.isArray(item)) return { id: parseHumanNumber(item[0]), data: item[1] ?? {} }
  return { id: parseHumanNumber(item.id), data: item.track ?? {} }
}

async function fetchHeadBlockNumber(): Promise<number | null> {
  try {
    const rpc = CurrentChainNode().rpcUrl
    const { data } = await axios.post(
      rpc,
      { jsonrpc: '2.0', id: 1, method: 'chain_getHeader', params: [] },
      { headers: { 'Content-Type': 'application/json' } },
    )
    const num = data?.result?.number
    if (num == null) return null
    return typeof num === 'string' ? parseInt(num.replace(/^0x/i, ''), 16) : Number(num)
  } catch {
    return null
  }
}

function unwrapContractOk(v: unknown): unknown {
  if (!v || typeof v !== 'object') return v
  const o = v as Record<string, unknown>
  if ('Ok' in o) return unwrapContractOk(o.Ok)
  if ('ok' in o) return unwrapContractOk(o.ok)
  return v
}

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

const showVoteBtn = computed(() => {
  if (!detail.value) return false
  return (
    detail.value.stateCode === ProposalState.Ongoing ||
    detail.value.stateCode === ProposalState.Confirming
  )
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

async function loadVotes() {
  const proposalId = id.value
  if (!Number.isFinite(proposalId)) return
  votesLoading.value = true
  try {
    const rows = (await SecretContractApi.votes(proposalId, null, 1024)) as unknown
    const list = Array.isArray(rows) ? rows : []

    voteItems.value = list.map((v: any) => ({
      id: parseHumanNumber(v.index),
      voter: callerToSs58(v.caller),
      yes: Boolean(v.opinionYes),
      lockAmount: getBnFromChain(String(v.pledge ?? '0')),
      weight: parseHumanNumber(v.voteWeight),
      voteBlock: parseHumanNumber(v.voteBlock ?? v.VoteBlock ?? 0),
    }))
  } catch (e) {
    console.error('Failed to load votes:', e)
    voteItems.value = []
  } finally {
    votesLoading.value = false
  }
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

function bnFromContract(v: unknown): BN {
  const u = unwrapContractOk(v)
  if (u === undefined || u === null) return new BN(0)
  if (typeof u === 'number' && Number.isFinite(u)) return new BN(String(Math.trunc(u)))
  if (typeof u === 'string') return getBnFromChain(u.replace(/,/g, ''))
  const s = String(u)
  if (s === '[object Object]') return new BN(0)
  return getBnFromChain(s)
}

async function loadDetail() {
  const rid = id.value
  if (!Number.isFinite(rid)) return
  loading.value = true
  try {
    const [proposalResult, tracksResult, methodBySelector, headNum, supplyRaw] = await Promise.all([
      SecretContractApi.proposal(rid),
      SecretContractApi.tracks(),
      SecretContractApi.getGovSelectorMethodMap(),
      fetchHeadBlockNumber(),
      SecretContractApi.totalSupply().catch(() => null),
    ])

    headBlock.value = headNum
    totalSupplyBn.value = supplyRaw != null ? bnFromContract(supplyRaw) : new BN(0)

    const p = (proposalResult as any)?.Some ?? proposalResult
    if (!p || typeof p !== 'object') {
      detail.value = null
      return
    }

    const trackId = parseHumanNumber((p as any).trackID)
    let trackLabel = `#${trackId}`
    let trackDetail: ReferendumDetail['track'] | undefined = undefined
    let decisionPeriodBlocks = 0
    let confirmPeriodBlocks = 0
    let preparePeriodBlocks = 0

    if (Array.isArray(tracksResult)) {
      for (let i = 0; i < tracksResult.length; i++) {
        const { id: tid, data } = normalizeTrackEntry(tracksResult[i], i)
        if (tid !== trackId) continue

        const dataAny = data as Record<string, unknown>
        const name = bytesToString((dataAny as any).name)
        if (name) trackLabel = name

        preparePeriodBlocks = parseHumanNumber(
          (dataAny as any).prepare_period ?? (dataAny as any).preparePeriod ?? 0,
        )
        const prepareBlocks = preparePeriodBlocks
        decisionPeriodBlocks = parseHumanNumber(
          (dataAny as any).decision_period ?? (dataAny as any).decisionPeriod ?? 0,
        )
        confirmPeriodBlocks = parseHumanNumber(
          (dataAny as any).confirm_period ?? (dataAny as any).confirmPeriod ?? 0,
        )

        const minApproval = parseCurveFromApi((dataAny as any).min_approval ?? (dataAny as any).minApproval)
        const minSupport = parseCurveFromApi((dataAny as any).min_support ?? (dataAny as any).minSupport)
        const maxDeciding = parseHumanNumber((dataAny as any).max_deciding ?? (dataAny as any).maxDeciding ?? 0)

        trackDetail = {
          id: trackId,
          name: name || trackLabel,
          preparePeriod: formatBlocks(prepareBlocks),
          decisionPeriod: formatBlocks(decisionPeriodBlocks),
          confirmPeriod: formatBlocks(confirmPeriodBlocks),
          decisionDeposit: `${String((dataAny as any).decision_deposit ?? (dataAny as any).decisionDeposit ?? '0')} VOTE`,
          maxBalance: `${String((dataAny as any).max_balance ?? (dataAny as any).maxBalance ?? '0')} VOTE`,
          minApproval,
          minSupport,
          maxDeciding,
        }
        break
      }
    }

    const code = readProposalStateCode((p as any).status)
    const { callLabel, callAmount } = formatProposalCall((p as any).call, methodBySelector)

    const content = [
      callLabel ? `Call: ${callLabel}` : 'Call: -',
      callAmount !== '' ? `Amount: ${callAmount} VOTE` : 'Amount: -',
      `TrackID: ${trackId}`,
    ]

    const submitBlock = parseHumanNumber((p as any).submitBlock)
    const decisionStartBlock = resolveDecisionStartBlock(
      submitBlock,
      preparePeriodBlocks,
      (p as any).status,
    )

    detail.value = {
      id: parseHumanNumber((p as any).id),
      title: t('gov.proposalTitle', { id: rid }),
      proposer: callerToSs58((p as any).caller),
      trackId,
      trackLabel,
      track: trackDetail,
      submitBlock,
      status: proposalStateToGovUi(code),
      stateCode: code,
      contentParagraphs: content,
      aiSummary: [],
      decisionPeriodBlocks,
      confirmPeriodBlocks,
      preparePeriodBlocks,
      decisionStartBlock,
      attempts: parseHumanNumber((p as any).attempts ?? (p as any).attemptCount ?? 0),
    }
    loadVotes()
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

function openVoteModal() {
  voteYes.value = true
  voteLockAmount.value = ''
  votePercent.value = 0
  loadUnlockedBalance()
  voteModalOpen.value = true
}

async function loadUnlockedBalance() {
  try {
    const userInfo = SecretContractApi.getCallerInfo()
    const addr = userInfo?.addr as string | undefined
    if (!addr) {
      unlockedBalance.value = new BN(0)
      return
    }
    const [bal, locked] = await Promise.all([
      SecretContractApi.balanceOf(addr),
      SecretContractApi.lockBalanceOf(addr),
    ])
    const unwrapOk = (v: unknown): unknown => {
      if (!v) return v
      if (Array.isArray(v) && v.length === 1) return unwrapOk(v[0])
      if (typeof v === 'object') {
        const obj = v as Record<string, unknown>
        if ('Ok' in obj) return unwrapOk(obj.Ok)
        if ('ok' in obj) return unwrapOk(obj.ok)
        if ('okValue' in obj) return unwrapOk(obj.okValue)
        if ('value' in obj) return unwrapOk(obj.value)
      }
      return v
    }
    const toBn = (v: unknown): BN => {
      const x = unwrapOk(v)
      if (x === undefined || x === null) return new BN(0)
      if (typeof x === 'number') return new BN(String(Math.trunc(x)))
      if (typeof x === 'string') return getBnFromChain(x)
      // 最后一层兜底：toString() 可能是 [object Object]，这里避免误判
      const s = String(x)
      if (s === '[object Object]') return new BN(0)
      return getBnFromChain(s)
    }
    const total = toBn(bal)
    const lock = toBn(locked)
    const free = total.sub(lock)
    unlockedBalance.value = free.gt(new BN(0)) ? free : new BN(0)
  } catch (e) {
    console.error('Failed to load unlocked balance:', e)
    unlockedBalance.value = new BN(0)
  }
}

function onVotePercentInput(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  votePercent.value = Number.isFinite(v) ? v : 0
  const pct = new BN(votePercent.value)
  const amount = unlockedBalance.value.mul(pct).div(new BN(100))
  voteLockAmount.value = amount.toString()
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

async function handleVote() {
  if (!detail.value || voting.value) return
  voting.value = true
  try {
    await $getTxProvider(async (wallet: WalletWrap) => {
      await SecretContractApi.submitVote(wallet, detail.value!.id, voteYes.value, voteLockAmount.value)
    })
    voteModalOpen.value = false
    await loadDetail()
    loadVotes()
  } catch (e) {
    console.error('SubmitVote failed:', e)
  } finally {
    voting.value = false
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

  .detail-header-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 16px;
  }

  .detail-header-main {
    flex: 1;
    min-width: 0;
  }

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

.vote-slider {
  width: 100%;
  accent-color: rgba(255, 255, 255, 0.7);
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
  align-self: center;
}

.tabs-wrap {
  padding: 0 15px;

  .tabs {
    .tab-btn {
      font-size: 13px;
      color: rgba($secondary-text-rgb, 0.5);
      background: none;
      border: none;
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

.status-section {
  .status-decision-block {
    margin-bottom: 12px;
  }

  .status-kv-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;

    .status-k {
      color: rgba($secondary-text-rgb, 0.65);
    }

    .status-v {
      font-weight: 500;
      color: rgba($secondary-text-rgb, 0.9);
    }
  }

  .status-progress-track {
    height: 6px;
    background: rgba(255, 255, 255, 0.06);
    overflow: hidden;
  }

  .status-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.85), rgba(96, 165, 250, 0.75));
    transition: width 0.35s ease;
  }

  .status-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    margin: 14px 0;
  }
}

.tally-section-head {
  margin-bottom: 16px;
  align-items: center;
}

.tally-title-inline {
  margin-bottom: 0;
}

.curve-chart-launch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba($secondary-text-rgb, 0.65);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    color: rgba(244, 63, 94, 0.95);
    border-color: rgba(244, 63, 94, 0.35);
    background: rgba(244, 63, 94, 0.06);
  }
}

.tally-section {
  .gov-subtitle {
    font-size: 11px;
    font-weight: 500;
    color: rgba($secondary-text-rgb, 0.45);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 10px;

    &--spaced {
      margin-top: 22px;
    }
  }

  .gov-stacked-bar {
    display: flex;
    width: 100%;
    height: 10px;
    overflow: visible;
    position: relative;
    background: rgba(255, 255, 255, 0.04);
  }

  .gov-bar-seg {
    height: 100%;
    min-width: 0;

    &--aye {
      background: linear-gradient(90deg, rgba(34, 197, 94, 0.95), rgba(52, 211, 153, 0.75));
    }

    &--nay {
      background: linear-gradient(90deg, rgba(248, 113, 113, 0.9), rgba(239, 68, 68, 0.75));
    }
  }

  .gov-bar-marker {
    position: absolute;
    top: -2px;
    bottom: -2px;
    width: 2px;
    margin-left: -1px;
    background: rgba(255, 255, 255, 0.55);
    border-radius: 1px;
    pointer-events: none;
    z-index: 2;
  }

  .gov-pct-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
    margin-top: 10px;
    font-size: 12px;
    color: rgba($secondary-text-rgb, 0.75);

    .gov-pct-mid {
      text-align: center;
      flex: 1;
    }

    &--support {
      .gov-pct-mid {
        flex: unset;
      }
    }
  }

  .gov-amount-rows {
    margin-top: 14px;

    &--compact {
      margin-top: 12px;
    }
  }

  .gov-amount-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: rgba($secondary-text-rgb, 0.82);
    margin-bottom: 8px;

    &--tight {
      margin-bottom: 6px;
    }

    &--aye .gov-amount-icon {
      color: rgba(34, 197, 94, 0.95);
    }

    &--nay .gov-amount-icon {
      color: rgba(239, 68, 68, 0.9);
    }

    .gov-amount-icon {
      flex-shrink: 0;
      width: 1.25rem;
      text-align: center;
      font-size: 14px;

      &--muted {
        color: rgba($secondary-text-rgb, 0.45);
      }
    }

    .gov-amount-amt {
      margin-left: auto;
      font-size: 12px;
      color: rgba($secondary-text-rgb, 0.55);
      white-space: nowrap;
    }
  }

  .gov-support-track {
    position: relative;
    height: 10px;
    background: rgba(255, 255, 255, 0.06);
    overflow: visible;
  }

  .gov-support-fill {
    height: 100%;
    background: rgba(255, 255, 255, 0.18);
    min-width: 0;
    transition: width 0.35s ease;
  }

  gap-x-4 .gov-metric-cards {
    margin-top: 12px;

    @media (max-width: 380px) {
      grid-template-columns: 1fr;
    }
  }

  .gov-metric-card {
    &--compact {
      padding: 8px 10px;
    }

    /** 已达成阈值 */
    &--met {
      background: rgba(34, 197, 94, 0.14);

      .gov-metric-label {
        color: rgba(187, 247, 208, 0.75);
      }

      .gov-metric-num {
        color: rgba(240, 253, 244, 0.95);
      }
    }

    /** 未达成阈值 */
    &--fail {
      background: rgba(239, 68, 68, 0.12);

      .gov-metric-label {
        color: rgba(254, 202, 202, 0.8);
      }

      .gov-metric-num {
        color: rgba(254, 242, 242, 0.96);
      }
    }
  }

  .gov-metric-line {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .gov-metric-label {
    font-size: 10px;
    line-height: 1.3;
    color: rgba($secondary-text-rgb, 0.5);
  }

  .gov-metric-num {
    font-size: 13px;
    font-weight: 600;
    color: rgba($secondary-text-rgb, 0.92);
    font-variant-numeric: tabular-nums;
  }
}

.gov-detail-side {
  @media (min-width: 1024px) {
    position: sticky;
    top: 96px;
    align-self: flex-start;
    max-height: calc(100vh - 6.5rem);
    overflow-x: hidden;
    overflow-y: auto;
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
