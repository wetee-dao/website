<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-4">
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
          <!-- Breadcrumb: Referenda / #id · 右侧链头高度 -->
          <nav
            class="breadcrumb breadcrumb--row flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm mb-4">
            <div class="flex flex-wrap items-center gap-1 min-w-0">
              <RouterLink to="/gov" class="breadcrumb-link">{{ t('govDetail.referenda') }}</RouterLink>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">#{{ detail.id }}</span>
            </div>
            <span class="breadcrumb-head-block shrink-0 tabular-nums"
              :aria-label="headBlock !== null ? t('govDetail.currentHeadBlock', { block: headBlock }) : undefined">
              <template v-if="headBlock !== null">{{ t('govDetail.currentHeadBlock', { block: headBlock }) }}</template>
              <template v-else>—</template>
            </span>
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
                  <div v-if="showExecuteBtn" class="flex flex-wrap items-center gap-2">
                    <span v-if="executeCountdownBlocks !== null && executeCountdownBlocks > 0"
                      class="text-sm text-secondary tabular-nums whitespace-nowrap p-2">
                      {{ t('govDetail.executeCountdown', { count: executeCountdownBlocks }) }}
                    </span>
                    <UButton type="button" color="neutral" variant="outline" size="lg"
                      :loading="executing" @click="handleExecute">
                      {{ t('govDetail.execute') }}
                    </UButton>
                  </div>
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
              :deposit-block="detail.depositBlock"
              :min-approval="detail.track?.minApproval" :min-support="detail.track?.minSupport" :vote-items="voteItems"
              :total-supply-bn="totalSupplyBn" :votes-loading="votesLoading" />

            <div class="detail-body flex flex-col lg:flex-row lg:items-stretch min-w-0">
              <div class="detail-main flex-1 min-w-0">
                <!-- Track 信息 -->
                <div v-if="detail.track" class="track-section p-5 lg:p-8 border-b border-white-4">
                  <h3 class="section-title">{{ t('gov.tracks') }}</h3>
                  <div class="track-grid">
                    <div class="track-kv">
                      <span class="track-k">{{ t('govTracks.trackName') }}</span>
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

                <!-- 我的投票：取消 / 解锁（主栏，提案正文下方，紧凑） -->
                <div class="my-vote-section my-vote-section--main my-vote-section--compact border-t border-white-4">
                  <div class="my-vote-head">
                    <span class="my-vote-head-title">{{ t('govDetail.myVote') }}</span>
                  </div>
                  <div v-if="votesLoading" class="my-vote-muted">{{ t('govDetail.votesLoading') }}</div>
                  <template v-else-if="!myWalletAddress">
                    <p class="my-vote-muted my-vote-muted--body">{{ t('govDetail.myVoteConnectHint') }}</p>
                  </template>
                  <template v-else-if="myVotes.length === 0">
                    <p class="my-vote-muted my-vote-muted--body text-center">{{ t('govDetail.myVoteEmpty') }}</p>
                  </template>
                  <template v-else>
                    <div v-for="mv in myVotes" :key="mv.id" class="my-vote-card my-vote-card--compact">
                      <div class="my-vote-compact-row">
                        <div class="my-vote-compact-main">
                          <UBadge class="my-vote-badge shrink-0" color="neutral" variant="soft" size="sm"
                            :class="mv.yes ? 'my-vote--aye' : 'my-vote--nay'">
                            {{ mv.yes ? t('govDetail.voteYes') : t('govDetail.voteNo') }}
                          </UBadge>
                          <span v-if="mv.deleted" class="my-vote-deleted">{{ t('govDetail.myVoteCanceled') }}</span>
                          <span v-else class="my-vote-meta-line">
                            <span v-if="mv.unlockedOnChain" class="my-vote-unlocked-badge">{{ t('govDetail.voteUnlockedOnChain') }}</span>
                            <template v-else>
                              <span class="tabular-nums">{{ mv.lockAmount.toString() }}</span>
                              <span class="my-vote-dot">·</span>
                              <span>w{{ mv.weight }}</span>
                              <span class="my-vote-dot">·</span>
                              <span>{{ t('gov.atBlock', { block: mv.voteBlock }) }}</span>
                              <template v-if="detail.statusBlock > 0">
                                <span class="my-vote-dot">·</span>
                                <span class="my-vote-unlock-hint"
                                  :title="t('govDetail.myVoteUnlockHint', { block: detail.statusBlock + mv.unlockBlock })">≥{{
                                    detail.statusBlock + mv.unlockBlock }}</span>
                              </template>
                            </template>
                          </span>
                        </div>
                        <div v-if="!mv.deleted" class="my-vote-actions">
                          <UButton v-if="showCancelVoteFor(mv)" type="button" size="sm" color="neutral"
                            variant="outline" class="my-vote-btn" :loading="cancelingVote"
                            @click="handleCancelMyVote(mv)">
                            {{ t('govDetail.cancelMyVote') }}
                          </UButton>
                          <UButton v-if="canUnlockVote(mv)" type="button" size="sm" color="neutral" variant="solid"
                            class="my-vote-btn" :loading="unlocking" @click="handleUnlockMyVote(mv)">
                            {{ t('govDetail.unlockMyVote') }}
                          </UButton>
                        </div>
                      </div>
                      <p v-if="!mv.deleted && !mv.unlockedOnChain && isProposalTerminalState() && !canUnlockVote(mv)" class="my-vote-wait">
                        {{ t('govDetail.myVoteUnlockWait') }}
                      </p>
                    </div>
                  </template>
                </div>
              </div>

              <aside
                class="gov-detail-side flex flex-col w-full lg:w-[min(22rem,38%)] xl:max-w-[26rem] flex-shrink-0 border-t border-white-4 lg:border-t-0 lg:border-l lg:border-white-4 divide-y divide-white/[0.06]">
                <!-- Status: 投票期进度条 / 确认期进度条 + 尝试次数 -->
                <div class="status-section gov-detail-side-section p-5 lg:p-6"
                  v-if="isVotingPeriod">
                  <h3 class="section-title">{{ t('govDetail.status') }}</h3>
                  <div class="status-decision-block">
                    <div class="status-kv-row">
                      <span class="status-k">{{ t('govDetail.decision') }}</span>
                      <span class="status-v">{{ formatBlockCountLabel(detail.decisionPeriodBlocks) }}</span>
                    </div>
                    <div class="status-progress-track" role="progressbar"
                      :aria-valuenow="Math.round(decisionPhaseProgress)" aria-valuemin="0" aria-valuemax="100">
                      <div class="status-progress-fill" :style="{ width: `${decisionPhaseProgress}%` }" />
                    </div>
                  </div>
                  <div class="status-divider" />

                  <div class="status-decision-block">
                    <div class="status-kv-row">
                      <span class="status-k">{{ t('govDetail.confirmation') }}</span>
                      <span class="status-v">{{ formatBlockCountLabel(detail.confirmPeriodBlocks) }}</span>
                    </div>
                    <div class="status-progress-track" role="progressbar"
                      :aria-valuenow="Math.round(confirmationPhaseProgress)" aria-valuemin="0" aria-valuemax="100">
                      <div class="status-progress-fill" :style="{ width: `${confirmationPhaseProgress}%` }" />
                    </div>
                    <div class="status-kv-row">
                      <span class="status-k">{{ t('govDetail.attempts') }}</span>
                      <span class="status-v">{{ detail.attempts }}</span>
                    </div>
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
                      <PixelCheckIcon class="gov-amount-icon gov-amount-icon--pixel" />
                      <span>{{ t('govDetail.votesAyeCount') }} ({{ voteSummary.ayeCount }})</span>
                      <span class="gov-amount-amt">{{ formatApproxAmount(voteSummary.ayeTotal) }} VOTE</span>
                    </div>
                    <div class="gov-amount-row gov-amount-row--nay">
                      <PixelCrossIcon class="gov-amount-icon gov-amount-icon--pixel" />
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
                      <span class="gov-amount-amt">{{ formatApproxAmount(voteSummary.totalPledge) }} VOTE</span>
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
            <div class="actions-section p-4 lg:p-6 border-t border-white-4">
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
                <div v-if="showExecuteBtn" class="flex flex-wrap items-center gap-2">
                  <UButton type="button" class="p-3" color="neutral" variant="outline" size="lg" :loading="executing"
                    @click="handleExecute">
                    {{ t('govDetail.execute') }}
                  </UButton>
                  <span v-if="executeCountdownBlocks !== null && executeCountdownBlocks > 0"
                    class="text-sm text-secondary tabular-nums whitespace-nowrap">
                    {{ t('govDetail.executeCountdown', { count: executeCountdownBlocks }) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>
    <div class="mb-4" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GovSidebar from './GovSidebar.vue'
import GovThresholdCurvesModal from './GovThresholdCurvesModal.vue'
import PixelCheckIcon from '@/components/svg/PixelCheckIcon.vue'
import PixelCrossIcon from '@/components/svg/PixelCrossIcon.vue'
import { SecretContractApi } from '@/apis/contract'
import { getLatestBlockHeight } from '@/apis/side'
import { bytesToString, callerToSs58 } from '@/utils/gov'
import { fetchVoteUnlockStatusMap, voteRefMapKey } from '@/utils/voteUnlockStatuses'
import { parseHumanNumber } from '@/utils/parseHumanNumber'
import { $getTxProvider } from '@/plugins/chain'
import type { WalletWrap } from '@/providers'
import { BN } from '@polkadot/util'
import { getBnFromChain } from '@/utils/chain'
import { parseCurveFromApi, curveY, type Curve } from '@/utils/curve'
import { ProposalState, proposalStatusKey, type ProposalStatusKey } from '@/utils/proposalState'
import { parseProposalStatusResult } from '@/utils/parseProposalStatus'

const { t } = useI18n()

type Status = ProposalStatusKey

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
  /** 与 ProposalState 字段名一致，来自 proposalStatusKey */
  status: Status
  stateCode: number
  comments?: number
  contentParagraphs: string[]
  aiSummary: string[]
  /** 投票期总长度（区块）用于进度条 */
  decisionPeriodBlocks: number
  /** 轨道 min_enactment_period（区块），Confirmed 执行倒计时用 */
  minEnactmentPeriodBlocks: number
  confirmPeriodBlocks: number
  /** 准备期长度（区块），用于推算投票期起点 */
  preparePeriodBlocks: number
  /**
   * 投票期时间起点（区块号），与阈值曲线 x=0 一致。
   * 来自 proposalStatus 的 Block（Ongoing/Confirming 时），否则 submitBlock + preparePeriod。
   */
  decisionStartBlock: number
  /** 质押激活块 Deposit.Block，用于 end = depositBlock + maxDeciding */
  depositBlock: number
  /** proposalStatus.blockHeight，用于解锁时间推算等 */
  statusBlock: number
  /** proposalStatus.lastConfirmedBlock，确认期进度用 statusBlock − 此值 */
  lastConfirmedBlock: number
  /** proposalStatus.confirmedNumber，尝试次数 */
  attempts: number
}

const route = useRoute()
const id = computed(() => Number(route.params.id) || 0)
const activeTab = ref<'content' | 'summary' | 'translations'>('content')

const contentTabs = [
  { key: 'content' as const, labelKey: 'govDetail.tabContent' },
  { key: 'translations' as const, labelKey: 'govDetail.tabTranslations' },
]

const loading = ref(false)
const detail = ref<ReferendumDetail | null>(null)
const depositAmount = ref('')
const depositing = ref(false)
const canceling = ref(false)
const cancelingVote = ref(false)
const unlocking = ref(false)
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
  /** 链上投票记录 id，用于 cancelVote / unlock */
  id: number
  voter: string
  yes: boolean
  lockAmount: BN
  weight: number
  voteBlock: number
  /** 提案结束后需再经过的区块数方可 unlock */
  unlockBlock: number
  deleted?: boolean
  /** vote_unlock_statuses：是否已在链上完成解锁 */
  unlockedOnChain: boolean
}

const votesLoading = ref(false)
const voteItems = ref<VoteItem[]>([])
const headBlock = ref<number | null>(null)
const totalSupplyBn = ref<BN>(new BN(0))

function getWalletAddress(): string {
  const u = SecretContractApi.getCallerInfo()
  return (u?.addr as string | undefined)?.trim() || ''
}

const myWalletAddress = ref('')

function refreshWalletAddress() {
  myWalletAddress.value = getWalletAddress()
}

const myVotes = computed(() => {
  const addr = myWalletAddress.value
  if (!addr) return []
  return voteItems.value.filter((v) => v.voter === addr)
})

/** 提案已终结且达到 unlock 区块后，可链上 unlock 取回锁仓 */
function canUnlockVote(v: VoteItem): boolean {
  const d = detail.value
  if (!d || v.deleted || v.unlockedOnChain) return false
  const done =
    d.stateCode === ProposalState.Approved ||
    d.stateCode === ProposalState.Rejected ||
    d.stateCode === ProposalState.Canceled
  if (!done) return false
  const endB = d.statusBlock
  const head = headBlock.value
  if (endB <= 0 || head == null) return true
  return head >= endB + v.unlockBlock
}

/** 合约侧仅 Ongoing 可取消投票 */
function showCancelVoteFor(v: VoteItem): boolean {
  const d = detail.value
  if (!d || v.deleted) return false
  return (
    d.stateCode === ProposalState.Ongoing || d.stateCode === ProposalState.Confirming
  )
}

function isProposalTerminalState(): boolean {
  const d = detail.value
  if (!d) return false
  return (
    d.stateCode === ProposalState.Approved ||
    d.stateCode === ProposalState.Rejected ||
    d.stateCode === ProposalState.Canceled
  )
}

const voteSummary = computed(() => {
  let ayeCount = 0
  let nayCount = 0
  let ayeTotal = new BN(0)
  let nayTotal = new BN(0)
  let totalPledge = new BN(0)
  for (const v of voteItems.value) {
    if (v.deleted) continue
    totalPledge = totalPledge.add(v.lockAmount)
    const wBn = new BN(v.weight)
    const weighted = v.lockAmount.mul(wBn)
    if (v.yes) {
      ayeCount += 1
      ayeTotal = ayeTotal.add(weighted)
    } else {
      nayCount += 1
      nayTotal = nayTotal.add(weighted)
    }
  }
  return { ayeCount, nayCount, ayeTotal, nayTotal, totalPledge }
})

function formatBnComma(b: BN): string {
  return b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/** 按 pledge（lockAmount）汇总：占比与展示用金额 */
const voteTally = computed(() => {
  const { ayeTotal, nayTotal } = voteSummary.value
  const sumW = ayeTotal.add(nayTotal)
  let ayePct = 0
  let nayPct = 0
  if (sumW.gt(new BN(0))) {
    ayePct = Math.round(ayeTotal.mul(new BN(10000)).div(sumW).toNumber()) / 100
    nayPct = Math.round(nayTotal.mul(new BN(10000)).div(sumW).toNumber()) / 100
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

/** 投票期起点：与图表横轴 0、curveY(x) 的 x 一致（块号来自 proposalStatus） */
function resolveDecisionStartBlock(
  submitBlock: number,
  prepareBlocks: number,
  stateCode: number,
  statusBlock: number,
): number {
  const fallback = submitBlock + Math.max(0, prepareBlocks)
  if (
    statusBlock > 0 &&
    (stateCode === ProposalState.Ongoing || stateCode === ProposalState.Confirming)
  ) {
    return statusBlock
  }
  return fallback
}

/**
 * 投票期曲线横轴 x：已过区块 = 当前块 − 质押块（与链上决策期一致），不超过 decisionPeriodBlocks。
 * 用于 minApproval/minSupport 的 curveY(x)，随投票期推进阈值应降低。
 */
const curveElapsedBlocks = computed(() => {
  const d = detail.value
  if (!d || d.decisionPeriodBlocks <= 0) return 0
  const head = headBlock.value
  if (head == null || d.depositBlock <= 0) return 0
  const elapsed = head - d.depositBlock
  if (elapsed < 0) return 0
  return Math.min(d.decisionPeriodBlocks, elapsed)
})

/** 侧栏票数展示：当前批准/支持万分比（与投票列表同源，非合约状态推演） */
const govTallyMetrics = computed(() => {
  const d = detail.value
  const ma = d?.track?.minApproval
  const ms = d?.track?.minSupport
  const x = curveElapsedBlocks.value
  const iss = totalSupplyBn.value

  let approvalThresholdPct = 0
  let supportThresholdPct = 0
  if (ma) approvalThresholdPct = permilleToNum(curveY(ma, x))
  if (ms) supportThresholdPct = permilleToNum(curveY(ms, x))

  let yes = new BN(0)
  let no = new BN(0)
  let support = new BN(0)
  for (const v of voteItems.value) {
    if (v.deleted) continue
    const wBn = new BN(v.weight)
    support = support.add(v.lockAmount)
    if (v.yes) yes = yes.add(v.lockAmount.mul(wBn))
    else no = no.add(v.lockAmount.mul(wBn))
  }
  const totalVotes = yes.add(no)
  let approvalPermille = 0
  if (totalVotes.gt(new BN(0))) {
    approvalPermille = yes.mul(new BN(10000)).div(totalVotes).toNumber()
  }
  let supportPermille = 0
  if (iss.gt(new BN(0))) {
    supportPermille = support.mul(new BN(10000)).div(iss).toNumber()
  }
  const currentApprovalPct = approvalPermille / 100
  const currentSupportPct = supportPermille / 100

  const minAp = ma ? curveY(ma, x) : 0
  const minSp = ms ? curveY(ms, x) : 0
  const approvalMet = approvalPermille >= minAp
  const supportMet = supportPermille >= minSp

  return {
    approvalThresholdPct,
    supportThresholdPct,
    currentApprovalPct,
    currentSupportPct,
    approvalMet,
    supportMet,
    issuance: iss,
  }
})

/** 投票期进度 0–100（侧栏 Status 条，与 curveElapsedBlocks 同源） */
const decisionPhaseProgress = computed(() => {
  const d = detail.value
  if (!d || d.decisionPeriodBlocks <= 0) return 0
  return Math.min(100, (curveElapsedBlocks.value / d.decisionPeriodBlocks) * 100)
})

/** 确认期内已过去区块数：链上为 blockHeight − lastConfirmedBlock（仅 state=确认中 时有意义） */
const confirmElapsedBlocks = computed(() => {
  const d = detail.value
  if (!d || d.confirmPeriodBlocks <= 0) return 0
  if (d.stateCode !== ProposalState.Confirming) return 0
  const elapsed = d.statusBlock - d.lastConfirmedBlock
  if (!Number.isFinite(elapsed) || elapsed < 0) return 0
  return Math.min(d.confirmPeriodBlocks, elapsed)
})

/**
 * 确认期进度 0–100。
 * 链上 state：2=确认中，3=已确认（确认期已结束）… —— 见 gov ProposalStatusConfirmed。
 * 仅在 Confirming 用 blockHeight−lastConfirmedBlock；Confirmed/Approved 视为已满。
 */
const confirmationPhaseProgress = computed(() => {
  const d = detail.value
  if (!d || d.confirmPeriodBlocks <= 0) return 0
  if (d.stateCode === ProposalState.Confirmed || d.stateCode === ProposalState.Approved) {
    return 100
  }
  if (d.stateCode !== ProposalState.Confirming) return 0
  return Math.min(100, (confirmElapsedBlocks.value / d.confirmPeriodBlocks) * 100)
})

function formatBlockCountLabel(blocks: number): string {
  return t('gov.blockCount', { count: blocks || 0 })
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

function normalizeTrackEntry(item: any, index: number): { id: number; data: any } {
  if (item == null) return { id: index, data: {} }
  if (Array.isArray(item)) return { id: parseHumanNumber(item[0]), data: item[1] ?? {} }
  return { id: parseHumanNumber(item.id), data: item.track ?? {} }
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
  return detail.value.stateCode === ProposalState.Confirmed
})

/** Confirmed：decisionPeriod + minEnactmentPeriod − (当前块 − 质押块) */
const executeCountdownBlocks = computed(() => {
  const d = detail.value
  if (!d || d.stateCode !== ProposalState.Confirmed) return null
  const head = headBlock.value
  if (head == null || d.depositBlock <= 0) return null
  const elapsed = head - d.depositBlock
  const windowBlocks = d.decisionPeriodBlocks + d.minEnactmentPeriodBlocks
  return Math.max(0, windowBlocks - elapsed)
})

const showVoteBtn = computed(() => {
  if (!detail.value) return false
  return (
    detail.value.stateCode === ProposalState.Ongoing ||
    detail.value.stateCode === ProposalState.Confirming
  )
})

/** 侧栏「投票期」进度条仅在链上投票期（Ongoing）展示 */
const isVotingPeriod = computed(
  () => detail.value?.stateCode === ProposalState.Ongoing || detail.value?.stateCode === ProposalState.Confirming || detail.value?.stateCode === ProposalState.Confirmed,
)

async function loadVotes() {
  const proposalId = id.value
  if (!Number.isFinite(proposalId)) return
  votesLoading.value = true
  try {
    const rows = (await SecretContractApi.votes(proposalId, null, 1024)) as unknown
    const list = Array.isArray(rows) ? rows : []

    const base = list.map((v: any) => ({
      id: parseHumanNumber(v.index ?? v.Index),
      voter: callerToSs58(v.caller),
      yes: Boolean(v.opinionYes ?? v.OpinionYes),
      lockAmount: getBnFromChain(String(v.pledge ?? v.Pledge ?? '0')),
      weight: parseHumanNumber(v.voteWeight ?? v.VoteWeight),
      voteBlock: parseHumanNumber(v.voteBlock ?? v.VoteBlock ?? 0),
      unlockBlock: parseHumanNumber(v.unlockBlock ?? v.UnlockBlock ?? 0),
      deleted: Boolean(v.deleted ?? v.Deleted ?? false),
      unlockedOnChain: false,
    }))

    const keys = base.map((v) => ({ ProposalID: proposalId, VoteIndex: v.id }))
    let unlockMap = new Map<string, boolean>()
    try {
      unlockMap = await fetchVoteUnlockStatusMap(keys)
    } catch (e) {
      console.warn('vote_unlock_statuses failed:', e)
    }

    voteItems.value = base.map((v) => ({
      ...v,
      unlockedOnChain: unlockMap.get(voteRefMapKey(proposalId, v.id)) ?? false,
    }))
    refreshWalletAddress()
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
    const [proposalResult, tracksResult, methodBySelector, headNum, supplyRaw, statusRaw] =
      await Promise.all([
        SecretContractApi.proposal(rid),
        SecretContractApi.tracks(),
        SecretContractApi.getGovSelectorMethodMap(),
        getLatestBlockHeight(),
        SecretContractApi.totalSupply().catch(() => null),
        SecretContractApi.proposalStatus(rid).catch(() => null),
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
    let minEnactmentPeriodBlocks = 0
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
        minEnactmentPeriodBlocks = parseHumanNumber(
          (dataAny as any).min_enactment_period ??
            (dataAny as any).minEnactmentPeriod ??
            (dataAny as any).MinEnactmentPeriod ??
            0,
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
          preparePeriod: t('gov.blockCount', { count: prepareBlocks }),
          decisionPeriod: t('gov.blockCount', { count: decisionPeriodBlocks }),
          confirmPeriod: t('gov.blockCount', { count: confirmPeriodBlocks }),
          decisionDeposit: `${String((dataAny as any).decision_deposit ?? (dataAny as any).decisionDeposit ?? '0')} VOTE`,
          maxBalance: `${String((dataAny as any).max_balance ?? (dataAny as any).maxBalance ?? '0')} VOTE`,
          minApproval,
          minSupport,
          maxDeciding,
        }
        break
      }
    }

    const parsedSt = parseProposalStatusResult(statusRaw)
    const code = parsedSt?.stateCode ?? ProposalState.Pending
    const statusBlock = parsedSt?.statusBlock ?? 0
    const lastConfirmedBlock = parsedSt?.lastConfirmedBlock ?? 0
    const attemptsFromStatus = parsedSt?.confirmedNumber
    const { callLabel, callAmount } = formatProposalCall((p as any).call, methodBySelector)

    const content = [
      callLabel ? `Call: ${callLabel}` : 'Call: -',
      callAmount !== '' ? `Amount: ${callAmount} VOTE` : 'Amount: -',
      `TrackID: ${trackId}`,
    ]

    const submitBlock = parseHumanNumber((p as any).submitBlock)
    const dep = (p as any).deposit ?? (p as any).Deposit
    const depositBlock = parseHumanNumber(dep?.block ?? dep?.Block ?? 0)
    const decisionStartBlock = resolveDecisionStartBlock(submitBlock, preparePeriodBlocks, code, statusBlock)

    detail.value = {
      id: parseHumanNumber((p as any).id),
      title: t('gov.proposalTitle', { id: rid }),
      proposer: callerToSs58((p as any).caller),
      trackId,
      trackLabel,
      track: trackDetail,
      submitBlock,
      status: proposalStatusKey(code),
      stateCode: code,
      contentParagraphs: content,
      aiSummary: [],
      decisionPeriodBlocks,
      minEnactmentPeriodBlocks,
      confirmPeriodBlocks,
      preparePeriodBlocks,
      decisionStartBlock,
      depositBlock,
      statusBlock,
      lastConfirmedBlock,
      attempts:
        attemptsFromStatus !== undefined
          ? attemptsFromStatus
          : parseHumanNumber((p as any).attempts ?? (p as any).attemptCount ?? 0),
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

onMounted(() => {
  refreshWalletAddress()
})

function openDepositModal() {
  depositAmount.value = ''
  depositModalOpen.value = true
}

function openVoteModal() {
  voteYes.value = true
  voteLockAmount.value = ''
  votePercent.value = 0
  refreshWalletAddress()
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
    refreshWalletAddress()
    await loadDetail()
    loadVotes()
  } catch (e) {
    console.error('SubmitVote failed:', e)
  } finally {
    voting.value = false
  }
}

async function handleCancelMyVote(v: VoteItem) {
  if (!detail.value || cancelingVote.value) return
  cancelingVote.value = true
  try {
    await $getTxProvider(async (wallet: WalletWrap) => {
      await SecretContractApi.cancelVote(wallet, detail.value!.id, v.id)
    })
    await loadDetail()
    loadUnlockedBalance()
  } catch (e) {
    console.error('cancelVote failed:', e)
  } finally {
    cancelingVote.value = false
  }
}

async function handleUnlockMyVote(v: VoteItem) {
  if (!detail.value || unlocking.value) return
  unlocking.value = true
  try {
    await $getTxProvider(async (wallet: WalletWrap) => {
      await SecretContractApi.unlock(wallet, detail.value!.id, v.id)
    })
    await loadDetail()
    loadUnlockedBalance()
  } catch (e) {
    console.error('unlock failed:', e)
  } finally {
    unlocking.value = false
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

  &.breadcrumb--row {
    width: 100%;
  }

  .breadcrumb-head-block {
    font-size: 12px;
    letter-spacing: 0.02em;
    color: rgba($secondary-text-rgb, 0.55);
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
    color: rgba($secondary-text-rgb, 0.92);
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
        color: rgba($secondary-text-rgb, 0.92);
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

.content-wrap {
  padding: 28px 32px;

  .prose p,
  .prose ul {
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
    margin: 3px 0;
  }

  .status-progress-fill {
    height: 100%;
    background: rgba(255, 255, 255, 0.18);
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
    color: rgba($secondary-text-rgb, 0.92);
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.06);
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
      background: rgba(255, 255, 255, 0.18);
    }

    &--nay {
      background: rgba(255, 255, 255, 0.14);
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

      &--pixel {
        display: block;
        height: 14px;
      }

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
    background: rgb(57, 85, 47);
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

.my-vote-section--compact {
  .my-vote-head {
    padding: 10px 28px;
  }

  .my-vote-head-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgba($secondary-text-rgb, 0.5);
  }

  .my-vote-muted {
    font-size: 13px;
    line-height: 1.45;
    color: rgba($secondary-text-rgb, 0.55);
  }

  .my-vote-muted--body {
    line-height: 1.5;
  }
}

.my-vote-section--main {
  .my-vote-card--compact {
    max-width: none;
  }
}

.my-vote-section {
  .my-vote-card--compact {
    padding: 6px 23px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);

    &+& {
      margin-top: 6px;
    }
  }

  .my-vote-compact-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 6px 10px;
  }

  .my-vote-compact-main {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 8px;
    min-width: 0;
    flex: 1 1 12rem;
  }

  .my-vote-meta-line {
    font-size: 14px;
    line-height: 1.45;
    color: rgba($secondary-text-rgb, 0.55);
  }

  .my-vote-dot {
    margin: 0 0.15em;
    opacity: 0.45;
  }

  .my-vote-unlock-hint {
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
  }

  .my-vote-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  :deep(.my-vote-btn) {
    padding-left: 12px;
    padding-right: 12px;
    min-height: 2rem;
    font-size: 13px;
  }

  :deep(.my-vote-badge) {
    font-size: 12px !important;
  }

  .my-vote-wait {
    margin: 6px 0 0;
    font-size: 12px;
    line-height: 1.45;
    color: rgba($secondary-text-rgb, 0.4);
  }

  .my-vote-unlocked-badge {
    font-size: 12px;
    font-weight: 500;
    color: rgba(52, 211, 153, 0.92);
  }

  .my-vote-deleted {
    font-size: 12px;
    color: rgba($secondary-text-rgb, 0.42);
  }

  :deep(.my-vote--aye) {
    border-color: rgba(34, 197, 94, 0.35);
    color: rgba(187, 247, 208, 0.95);
  }

  :deep(.my-vote--nay) {
    border-color: rgba(239, 68, 68, 0.35);
    color: rgba(254, 202, 202, 0.95);
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
    color: rgba($secondary-text-rgb, 0.92);
  }

  &--primary {
    background: rgba(255, 255, 255, 0.08);
    color: rgba($secondary-text-rgb, 0.92);
    border-color: transparent;
  }
}

.status-badge {
  font-size: 11px;
  font-weight: 500;

  white-space: nowrap;
  letter-spacing: 0.02em;

  &.status-pending,
  &.status-ongoing,
  &.status-approved {
    background: rgba(255, 255, 255, 0.06);
    color: rgba($secondary-text-rgb, 0.8);
  }

  &.status-confirming {
    background: rgba(234, 179, 8, 0.12);
    color: rgba(253, 224, 71, 0.92);
  }

  &.status-confirmed {
    background: rgba(56, 189, 248, 0.14);
    color: rgba(125, 211, 252, 0.95);
  }

  &.status-rejected,
  &.status-canceled {
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
  color: rgba($secondary-text-rgb, 0.88);
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
