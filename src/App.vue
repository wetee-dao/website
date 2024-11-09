<template>
  <Header />
  <Header class="header-shadow" />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import { onMounted } from 'vue';

onMounted(() => {
  document.getElementById('loader')!.style.display = "none";
  document.getElementById('app')!.style.visibility = "visible";
})
</script>


<style lang="scss" scoped>
.header-shadow {
  z-index: 98;
  background: transparent;
  backdrop-filter: none;
  left: -4px;
  top: 2px;
  border: none;

  :deep(.header__logo) {
    height: 23px;
  }

  :deep(.active) {
    &:after {
      display: none;
    }
  }
}

.header-shadow .header__nav a {
  color: #fff !important;
}
</style>
