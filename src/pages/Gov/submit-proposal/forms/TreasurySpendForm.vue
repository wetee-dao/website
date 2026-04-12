<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <div class="sm:col-span-2">
      <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
        {{ t('proposal.spendTo') }}
      </div>
      <Account v-model="model.to"/>
    </div>
    <div class="sm:col-span-2">
      <div class="mb-1.5 text-[11px] tracking-[0.08em] text-white/45">
        {{ t('proposal.spendAmount') }}
      </div>
      <UInput v-model="model.amount" class="w-full" placeholder="input amount" size="lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Account from '@/components/Account.vue'
import type { TreasurySpendFormModel } from '../types'

const model = defineModel<TreasurySpendFormModel>({ required: true })

const { t } = useI18n()
</script>
