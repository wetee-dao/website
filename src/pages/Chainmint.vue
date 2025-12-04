<template>
  <div class="chain-mint">
    <div class="bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { onMounted, onUnmounted } from 'vue';

const userStore = useGlobalStore()

onMounted(async () => {

})

onUnmounted(async () => {

})

</script>

<style lang="scss" scoped>
.chain-mint {}
</style>
