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
                <div class="text-sm text-white/70 shrink-0">
                  {{ v.lockAmount.toString() }} VOTE
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
}

const props = defineProps<{
  open: boolean
  decisionPeriodBlocks: number
  /** 决策期起点（与页面 govTallyMetrics / curveY 的 x 一致） */
  decisionStartBlock: number
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
  for (const v of props.voteItems) {
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

function blocksToHours(b: number): number {
  return (b * 6) / 3600
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
  if (!maxB || maxB <= 0 || !ma || !ms) {
    return { datasets: [] }
  }

  const maxH = blocksToHours(maxB)
  const n = 96
  const approvalThresh: { x: number; y: number }[] = []
  const supportThresh: { x: number; y: number }[] = []
  for (let i = 0; i <= n; i++) {
    const xb = Math.floor((maxB * i) / n)
    const h = blocksToHours(xb)
    approvalThresh.push({ x: h, y: permilleToNum(curveY(ma, xb)) })
    supportThresh.push({ x: h, y: permilleToNum(curveY(ms, xb)) })
  }

  const start = props.decisionStartBlock
  const sorted = [...props.voteItems].sort((a, b) => a.voteBlock - b.voteBlock)
  let aye = new BN(0)
  let nay = new BN(0)
  const appr: { x: number; y: number }[] = []
  const supp: { x: number; y: number }[] = []
  let finalAp = 0
  let finalSp = 0

  const iss = props.totalSupplyBn

  for (const v of sorted) {
    const xb = Math.min(maxB, Math.max(0, v.voteBlock - start))
    const h = blocksToHours(xb)
    if (v.yes) aye = aye.add(v.lockAmount)
    else nay = nay.add(v.lockAmount)
    const sum = aye.add(nay)
    let ap = 0
    if (sum.gt(new BN(0))) ap = Math.round(aye.mul(new BN(10000)).div(sum).toNumber()) / 100
    let sp = 0
    if (iss.gt(new BN(0))) sp = Math.round(sum.mul(new BN(1000000)).div(iss).toNumber()) / 10000
    finalAp = ap
    finalSp = sp
    /** x=0 处不展示当前批准/支持（决策起点不画点） */
    if (h > 0) {
      appr.push({ x: h, y: ap })
      supp.push({ x: h, y: sp })
    }
  }

  const hasCurrentLines = appr.length > 0
  if (hasCurrentLines) {
    appr.push({ x: maxH, y: finalAp })
    supp.push({ x: maxH, y: finalSp })
  }

  const pr = showVoters.value ? 4 : 0

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
  const maxH = maxB > 0 ? blocksToHours(maxB) : 1

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    parsing: false as const,
    /** 避免贴顶时线宽/数据点被 canvas 裁切 */
    layout: {
      padding: { top: 20, right: 10, left: 4, bottom: 6 },
    },
    scales: {
      x: {
        type: 'linear' as const,
        min: 0,
        max: maxH,
        title: {
          display: true,
          text: t('govDetail.chartAxisHours'),
          color: 'rgba(148,163,184,0.85)',
          font: { size: 11 },
        },
        ticks: {
          color: 'rgba(148,163,184,0.75)',
          maxTicksLimit: 8,
          callback: (v: string | number) => `${Math.round(Number(v))}h`,
        },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: t('govDetail.chartAxisPercent'),
          color: 'rgba(148,163,184,0.85)',
          font: { size: 11 },
        },
        ticks: {
          color: 'rgba(148,163,184,0.75)',
          callback: (v: string | number) => `${Number(v)}%`,
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
        callbacks: {
          title(items: { parsed: { x?: number } }[]) {
            const x = items[0]?.parsed?.x
            if (x === undefined) return ''
            return `${t('govDetail.chartAxisHours')}: ${Number(x).toFixed(1)}h`
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
