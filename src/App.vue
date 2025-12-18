<template>
  <NConfigProvider :theme="darkTheme">
    <NNotificationProvider>
      <Header />
      <Header :shadow="true" />
      <RouterView />
    </NNotificationProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import { onMounted } from 'vue';
import { NNotificationProvider, NConfigProvider, darkTheme } from 'naive-ui';

onMounted(async () => {
  document.getElementById('loader')!.style.display = "none";
  document.getElementById('app')!.style.visibility = "visible";
})
</script>

<style lang="scss" scoped>

</style>
