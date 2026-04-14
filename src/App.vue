<template>
  <UApp :toaster="toaster">
    <Header />
    <Header :shadow="true" />
    <RouterView />
  </UApp>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import { onMounted } from 'vue';

const toaster = { position: 'top-right', duration: 5000 }

onMounted(async () => {
  document.getElementById('loader')!.style.display = "none";
  document.getElementById('app')!.style.visibility = "visible";
})
</script>

<style lang="scss" scoped></style>
