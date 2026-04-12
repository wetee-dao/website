<template>
    <div ref="rootRef" class="account-input flex flex-col gap-1">
        <div class="flex w-full min-w-0">
        <USelect
            v-model="accountType"
            :items="typeOptions"
            value-key="value"
            label-key="label"
            size="sm"
            class="account-type-select"
            @update:model-value="scheduleFocusInput"
        />
        <UInput
            ref="inputRef"
            v-model="raw"
            class="w-full"
            size="lg"
            :placeholder="accountType === 1 ? 'SS58 or 0x…' : '0x…'"
        >
            <template #leading>
                <div class="flex items-center">
                    <PolkadotIdenticon v-if="accountType === 1" class="h-6 w-6" :size="24"
                        :address="polkadotIconAddress" />
                    <svg v-else class="h-6 w-6 opacity-80" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M12 2l6.5 10L12 9.2 5.5 12 12 2Z" fill="currentColor" opacity="0.85" />
                        <path d="M12 9.7l6.5 2.9L12 16l-6.5-3.4L12 9.7Z" fill="currentColor" opacity="0.65" />
                        <path d="M12 16.6l6.5-3.3L12 22l-6.5-8.7L12 16.6Z" fill="currentColor" opacity="0.5" />
                    </svg>
                </div>
            </template>
        </UInput>
        </div>
        <p v-if="formatError" class="text-xs text-rose-400/90 pl-0.5 leading-snug">
            {{ formatError }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { hexToU8a } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import PolkadotIdenticon from '@/components/PolkadotIdenticon.vue'
import { hexToSS58, ss58toHex } from '@/utils/chain'

const { t } = useI18n()

type UniAddr = { t: 1 | 2; v: string }

const model = defineModel<UniAddr | null>({ default: null })

const accountType = ref<1 | 2>(model.value?.t === 2 ? 2 : 1)
const raw = ref<string>('')
const inputRef = ref<any>(null)
const focusToken = ref(0)
const typeOptions = [
    { value: 1 as const, label: 'Polkadot' },
    { value: 2 as const, label: 'Ethereum' },
]

async function focusInput() {
    await nextTick()
    const root: HTMLElement | null = inputRef.value?.$el ?? null
    const el = root?.querySelector('input') as HTMLInputElement | null
    if (!el) return
    if (document.activeElement === el) return
    el.focus()
}

function scheduleFocusInput() {
    focusToken.value += 1
    const token = focusToken.value

    // 选择完成后，下拉关闭/动画会延后触发 focus 回到触发器，延迟一次即可避免晃动
    setTimeout(() => token === focusToken.value && focusInput(), 120)
}

/** 非空时：SS58 或 32 字节公钥（0x… 或 64 位 hex） */
function isValidPolkadotInput(input: string): boolean {
    const s = input.trim()
    if (!s) return true
    if (/^0x[0-9a-fA-F]+$/i.test(s)) {
        try {
            return hexToU8a(s).length === 32
        } catch {
            return false
        }
    }
    if (/^[0-9a-fA-F]{64}$/i.test(s)) {
        try {
            return hexToU8a(`0x${s}`).length === 32
        } catch {
            return false
        }
    }
    try {
        decodeAddress(s)
        return true
    } catch {
        return false
    }
}

/** 非空时：0x + 20 字节 */
function isValidEthInput(input: string): boolean {
    const s = input.trim()
    if (!s) return true
    let hex = s.startsWith('0x') || s.startsWith('0X') ? s.slice(2) : s
    return /^[0-9a-fA-F]{40}$/.test(hex)
}

function normalizePolkadot(input: string): string {
    const s = input.trim()
    if (!s) return ''
    if (/^0x[0-9a-fA-F]+$/i.test(s)) {
        try {
            const u8 = hexToU8a(s)
            if (u8.length !== 32) return ''
            return `0x${s.slice(2).toLowerCase()}`
        } catch {
            return ''
        }
    }
    if (/^[0-9a-fA-F]{64}$/i.test(s)) {
        try {
            const u8 = hexToU8a(`0x${s}`)
            if (u8.length !== 32) return ''
            return `0x${s.toLowerCase()}`
        } catch {
            return ''
        }
    }
    try {
        return ss58toHex(s)
    } catch {
        return ''
    }
}

function normalizeEth(input: string): string {
    const s = input.trim()
    if (!s) return ''
    const lower = s.startsWith('0x') || s.startsWith('0X') ? `0x${s.slice(2).toLowerCase()}` : `0x${s.toLowerCase()}`
    return lower
}

function syncFromModel(v: UniAddr | null) {
    if (!v) {
        raw.value = ''
        accountType.value = 1
        return
    }
    accountType.value = v.t
    raw.value = v.v
}

function syncToModel() {
    const ty = accountType.value
    const input = raw.value
    const trimmed = input.trim()
    if (!trimmed) {
        model.value = null
        return
    }
    if (ty === 1 && !isValidPolkadotInput(input)) {
        model.value = null
        return
    }
    if (ty === 2 && !isValidEthInput(input)) {
        model.value = null
        return
    }
    const v = ty === 1 ? normalizePolkadot(input) : normalizeEth(input)
    model.value = v ? ({ t: ty, v } as UniAddr) : null
}

const formatError = computed(() => {
    const s = raw.value.trim()
    if (!s) return ''
    if (accountType.value === 1) {
        return isValidPolkadotInput(raw.value) ? '' : t('common.accountInvalidPolkadot')
    }
    return isValidEthInput(raw.value) ? '' : t('common.accountInvalidEthereum')
})

const isFormatValid = computed(() => {
    const s = raw.value.trim()
    if (!s) return true
    return accountType.value === 1 ? isValidPolkadotInput(raw.value) : isValidEthInput(raw.value)
})

defineExpose({ isFormatValid })

watch(
    () => model.value,
    (v) => {
        // 外部更新时同步 UI，但避免覆盖用户输入中的空格变化
        if (!v) {
            if (raw.value !== '') syncFromModel(v)
            return
        }
        if (v.t !== accountType.value || v.v !== raw.value) syncFromModel(v)
    },
    { deep: true, immediate: true },
)

watch([accountType, raw], () => syncToModel())

watch(accountType, () => scheduleFocusInput(), { flush: 'post' })

const POLKADOT_PLACEHOLDER =
    '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

const polkadotIconAddress = computed(() => {
    const s = raw.value.trim()
    if (!s) return POLKADOT_PLACEHOLDER
    if (/^0x[0-9a-fA-F]{2,}$/i.test(s)) {
        try {
            return hexToSS58(s)
        } catch {
            return POLKADOT_PLACEHOLDER
        }
    }
    if (/^[0-9a-fA-F]{64}$/i.test(s)) {
        try {
            return hexToSS58(`0x${s}`)
        } catch {
            return POLKADOT_PLACEHOLDER
        }
    }
    return s
})
</script>

<style scoped>
.account-input :deep(.polkadot-identicon) {
    width: 24px;
    height: 24px;
}

.account-type-select {
    min-width: 120px;
}

/* 去掉右侧选择框边框/描边 */
.account-type-select :deep(button),
.account-type-select :deep([data-ui='select'] button) {
    border: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
}

.account-type-select :deep(.ring-1),
.account-type-select :deep(.ring-inset),
.account-type-select :deep([class*='ring-']) {
    box-shadow: none !important;
}
</style>
