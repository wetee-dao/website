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
              <UButton class="p-3" color="neutral" variant="solid" size="lg" type="button"
                @click="showProposalModal = true">
                {{ t('gov.submitProposal') }}
              </UButton>
            </div>
          </div>

          <!-- Tracks 筛选 -->
          <div class="tracks-wrap flex items-center">
            <div class="tracks-label mr-2">{{ t('gov.tracks') }}</div>
            <div class="tracks-tabs flex flex-wrap gap-2">
              <UButton color="neutral" variant="ghost" size="lg" v-for="tab in trackOptions" type="button"
                class="track-tab p-3" :key="tab.id" :class="{ active: trackFilter === tab.id.toString() }"
                @click="trackFilter = tab.id.toString()">
                {{ tab.label }}
              </UButton>
            </div>
          </div>

          <!-- Referenda 列表 -->
          <ReferendaList :items="listItems" />

          <div v-if="loading && referendas.length === 0" class="empty-state p-10 text-center text-secondary">
            {{ t('gov.loadingReferenda') }}
          </div>
          <div v-else-if="!loading && filteredReferenda.length === 0"
            class="empty-state p-10 text-center text-secondary">
            {{ t('gov.empty') }}
          </div>
        </div>
      </main>
    </div>
    <div class="pb-4" />

    <!-- 提交公投弹窗 -->
    <SubmitProposal :show="showProposalModal" @close="showProposalModal = false" @submitted="loadData" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GovSidebar from './GovSidebar.vue'
import ReferendaList, { type ReferendaListItem } from './ReferendaList.vue'
import SubmitProposal from './submit-proposal'
import { SecretContractApi } from '@/apis/contract'
import { parseHumanNumber } from '@/utils/parseHumanNumber'
import { ProposalState, type ProposalStatusKey } from '@/utils/proposalState'
import { parseProposalStatusResult } from '@/utils/parseProposalStatus'
import {
  type GovReferendumRow,
  buildTrackCategoryById,
  mapProposal,
} from './govReferendaMap'

type Status = ProposalStatusKey
type Referendum = GovReferendumRow

const { t } = useI18n()
const trackFilter = ref<string>('all')
const showProposalModal = ref(false)
const loading = ref(false)

const trackOptions = ref<{ id: string, name: string, label: string }[]>([
  { id: "all", name: 'all', label: t('gov.all') },
])

const referendas = ref<Referendum[]>([])
const filteredReferenda = computed(() => {
  if (trackFilter.value === 'all') return referendas.value
  return referendas.value.filter((r) => r.trackCategory === trackFilter.value)
})

const listItems = computed<ReferendaListItem[]>(() =>
  filteredReferenda.value.map((r) => ({
    id: r.id,
    submitBlock: r.submitBlock,
    proposer: r.proposer,
    trackLabel: trackName(r.trackId),
    status: r.status,
    callLabel: r.callLabel,
    callContract: r.callContract,
    callMethod: r.callMethod,
    callAmount: r.callAmount,
    comments: r.comments,
  })),
)

const trackName = (trackId: number): string => {
  return trackOptions.value.find((t) => t.id === trackId.toString())?.name ?? ''
}

async function loadData() {
  loading.value = true
  try {
    const [tracksResult, proposalsResult, methodBySelector] = await Promise.all([
      SecretContractApi.tracks(),
      SecretContractApi.proposals(),
      SecretContractApi.getGovSelectorMethodMap(),
    ])

    const categoryByTrackId = buildTrackCategoryById(tracksResult)
    const rows = proposalsResult.filter(
      (item: unknown): item is Record<string, unknown> => item != null && typeof item === 'object',
    )
    const proposals: Referendum[] = await Promise.all(
      rows.map(async (p: Record<string, unknown>) => {
        const pid = parseHumanNumber(p.id)
        const stRaw = await SecretContractApi.proposalStatus(pid).catch(() => null)
        const parsed = parseProposalStatusResult(stRaw)
        const stateCode = parsed?.stateCode ?? ProposalState.Pending
        return mapProposal(p, categoryByTrackId, methodBySelector, stateCode)
      }),
    )
    proposals.sort((a, b) => b.id - a.id)

    let ts = [{ id: "all", name: 'all', label: t('gov.all') }]
    tracksResult.forEach((t: any) => { ts.push({ id: t.id, name: t.track.name, label: t.track.name }) })
    trackOptions.value = ts
    referendas.value = proposals
  } catch (e) {
    console.error('Failed to load referenda:', e)
    referendas.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
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


.empty-state {
  font-size: 14px;
  padding: 60px 32px;
}

.text-secondary {
  color: $secondary-text;
}
</style>
