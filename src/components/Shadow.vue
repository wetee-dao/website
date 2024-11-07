<template>
  <div class="shadow-box">
    <div class="slot" :style="'background-image: radial-gradient(transparent 1em, ' + bg + ' 1em)'">
      <slot></slot>
    </div>

    <slot class="bg"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps(["bg"])
const bg = ref(props.bg ?? "#090909")
</script>

<style lang="scss" scoped>
.shadow-box {
  font-size: 2px;
  position: relative;
  top: 1em;
  left: 1em;
  width: 100%;
  // height: 100%;
  padding: 4em;

  .slot {
    width: 100%;
    // height: 100%;
    position: absolute;
    z-index: 1;
    background-color: transparent;
    transition: background - color 0.5s ease;
    background-size: 4em 4em;
    backdrop-filter: saturate(50%) blur(4em);
    top: -1em;
    left: -1em;
  }

  .bg {
    width: 100%;
    height: 100%;
  }
}
</style>