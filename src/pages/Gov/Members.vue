<template>
  <div class="page gradient-body">
    <div class="gov-layout container flex mb-4 flex-col lg:flex-row gap-4">
      <GovSidebar />

      <main class="gov-main flex-1 min-w-0">
        <div class="chain-box main-box">
          <div class="title-wrap title-wrap--pixel flex flex-wrap justify-between items-center gap-4">
            <div class="title-pixel-bg" aria-hidden="true">
              <PixelBg :tile-size="6" :gap="4" :max-opacity="0.08" :density="0.18" :wave-speed="0.0014" />
            </div>
            <div class="relative z-[1]">
              <h1 class="page-title">{{ t('govMembers.title') }}</h1>
              <p class="page-subtitle">{{ t('govMembers.subtitle') }}</p>
            </div>
            <div class="flex gap-3">
              <UButton
                v-if="!isMember" 
                class="p-3" 
                color="neutral"
                variant="solid"
                size="lg"
                type="button"
                :disabled="!publicJoin || joining"
                @click="handleJoin"
              >
                {{ joining ? '...' : (publicJoin ? t('govMembers.join') : t('govMembers.publicJoin') + ' ' + t('common.disabled')) }}
              </UButton>
              <UButton
                v-else 
                class="p-3" 
                color="neutral"
                variant="outline"
                size="lg"
                type="button"
                :disabled="leaving"
                @click="handleLeave"
              >
                {{ leaving ? '...' : t('govMembers.leave') }}
              </UButton>
            </div>
          </div>

          <!-- 成员统计 -->
          <div class="stats-bar p-5 lg:p-8 border-b border-white-4">
            <div class="stat-item">
              <span class="stat-label">{{ t('govMembers.totalMembers') }}</span>
              <span class="stat-value">{{ members.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">{{ t('govMembers.publicJoin') }}</span>
              <span class="stat-value">{{ publicJoin ? t('common.yes') : t('common.no') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">{{ t('govMembers.myBalance') }}</span>
              <span class="stat-value">{{ myBalance }}</span>
            </div>
          </div>

          <!-- 成员列表 -->
          <div class="members-section p-5 lg:p-8">
            <h3 class="section-title">{{ t('govMembers.memberList') }}</h3>
            <div class="members-list">
              <div v-for="m in members" :key="m.account.v" class="member-item">
                <div class="member-info flex flex-row" v-if="m.account.t == 1">
                  <div class="member-address-row">
                    <!-- Polkadot 账户显示 identicon -->
                    <PolkadotIdenticon 
                      class="member-icon"
                      :address="hexToSS58(m.account.v)"
                    />
                    <span class="member-address">
                      {{ hexToSS58(m.account.v)}}
                    </span>
                  </div>
                  <span class="member-balance">{{ formatBalanceValue(m.balance) }}</span>
                </div>
                <UBadge v-if="getMemberSS58(m) === myAddress" class="member-badge" color="neutral" variant="subtle" size="sm">
                  {{ t('govMembers.you') }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div class="pb-4" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GovSidebar from './GovSidebar.vue'
import PixelBg from '@/components/anim/PixelBg.vue'
import PolkadotIdenticon from '@/components/PolkadotIdenticon.vue'
import { SecretContractApi } from '@/apis/contract'
import { BN } from '@polkadot/util'
import { $getTxProvider } from '@/plugins/chain'
import type { WalletWrap } from '@/providers'
import { hexToSS58 } from '@/utils/chain'

const { t } = useI18n()

const WTE = 1_000_000_000_000 // 10^12 decimals

// 格式化余额
function formatBalanceValue(value: any): string {
  if (!value) return '0'
  try {
    const bn = new BN(String(value).replace(/,/g, ''))
    const formatted = bn.toString()
    return formatted.toLocaleString() + ' VOTE'
  } catch {
    return String(value)
  }
}

// 获取成员的 ss58 地址
function getMemberSS58(m: any): string {
  if (m.account.t === 1) {
    return hexToSS58(m.account.v)
  }
  return m.account.v
}

const members = ref<any[]>([])
const isMember = ref(false)
const myAddress = ref('')
const myBalance = ref('0')
const publicJoin = ref(false)
const joining = ref(false)
const leaving = ref(false)

async function loadData() {
  try {
    // 加载成员列表
    const membersResult = await SecretContractApi.members()
    if (membersResult && Array.isArray(membersResult)) {
      members.value = membersResult
    }

    // 检查是否允许公开加入
    const publicJoinResult = await SecretContractApi.getPublicJoin()
    if (publicJoinResult !== undefined) {
      publicJoin.value = publicJoinResult as boolean
    }

    // 获取当前用户地址
    const userInfo = SecretContractApi.getCallerInfo()
    if (userInfo && userInfo.addr) {
      myAddress.value = userInfo.addr
      
      // 检查是否是成员
      const balanceResult = await SecretContractApi.balanceOf(userInfo.addr)
      if (balanceResult !== undefined && balanceResult !== null) {
        myBalance.value = formatBalanceValue(balanceResult)
        // 检查是否是成员（余额 > 0）
        try {
          const bn = new BN(String(balanceResult).replace(/,/g, ''))
          isMember.value = bn.gt(new BN(0))
        } catch {
          isMember.value = false
        }
      }
    }
  } catch (error) {
    console.error('Failed to load members data:', error)
  }
}

async function handleJoin() {
  if (joining.value) return
  try {
    joining.value = true
    await $getTxProvider(async (wallet: WalletWrap) => {
      // 使用 publicJoin 方法公开加入 DAO
      await SecretContractApi.publicJoin(wallet)
    })
    loadData()
  } catch (error) {
    console.error('Failed to join:', error)
  } finally {
    joining.value = false
  }
}

async function handleLeave() {
  if (leaving.value) return
  try {
    leaving.value = true
    await $getTxProvider(async (wallet: WalletWrap) => {
      await SecretContractApi.leave(wallet)
    })
    loadData()
  } catch (error) {
    console.error('Failed to leave:', error)
  } finally {
    leaving.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.page {
  padding-top: 100px;
}

.gov-layout {
  min-height: calc(100vh - 230px);
}

.chain-box {
  background-color: rgba($primary-bg-rgb, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.main-box {
  .title-wrap {
    padding: 28px 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .title-wrap--pixel {
    position: relative;
    overflow: hidden;
  }

  .title-pixel-bg {
    position: absolute;
    inset: 0;
    opacity: 0.65;
    filter: blur(0.15px);
    -webkit-mask-image: radial-gradient(90% 140% at 50% 0%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 72%);
    mask-image: radial-gradient(90% 140% at 50% 0%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 72%);
  }

  .page-title {
    font-size: 18px;
    font-weight: 500;
    color: $primary-text;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }

  .page-subtitle {
    font-size: 13px;
    color: rgba($secondary-text-rgb, 0.6);
    margin: 0;
    font-weight: 400;
  }

  .mbtn {
    font-size: 13px;
    padding: 0 20px;
    margin: 0;
    width: auto;
    
    border: 1px solid rgba($secondary-text-rgb, 0.2);
    background: transparent;
    color: rgba($secondary-text-rgb, 0.7);
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 400;

    &:hover {
      border-color: rgba($secondary-text-rgb, 0.4);
      color: $primary-text;
    }

    &--primary {
      background: rgba(255, 255, 255, 0.08);
      color: $primary-text;
      border-color: transparent;
    }

    &--danger {
      background: rgba(244, 67, 54, 0.1);
      color: #ef5350;
      border-color: rgba(244, 67, 54, 0.3);
    }
  }
}

.border-white-4 {
  border-color: rgba(255, 255, 255, 0.04);
}

.stats-bar {
  display: flex;
  gap: 48px;

  .stat-item {
    .stat-label {
      display: block;
      font-size: 11px;
      color: rgba($secondary-text-rgb, 0.4);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 15px;
      font-weight: 500;
      color: $primary-text;
    }
  }
}

.members-section {
  .section-title {
    font-size: 11px;
    font-weight: 500;
    color: rgba($secondary-text-rgb, 0.4);
    margin: 0 0 16px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .members-list {
    .member-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.05);

      &:last-child {
        border-bottom: none;
      }

      .member-info {
        width: 100%;
        align-items: center;

        .member-address-row {
          display: flex;
          flex:1;

          .member-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
          }

          .member-address {
            margin-left: 15px;
            font-size: 14px;
            line-height: 40px;
            color: $secondary-text;
            font-family: monospace;
          }
        }

        .member-balance {
          font-size: 13px;
          color: rgba($secondary-text-rgb, 0.5);
        }
      }

      .member-badge {
        padding: 2px 8px;
        font-size: 10px;
        background: rgba(255, 255, 255, 0.08);
        color: rgba($secondary-text-rgb, 0.6);
        
      }
    }
  }
}
</style>
