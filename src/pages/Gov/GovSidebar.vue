<template>
  <aside class="gov-sidebar shrink-0 lg:w-56">
    <div class="chain-box sidebar-box">
      <div class="sidebar-title">Governance</div>
      <nav class="sidebar-nav">
        <RouterLink to="/gov?tab=overview" class="nav-item" :class="{ active: isOverviewActive }">
          Overview
        </RouterLink>
        <RouterLink to="/gov" class="nav-item" :class="{ active: isReferendaActive }">
          Referenda
        </RouterLink>
        <a href="javascript:void(0)" class="nav-item">Discussions</a>
        <a href="javascript:void(0)" class="nav-item">Delegation</a>
      </nav>
      <div class="sidebar-divider" />
      <div class="sidebar-title">Treasury</div>
      <nav class="sidebar-nav">
        <a href="javascript:void(0)" class="nav-item">Status</a>
        <a href="javascript:void(0)" class="nav-item">Spends</a>
        <a href="javascript:void(0)" class="nav-item">Proposals</a>
      </nav>
      <div class="sidebar-divider" />
      <div class="sidebar-title">Others</div>
      <nav class="sidebar-nav">
        <a href="javascript:void(0)" class="nav-item">Staking</a>
        <a href="javascript:void(0)" class="nav-item">Preimages</a>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

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
  background-color: $primary-bg;
  background-color: rgba($primary-bg-rgb, 0.68);
  border: 4px solid rgba(255, 255, 255, 0.06);
}

.sidebar-box {
  .sidebar-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $secondary-text;
    padding: 16px 18px 8px;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
  }

  .nav-item {
    padding: 8px 16px;
    font-size: 14px;
    color: $secondary-text;
    text-decoration: none;
    border-radius: 2px;
    margin: 1.5px 8px;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    &.active {
      background: rgba(255, 255, 255, 0.1);
      color: $primary-text;
    }
  }

  .sidebar-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.06);
    // margin: 8px 0;
  }
}
</style>
