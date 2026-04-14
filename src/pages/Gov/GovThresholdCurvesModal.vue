<template>
  <UModal
    :open="open"
    :overlay="true"
    :scrollable="true"
    :dismissible="true"
    :ui="modalUi"
    :title="t('govDetail.thresholdCurvesModalTitle')"
    :description="t('govDetail.thresholdCurvesModalDesc')"
    @update:open="(v: boolean) => emit('update:open', v)"
  >
    <template #body>
      <div class="space-y-4">
        <p v-if="curveNote" class="text-xs leading-relaxed text-[rgba(var(--g-secondary-text-rgb),0.55)]">
          {{ curveNote }}
        </p>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <label class="flex cursor-pointer items-center gap-2 text-sm text-[rgba(var(--g-secondary-text-rgb),0.75)]">
            <input v-model="showVoters" type="checkbox" class="gov-curve-toggle" />
            {{ t('govDetail.showVotersOnChart') }}
          </label>
        </div>
        <div v-if="!hasData" class="rounded-lg border border-white/10 bg-white/[0.02] py-16 text-center text-sm text-white/45">
          {{ t('govDetail.thresholdCurvesNoData') }}
        </div>
        <div v-else class="gov-threshold-chart-wrap">
          <Line :data="lineData" :options="chartOptions" />
        </div>

        <section class="gov-curve-votes-section border-t border-white/10 pt-4 mt-4">
          <div v-if="votesLoading" class="gov-curve-votes-placeholder">
            {{ t('govDetail.votesLoading') }}
          </div>
          <template v-else-if="voteItems.length === 0">
            <div class="gov-curve-votes-placeholder">
              {{ t('govDetail.voteListPlaceholder') }}
            </div>
          </template>
          <template v-else>
            <div class="gov-curve-votes-summary">
              <span>{{ t('govDetail.votesAyeCount') }} {{ voteSummaryLocal.ayeCount }}</span>
              <span>{{ t('govDetail.votesNayCount') }} {{ voteSummaryLocal.nayCount }}</span>
              <span>{{ t('govDetail.votesTotalLocked') }} {{ voteSummaryLocal.total.toString() }}</span>
            </div>
            <div class="gov-curve-votes-list space-y-2">
              <div v-for="v in voteItems" :key="v.id" class="gov-curve-vote-row flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <UBadge
                    color="neutral"
                    variant="soft"
                    size="md"
                    :class="v.yes ? 'curve-vote-aye shrink-0 p-3' : 'curve-vote-nay shrink-0 p-3'"
                  >
                    {{ v.yes ? t('govDetail.voteYes') : t('govDetail.voteNo') }}
                  </UBadge>
                  <div class="min-w-0">
                    <div class="text-sm text-white/80 truncate">
                      {{ shortAddr(v.voter) }}
                    </div>
                    <div class="text-[11px] text-white/40">
                      #{{ v.id }} · w={{ v.weight }}
                    </div>
                  </div>
                </div>
                <div class="text-sm text-white/70 shrink-0 flex flex-col items-end gap-0.5">
                  <span v-if="v.unlockedOnChain" class="text-[11px] text-emerald-400/90">{{ t('govDetail.voteUnlockedOnChain') }}</span>
                  <span>{{ v.lockAmount.toString() }} VOTE</span>
                </div>
              </div>
            </div>
          </template>
        </section>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end">
        <UButton color="neutral" variant="outline" size="lg" type="button" @click="emit('update:open', false)">
          {{ t('common.close') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { BN } from '@polkadot/util'
import { curveY, formatCurveType, type Curve } from '@/utils/curve'

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Tooltip, Legend)

type CurveModalVoteItem = {
  id: number
  voter: string
  yes: boolean
  lockAmount: BN
  weight: number
  voteBlock: number
  unlockBlock?: number
  deleted?: boolean
  /** vote_unlock_statuses */
  unlockedOnChain?: boolean
}

const props = defineProps<{
  open: boolean
  decisionPeriodBlocks: number
  /** 回退用：无质押块时的投票期起点 */
  decisionStartBlock: number
  /** 质押激活块；与详情页 curveY 一致，优先作为投票期起点 */
  depositBlock: number
  minApproval: Curve | null | undefined
  minSupport: Curve | null | undefined
  voteItems: CurveModalVoteItem[]
  totalSupplyBn: BN
  votesLoading: boolean
}>()

const emit = defineEmits<{
  'update:open': [v: boolean]
}>()

const { t } = useI18n()
const showVoters = ref(true)

function shortAddr(a: string): string {
  if (!a || a === '—') return '—'
  if (a.length <= 18) return a
  return `${a.slice(0, 8)}…${a.slice(-6)}`
}

const voteSummaryLocal = computed(() => {
  let ayeCount = 0
  let nayCount = 0
  let ayeTotal = new BN(0)
  let nayTotal = new BN(0)
  let totalPledge = new BN(0)
  for (const v of props.voteItems) {
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
  return { ayeCount, nayCount, ayeTotal, nayTotal, total: totalPledge }
})

const modalUi = {
  overlay: 'bg-black/70 backdrop-blur-[2px]',
  content:
    'bg-[rgba(var(--g-primary-bg-rgb),0.94)] ring-1 ring-white/10 border border-white/5 rounded-[var(--ui-radius)] shadow-[0_24px_80px_rgba(0,0,0,0.55)] w-[calc(100vw-1.5rem)] max-w-5xl',
  header: 'px-5 py-4 sm:px-6 border-b border-white/5',
  body: 'px-5 py-5 sm:px-6 max-h-[min(78vh,800px)] overflow-y-auto overflow-x-hidden',
  footer: 'px-5 py-4 sm:px-6 border-t border-white/5',
  title: 'text-[0.95rem] font-semibold tracking-tight text-[rgba(var(--g-secondary-text-rgb),0.92)]',
  description: 'mt-1 text-xs text-[rgba(var(--g-secondary-text-rgb),0.55)]',
  close: 'top-4 end-4',
}

function permilleToNum(permille: number): number {
  return Math.round(permille) / 100
}

const hasData = computed(() => {
  const maxB = props.decisionPeriodBlocks
  return maxB > 0 && props.minApproval && props.minSupport
})

const curveNote = computed(() => {
  const ma = props.minApproval
  const ms = props.minSupport
  if (!ma || !ms) return ''
  return t('govDetail.chartCurveTypesNote', {
    approval: formatCurveType(ma.Type),
    support: formatCurveType(ms.Type),
  })
})

const lineData = computed(() => {
  const maxB = props.decisionPeriodBlocks
  const ma = props.minApproval
  const ms = props.minSupport
  /** 与 ReferendaDetail curveElapsedBlocks 一致：质押块优先于 proposalStatus 起点 */
  const periodStart =
    props.depositBlock > 0 ? props.depositBlock : props.decisionStartBlock
  if (!maxB || maxB <= 0 || !ma || !ms) {
    return { datasets: [] }
  }

  /** 投票期内已过区块数（与 curveY 横轴一致） */
  function elapsedClamped(voteBlock: number): number {
    return Math.min(maxB, Math.max(0, voteBlock - periodStart))
  }

  /**
   * 图表横轴：链上绝对区块号 = periodStart + elapsed；
   * 无起点时退回 0 … decisionPeriodBlocks。
   */
  function toChartX(elapsedInDecision: number): number {
    const e = Math.min(Math.max(0, elapsedInDecision), maxB)
    if (periodStart > 0) return periodStart + e
    return e
  }

  const n = 96
  const approvalThresh: { x: number; y: number }[] = []
  const supportThresh: { x: number; y: number }[] = []
  for (let i = 0; i <= n; i++) {
    const elapsed = Math.floor((maxB * i) / n)
    const yA = permilleToNum(curveY(ma, elapsed))
    const yS = permilleToNum(curveY(ms, elapsed))
    approvalThresh.push({ x: toChartX(elapsed), y: yA })
    supportThresh.push({ x: toChartX(elapsed), y: yS })
  }

  const sorted = [...props.voteItems].sort((a, b) => a.voteBlock - b.voteBlock)
  let aye = new BN(0)
  let nay = new BN(0)
  let supportSum = new BN(0)
  const appr: { x: number; y: number }[] = []
  const supp: { x: number; y: number }[] = []

  const iss = props.totalSupplyBn

  for (const v of sorted) {
    if (v.deleted) continue
    const elapsed = elapsedClamped(v.voteBlock)
    const wBn = new BN(v.weight)
    const contrib = v.lockAmount.mul(wBn)
    supportSum = supportSum.add(v.lockAmount)
    if (v.yes) aye = aye.add(contrib)
    else nay = nay.add(contrib)
    const sum = aye.add(nay)
    let ap = 0
    if (sum.gt(new BN(0))) ap = Math.round(aye.mul(new BN(10000)).div(sum).toNumber()) / 100
    let sp = 0
    if (iss.gt(new BN(0))) sp = Math.round(supportSum.mul(new BN(1000000)).div(iss).toNumber()) / 10000
    /** 投票期起点当刻（elapsed=0）不画点；无有效投票则不产生虚线系列；不在投票期末尾补点 */
    if (elapsed > 0) {
      appr.push({ x: toChartX(elapsed), y: ap })
      supp.push({ x: toChartX(elapsed), y: sp })
    }
  }

  const hasCurrentLines = appr.length > 0

  /** 仅有投票轨迹时才显示折线点（无投票则无虚线系列，此处为双保险） */
  const pr = showVoters.value && hasCurrentLines ? 4 : 0

  const datasets: ChartData<'line'>['datasets'] = [
    {
      label: t('govDetail.chartApprovalThreshold'),
      data: approvalThresh,
      order: 0,
      borderColor: 'rgba(34, 197, 94, 0.95)',
      backgroundColor: 'transparent',
      borderWidth: 2,
      fill: false,
      tension: 0,
      clip: false as const,
      pointRadius: 0,
      pointHoverRadius: 5,
    },
  ]

  if (hasCurrentLines) {
    datasets.push(
      {
        label: t('govDetail.chartCurrentApproval'),
        data: appr,
        order: 1,
        borderColor: 'rgba(34, 197, 94, 0.6)',
        borderDash: [6, 4],
        borderWidth: 2,
        fill: false,
        stepped: 'after' as const,
        clip: false as const,
        pointRadius: pr,
        pointHoverRadius: pr ? 6 : 4,
      },
      {
        label: t('govDetail.chartCurrentSupport'),
        data: supp,
        order: 2,
        borderColor: 'rgba(168, 85, 247, 0.55)',
        borderDash: [6, 4],
        borderWidth: 2,
        fill: false,
        stepped: 'after' as const,
        clip: false as const,
        pointRadius: pr,
        pointHoverRadius: pr ? 6 : 4,
      },
    )
  }

  datasets.push({
    label: t('govDetail.chartSupportThreshold'),
    data: supportThresh,
    order: hasCurrentLines ? 3 : 1,
    borderColor: 'rgba(192, 132, 252, 1)',
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    fill: false,
    tension: 0,
    clip: false as const,
    pointRadius: 0,
    pointHoverRadius: 5,
  })

  return { datasets }
})

const chartOptions = computed(() => {
  const maxB = props.decisionPeriodBlocks
  const periodStart =
    props.depositBlock > 0 ? props.depositBlock : props.decisionStartBlock
  const useAbs = periodStart > 0 && maxB > 0
  const xMin = useAbs ? periodStart : 0
  const xMax = useAbs ? periodStart + maxB : maxB > 0 ? maxB : 1

  return {
    responsive: true,
    maintainAspectRatio: false,
    /**
     * 不可用 index：各数据集点数不同（阈值 ~97 点 vs 投票阶梯少量点），
     * index 会按下标对齐，导致在某一链上高度错配到「第 i 票」的 y，出现「该块无投票却有当前批准率」的假象。
     * 按 x 轴取最近点，使每条线在鼠标横坐标处独立取最近样本。
     */
    interaction: { mode: 'nearest' as const, intersect: false, axis: 'x' as const },
    parsing: false as const,
    /** 避免贴顶时线宽/数据点被 canvas 裁切 */
    layout: {
      padding: { top: 20, right: 10, left: 0, bottom: 6 },
    },
    scales: {
      x: {
        type: 'linear' as const,
        min: xMin,
        max: xMax,
        title: {
          display: true,
          text: useAbs ? t('govDetail.chartAxisBlocksChain') : t('govDetail.chartAxisBlocks'),
          color: 'rgba(148,163,184,0.85)',
          font: { size: 11 },
        },
        ticks: {
          color: 'rgba(148,163,184,0.75)',
          maxTicksLimit: 10,
          callback: (v: string | number) => String(Math.round(Number(v))),
        },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: false,
        },
        ticks: {
          display: false,
        },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(203,213,225,0.88)',
          boxWidth: 14,
          padding: 12,
          font: { size: 11 },
        },
      },
      tooltip: {
        mode: 'nearest' as const,
        intersect: false,
        axis: 'x' as const,
        callbacks: {
          title(items: { parsed: { x?: number } }[]) {
            const x = items[0]?.parsed?.x
            if (x === undefined) return ''
            if (useAbs) return t('gov.atBlock', { block: Math.round(Number(x)) })
            return t('govDetail.chartTooltipDecisionElapsed', { blocks: Math.round(Number(x)) })
          },
          label(ctx: { dataset: { label?: string }; parsed: { y?: number } }) {
            const y = ctx.parsed.y
            const lab = ctx.dataset.label ?? ''
            if (y === undefined) return lab
            return `${lab}: ${y.toFixed(2)}%`
          },
        },
      },
    },
  }
})
</script>

<style scoped>
.gov-threshold-chart-wrap {
  height: min(52vh, 380px);
  width: 100%;
  overflow: visible;
  padding-top: 4px;
}

.gov-curve-toggle {
  accent-color: rgba(244, 63, 94, 0.85);
  width: 1rem;
  height: 1rem;
}

.gov-curve-votes-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--g-secondary-text-rgb), 0.4);
  margin: 0 0 12px;
}

.gov-curve-votes-placeholder {
  font-size: 13px;
  color: rgba(var(--g-secondary-text-rgb), 0.5);
  padding: 12px 0;
}

.gov-curve-votes-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 12px;
}

.gov-curve-votes-list {
  max-height: min(36vh, 280px);
  overflow-y: auto;
  padding-right: 4px;
}

.gov-curve-vote-row {
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
}

.curve-vote-aye {
  color: rgba(34, 197, 94, 0.9) !important;
  background: rgba(34, 197, 94, 0.12) !important;
}

.curve-vote-nay {
  color: rgba(239, 68, 68, 0.9) !important;
  background: rgba(239, 68, 68, 0.12) !important;
}
</style>
