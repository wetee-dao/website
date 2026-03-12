<template>
    <div class="page gradient-body nodes-page">
        <div class="nodes-container container">
            <header class="page-header">
                <h1 class="page-title">{{ t('chain.nodesTitle') }}</h1>
                <p class="page-desc">{{ t('chain.nodesDesc') }}</p>
            </header>

            <!-- Secrets -->
            <section class="panel panel-secrets">
                <div class="panel-head">
                    <span class="panel-count">{{ normalizedSecrets.length }} {{ t('chain.nodesSecretsTitle') }}</span>
                </div>
                <div class="panel-body">
                    <template v-if="loadingSecrets">
                        <div class="state-loading state-loading--compact">
                            <div class="loader-minimal"></div>
                            <span>{{ t('chain.nodesLoadingSecrets') }}</span>
                        </div>
                    </template>
                    <template v-else-if="errorSecrets">
                        <div class="state-error state-error--compact">{{ errorSecrets }}</div>
                    </template>
                    <template v-else-if="normalizedSecrets.length === 0">
                        <div class="state-empty state-empty--compact">{{ t('chain.nodesNoSecrets') }}</div>
                    </template>
                    <template v-else>
                        <div class="node-grid node-grid--secrets">
                            <article v-for="(node, i) in normalizedSecrets" :key="'s-' + i" class="node-card">
                                <div class="card-head">
                                    <span class="card-id">#{{ node[0] }}</span>
                                    <span class="card-status">{{ t('chain.online') }}</span>
                                </div>
                                <p class="card-name">{{ node[1].name }}</p>
                                <div class="card-info">
                                    <p class="card-field mono">
                                        <span class="field-label">{{ t('chain.owner') }}</span>
                                        <span class="field-value">{{ node[1].owner }}</span>
                                    </p>
                                    <p class="card-field mono">
                                        <span class="field-label">{{ t('chain.p2pId') }}</span>
                                        <span class="field-value">{{ node[1].p2pId }}</span>
                                    </p>
                                    <p class="card-field mono">
                                        <span class="field-label">{{ t('chain.validatorId') }}</span>
                                        <span class="field-value">{{ node[1].validatorId }}</span>
                                    </p>
                                </div>
                            </article>
                        </div>
                    </template>
                </div>
            </section>

            <!-- Workers -->
            <section class="panel panel-workers">
                <div class="panel-head">
                    <span class="panel-count">{{ normalizedWorkers.length }} {{ t('chain.nodesWorkersTitle') }}</span>
                </div>
                <div class="panel-body">
                    <template v-if="loadingWorkers">
                        <div class="state-loading">
                            <div class="loader-minimal"></div>
                            <span>{{ t('chain.nodesLoadingWorkers') }}</span>
                        </div>
                    </template>
                    <template v-else-if="errorWorkers">
                        <div class="state-error">{{ errorWorkers }}</div>
                    </template>
                    <template v-else-if="normalizedWorkers.length === 0">
                        <div class="state-empty">{{ t('chain.nodesNoWorkers') }}</div>
                    </template>
                    <template v-else>
                        <div class="node-grid node-grid--workers">
                            <article v-for="(node, i) in workersDisplayed" :key="'w-' + (workersStartIndex + i)" class="node-card">
                                <div class="card-head">
                                    <span class="card-id">#{{ node[0] }}</span>
                                    <span class="card-status">Online</span>
                                </div>
                                <p class="card-name">{{ node[1].name }}</p>
                                <div class="card-info">
                                    <p class="card-field mono">
                                        <span class="field-label">Owner</span>
                                        <span class="field-value">{{ node[1].owner }}</span>
                                    </p>
                                    <p class="card-field mono">
                                        <span class="field-label">P2P ID</span>
                                        <span class="field-value">{{ node[1].p2pId }}</span>
                                    </p>
                                </div>
                            </article>
                        </div>
                        <div v-if="workersTotalPages > 1" class="pagination">
                            <button type="button" class="pagination-btn" :disabled="workersPage <= 1"
                                @click="workersPage = Math.max(1, workersPage - 1)">
                                {{ t('pods.previous') }}
                            </button>
                            <span class="pagination-info">{{ workersPage }} / {{ workersTotalPages }}</span>
                            <button type="button" class="pagination-btn" :disabled="workersPage >= workersTotalPages"
                                @click="workersPage = Math.min(workersTotalPages, workersPage + 1)">
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
import { GetNodes, GetWorkers } from '@/apis/main-chain'

const { t } = useI18n()

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
        .finally(() => {
            loadingSecrets.value = false
        })

    loadingWorkers.value = true
    errorWorkers.value = ''
    GetWorkers(null, 48)
        .then((data) => {
            workersRaw.value = data
        })
        .finally(() => {
            loadingWorkers.value = false
        })
})
</script>

<style lang="scss" scoped>
.page {
    padding-top: 7rem;
    min-height: 100vh;
}

.nodes-container {
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
    margin-bottom: 3rem;
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

/* Grid */
.node-grid--secrets {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.25rem;
}

.node-grid--workers {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.25rem;
}

/* Card — minimal, flat */
.node-card {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    padding: 1.5rem 1.5rem 1.25rem;
    transition: border-color 0.2s ease, background 0.2s ease;
}

.node-card:hover {
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.03);
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

.card-status {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.card-name {
    font-size: 1rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.92);
    margin: 0 0 1rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.01em;
}

.card-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.card-field {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin: 0;
}

.field-label {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.field-value {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.4;
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

.state-loading--compact,
.state-error--compact,
.state-empty--compact {
    min-height: 80px;
    flex-direction: row;
    gap: 0.75rem;
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

.state-loading--compact .loader-minimal {
    margin-bottom: 0;
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

/* Responsive */
@media (max-width: 768px) {
    .node-grid--secrets,
    .node-grid--workers {
        grid-template-columns: 1fr;
    }
}
</style>
