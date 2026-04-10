<template>
  <UModal :open="show" :overlay="true" :scrollable="true" :dismissible="true" :ui="{
    overlay: 'bg-black/70 backdrop-blur-[2px]',
    content:
      'bg-[rgba(var(--g-primary-bg-rgb),0.94)] ring-1 ring-white/10 border border-white/5 rounded-[var(--ui-radius)] shadow-[0_24px_80px_rgba(0,0,0,0.55)] w-[calc(100vw-2rem)] max-w-2xl',
    header: 'px-5 py-4 sm:px-6 border-b border-white/5',
    body: 'px-5 py-5 sm:px-6',
    footer: 'px-5 py-4 sm:px-6 border-t border-white/5',
    title: 'text-[0.95rem] font-semibold tracking-tight text-[rgba(var(--g-secondary-text-rgb),0.92)]',
    description: 'mt-1 text-xs text-[rgba(var(--g-secondary-text-rgb),0.55)]',
    close: 'top-4 end-4',
  }" :title="t('proposal.submitTitle')"
    :description="t('proposal.selectTrack') + ' · ' + t('proposal.selectAction') + ' · ' + t('proposal.params')"
    @update:open="(v: boolean) => (!v ? handleClose() : undefined)">
    <template #body>
      <div class="space-y-6">
        <section class="space-y-2">
          <div class="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            {{ t('proposal.selectTrack') }}
          </div>
          <USelect v-model="selectedTrackId" class="w-full p-3" :items="tracks" value-key="id" label-key="name"
            size="lg" />
        </section>

        <section class="space-y-2">
          <div class="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            {{ t('proposal.selectAction') }}
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton v-for="a in actionTabs" :key="a.id" color="neutral"
              :variant="selectedAction === a.id ? 'solid' : 'outline'" size="lg"
              class="min-w-[calc(50%-0.25rem)] flex-1 justify-start gap-2 p-3 sm:min-w-[8rem]"
              @click="selectedAction = a.id">
              <span class="truncate">{{ a.label }}</span>
            </UButton>
          </div>
        </section>

        <section v-if="selectedAction" class="space-y-3">
          <div class="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            {{ t('proposal.params') }}
          </div>
          <AddTrackForm v-if="selectedAction === 'addTrack'" v-model="addTrackForm" />
          <TreasurySpendForm v-else-if="selectedAction === 'spend'" v-model="spendForm" />
          <div v-else-if="selectedAction === 'setDefaultTrack'" class="space-y-2">
            <div class="text-sm text-secondary">
              {{ t('proposal.setDefaultTrackHint') }}
            </div>
            <USelect
              v-model="defaultTrackId"
              class="w-full p-3"
              :items="tracks"
              value-key="id"
              label-key="name"
              size="lg"
            />
          </div>
        </section>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full flex-wrap items-center justify-center gap-3">
        <UButton color="neutral" variant="outline" size="lg" type="button" class="px-6" @click="handleClose">
          &nbsp;&nbsp;{{ t('common.cancel') }}&nbsp;&nbsp;
        </UButton>
        <UButton color="neutral" variant="solid" size="lg" type="button" class="px-6" :loading="submitting"
          :disabled="!canSubmit" @click="handleSubmit">
          {{ t('proposal.submit') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { SecretContractApi } from '@/apis/contract'
import { $getTxProvider } from '@/plugins/chain'
import type { WalletWrap } from '@/providers'
import AddTrackForm from './forms/AddTrackForm.vue'
import TreasurySpendForm from './forms/TreasurySpendForm.vue'
import { submitProposalPayload } from './submitProposal'
import {
  createDefaultAddTrackForm,
  createDefaultTreasurySpendForm,
  type AddTrackFormModel,
  type TreasurySpendFormModel,
} from './types'
import type { ProposalSubmitPayload } from './types'

const props = defineProps<{
  show: boolean
  defaultAction?: string
  defaultTrackId?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submitted'): void
}>()

const { t } = useI18n()

const submitting = ref(false)

type ActionId = 'addTrack' | 'spend' | 'setDefaultTrack'

interface TrackRow {
  id: number
  name: string
}

const tracks = ref<TrackRow[]>([])
const selectedTrackId = ref(0)
const selectedAction = ref<ActionId | ''>('')
const defaultTrackId = ref(0)

const addTrackForm = ref<AddTrackFormModel>(createDefaultAddTrackForm())
const spendForm = ref<TreasurySpendFormModel>(createDefaultTreasurySpendForm())

const actionTabs = computed(() => [
  { id: 'addTrack' as const, label: t('proposal.actionAddTrack') },
  { id: 'spend' as const, label: t('proposal.actionSpend') },
  { id: 'setDefaultTrack' as const, label: t('proposal.actionSetDefaultTrack') },
])

const trackSelectionOk = computed(() => {
  if (tracks.value.length === 0) return false
  return tracks.value.some((x) => x.id === selectedTrackId.value)
})

const defaultTrackSelectionOk = computed(() => {
  if (tracks.value.length === 0) return false
  return tracks.value.some((x) => x.id === defaultTrackId.value)
})

const canSubmit = computed(() => {
  if (!selectedAction.value || !trackSelectionOk.value) return false
  if (selectedAction.value === 'addTrack') {
    return addTrackForm.value.name.trim().length > 0
  }
  if (selectedAction.value === 'setDefaultTrack') {
    return defaultTrackSelectionOk.value
  }
  const s = spendForm.value
  return !!s.to?.v && s.amount.trim().length > 0
})

function buildPayload(): ProposalSubmitPayload | null {
  if (!canSubmit.value) return null
  const proposalTrackId = selectedTrackId.value
  if (selectedAction.value === 'addTrack') {
    const f = addTrackForm.value
    return {
      action: 'addTrack',
      proposalTrackId,
      trackData: {
        name: f.name,
        preparePeriod: f.preparePeriod,
        decisionPeriod: f.decisionPeriod,
        confirmPeriod: f.confirmPeriod,
        maxDeciding: f.maxDeciding,
        minEnactmentPeriod: 1,
        decisionDeposit: f.decisionDeposit,
        maxBalance: f.maxBalance,
      },
    }
  }
  if (selectedAction.value === 'setDefaultTrack') {
    return {
      action: 'setDefaultTrack',
      proposalTrackId,
      defaultTrackId: defaultTrackId.value,
    }
  }
  const s = spendForm.value
  return {
    action: 'spend',
    proposalTrackId,
    to: s.to!,
    amount: s.amount,
  }
}

function reset() {
  selectedAction.value = (
    props.defaultAction === 'addTrack' ||
    props.defaultAction === 'spend' ||
    props.defaultAction === 'setDefaultTrack'
      ? props.defaultAction
      : ''
  ) as ActionId | ''
  addTrackForm.value = createDefaultAddTrackForm()
  spendForm.value = createDefaultTreasurySpendForm()
  selectedTrackId.value = tracks.value.length > 0 ? tracks.value[0].id : 0
  defaultTrackId.value = selectedTrackId.value
  if (props.defaultTrackId !== undefined) {
    selectedTrackId.value = props.defaultTrackId
    defaultTrackId.value = props.defaultTrackId
  }
}

async function loadTracks() {
  try {
    const result = await SecretContractApi.tracks()
    tracks.value = result.map((item: any, index: number) => {
      console.log('item:', item)
      return {
        id: item.id,
        name: `Track ${item.id} -> ${item.track.name}`,
      }
    })
    if (props.defaultTrackId !== undefined) {
      selectedTrackId.value = props.defaultTrackId
    } else if (tracks.value.length > 0) {
      selectedTrackId.value = tracks.value[0].id
    }
  } catch (error) {
    console.error('Failed to load tracks:', error)
  }
}

async function handleSubmit() {
  const payload = buildPayload()
  if (!payload || submitting.value) return

  submitting.value = true
  try {
    await $getTxProvider(async (wallet: WalletWrap) => {
      await submitProposalPayload(wallet, payload)
    })
    emit('submitted')
    handleClose()
  } catch (error) {
    console.error('Failed to submit proposal:', error)
  } finally {
    submitting.value = false
  }
}

function handleClose() {
  emit('close')
}

watch(
  () => props.defaultAction,
  (val) => {
    if (val === 'addTrack' || val === 'spend') selectedAction.value = val
  },
  { immediate: true },
)

watch(
  () => props.show,
  (open) => {
    if (open) loadTracks()
    else reset()
  },
)
</script>

<style lang="scss" scoped>
/* UModal ui + Nuxt UI + Tailwind */
</style>
