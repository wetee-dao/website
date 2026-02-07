<template>
    <div class="page gradient-body pods-page">
        <div class="pods-container container">
            <div class="page-header">
                <div class="title-row flex items-center gap-3">
                    <Svgimg class="chain-logo" name="applications" />
                    <h1 class="page-title">Trusted Applications</h1>
                    <span class="badge-live">
                        <span class="pulse"></span>
                        LIVE
                    </span>
                </div>
                <p class="page-desc">TEE trusted execution environment — Pod applications list</p>
            </div>

            <section class="panel panel-pods">
                <div class="panel-border"></div>
                <div class="panel-header">
                    <Svgimg class="panel-icon" name="applications" />
                    <div>
                        <h2 class="panel-title">Pods</h2>
                        <p class="panel-subtitle">
                            Trusted apps · {{ normalizedPods.length }} total, page {{ podsPage }} / {{ podsTotalPages }}
                        </p>
                    </div>
                    <span class="panel-count">{{ normalizedPods.length }}</span>
                </div>
                <div class="panel-body">
                    <template v-if="loadingPods">
                        <div class="state-loading">
                            <div class="scan-line"></div>
                            <div class="Waiting_loader__jL6XM w-12 h-12 mx-auto mb-4"></div>
                            <span>Loading trusted applications...</span>
                        </div>
                    </template>
                    <template v-else-if="errorPods">
                        <div class="state-error">{{ errorPods }}</div>
                    </template>
                    <template v-else-if="normalizedPods.length === 0">
                        <div class="state-empty">No trusted applications</div>
                    </template>
                    <template v-else>
                        <div class="pod-grid">
                            <div
                                v-for="(item, i) in podsDisplayed"
                                :key="'p-' + (podsStartIndex + i)"
                                class="pod-card"
                            >
                                <div class="card-accent"></div>
                                <div class="card-glow"></div>
                                <header class="card-header">
                                    <div class="card-title-row">
                                        <span class="card-id-badge">#{{ podId(item) }}</span>
                                        <span class="card-name" :title="podName(item) || 'Unnamed Pod'">{{ podName(item) || 'Unnamed Pod' }}</span>
                                    </div>
                                    <div class="card-badges">
                                        <span v-if="podField(item, 'ptype')" class="badge badge-type">{{ podField(item, 'ptype') }}</span>
                                        <span v-if="podField(item, 'teeType')" class="badge badge-tee">{{ podField(item, 'teeType') }}</span>
                                        <span class="badge badge-status">
                                            <span class="dot"></span>
                                            Running
                                        </span>
                                    </div>
                                </header>
                                <div class="card-body">
                                    <div class="card-section">
                                        <div class="card-row card-row--image">
                                            <span class="card-label">Image</span>
                                            <span class="card-value mono card-value--image" :title="podImage(item)">
                                                <template v-if="!hasExtInfo(podId(item)) && !podImage(item)">Loading…</template>
                                                <template v-else>{{ podImage(item) || '—' }}</template>
                                            </span>
                                        </div>
                                        <div class="card-specs-row">
                                            <span class="spec-pill"><em class="spec-icon">CPU</em> {{ podField(item, 'cpu') || '—' }}</span>
                                            <span class="spec-pill"><em class="spec-icon">Mem</em> {{ podField(item, 'mem') || '—' }}</span>
                                            <span class="spec-pill"><em class="spec-icon">GPU</em> {{ podField(item, 'gpu') || '0' }}</span>
                                        </div>
                                    </div>
                                    <div class="card-divider"></div>
                                    <div class="card-section card-section--meta">
                                        <div v-if="podField(item, 'startBlock')" class="card-row card-row--compact">
                                            <span class="card-label">Block</span>
                                            <span class="card-value mono">{{ podField(item, 'startBlock') }}</span>
                                        </div>
                                        <div v-if="podField(item, 'command') && podField(item, 'command') !== 'NONE'" class="card-row card-row--compact">
                                            <span class="card-label">Cmd</span>
                                            <span class="card-value mono truncate" :title="podField(item, 'command')">{{ podField(item, 'command') }}</span>
                                        </div>
                                        <div v-if="podOwner(item)" class="card-row card-row--owner">
                                            <span class="card-label">Owner</span>
                                            <span class="card-value mono truncate" :title="podOwner(item)">{{ podOwner(item) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="podsTotalPages > 1" class="pagination">
                            <button
                                type="button"
                                class="pagination-btn"
                                :disabled="podsPage <= 1"
                                @click="podsPage = Math.max(1, podsPage - 1)"
                            >
                                Previous
                            </button>
                            <span class="pagination-info">
                                {{ podsStartIndex + 1 }} – {{ podsEndIndex }} / {{ normalizedPods.length }}
                            </span>
                            <button
                                type="button"
                                class="pagination-btn"
                                :disabled="podsPage >= podsTotalPages"
                                @click="podsPage = Math.min(podsTotalPages, podsPage + 1)"
                            >
                                Next
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
import Svgimg from '@/components/svg/SvgImg.vue'
import { GetPods, GetPodExtInfo } from '@/apis/main-chain'

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
    padding-top: 100px;
    min-height: 100vh;
}

.pods-container {
    position: relative;
}

.pods-page::before {
    content: '';
    position: fixed;
    inset: 0;
    top: 80px;
    pointer-events: none;
    background-image:
        linear-gradient(rgba(65, 225, 128, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(65, 225, 128, 0.03) 1px, transparent 1px);
    background-size: 24px 24px;
    z-index: 0;
}

.page-header {
    position: relative;
    margin-bottom: 2rem;
    padding: 1rem 0;
}

.title-row {
    position: relative;
    z-index: 1;
}

.chain-logo {
    width: 36px;
    height: 36px;
    color: $primary-text;
    flex-shrink: 0;
}

.page-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: $primary-text;
    margin: 0;
    letter-spacing: 0.02em;
}

.badge-live {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.7rem;
    font-weight: 600;
    color: rgba($primary-text-rgb, 0.9);
    padding: 4px 10px;
    border: 1px solid rgba($primary-text-rgb, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $primary-text;
    animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
    0%, 100% {
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(65, 225, 128, 0.5);
    }
    50% { opacity: 0.8; }
    70% { box-shadow: 0 0 0 6px rgba(65, 225, 128, 0); }
}

.page-desc {
    margin: 0.5rem 0 0 0;
    font-size: 0.95rem;
    color: rgba($primary-text-rgb, 0.6);
    position: relative;
    z-index: 1;
}

.panel {
    position: relative;
    z-index: 1;
    background: rgba($primary-bg-rgb, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.06);
    overflow: hidden;
}

.panel-border {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(11, 175, 255, 0.15), transparent 40%, transparent 60%, rgba(11, 175, 255, 0.08));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
}

.panel-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    flex-wrap: wrap;
}

.panel-icon {
    width: 28px;
    height: 28px;
    color: $primary-text;
    flex-shrink: 0;
}

.panel-title {
    line-height: 1.1;
    font-size: 14px;
    font-weight: 700;
    color: $primary-text;
    margin: 0;
    flex: 1;
}

.panel-subtitle {
    font-size: 0.75rem;
    color: rgba($primary-text-rgb, 0.5);
    width: 100%;
}

.panel-count {
    font-variant-numeric: tabular-nums;
    font-size: 1rem;
    font-weight: 600;
    color: rgba($primary-text-rgb, 0.8);
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.05);
}

.panel-body {
    padding: 1rem 1.25rem;
    position: relative;
}

.pod-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1rem;
}

/* Card container */
.pod-card {
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(165deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.28) 100%);
    overflow: hidden;
    transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
}

.pod-card:hover {
    border-color: rgba(11, 175, 255, 0.3);
    box-shadow: 0 8px 32px rgba(11, 175, 255, 0.08), 0 0 0 1px rgba(11, 175, 255, 0.06);
    transform: translateY(-2px);
}

.card-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, rgba(11, 175, 255, 0.6), rgba(65, 225, 128, 0.4));
    opacity: 0.9;
}

.card-glow {
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
    background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(11, 175, 255, 0.15), transparent 70%);
}

.pod-card:hover .card-glow {
    opacity: 1;
}

/* Card header */
.card-header {
    padding: 1rem 1.25rem 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.card-title-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.6rem;
}

.card-id-badge {
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba($primary-text-rgb, 0.5);
    padding: 2px 8px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 6px;
}

.card-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: $primary-text;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.card-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}

.badge-type {
    background: rgba(11, 175, 255, 0.15);
    color: rgba(11, 175, 255, 0.95);
}

.badge-tee {
    background: rgba(65, 225, 128, 0.12);
    color: rgba(65, 225, 128, 0.9);
}

.badge-status {
    background: rgba(255, 255, 255, 0.06);
    color: rgba($primary-text-rgb, 0.75);
}

.badge-status .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 6px #22c55e;
    animation: pulse-dot 1.5s ease-in-out infinite;
}

/* Card body */
.card-body {
    padding: 1.1rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0;
}

.card-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.card-section--meta {
    gap: 0.35rem;
}

.card-divider {
    height: 1px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.06), transparent);
    margin: 0.75rem 0 0.5rem;
}

.card-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.75rem;
    line-height: 1.45;
}

.card-row--image {
    align-items: flex-start;
}

.card-row--compact {
    font-size: 0.72rem;
    line-height: 1.35;
}

.card-row--owner .card-value {
    font-size: 0.7rem;
}

.card-label {
    color: rgba($primary-text-rgb, 0.48);
    flex-shrink: 0;
    min-width: 3.8rem;
    font-size: 0.72rem;
}

.card-section--meta .card-label {
    min-width: 3.2rem;
}

.card-value {
    color: rgba($primary-text-rgb, 0.92);
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.card-value--image {
    -webkit-line-clamp: 2;
    line-clamp: 2;
    font-size: 0.72rem;
    color: rgba(11, 175, 255, 0.9);
}

.truncate {
    -webkit-line-clamp: 1;
    line-clamp: 1;
}

.card-specs-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
}

.spec-pill {
    font-size: 0.7rem;
    color: rgba($primary-text-rgb, 0.88);
    padding: 5px 10px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    font-variant-numeric: tabular-nums;
}

.spec-icon {
    font-style: normal;
    color: rgba($primary-text-rgb, 0.5);
    margin-right: 2px;
    font-size: 0.65rem;
}

.mono {
    font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
}

.state-loading,
.state-error,
.state-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 180px;
    color: rgba($primary-text-rgb, 0.5);
    font-size: 0.9rem;
}

.state-loading {
    position: relative;
}

.scan-line {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(65, 225, 128, 0.3), transparent);
    animation: scan 2s linear infinite;
}

@keyframes scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(180px); }
}

.state-error {
    color: #f87171;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.pagination-btn {
    padding: 6px 14px;
    font-size: 0.875rem;
    color: $primary-text;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
}

.pagination-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba($btn-color, 0.5);
}

.pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.pagination-info {
    font-size: 0.875rem;
    color: rgba($primary-text-rgb, 0.6);
    font-variant-numeric: tabular-nums;
}
</style>
