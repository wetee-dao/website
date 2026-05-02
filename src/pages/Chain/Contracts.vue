<template>
  <div class="page gradient-body">
    <div class="blocks container">
      <div class="chain-box">
        <div class="title-wrap">
          <PixelBg :tileSize="6" :gap="4" :maxOpacity="0.12" :density="0.4" />
          <div class="title-row">
            <MainchainContracts class="title-icon" />
            <h1 class="title">{{ t('chain.contractsTitle') }}</h1>
          </div>
        </div>
        <div class="panel-body">
          <div class="chain-grid">
            <article v-for="row in chainRowsView" :key="row.item.id" class="chain-card">
              <div class="card-top">
                <div class="chain-head">
                  <div class="chain-icon">
                    <img v-if="row.item.icon" :src="row.item.icon" :alt="row.item.name" />
                    <span v-else>{{ row.item.fallbackIcon }}</span>
                  </div>
                  <div>
                    <div class="chain-name">{{ row.item.name }}</div>
                    <div class="chain-subtitle">{{ row.item.description }}</div>
                  </div>
                </div>
              </div>
              <div class="chain-meta">
                <div class="chain-meta-fields">
                  <div class="meta-line">
                    <span class="meta-label">{{ t('chain.contractSource') }}</span>
                    <div class="meta-values">
                      <a
                        v-if="row.item.sourceUrl"
                        class="chip mono link-chip"
                        :href="row.item.sourceUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {{ row.item.sourceUrl }}
                      </a>
                      <span v-else class="chip mono">-</span>
                    </div>
                  </div>
                  <div class="meta-line">
                    <span class="meta-label">{{ t('chain.supportedAssets') }}</span>
                    <div class="meta-values">
                      <span v-for="asset in row.item.assets" :key="asset" class="chip">{{ asset }}</span>
                    </div>
                  </div>
                  <div class="meta-line">
                    <span class="meta-label">{{ t('chain.supportedWallets') }}</span>
                    <div class="meta-values">
                      <span v-for="wallet in row.item.wallets" :key="wallet.name" class="wallet-chip">
                        <img :src="wallet.icon" :alt="wallet.name" />
                        <span>{{ wallet.name }}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="chain-meta-contracts">
                  <div class="contract-action-list contract-action-list--vertical">
                    <template v-for="c in row.contractRows" :key="c.key">
                      <a
                        v-if="c.href"
                        class="card-action card-action-link contract-action-row"
                        :href="c.href"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div class="contract-action-row-body">
                          <span class="contract-action-kind">{{ c.label }}</span>
                          <span class="contract-action-addr mono">{{ c.address }}</span>
                        </div>
                        <span class="contract-action-arrow" aria-hidden="true">↗</span>
                      </a>
                      <div v-else class="card-action contract-action-static contract-action-row">
                        <div class="contract-action-row-body">
                          <span class="contract-action-kind">{{ c.label }}</span>
                          <span class="contract-action-addr mono">{{ c.address }}</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-4"></div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Footer from '@/components/Footer.vue'
import PixelBg from '@/components/anim/PixelBg.vue'
import MainchainContracts from '@/components/svg/MainchainContracts.vue'
import { fetchChainContractsSlice } from '@/apis/chain-info'

const { t } = useI18n()

interface ChainRow {
  id: string
  name: string
  icon?: string
  fallbackIcon: string
  description: string
  cloudContract: string
  subnetContract: string
  sourceUrl: string
  apiUrl: string
  assets: string[]
  wallets: { name: string; icon: string }[]
  integrated: boolean
}

/** 主链 id：仅此卡片合并接口返回的 cloud / subnet / token */
const MAIN_CHAIN_ID = '1'

/** 各链「合约地址」在浏览器中的账户页模板；`{address}` 为接口/页面中的地址（0x 会统一小写以匹配 Subscan） */
const ACCOUNT_EXPLORER: Record<string, (address: string) => string> = {
  [MAIN_CHAIN_ID]: (address) => {
    const a = address.trim()
    const path = /^0x[0-9a-fA-F]+$/i.test(a) ? a.toLowerCase() : encodeURIComponent(a)
    return `https://assethub-paseo.subscan.io/account/${path}?tab=pvm_call`
  },
  '2': (address) => `https://etherscan.io/address/${address.trim()}`,
  '3': (address) => `https://bscscan.com/address/${address.trim()}`,
  '4': (address) => `https://solscan.io/account/${encodeURIComponent(address.trim())}`,
}

function contractExplorerHref(chainId: string, value: string): string | null {
  const v = (value ?? '').trim()
  if (!v || v === '-') return null
  const build = ACCOUNT_EXPLORER[chainId]
  if (!build) return null
  return build(v)
}

interface ContractRowVm {
  key: string
  label: string
  address: string
  href: string | null
}

/** 主链展示 Cloud + Subnet；其他链仅 Cloud（无 Subnet 合约） */
function contractDisplayRows(item: ChainRow): ContractRowVm[] {
  const rows: ContractRowVm[] = [
    {
      key: 'cloud',
      label: t('chain.contractCloud'),
      address: item.cloudContract,
      href: contractExplorerHref(item.id, item.cloudContract),
    },
  ]
  if (item.id === MAIN_CHAIN_ID) {
    rows.push({
      key: 'subnet',
      label: t('chain.contractSubnet'),
      address: item.subnetContract,
      href: contractExplorerHref(item.id, item.subnetContract),
    })
  }
  return rows
}

function staticRows(): ChainRow[] {
  const base = (): Omit<ChainRow, 'id' | 'name' | 'icon' | 'fallbackIcon' | 'description' | 'assets' | 'wallets'> => ({
    cloudContract: '-',
    subnetContract: '-',
    sourceUrl: '',
    apiUrl: '',
    integrated: false,
  })

  return [
    {
      ...base(),
      id: MAIN_CHAIN_ID,
      name: 'POLKAODOT',
      icon: '/imgs/polkadot_mini.svg',
      fallbackIcon: 'P',
      description: 'Polkadot 具备共享安全、平行链互操作与链上治理升级能力。',
      sourceUrl: 'https://github.com/wetee-dao/contract/tree/main/revives',
      apiUrl: '',
      assets: ['DOT', 'USDT', 'USDC'],
      wallets: [
        { name: 'MetaMask', icon: '/imgs/metamask.svg' },
        { name: 'SubWallet', icon: '/imgs/subwallet-official.svg' },
        { name: 'Polkadot.js', icon: '/imgs/polkadot-js-official.svg' },
      ],
    },
    {
      ...base(),
      id: '2',
      name: 'ETH',
      icon: '/imgs/eth-official.svg',
      fallbackIcon: 'E',
      description: 'Ethereum 具备成熟的智能合约生态与广泛的钱包及资产支持。',
      sourceUrl: 'https://github.com/wetee-dao/contract/tree/main/evms',
      assets: ['ETH', 'USDT', 'USDC'],
      wallets: [{ name: 'MetaMask', icon: '/imgs/metamask.svg' }],
    },
    {
      ...base(),
      id: '3',
      name: 'BNB',
      icon: '/imgs/bnb-official.svg',
      fallbackIcon: 'B',
      description: 'BNB Chain 具备高兼容 EVM 生态与常见稳定币资产接入能力。',
      sourceUrl: 'https://github.com/wetee-dao/contract/tree/main/evms',
      assets: ['BNB', 'USDT', 'USDC'],
      wallets: [{ name: 'MetaMask', icon: '/imgs/metamask.svg' }],
    },
    {
      ...base(),
      id: '4',
      name: 'SOL',
      icon: '/imgs/sol-official.svg',
      fallbackIcon: 'S',
      description: 'Solana 具备高吞吐链上执行能力与主流资产钱包生态支持。',
      assets: ['SOL', 'USDT', 'USDC'],
      wallets: [{ name: 'MetaMask', icon: '/imgs/metamask.svg' }],
    },
  ]
}

const chainItems = ref<ChainRow[]>(staticRows())

const chainRowsView = computed(() =>
  chainItems.value.map((item) => ({
    item,
    contractRows: contractDisplayRows(item),
  })),
)

onMounted(async () => {
  try {
    const slice = await fetchChainContractsSlice()
    const info = slice[0]
    if (!info) return

    const cloud = (info.cloud_contract ?? '').trim()
    const subnet = (info.subnet_contract ?? '').trim()
    const tokens = info.token?.filter(Boolean) ?? []

    chainItems.value = chainItems.value.map((row) => {
      if (row.id !== MAIN_CHAIN_ID) return row
      const integrated = Boolean(cloud && subnet)
      return {
        ...row,
        cloudContract: cloud || '-',
        subnetContract: subnet || '-',
        assets: tokens.length ? [...tokens] : row.assets,
        integrated,
      }
    })
  } catch {
    /* GraphqlClient 已 toast；页面保留静态展示 */
  }
})
</script>

<style lang="scss" scoped>
.page {
  padding-top: 100px;
}

.blocks {
  border: 1px solid rgba(255, 255, 255, 0.06);
  min-height: calc(100vh - 140px);
}

.chain-box {
  background-color: rgba($primary-bg-rgb, 0.42);

  .title-wrap {
    position: relative;
    overflow: hidden;
    padding: 40px 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .title {
    position: relative;
    z-index: 1;
    margin: 0;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: rgba(255, 255, 255, 0.94);
  }
}

.title-row {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  width: 30px;
  height: 30px;
  color: $primary-text;
}

.chain-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 16px;
}

.chain-card {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 24px;
  &:last-child {
    border-bottom: none;
  }
}

.card-top {
  margin-bottom: 16px;
}

.contract-action-list {
  &--vertical {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    width: 100%;
  }
}

.contract-action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  white-space: normal;
  text-align: left;
}

.contract-action-row-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  min-width: 0;
  flex: 1;
}

.contract-action-kind {
  font-size: 11px;
  font-weight: 600;
  color: rgba(15, 17, 21, 0.55);
}

.contract-action-addr {
  font-size: 12px;
  line-height: 1.4;
  word-break: break-all;
  color: #0f1115;
}

.contract-action-arrow {
  flex-shrink: 0;
  align-self: center;
  font-size: 13px;
  line-height: 1;
  color: #0f1115;
}

.contract-action-static {
  opacity: 0.78;
  cursor: default;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.72);
  color: #0f1115;
}

a.card-action.card-action-link {
  text-decoration: none;
  color: #0f1115;

  &:hover {
    opacity: 0.92;
  }
}

.chain-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.chain-head > div:last-child {
  flex: 1;
  min-width: 0;
}

.chain-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    color: rgba(255, 255, 255, 0.88);
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.chain-name {
  color: rgba(255, 255, 255, 0.92);
  font-size: 19px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.chain-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  line-height: 1.5;
  max-width: 100%;
}

.card-action {
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.92);
  color: #0f1115;
  font-size: 12px;
  font-weight: 500;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.72;
    cursor: not-allowed;
  }
}

.chain-meta {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(14rem, 24rem);
  gap: 16px 28px;
  align-items: start;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

@media (max-width: 800px) {
  .chain-meta {
    grid-template-columns: 1fr;
  }
}

.chain-meta-fields {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.chain-meta-contracts {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
  width: 100%;

  .card-action.contract-action-row {
    padding: 5px 8px;
    white-space: normal;
    align-items: center;
  }
}

.meta-line {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-label {
  width: 88px;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.52);
  font-size: 12px;
}

.meta-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.card-desc {
  margin: 0 0 16px;
  color: rgba(255, 255, 255, 0.68);
  font-size: 14px;
  line-height: 1.6;
  max-width: 760px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.76);
  font-size: 13px;
  line-height: 1.1;
}

.link-chip {
  max-width: 100%;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.wallet-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.02);

  img {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  span {
    color: rgba(255, 255, 255, 0.76);
    font-size: 13px;
    line-height: 1;
  }
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.panel-desc {
  color: rgba($secondary-text-rgb, 0.78);
  font-size: 0.9rem;
  line-height: 1.6;
}

</style>
