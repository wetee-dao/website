<template>
  <aside class="gov-sidebar shrink-0 lg:w-56">
    <div class="chain-box sidebar-box">
      <div class="sidebar-title">{{ t('gov.governance') }}</div>
      <nav class="sidebar-nav">
        <RouterLink to="/gov?tab=overview" class="nav-item" :class="{ active: isOverviewActive }">
          {{ t('gov.overview') }}
        </RouterLink>
        <RouterLink to="/gov" class="nav-item" :class="{ active: isReferendaActive }">
          {{ t('gov.referenda') }}
        </RouterLink>
        <a href="javascript:void(0)" class="nav-item">{{ t('gov.discussions') }}</a>
        <a href="javascript:void(0)" class="nav-item">{{ t('gov.delegation') }}</a>
      </nav>
      <div class="sidebar-divider" />
      <div class="sidebar-title">{{ t('gov.treasuryTitle') }}</div>
      <nav class="sidebar-nav">
        <a href="javascript:void(0)" class="nav-item">{{ t('gov.status') }}</a>
        <a href="javascript:void(0)" class="nav-item">{{ t('gov.spends') }}</a>
        <a href="javascript:void(0)" class="nav-item">{{ t('gov.proposals') }}</a>
      </nav>
      <div class="sidebar-divider" />
      <div class="sidebar-title">{{ t('gov.othersTitle') }}</div>
      <nav class="sidebar-nav">
        <a href="javascript:void(0)" class="nav-item">{{ t('gov.staking') }}</a>
        <a href="javascript:void(0)" class="nav-item">{{ t('gov.preimages') }}</a>
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

const isOverviewActive = computed(() => route.path === '/gov' && route.query.tab === 'overview')

const isReferendaActive = computed(() => {
  if (route.path === '/gov') return route.query.tab !== 'overview'
  return route.path.startsWith('/gov/referenda')
})
</script>

<style lang="scss" scoped>
.gov-sidebar {
  /* layout only */
}

.chain-box {
  background-color: rgba($primary-bg-rgb, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.sidebar-box {
  .sidebar-title {
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba($secondary-text-rgb, 0.4);
    padding: 20px 20px 10px;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: 0 8px;
  }

  .nav-item {
    padding: 10px 12px;
    font-size: 13px;
    color: rgba($secondary-text-rgb, 0.6);
    text-decoration: none;
    border-radius: 2px;
    margin: 1px 0;
    transition: all 0.2s ease;
    font-weight: 400;

    &:hover {
      background: rgba(255, 255, 255, 0.03);
      color: rgba($secondary-text-rgb, 0.8);
    }

    &.active {
      background: rgba(255, 255, 255, 0.05);
      color: $primary-text;
    }
  }

  .sidebar-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.04);
    margin: 8px 16px;
  }
}
</style>
