<template>
  <div class="referenda-list divide-y">
    <RouterLink
      v-for="r in items"
      :key="r.id"
      :to="`/gov/referenda/${r.id}`"
      class="referendum-item flex flex-col md:flex-row md:items-center gap-0 md:gap-4"
    >
      <div class="referendum-id">#{{ r.id }}</div>
      <div class="referendum-body flex-1 min-w-0">
        <div class="referendum-title-row">
          <h3 class="referendum-title">{{ title(r.id) }}</h3>
          <span v-if="r.trackLabel" class="track-badge"># {{ r.trackLabel }}</span>
        </div>
        <div class="referendum-subrow flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-secondary">
          <div v-if="r.callContract && r.callMethod" class="proposal-call" :title="r.callLabel">
            <div class="proposal-call__fn" aria-label="call">
              <span class="proposal-call__contract">{{ r.callContract }}</span>
              <span class="proposal-call__sep" aria-hidden="true" />
              <span class="proposal-call__method">{{ r.callMethod }}</span>
            </div>
            <div v-if="r.callAmount !== ''" class="proposal-call__amount">
              <span class="proposal-call__amount-label">{{ amountPrefix }}</span>
              <span class="proposal-call__amount-value">{{ r.callAmount }}</span>
              <span class="proposal-call__amount-unit">VOTE</span>
            </div>
          </div>
          <span v-if="r.proposer" class="proposer">{{ r.proposer }}</span>
          <span v-if="r.submitBlock !== undefined" class="time-ago">{{ atBlock(r.submitBlock) }}</span>
        </div>
      </div>
      <div class="referendum-right flex items-center gap-3 shrink-0">
        <span v-if="r.comments !== undefined" class="comments">{{ r.comments }}</span>
        <UBadge :class="statusClass(r.status) + ' status-badge p-3'" color="neutral" size="lg">
          {{ statusLabel(r.status) }}
        </UBadge>
      </div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { type ProposalStatusKey } from '@/utils/proposalState'

export interface ReferendaListItem {
  id: number
  submitBlock?: number
  proposer?: string
  trackLabel?: string
  status: ProposalStatusKey
  callLabel?: string
  callContract?: string
  callMethod?: string
  callAmount?: string
  comments?: number
}

defineProps<{
  items: ReferendaListItem[]
}>()

const { t } = useI18n()

const title = (id: number) => t('gov.proposalTitle', { id })
const atBlock = (block: number) => t('gov.atBlock', { block })
const amountPrefix = t('gov.callAmountPrefix')

function statusClass(status: ProposalStatusKey): string {
  return `status-${status.toLowerCase()}`
}

function statusLabel(status: ProposalStatusKey): string {
  const map: Record<ProposalStatusKey, string> = {
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
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: rgba($secondary-text-rgb, 0.92);
  background-color: rgba(255, 255, 255, 0.04);
  height: 60px;
  width: 60px;
  line-height: 60px;
  text-align: center;
}

.referendum-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.referendum-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba($secondary-text-rgb, 0.92);
  margin: 0;
  line-height: 1.5;
}

.track-badge {
  padding: 3px 10px;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba($secondary-text-rgb, 0.6);
  font-weight: 400;
}

.proposal-call {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.proposal-call__fn {
  display: inline-flex;
  align-items: center;
  gap: 0;
  max-width: 100%;
  padding: 0;
  background: transparent;
}

.proposal-call__contract {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba($secondary-text-rgb, 0.48);
}

.proposal-call__sep {
  display: inline-block;
  width: 1px;
  height: 14px;
  margin: 0 2px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 0;
}

.proposal-call__method {
  font-family: ui-monospace, 'SFMono-Regular', 'Menlo', monospace;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: rgba($secondary-text-rgb, 0.82);
}

.proposal-call__amount {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 0;
  border-radius: 0;
  background: transparent;
}

.proposal-call__amount-label {
  font-size: 11px;
  font-weight: 500;
  color: rgba($secondary-text-rgb, 0.45);
  letter-spacing: 0.02em;
}

.proposal-call__amount-value {
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: rgba($secondary-text-rgb, 0.9);
}

.proposal-call__amount-unit {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba($secondary-text-rgb, 0.45);
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
</style>

