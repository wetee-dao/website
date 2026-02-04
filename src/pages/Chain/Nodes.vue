<template>
    <div class="page gradient-body nodes-page">
        <div class="nodes-container container">
            <!-- Page header -->
            <div class="page-header">
                <div class="title-row flex items-center gap-3">
                    <Svgimg class="chain-logo" name="lineblock" />
                    <h1 class="page-title">Network Nodes</h1>
                    <span class="badge-live">
                        <span class="pulse"></span>
                        LIVE
                    </span>
                </div>
                <p class="page-desc">Consensus nodes & runtime workers — live topology</p>
            </div>

            <!-- Secrets: compact top strip -->
            <section class="panel panel-secrets">
                <div class="panel-border"></div>
                <div class="panel-header panel-header--compact">
                    <Svgimg class="panel-icon" name="secret" />
                    <div>
                        <h2 class="panel-title">Secrets</h2>
                        <p class="panel-subtitle">Blockchain consensus nodes · block production & validation</p>
                    </div>
                    <span class="panel-count">{{ normalizedSecrets.length }}</span>
                </div>
                <div class="panel-body panel-body--compact">
                    <template v-if="loadingSecrets">
                        <div class="state-loading state-loading--compact">
                            <div class="Waiting_loader__jL6XM w-8 h-8"></div>
                            <span>Loading consensus nodes...</span>
                        </div>
                    </template>
                    <template v-else-if="errorSecrets">
                        <div class="state-error state-error--compact">{{ errorSecrets }}</div>
                    </template>
                    <template v-else-if="normalizedSecrets.length === 0">
                        <div class="state-empty state-empty--compact">No consensus nodes</div>
                    </template>
                    <template v-else>
                        <div class="node-grid node-grid--secrets">
                            <div v-for="(node, i) in normalizedSecrets" :key="'s-' + i"
                                class="node-card node-card-secret node-card--compact">
                                <div class="card-glow"></div>
                                <div class="card-index">#{{ node[0] }} {{ node[1].name }}</div>
                                <div class="card-status">
                                    <span class="dot"></span>
                                    <span>Online</span>
                                </div>
                                <div class="card-id mono" > Owner: {{ node[1].owner }}</div>
                                <div class="card-id mono" > P2P ID: {{ node[1].p2pId }}</div>
                                <div class="card-id mono" > Validator ID: {{ node[1].validatorId }}</div>
                            </div>
                        </div>
                    </template>
                </div>
            </section>

            <!-- Workers: main area + pagination -->
            <section class="panel panel-workers">
                <div class="panel-border"></div>
                <div class="panel-header">
                    <Svgimg class="panel-icon" name="applications" />
                    <div>
                        <h2 class="panel-title">Workers</h2>
                        <p class="panel-subtitle">Runtime workers · {{ normalizedWorkers.length }} total, page {{
                            workersPage }} /
                            {{ workersTotalPages }}</p>
                    </div>
                    <span class="panel-count">{{ normalizedWorkers.length }}</span>
                </div>
                <div class="panel-body">
                    <template v-if="loadingWorkers">
                        <div class="state-loading">
                            <div class="scan-line"></div>
                            <div class="Waiting_loader__jL6XM w-12 h-12 mx-auto mb-4"></div>
                            <span>Loading workers...</span>
                        </div>
                    </template>
                    <template v-else-if="errorWorkers">
                        <div class="state-error">{{ errorWorkers }}</div>
                    </template>
                    <template v-else-if="normalizedWorkers.length === 0">
                        <div class="state-empty">No workers</div>
                    </template>
                    <template v-else>
                        <div class="node-grid node-grid--workers">
                            <div v-for="(node, i) in workersDisplayed" :key="'w-' + (workersStartIndex + i)"
                                class="node-card node-card-worker">
                                <div class="card-glow"></div>
                                <div class="card-index">#{{ node[0] }} {{ node[1].name }}</div>
                                <div class="card-status">
                                    <span class="dot"></span>
                                    <span>Online</span>
                                </div>
                                <div class="card-id mono" > Owner: {{ node[1].owner }}</div>
                                <div class="card-id mono" > P2P ID: {{ node[1].p2pId }}</div>
                            </div>
                        </div>
                        <!-- Pagination -->
                        <div v-if="workersTotalPages > 1" class="pagination">
                            <button type="button" class="pagination-btn" :disabled="workersPage <= 1"
                                @click="workersPage = Math.max(1, workersPage - 1)">
                                Previous
                            </button>
                            <span class="pagination-info">
                                {{ workersStartIndex + 1 }} – {{ workersEndIndex }} / {{ normalizedWorkers.length }}
                            </span>
                            <button type="button" class="pagination-btn" :disabled="workersPage >= workersTotalPages"
                                @click="workersPage = Math.min(workersTotalPages, workersPage + 1)">
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
import { GetNodes, GetWorkers } from '@/apis/main-chain'

const secretsRaw = ref<any>(null)
const workersRaw = ref<any>(null)
const loadingSecrets = ref(true)
const loadingWorkers = ref(true)
const errorSecrets = ref('')
const errorWorkers = ref('')

function toArray(val: any): any[] {
    if (val == null) return []
    if (Array.isArray(val)) return val
    if (typeof val === 'object' && !Array.isArray(val)) return Object.values(val)

    return [val]
}

function nodeId(node: any): string {
    if (node == null) return '—'
    if (typeof node === 'string') return node
    if (node.id != null) return String(node.id)
    if (node.address != null) return String(node.address)
    if (node.pubkey != null) return String(node.pubkey)
    return JSON.stringify(node).slice(0, 42) + '…'
}

const normalizedSecrets = computed(() => toArray(secretsRaw.value))
const normalizedWorkers = computed(() => toArray(workersRaw.value))

// Workers pagination: page size
const workersPageSize = 48
const workersPage = ref(1)
const workersTotalPages = computed(() =>
    Math.max(1, Math.ceil(normalizedWorkers.value.length / workersPageSize))
)
const workersStartIndex = computed(() => (workersPage.value - 1) * workersPageSize)
const workersEndIndex = computed(() =>
    Math.min(workersPage.value * workersPageSize, normalizedWorkers.value.length)
)
const workersDisplayed = computed(() =>
    normalizedWorkers.value.slice(workersStartIndex.value, workersEndIndex.value)
)

watch(workersTotalPages, (total) => {
    if (workersPage.value > total) workersPage.value = Math.max(1, total)
})

onMounted(() => {
    loadingSecrets.value = true
    errorSecrets.value = ''
    GetNodes()
        .then((data) => {
            secretsRaw.value = data
        })
        .catch((e) => {
            errorSecrets.value = e?.message || 'Failed to load consensus nodes'
        })
        .finally(() => {
            loadingSecrets.value = false
        })

    loadingWorkers.value = true
    errorWorkers.value = ''
    GetWorkers(null, 48)
        .then((data) => {
            console.log("getWorkers", data)
            workersRaw.value = data
        })
        .finally(() => {
            loadingWorkers.value = false
        })
})
</script>

<style lang="scss" scoped>
.page {
    padding-top: 100px;
    min-height: 100vh;
}

.nodes-container {
    position: relative;
}

/* Tech grid background */
.nodes-page::before {
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

    0%,
    100% {
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(65, 225, 128, 0.5);
    }

    50% {
        opacity: 0.8;
    }

    70% {
        box-shadow: 0 0 0 6px rgba(65, 225, 128, 0);
    }
}

.page-desc {
    margin: 0.5rem 0 0 0;
    font-size: 0.95rem;
    color: rgba($primary-text-rgb, 0.6);
    position: relative;
    z-index: 1;
}

/* Secrets compact top strip */
.panel-secrets {
    margin-bottom: 1.5rem;
    min-height: 0;
}

.panel-header--compact {
    padding: 0.75rem 1.25rem;
}

.panel-header--compact .panel-subtitle {
    padding-left: 0;
    margin-top: 0;
}

.panel-body--compact {
    padding: 0.75rem 1.25rem;
    min-height: 0;
}

.state-loading--compact,
.state-error--compact,
.state-empty--compact {
    min-height: 80px;
    flex-direction: row;
    gap: 0.75rem;
}

/* Secrets horizontal scroll row */
.node-grid--secrets {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.75rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 4px;
    scrollbar-width: thin;
}

.node-grid--secrets::-webkit-scrollbar {
    height: 6px;
}

.node-grid--secrets::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
}

.node-card--compact {
    flex: 0 0 auto;
    width: 200px;
    min-width: 200px;
    padding: 0.75rem;
}

/* Workers main area */
.panel-workers {
    position: relative;
    z-index: 1;
}

.panel {
    position: relative;
    background: rgba($primary-bg-rgb, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.06);
    overflow: hidden;
}

.panel-border {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(65, 225, 128, 0.15), transparent 40%, transparent 60%, rgba(65, 225, 128, 0.08));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
}

.panel-workers .panel-border {
    background: linear-gradient(135deg, rgba(11, 175, 255, 0.15), transparent 40%, transparent 60%, rgba(11, 175, 255, 0.08));
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

/* Workers grid: multi-column */
.node-grid--workers {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
}

/* Pagination */
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
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(180px);
    }
}

.state-error {
    color: #f87171;
}

/* Node cards */
.node-grid {
    gap: 0.75rem;
}

.node-card {
    position: relative;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.2);
    transition: border-color 0.2s, box-shadow 0.2s;
}

.node-card:hover {
    border-color: rgba(65, 225, 128, 0.25);
    box-shadow: 0 0 20px rgba(65, 225, 128, 0.06);
}

.node-card-worker:hover {
    border-color: rgba(11, 175, 255, 0.25);
    box-shadow: 0 0 20px rgba(11, 175, 255, 0.06);
}

.card-glow {
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
}

.node-card-secret .card-glow {
    background: radial-gradient(circle at 50% 0%, rgba(65, 225, 128, 0.12), transparent 70%);
}

.node-card-worker .card-glow {
    background: radial-gradient(circle at 50% 0%, rgba(11, 175, 255, 0.12), transparent 70%);
}

.node-card:hover .card-glow {
    opacity: 1;
}

.card-index {
    font-size: 18px;
    font-variant-numeric: tabular-nums;
    color: rgba($primary-text-rgb, 0.5);
    margin-bottom: 6px;
}

.card-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.7rem;
    color: rgba($primary-text-rgb, 0.7);
    margin-bottom: 8px;
}

.card-status .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $primary-text;
    flex-shrink: 0;
}

.node-card-worker .card-status .dot {
    background: $btn-color;
}

.card-id {
    font-size: 0.75rem;
    color: $primary-text;
    word-break: break-all;
    line-height: 1.35;
    max-height: 2.7em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
}

.mono {
    font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
}
</style>
