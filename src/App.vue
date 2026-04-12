<template>
  <UApp>
    <Header />
    <Header :shadow="true" />
    <RouterView />
  </UApp>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import { onMounted } from 'vue';

onMounted(async () => {
  document.getElementById('loader')!.style.display = "none";
  document.getElementById('app')!.style.visibility = "visible";
})
</script>

<style lang="scss" scoped></style>
