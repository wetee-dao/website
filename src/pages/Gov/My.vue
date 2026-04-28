<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-row gap-0 overflow-x-auto">
      <GovSidebar />

      <main class="gov-main flex-1 min-w-0">
        <div class="chain-box main-box">
          <div class="title-wrap title-wrap--pixel flex flex-wrap justify-between items-center gap-4">
            <div class="title-pixel-bg" aria-hidden="true">
              <PixelBg :tile-size="6" :gap="4" :max-opacity="0.28" :density="0.18" :wave-speed="0.0014" />
            </div>
            <div class="relative z-[1]">
              <h1 class="page-title">{{ t('govMy.title') }}</h1>
              <p class="page-subtitle">{{ t('govMy.subtitle') }}</p>
            </div>
          </div>

          <div v-if="!userAddr" class="p-8 lg:p-10 border-b border-white-4 text-center">
            <p class="text-secondary mb-4">{{ t('govMy.connectHint') }}</p>
            <UButton color="neutral" variant="solid" size="lg" type="button" class="p-3" @click="openLogin">
              {{ t('govMy.connect') }}
            </UButton>
          </div>

          <template v-else>
            <!-- 余额 -->
            <div class="stats-bar flex flex-wrap gap-6 p-5 lg:p-8 border-b border-white-4">
              <div class="stat-item">
                <span class="stat-label">{{ t('govMy.voteBalance') }}</span>
                <span class="stat-value">{{ voteBalanceDisplay }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ t('govMy.voteLocked') }}</span>
                <span class="stat-value">{{ voteLockedDisplay }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ t('govMy.voteFree') }}</span>
                <span class="stat-value">{{ voteFreeDisplay }}</span>
              </div>
            </div>

            <div v-if="loading" class="empty-state p-10 text-center text-secondary">
              {{ t('govMy.loading') }}
            </div>

            <template v-else>
              <!-- 我的提案 -->
              <section class="section-block border-b border-white-4">
                <h2 class="section-title px-8 py-6">{{ t('govMy.myProposals') }}</h2>
                <div v-if="myProposalItems.length === 0" class="text-secondary text-sm px-8 pb-6">
                  {{ t('govMy.emptyProposals') }}
                </div>
                <ReferendaList v-else :items="myProposalItems" />
              </section>

              <!-- 投票历史 -->
              <section class="section-block">
                <h2 class="section-title  px-8 py-6">{{ t('govMy.voteHistory') }}</h2>
                <div v-if="voteHistoryRows.length === 0" class="text-secondary text-sm py-6 px-8">
                  {{ t('govMy.emptyVotes') }}
                </div>
                <div v-else class="vote-table-wrap overflow-x-auto">
                  <table class="vote-table w-full text-sm">
                    <thead>
                      <tr class="text-left text-secondary border-b border-white-4">
                        <th class="py-3 pr-4 pl-8">{{ t('govMy.colId') }}</th>
                        <th class="py-3 pr-4">{{ t('govMy.colSide') }}</th>
                        <th class="py-3 pr-4">{{ t('govMy.colAmount') }}</th>
                        <th class="py-3 pr-4">{{ t('govMy.colBlock') }}</th>
                        <th class="py-3 pr-4">{{ t('govMy.colUnlock') }}</th>
                        <th class="py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in voteHistoryRows" :key="`${row.proposalId}-${row.voteBlock}-${row.index}`"
                        class="border-b border-white-4">
                        <td class="py-3 pr-4 tabular-nums pl-8">#{{ row.proposalId }}</td>
                        <td class="py-3 pr-4">
                          <UBadge color="neutral" variant="subtle" size="sm">
                            {{ row.yes ? t('govMy.aye') : t('govMy.nay') }}
                          </UBadge>
                        </td>
                        <td class="py-3 pr-4 tabular-nums">{{ row.lockDisplay }}</td>
                        <td class="py-3 pr-4 tabular-nums">{{ row.voteBlock }}</td>
                        <td class="py-3 pr-4">
                          <span v-if="row.unlockedOnChain" class="text-emerald-400/90">{{ t('govMy.unlocked') }}</span>
                          <span v-else class="text-secondary">{{ t('govMy.locked') }}</span>
                        </td>
                        <td class="py-3">
                          <RouterLink :to="`/gov/referenda/${row.proposalId}`"
                            class="text-primary underline-offset-2 hover:underline">
                            {{ t('govMy.viewDetail') }}
                          </RouterLink>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </template>
          </template>
        </div>
      </main>
    </div>
    <div class="pb-4" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BN } from '@polkadot/util'
import GovSidebar from './GovSidebar.vue'
import PixelBg from '@/components/anim/PixelBg.vue'
import ReferendaList, { type ReferendaListItem } from './ReferendaList.vue'
import { SecretContractApi } from '@/apis/contract'
import { getBnFromChain } from '@/utils/chain'
import { bytesToString, callerToSs58 } from '@/utils/gov'
import { parseHumanNumber } from '@/utils/parseHumanNumber'
import { ProposalState } from '@/utils/proposalState'
import { parseProposalStatusResult } from '@/utils/parseProposalStatus'
import { useGlobalStore } from '@/stores/global'
import useGlobelProperties from '@/plugins/globel'
import { buildTrackCategoryById, mapProposal, type GovReferendumRow } from './govReferendaMap'
import { fetchVoteUnlockStatusMap, voteRefMapKey } from '@/utils/voteUnlockStatuses'

const { t } = useI18n()
const globalStore = useGlobalStore()
const global = useGlobelProperties()

const userAddr = computed(() => (globalStore.userInfo?.addr as string | undefined) ?? '')

const loading = ref(false)
const voteBalanceDisplay = ref('—')
const voteLockedDisplay = ref('—')
const voteFreeDisplay = ref('—')
const myReferenda = ref<GovReferendumRow[]>([])
const trackNameById = ref<Map<number, string>>(new Map())
const voteHistoryRows = ref<
  {
    proposalId: number
    yes: boolean
    lockDisplay: string
    voteBlock: number
    index: number
    unlockedOnChain: boolean
  }[]
>([])

const myProposalItems = computed<ReferendaListItem[]>(() =>
  myReferenda.value.map((r) => ({
    id: r.id,
    submitBlock: r.submitBlock,
    proposer: r.proposer,
    trackLabel: trackNameById.value.get(r.trackId) ?? `#${r.trackId}`,
    status: r.status,
    callLabel: r.callLabel,
    callContract: r.callContract,
    callMethod: r.callMethod,
    callAmount: r.callAmount,
  })),
)

function openLogin() {
  global.$Login()
}

function formatBnVote(bn: BN): string {
  return bn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VOTE'
}

function unwrapBn(v: unknown): BN {
  if (v === undefined || v === null) return new BN(0)
  if (typeof v === 'object' && v !== null) {
    const o = v as Record<string, unknown>
    if ('Ok' in o) return unwrapBn(o.Ok)
    if ('ok' in o) return unwrapBn(o.ok)
  }
  if (typeof v === 'number' && Number.isFinite(v)) return new BN(String(Math.trunc(v)))
  const s = String(v).replace(/,/g, '')
  if (s === '[object Object]') return new BN(0)
  try {
    return getBnFromChain(s)
  } catch {
    return new BN(0)
  }
}

async function fetchAllProposalRows(): Promise<Record<string, unknown>[]> {
  const acc: Record<string, unknown>[] = []
  let startKey: number | null = null
  const pageSize = 64
  for (let guard = 0; guard < 500; guard++) {
    const batch = await SecretContractApi.proposalsPage(startKey, pageSize)
    if (batch.length === 0) break
    for (const p of batch) acc.push(p as Record<string, unknown>)
    if (batch.length < pageSize) break
    const last = batch[batch.length - 1] as Record<string, unknown>
    const lastId = parseHumanNumber(last.id)
    if (lastId === startKey) break
    startKey = lastId
  }
  return acc
}


/** 链上 Vote 结构 → 表格行（已删除的投票不展示） */
function mapVoteRecordToHistoryRow(v: Record<string, unknown>): {
  proposalId: number
  yes: boolean
  lockDisplay: string
  voteBlock: number
  index: number
} | null {
  const proposalId = parseHumanNumber(v.proposalID)
  const index = parseHumanNumber(v.index)
  // proposalID 可能从 0 开始；仅过滤负数/非数字
  if (!Number.isFinite(proposalId) || proposalId < 0) return null
  const lock = getBnFromChain(String(v.Pledge ?? v.pledge ?? '0'))
  const yesVal = v.OpinionYes ?? v.opinionYes
  const yes = yesVal === true || String(yesVal).toLowerCase() === 'true'
  return {
    proposalId,
    yes,
    lockDisplay: formatBnVote(lock),
    voteBlock: parseHumanNumber(v.VoteBlock ?? v.voteBlock ?? 0),
    index,
  }
}

/** 分页拉取当前用户全部 Vote（votes_of_user 现返回完整 Vote，不再需逐条 vote 查询） */
async function fetchAllVotesOfUser(addr: string): Promise<Record<string, unknown>[]> {
  const acc: Record<string, unknown>[] = []
  let startKey: number | null = null
  const pageSize = 64
  for (let guard = 0; guard < 500; guard++) {
    const list = await SecretContractApi.votesOfUser(addr, startKey, pageSize)
    if (list.length === 0) break
    for (const item of list) {
      if (item && typeof item === 'object') acc.push(item as Record<string, unknown>)
    }
    if (list.length < pageSize) break
    const last = list[list.length - 1] as Record<string, unknown>
    const lastPid = parseHumanNumber(last.proposalID)
    if (lastPid === startKey) break
    startKey = lastPid
  }
  return acc
}

/** votes_of_user 拉全量 Vote 后，再 batch vote_unlock_statuses */
async function loadVoteHistory(addr: string) {
  const voteRecords = await fetchAllVotesOfUser(addr)
  const collected = voteRecords
    .map(mapVoteRecordToHistoryRow)
    .filter((x): x is NonNullable<typeof x> => x != null)

  collected.sort((a, b) => b.voteBlock - a.voteBlock || b.proposalId - a.proposalId)

  const unlockKeys = collected.map((r) => ({ ProposalID: r.proposalId, VoteIndex: r.index }))
  let unlockMap = new Map<string, boolean>()
  try {
    unlockMap = await fetchVoteUnlockStatusMap(unlockKeys)
  } catch (e) {
    console.warn('vote_unlock_statuses (my page) failed:', e)
  }

  voteHistoryRows.value = collected
    .map((r) => ({
      ...r,
      unlockedOnChain: unlockMap.get(voteRefMapKey(r.proposalId, r.index)) ?? false,
    }))
}

async function loadData() {
  const addr = userAddr.value
  if (!addr) return

  loading.value = true
  try {
    const [tracksResult, allRows, methodBySelector] = await Promise.all([
      SecretContractApi.tracks(),
      fetchAllProposalRows(),
      SecretContractApi.getGovSelectorMethodMap(),
    ])

    const nameMap = new Map<number, string>()
    const tr = Array.isArray(tracksResult) ? tracksResult : []
    for (const item of tr) {
      const row = item as unknown[]
      const trackData = (row[1] ?? row) as Record<string, unknown>
      const id = parseHumanNumber(row[0] ?? trackData.id)
      const name = bytesToString(trackData.name) || `Track ${id}`
      nameMap.set(id, name)
    }
    trackNameById.value = nameMap

    const categoryByTrackId = buildTrackCategoryById(tracksResult)

    const balRaw = await SecretContractApi.balanceOf(addr)
    const lockedRaw = await SecretContractApi.lockBalanceOf(addr)
    const total = unwrapBn(balRaw)
    const locked = unwrapBn(lockedRaw)
    const free = total.sub(locked)
    voteBalanceDisplay.value = formatBnVote(total)
    voteLockedDisplay.value = formatBnVote(locked)
    voteFreeDisplay.value = formatBnVote(free.gt(new BN(0)) ? free : new BN(0))

    const mineRaw = allRows.filter((p) => callerToSs58(p.caller as any) === addr)
    const mineMapped: GovReferendumRow[] = await Promise.all(
      mineRaw.map(async (p) => {
        const pid = parseHumanNumber(p.id)
        const stRaw = await SecretContractApi.proposalStatus(pid).catch(() => null)
        const parsed = parseProposalStatusResult(stRaw)
        const stateCode = parsed?.stateCode ?? ProposalState.Pending
        return mapProposal(p, categoryByTrackId, methodBySelector, stateCode)
      }),
    )
    mineMapped.sort((a, b) => b.id - a.id)
    myReferenda.value = mineMapped

    await loadVoteHistory(addr)
  } catch (e) {
    console.error('GovMy load failed:', e)
    myReferenda.value = []
    voteHistoryRows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (userAddr.value) loadData()
})

watch(userAddr, (a) => {
  if (a) loadData()
  else {
    myReferenda.value = []
    voteHistoryRows.value = []
    voteBalanceDisplay.value = '—'
    voteLockedDisplay.value = '—'
    voteFreeDisplay.value = '—'
  }
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

  .title-wrap--pixel {
    position: relative;
    overflow: hidden;
  }

  .title-pixel-bg {
    position: absolute;
    inset: 0;
    opacity: 0.65;
    filter: blur(0.15px);
    -webkit-mask-image: radial-gradient(90% 140% at 50% 0%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 72%);
    mask-image: radial-gradient(90% 140% at 50% 0%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 72%);
  }

  .page-title {
    font-size: 18px;
    font-weight: 500;
    color: rgba($secondary-text-rgb, 0.92);
    margin: 0 0 6px;
  }

  .page-subtitle {
    font-size: 13px;
    color: rgba($secondary-text-rgb, 0.6);
    margin: 0;
  }
}

.border-white-4 {
  border-color: rgba(255, 255, 255, 0.04);
}

.stats-bar {
  .stat-item {
    min-width: 140px;
  }

  .stat-label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgba($secondary-text-rgb, 0.5);
    margin-bottom: 6px;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 500;
    color: rgba($secondary-text-rgb, 0.9);
    font-variant-numeric: tabular-nums;
  }
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba($secondary-text-rgb, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.section-block {
  :deep(.referenda-list) {
    padding: 0;
  }
}

.vote-table {
  border-collapse: collapse;

  th,
  td {
    vertical-align: middle;
  }
}

.text-primary {
  color: rgba(80, 250, 130, 0.95);
}

.empty-state {
  font-size: 14px;
}
</style>
