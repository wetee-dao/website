<template>
  <div class="curve-form space-y-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
    <div v-if="title" class="text-[11px] font-medium uppercase tracking-[0.12em] text-white/50">
      {{ title }}
    </div>
    <div>
      <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
        {{ t('proposal.curveType') }}
      </div>
      <USelect
        v-model="model.type"
        class="w-full p-3"
        :items="curveTypeItems"
        value-key="value"
        label-key="label"
        size="lg"
      />
    </div>

    <template v-if="model.type === 'LinearDecreasing'">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">{{ t('proposal.linearBegin') }}</div>
          <UInput v-model.number="model.linearBegin" class="w-full" type="number" min="0" size="lg" />
        </div>
        <div>
          <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">{{ t('proposal.linearEnd') }}</div>
          <UInput v-model.number="model.linearEnd" class="w-full" type="number" min="0" size="lg" />
        </div>
        <div>
          <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">{{ t('proposal.linearLength') }}</div>
          <UInput v-model.number="model.linearLength" class="w-full" type="number" min="0" size="lg" />
        </div>
      </div>
    </template>

    <template v-else-if="model.type === 'SteppedDecreasing'">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">{{ t('proposal.stepBegin') }}</div>
          <UInput v-model.number="model.stepBegin" class="w-full" type="number" min="0" size="lg" />
        </div>
        <div>
          <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">{{ t('proposal.stepEnd') }}</div>
          <UInput v-model.number="model.stepEnd" class="w-full" type="number" min="0" size="lg" />
        </div>
        <div>
          <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">{{ t('proposal.stepSize') }}</div>
          <UInput v-model.number="model.stepSize" class="w-full" type="number" min="0" size="lg" />
        </div>
        <div>
          <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">{{ t('proposal.stepPeriod') }}</div>
          <UInput v-model.number="model.stepPeriod" class="w-full" type="number" min="0" size="lg" />
        </div>
      </div>
    </template>

    <template v-else-if="model.type === 'Reciprocal'">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">{{ t('proposal.reciprocalFactor') }}</div>
          <UInput v-model.number="model.reciprocalFactor" class="w-full" type="number" min="0" size="lg" />
        </div>
        <div>
          <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">{{ t('proposal.reciprocalXScale') }}</div>
          <UInput v-model.number="model.reciprocalXScale" class="w-full" type="number" min="0" size="lg" />
        </div>
        <div>
          <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">{{ t('proposal.reciprocalXOffset') }}</div>
          <UInput v-model.number="model.reciprocalXOffset" class="w-full" type="number" size="lg" />
        </div>
        <div>
          <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">{{ t('proposal.reciprocalYOffset') }}</div>
          <UInput v-model.number="model.reciprocalYOffset" class="w-full" type="number" size="lg" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CurveFormModel } from '../types'

defineProps<{ title?: string }>()

const model = defineModel<CurveFormModel>({ required: true })

const { t } = useI18n()

const curveTypeItems = computed(() => [
  { value: 'LinearDecreasing' as const, label: t('proposal.curveLinear') },
  { value: 'SteppedDecreasing' as const, label: t('proposal.curveStepped') },
  { value: 'Reciprocal' as const, label: t('proposal.curveReciprocal') },
])
</script>
