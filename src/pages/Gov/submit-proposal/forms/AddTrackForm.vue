<template>
  <div class="space-y-5">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
          {{ t('proposal.trackName') }}
        </div>
        <UInput
          v-model="model.name"
          class="w-full"
          :placeholder="t('proposal.trackNamePlaceholder')"
          size="lg"
        />
      </div>

      <div>
        <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
          {{ t('proposal.preparePeriod') }}
        </div>
        <UInput v-model.number="model.preparePeriod" class="w-full" type="number" size="lg" />
      </div>
      <div>
        <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
          {{ t('proposal.decisionPeriod') }}
        </div>
        <UInput v-model.number="model.decisionPeriod" class="w-full" type="number" size="lg" />
      </div>

      <div>
        <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
          {{ t('proposal.confirmPeriod') }}
        </div>
        <UInput v-model.number="model.confirmPeriod" class="w-full" type="number" size="lg" />
      </div>
      <div>
        <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
          {{ t('proposal.maxDeciding') }}
        </div>
        <UInput v-model.number="model.maxDeciding" class="w-full" type="number" size="lg" />
      </div>

      <div>
        <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
          {{ t('proposal.decisionDeposit') }}
        </div>
        <UInput v-model="model.decisionDeposit" class="w-full" size="lg" />
      </div>
      <div>
        <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
          {{ t('proposal.maxBalance') }}
        </div>
        <UInput v-model="model.maxBalance" class="w-full" size="lg" />
      </div>
    </div>

    <CurveForm v-model="model.minApproval" :title="t('proposal.curveMinApproval')" />
    <CurveForm v-model="model.minSupport" :title="t('proposal.curveMinSupport')" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { AddTrackFormModel } from '../types'
import CurveForm from './CurveForm.vue'

const model = defineModel<AddTrackFormModel>({ required: true })

const { t } = useI18n()
</script>
