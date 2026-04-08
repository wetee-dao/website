<template>
  <aside class="gov-sidebar shrink-0 lg:w-56">
    <div class="chain-box sidebar-box pb-4">
      <div class="sidebar-title">{{ t('gov.governance') }}</div>
      <nav class="sidebar-nav">
        <RouterLink to="/gov/overview" class="nav-item" :class="{ active: isOverviewActive }">
          {{ t('gov.overview') }}
        </RouterLink>
        <RouterLink to="/gov" class="nav-item" :class="{ active: isReferendaActive }">
          {{ t('gov.referenda') }}
        </RouterLink>
        <RouterLink to="/gov/members" class="nav-item" :class="{ active: isMembersActive }">
          {{ t('gov.members') }}
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

const isReferendaActive = computed(() => {
  return route.path === '/gov' || route.path.startsWith('/gov/referenda')
})

const isMembersActive = computed(() => route.path.startsWith('/gov/members'))

const isTracksActive = computed(() => route.path.startsWith('/gov/tracks'))

const isSpendsActive = computed(() => route.path.startsWith('/gov/spends'))
</script>

<style lang="scss" scoped>
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
