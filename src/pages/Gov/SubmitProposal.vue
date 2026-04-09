<template>
  <UModal
    :open="show"
    :overlay="true"
    :scrollable="true"
    :dismissible="true"
    :ui="{
      overlay: 'bg-black/70 backdrop-blur-[2px]',
      content:
        'bg-[rgba(var(--g-primary-bg-rgb),0.94)] ring-1 ring-white/10 border border-white/5 rounded-[var(--ui-radius)] shadow-[0_24px_80px_rgba(0,0,0,0.55)] w-[calc(100vw-2rem)] max-w-2xl',
      header: 'px-5 py-4 sm:px-6 border-b border-white/5',
      body: 'px-5 py-5 sm:px-6',
      footer: 'px-5 py-4 sm:px-6 border-t border-white/5',
      title: 'text-[0.95rem] font-semibold tracking-tight text-[rgba(var(--g-secondary-text-rgb),0.92)]',
      description: 'mt-1 text-xs text-[rgba(var(--g-secondary-text-rgb),0.55)]',
      close: 'top-4 end-4',
    }"
    :title="t('proposal.submitTitle')"
    :description="t('proposal.selectTrack') + ' · ' + t('proposal.selectAction') + ' · ' + t('proposal.params')"
    @update:open="(v: boolean) => (!v ? handleClose() : undefined)"
  >
    <template #body>
      <div class="space-y-6">
        <!-- Step 1: 选择轨道 -->
        <section class="space-y-2">
          <div class="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            {{ t('proposal.selectTrack') }}
          </div>
          <USelect
            class="w-full p-3"
            v-model="selectedTrackId"
            :items="tracks"
            value-key="id"
            label-key="name"
            size="lg"
          />
        </section>

        <!-- Step 2: 选择操作类型 -->
        <section class="space-y-2">
          <div class="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            {{ t('proposal.selectAction') }}
          </div>
          <div class="grid grid-cols-2 gap-2">
            <UButton
              v-for="action in availableActions"
              :key="action.value"
              :variant="selectedAction === action.value ? 'solid' : 'outline'"
              size="lg"
              class="justify-start gap-2 p-3"
              @click="selectedAction = action.value"
            >
              <span class="truncate">{{ action.label }}</span>
            </UButton>
          </div>
        </section>

        <!-- Step 3: 操作参数表单 -->
        <section v-if="selectedAction" class="space-y-3">
          <div class="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            {{ t('proposal.params') }}
          </div>

          <!-- AddTrack 表单 -->
          <div v-if="selectedAction === 'addTrack'" class="space-y-3">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
                  {{ t('proposal.trackName') }}
                </div>
                <UInput v-model="addTrackForm.name" class="w-full" :placeholder="t('proposal.trackNamePlaceholder')" size="lg" />
              </div>

              <div>
                <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
                  {{ t('proposal.preparePeriod') }}
                </div>
                <UInput class="w-full" v-model.number="addTrackForm.preparePeriod" type="number" size="lg" />
              </div>
              <div>
                <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
                  {{ t('proposal.decisionPeriod') }}
                </div>
                <UInput class="w-full" v-model.number="addTrackForm.decisionPeriod" type="number" size="lg" />
              </div>

              <div>
                <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
                  {{ t('proposal.confirmPeriod') }}
                </div>
                <UInput class="w-full" v-model.number="addTrackForm.confirmPeriod" type="number" size="lg" />
              </div>
              <div>
                <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
                  {{ t('proposal.maxDeciding') }}
                </div>
                <UInput class="w-full" v-model.number="addTrackForm.maxDeciding" type="number" size="lg" />
              </div>

              <div>
                <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
                  {{ t('proposal.decisionDeposit') }}
                </div>
                <UInput class="w-full" v-model="addTrackForm.decisionDeposit" size="lg" />
              </div>
              <div>
                <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
                  {{ t('proposal.maxBalance') }}
                </div>
                <UInput class="w-full" v-model="addTrackForm.maxBalance" size="lg" />
              </div>
            </div>
          </div>

          <!-- Spend 表单 -->
          <div v-else-if="selectedAction === 'spend'" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
                {{ t('proposal.spendTo') }}
              </div>
              <UInput v-model="spendForm.to" placeholder="5..." class="w-full" size="lg" />
            </div>
            <div class="sm:col-span-2">
              <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
                {{ t('proposal.spendAmount') }}
              </div>
              <UInput v-model="spendForm.amount" placeholder="1000" class="w-full" size="lg" />
            </div>
          </div>
        </section>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-wrap items-center justify-center gap-3 w-full">
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          type="button"
          class="px-6"
          @click="handleClose"
        >
          &nbsp;&nbsp;{{ t('common.cancel') }}&nbsp;&nbsp;
        </UButton>
        <UButton
          color="neutral"
          variant="solid"
          size="lg"
          type="button"
          class="px-6"
          :loading="submitting"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          {{ t('proposal.submit') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { SecretContractApi } from '@/apis/contract'
import { $getTxProvider } from '@/plugins/chain'
import type { WalletWrap } from '@/providers'

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

interface Track {
  id: number
  name: string
}

const tracks = ref<Track[]>([])
const selectedTrackId = ref<number>(0)
const selectedAction = ref<string>('')
const submitting = ref(false)

// AddTrack 表单
const addTrackForm = ref({
  name: '',
  preparePeriod: 100,
  decisionPeriod: 100,
  confirmPeriod: 100,
  maxDeciding: 10,
  decisionDeposit: '1000000000000',
  maxBalance: '1000000000000000',
})

// Spend 表单
const spendForm = ref({
  to: '',
  amount: '',
})

// 可用操作
const availableActions = computed(() => [
  { value: 'addTrack', label: t('proposal.actionAddTrack')},
  { value: 'spend', label: t('proposal.actionSpend')},
])

// 是否可提交
const canSubmit = computed(() => {
  if (!selectedTrackId.value || !selectedAction.value) return false
  
  if (selectedAction.value === 'addTrack') {
    return addTrackForm.value.name.length > 0
  }
  
  if (selectedAction.value === 'spend') {
    return spendForm.value.to.length > 0 && spendForm.value.amount.length > 0
  }
  
  return false
})

// 加载轨道
async function loadTracks() {
  try {
    const result = await SecretContractApi.tracks()
    if (result && Array.isArray(result)) {
      tracks.value = result.map((item: any, index: number) => {
        const trackData = item[1] || item
        return {
          id: item[0] ?? trackData.id ?? index,
          name: trackData.name || `Track ${index}`,
        }
      })
      
      // 设置默认轨道
      if (props.defaultTrackId) {
        selectedTrackId.value = props.defaultTrackId
      } else if (tracks.value.length > 0) {
        selectedTrackId.value = tracks.value[0].id
      }
    }
  } catch (error) {
    console.error('Failed to load tracks:', error)
  }
}

// 提交公投
async function handleSubmit() {
  if (!canSubmit.value || submitting.value) return
  
  submitting.value = true
  
  try {
    await $getTxProvider(async (wallet: WalletWrap) => {
      if (selectedAction.value === 'addTrack') {
        // 添加轨道操作
        const trackData = {
          name: addTrackForm.value.name,
          preparePeriod: addTrackForm.value.preparePeriod,
          decisionPeriod: addTrackForm.value.decisionPeriod,
          confirmPeriod: addTrackForm.value.confirmPeriod,
          maxDeciding: addTrackForm.value.maxDeciding,
          minEnactmentPeriod: 1,
          decisionDeposit: addTrackForm.value.decisionDeposit,
          maxBalance: addTrackForm.value.maxBalance,
        }
        await SecretContractApi.addTrack(wallet, trackData)
      } else if (selectedAction.value === 'spend') {
        // 支出操作
        await SecretContractApi.spend(wallet, spendForm.value.to, spendForm.value.amount, selectedTrackId.value)
      }
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

// 监听默认操作
watch(() => props.defaultAction, (val) => {
  if (val) selectedAction.value = val
}, { immediate: true })

// 监听显示状态
watch(() => props.show, (val) => {
  if (val) loadTracks()
})

onMounted(() => {
  if (props.show) loadTracks()
})
</script>

<style lang="scss" scoped>
/* 保持 scoped 样式最小化：高级感主要由 Nuxt UI + Tailwind 负责 */
</style>
