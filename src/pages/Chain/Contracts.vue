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
            <article v-for="item in chainItems" :key="item.id" class="chain-card">
              <div class="card-top">
                <div class="chain-head">
                  <div class="chain-icon">
                    <img v-if="item.icon" :src="item.icon" :alt="item.name" />
                    <span v-else>{{ item.fallbackIcon }}</span>
                  </div>
                  <div>
                    <div class="chain-name">{{ item.name }}</div>
                    <div class="chain-subtitle">{{ item.description }}</div>
                  </div>
                </div>
                <button class="card-action" type="button" :disabled="!item.apiUrl">
                  <span>{{ item.contract !== '-' ? t('chain.contractsStatusActive') : t('chain.contractsStatusPending') }}</span>
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
              <div class="chain-meta">
                <div class="meta-line">
                  <span class="meta-label">{{ t('chain.contractAddress') }}</span>
                  <span class="chip mono">{{ item.contract }}</span>
                </div>
                <div class="meta-line">
                  <span class="meta-label">{{ t('chain.contractSource') }}</span>
                  <div class="meta-values">
                    <a
                      v-if="item.sourceUrl"
                      class="chip mono link-chip"
                      :href="item.sourceUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ item.sourceUrl }}
                    </a>
                    <span v-else class="chip mono">-</span>
                  </div>
                </div>
                <div class="meta-line">
                  <span class="meta-label">{{ t('chain.supportedAssets') }}</span>
                  <div class="meta-values">
                    <span v-for="asset in item.assets" :key="asset" class="chip">{{ asset }}</span>
                  </div>
                </div>
                <div class="meta-line">
                  <span class="meta-label">{{ t('chain.supportedWallets') }}</span>
                  <div class="meta-values">
                    <span v-for="wallet in item.wallets" :key="wallet.name" class="wallet-chip">
                      <img :src="wallet.icon" :alt="wallet.name" />
                      <span>{{ wallet.name }}</span>
                    </span>
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
import { useI18n } from 'vue-i18n'
import Footer from '@/components/Footer.vue'
import PixelBg from '@/components/anim/PixelBg.vue'
import MainchainContracts from '@/components/svg/MainchainContracts.vue'

const { t } = useI18n()

const chainItems = [
  {
    id: '1',
    name: 'POLKAODOT',
    icon: '/imgs/polkadot_mini.svg',
    fallbackIcon: 'P',
    description: 'Polkadot 具备共享安全、平行链互操作与链上治理升级能力。',
    contract: '0x0b974c94f5ad06c4236efaed5a962cce3ddfbc18',
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
    id: '2',
    name: 'ETH',
    icon: '/imgs/eth-official.svg',
    fallbackIcon: 'E',
    description: 'Ethereum 具备成熟的智能合约生态与广泛的钱包及资产支持。',
    contract: '-',
    sourceUrl: '',
    apiUrl: '',
    assets: ['ETH', 'USDT', 'USDC'],
    wallets: [
      { name: 'MetaMask', icon: '/imgs/metamask.svg' },
    ],
  },
  {
    id: '3',
    name: 'BNB',
    icon: '/imgs/bnb-official.svg',
    fallbackIcon: 'B',
    description: 'BNB Chain 具备高兼容 EVM 生态与常见稳定币资产接入能力。',
    contract: '-',
    sourceUrl: '',
    apiUrl: '',
    assets: ['BNB', 'USDT', 'USDC'],
    wallets: [
      { name: 'MetaMask', icon: '/imgs/metamask.svg' },
    ],
  },
  {
    id: '4',
    name: 'SOL',
    icon: '/imgs/sol-official.svg',
    fallbackIcon: 'S',
    description: 'Solana 具备高吞吐链上执行能力与主流资产钱包生态支持。',
    contract: '-',
    sourceUrl: '',
    apiUrl: '',
    assets: ['SOL', 'USDT', 'USDC'],
    wallets: [
      { name: 'MetaMask', icon: '/imgs/metamask.svg' },
    ],
  },
]
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
  border-radius: 18px;
  padding: 24px;
  &:last-child {
    border-bottom: none;
  }
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.chain-head {
  display: flex;
  align-items: center;
  gap: 10px;
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
}

.card-action {
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.92);
  color: #0f1115;
  font-size: 12px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 9px;
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
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-line {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-label {
  width: 60px;
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
  border-radius: 10px;
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
  border-radius: 10px;

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
