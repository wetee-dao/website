<template>
  <aside class="gov-sidebar shrink-0 lg:w-32">
    <div class="chain-box sidebar-box pb-4">
      <div class="sidebar-title">{{ t('gov.governance') }}</div>
      <nav class="sidebar-nav">
        <RouterLink to="/gov/overview" class="nav-item" :class="{ active: isOverviewActive }">
          {{ t('gov.overview') }}
        </RouterLink>
        <RouterLink to="/gov/members" class="nav-item" :class="{ active: isMembersActive }">
          {{ t('gov.members') }}
        </RouterLink>
        <RouterLink to="/gov" class="nav-item" :class="{ active: isReferendaActive }">
          {{ t('gov.referenda') }}
        </RouterLink>
        <RouterLink to="/gov/tracks" class="nav-item" :class="{ active: isTracksActive }">
          {{ t('gov.tracks') }}
        </RouterLink>
      </nav>
      <div class="sidebar-divider" />
      <div class="sidebar-title">{{ t('gov.treasuryTitle') }}</div>
      <nav class="sidebar-nav">
        <RouterLink to="/gov/spends" class="nav-item" :class="{ active: isSpendsActive }">
          {{ t('gov.spends') }}
        </RouterLink>
        <RouterLink to="/gov/treasury-tokens" class="nav-item" :class="{ active: isTreasuryTokensActive }">
          {{ t('gov.treasuryTokens') }}
        </RouterLink>
      </nav>
      <div class="sidebar-divider" />
      <div class="sidebar-title">{{ t('gov.personalTitle') }}</div>
      <nav class="sidebar-nav">
        <RouterLink to="/gov/me" class="nav-item" :class="{ active: isMyActive }">
          {{ t('govMy.nav') }}
        </RouterLink>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

const isOverviewActive = computed(() => route.path === '/gov/overview')

const isReferendaActive = computed(
  () => route.path === '/gov' || route.path.startsWith('/gov/referenda'),
)

/** 不能用 startsWith('/gov/me')：会与 /gov/members 前缀冲突 */
const isMyActive = computed(
  () => route.path === '/gov/me' || route.path.startsWith('/gov/me/'),
)

const isMembersActive = computed(() => route.path.startsWith('/gov/members'))

const isTracksActive = computed(() => route.path.startsWith('/gov/tracks'))

const isSpendsActive = computed(() => route.path.startsWith('/gov/spends'))

const isTreasuryTokensActive = computed(() => route.path.startsWith('/gov/treasury-tokens'))
</script>

<style lang="scss" scoped>
.chain-box {
  background-color: rgba($primary-bg-rgb, 0.95);
  // border-top: 1px solid rgba(255, 255, 255, 0.04);
  margin-top: -15px;
}

.sidebar-box {
  .sidebar-title {
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba($secondary-text-rgb, 0.4);
    padding: 16px 24px 8px 0;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
  }

  .nav-item {
    padding: 10px 12px 10px 0;
    font-size: 13px;
    color: rgba($secondary-text-rgb, 0.6);
    text-decoration: none;

    margin: 1px 0;
    transition: all 0.2s ease;
    font-weight: 400;

    &:hover {
      color: rgba($secondary-text-rgb, 1);
    }

    &.active {

      color: rgba($secondary-text-rgb, 0.92);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: -12px;
        bottom: 0;
        width: calc(100% + 24px);
        height: 100%;
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }

  .sidebar-divider {
    height: 1px;
    background: rgba($secondary-text-rgb, 0.4);
    margin: 10px 24px 10px 0;
    width: 10px;
  }
}
</style>
