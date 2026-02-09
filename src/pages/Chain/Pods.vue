<template>
    <div class="page gradient-body pods-page">
        <div class="pods-container container">
            <header class="page-header">
                <h1 class="page-title">{{ t('pods.title') }}</h1>
                <p class="page-desc">{{ t('pods.desc') }}</p>
            </header>

            <section class="panel panel-pods">
                <div class="panel-head">
                    <span class="panel-count">{{ normalizedPods.length }} {{ t('pods.panelTitle') }}</span>
                </div>
                <div class="panel-body">
                    <template v-if="loadingPods">
                        <div class="state-loading">
                            <div class="loader-minimal"></div>
                            <span>{{ t('pods.loading') }}</span>
                        </div>
                    </template>
                    <template v-else-if="errorPods">
                        <div class="state-error">{{ errorPods }}</div>
                    </template>
                    <template v-else-if="normalizedPods.length === 0">
                        <div class="state-empty">{{ t('pods.empty') }}</div>
                    </template>
                    <template v-else>
                        <div class="pod-grid">
                            <article
                                v-for="(item, i) in podsDisplayed"
                                :key="'p-' + (podsStartIndex + i)"
                                class="pod-card"
                            >
                                <div class="card-main">
                                    <div class="card-head">
                                        <span class="card-id">#{{ podId(item) }}</span>
                                        <span class="card-meta">
                                            <template v-if="podField(item, 'ptype')">{{ podField(item, 'ptype') }}</template>
                                            <template v-if="podField(item, 'ptype') && podField(item, 'teeType')"> · </template>
                                            <template v-if="podField(item, 'teeType')">{{ podField(item, 'teeType') }}</template>
                                        </span>
                                    </div>
                                    <p class="card-name" :title="podName(item) || t('pods.unnamedPod')">{{ podName(item) || t('pods.unnamedPod') }}</p>
                                    <p class="card-image mono" :title="podImage(item)">
                                        <template v-if="!hasExtInfo(podId(item)) && !podImage(item)">{{ t('pods.loadingImage') }}</template>
                                        <template v-else>{{ podImage(item) || '—' }}</template>
                                    </p>
                                    <div class="card-specs">
                                        <span>{{ podField(item, 'cpu') || '—' }} {{ t('pods.cpu') }}</span>
                                        <span>{{ podField(item, 'mem') || '—' }} {{ t('pods.mem') }}</span>
                                        <span>{{ podField(item, 'gpu') || '0' }} {{ t('pods.gpu') }}</span>
                                    </div>
                                </div>
                                <div class="card-foot">
                                    <template v-if="podField(item, 'startBlock')">
                                        <span class="card-foot-item">{{ t('pods.block') }} {{ podField(item, 'startBlock') }}</span>
                                    </template>
                                    <template v-if="podOwner(item)">
                                        <span class="card-foot-item mono truncate" :title="podOwner(item)">{{ podOwner(item) }}</span>
                                    </template>
                                </div>
                            </article>
                        </div>
                        <div v-if="podsTotalPages > 1" class="pagination">
                            <button type="button" class="pagination-btn" :disabled="podsPage <= 1" @click="podsPage = Math.max(1, podsPage - 1)">
                                {{ t('pods.previous') }}
                            </button>
                            <span class="pagination-info">{{ podsPage }} / {{ podsTotalPages }}</span>
                            <button type="button" class="pagination-btn" :disabled="podsPage >= podsTotalPages" @click="podsPage = Math.min(podsTotalPages, podsPage + 1)">
                                {{ t('pods.next') }}
                            </button>
                        </div>
                    </template>
                </div>
            </section>
        </div>
        <div class="pb-8"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Svgimg from '@/components/svg/SvgImg.vue'
import { GetPods, GetPodExtInfo } from '@/apis/main-chain'

const { t } = useI18n()
const podsRaw = ref<any>(null)
const loadingPods = ref(true)
const errorPods = ref('')
/** podId -> extended info (containers with image, etc.) */
const podExtInfoMap = ref<Record<string, any>>({})

function toArray(val: any): any[] {
    if (val == null) return []
    if (Array.isArray(val)) return val
    if (typeof val === 'object' && !Array.isArray(val)) return Object.values(val)
    return [val]
}

/** Entry format may be [id, data] or plain object */
function podId(item: any): string {
    if (item == null) return '—'
    if (Array.isArray(item)) return String(item[0] ?? '—')
    if (typeof item === 'object' && item.id != null) return String(item.id)
    return '—'
}

function podData(item: any): any {
    if (item == null) return {}
    if (Array.isArray(item) && item[1] != null) return item[1]
    if (typeof item === 'object') return item
    return {}
}

function podName(item: any): string {
    const data = podData(item)
    const name = data?.name
    if (typeof name === 'string') return name
    if (Array.isArray(name)) return new TextDecoder().decode(new Uint8Array(name))
    return podImage(item) || ''
}

function podOwner(item: any): string {
    const data = podData(item)
    return data?.owner ?? ''
}

/** Get a single field from pod data; supports camelCase and snake_case */
function podField(item: any, key: string): string {
    const data = podData(item)
    const camel = data?.[key]
    if (camel != null && camel !== '') return String(camel)
    const snake = key.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
    const snakeVal = data?.[snake]
    if (snakeVal != null && snakeVal !== '') return String(snakeVal)
    return ''
}



/** Image from podData (list API) or from podExtInfo (fetched per pod) */
function podImage(item: any): string {
    console.log("item", item)
    const id = podId(item)
    const containers = item[2]
    const raw = containers[0]?.[1]?.image ?? ""
    return raw
}

/** Whether we have fetched ext info for this pod (so image won't load later) */
function hasExtInfo(id: string): boolean {
    return id != null && id !== '—' && podExtInfoMap.value[id] != null
}

/** Length of array field (disk, env, etc.) */
function podArrayLength(item: any, key: string): number {
    const data = podData(item)
    const arr = data?.[key]
    if (!Array.isArray(arr)) return 0
    return arr.length
}

const normalizedPods = computed(() => toArray(podsRaw.value))

const podsPageSize = 48
const podsPage = ref(1)
const podsTotalPages = computed(() =>
    Math.max(1, Math.ceil(normalizedPods.value.length / podsPageSize))
)
const podsStartIndex = computed(() => (podsPage.value - 1) * podsPageSize)
const podsEndIndex = computed(() =>
    Math.min(podsPage.value * podsPageSize, normalizedPods.value.length)
)
const podsDisplayed = computed(() =>
    normalizedPods.value.slice(podsStartIndex.value, podsEndIndex.value)
)

watch(podsTotalPages, (total) => {
    if (podsPage.value > total) podsPage.value = Math.max(1, total)
})

/** Fetch ext info (image, etc.) for pods on current page */
function fetchExtInfoForDisplayedPods() {
    const list = normalizedPods.value
    const start = podsStartIndex.value
    const end = podsEndIndex.value
    for (let i = start; i < end; i++) {
        const item = list[i]
        const id = podId(item)
        if (!id || id === '—' || podExtInfoMap.value[id] != null) continue
        GetPodExtInfo(id)
            .then((ext) => {
                podExtInfoMap.value = { ...podExtInfoMap.value, [id]: ext }
            })
            .catch(() => {})
    }
}

watch([normalizedPods, podsStartIndex, podsEndIndex], () => {
    fetchExtInfoForDisplayedPods()
}, { immediate: true })

onMounted(() => {
    loadingPods.value = true
    errorPods.value = ''
    GetPods(null, 200)
        .then((data) => {
            podsRaw.value = data
            fetchExtInfoForDisplayedPods()
        })
        .finally(() => {
            loadingPods.value = false
        })
})
</script>

<style lang="scss" scoped>
.page {
    padding-top: 7rem;
    min-height: 100vh;
}

.pods-container {
    position: relative;
    margin: 0 auto;
}

/* Header — minimal */
.page-header {
    margin-bottom: 3rem;
    padding: 0;
}

.page-title {
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.95);
    margin: 0 0 0.35rem 0;
}

.page-desc {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.45);
    margin: 0;
    letter-spacing: 0.02em;
}

/* Panel — single line head */
.panel {
    position: relative;
    background: transparent;
    border: none;
    overflow: visible;
}

.panel-head {
    padding: 0 0 1.25rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    margin-bottom: 1.5rem;
}

.panel-count {
    font-size: 0.75rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.03em;
    text-transform: uppercase;
}

.panel-body {
    padding: 0;
}

/* Grid — more space */
.pod-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.25rem;
}

/* Card — minimal, flat */
.pod-card {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 1.5rem 1.5rem 1.25rem;
    transition: border-color 0.2s ease, background 0.2s ease;
}

.pod-card:hover {
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.03);
}

.card-main {
    flex: 1;
    min-width: 0;
}

.card-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}

.card-id {
    font-size: 0.7rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.04em;
    font-variant-numeric: tabular-nums;
}

.card-meta {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.02em;
}

.card-name {
    font-size: 1rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.92);
    margin: 0 0 0.6rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.01em;
}

.card-image {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0 0.85rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.4;
}

.card-specs {
    display: flex;
    flex-wrap: wrap;
    gap: 0 1.25rem;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
}

.card-foot {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
}

.card-foot-item {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.35);
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.truncate {
    max-width: 12em;
}

.mono {
    font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
}

/* States */
.state-loading,
.state-error,
.state-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.875rem;
    letter-spacing: 0.02em;
}

.loader-minimal {
    width: 20px;
    height: 20px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-top-color: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    margin-bottom: 1rem;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.state-error {
    color: rgba(248, 113, 113, 0.9);
}

/* Pagination — minimal */
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2.5rem;
    padding-top: 2rem;
}

.pagination-btn {
    padding: 0;
    font-size: 0.8rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: 0.03em;
    transition: color 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
    color: rgba(255, 255, 255, 0.9);
}

.pagination-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.pagination-info {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.35);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
}
</style>
