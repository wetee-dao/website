<template>
  <div class="shadow-box">
    <div class="slot" :style="'background-image: radial-gradient(transparent 1em, ' + bg + ' 1em)'">
      <div>
        <slot></slot>
      </div>
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

  .slot {
    width: 125%;
    height: 140%;
    position: absolute;
    z-index: 1;
    background-color: transparent;
    transition: background - color 0.5s ease;
    background-size: 4em 4em;
    backdrop-filter: saturate(50%) blur(4em);
    top: calc(-12.5% - 2em);
    left: calc(-12.5% - 1em);

    div {
      width: 80%;
      height: 80%;
      margin: 10%;
    }
  }

  .bg {
    width: 100%;
    height: 100%;
  }
}
</style>