<template>
  <div class="chip">
    <div class="chip-pins">
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
    </div>
    <div class="chip-pins-bottom">
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
    </div>
    <div class="chip-pins-left">
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
    </div>
    <div class="chip-pins-right">
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
      <div class="chip-pin"></div>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.chip {
  font-size: 4px;
  width: 50em;
  height: 50em;
  margin: 11em;
  display: flex;
  align-items: center;
  background-color: #101010;
  padding: 5em 7.5em;
  // animation: chip_diffuse 2s 0s infinite;
  position: relative;
}

@keyframes chip_diffuse {
  0% {
    box-shadow: 0 0 0px rgba($primary-text-rgb, $alpha: 0.05);
  }

  80% {
    box-shadow: 0 0 40px rgba($primary-text-rgb, $alpha: 0.05);
  }

  100% {
    box-shadow: 0 0 0px rgba($primary-text-rgb, $alpha: 0.05);
  }
}

.chip-pins {
  width: 100%;
  height: 12.5em;
  position: absolute;
  left: 0;
  top: -13em;
  display: flex;
  justify-content: space-around;
}

.chip-pin {
  width: 1em;
  height: 12.5em;
  background-color: rgba(255, 255, 255, 0.0588235294);
  overflow: hidden;
}

.chip-pins .chip-pin::before {
  content: '';
  display: block;
  height: 5em;
  width: 1em;
  background: linear-gradient(to top, transparent, $primary-text);
  animation: bottom_to_top 2s 0s infinite;
}

@keyframes bottom_to_top {
  0% {
    margin-top: 12.5em;
  }

  100% {
    margin-top: -5em;
  }
}

.chip-pins-bottom {
  width: 100%;
  height: 12.5em;
  position: absolute;
  left: 0;
  bottom: -13em;
  display: flex;
  justify-content: space-around;
}

.chip-pins-bottom .chip-pin::before {
  content: '';
  display: block;
  height: 5em;
  width: 1em;
  background: linear-gradient(to bottom, transparent, $primary-text);
  animation: top_to_bottom 2s 0s infinite;
}

@keyframes top_to_bottom {
  0% {
    margin-top: -5em;
  }

  100% {
    margin-top: 12.5em;
  }
}

.chip-pins-left {
  width: 12.5em;
  height: 100%;
  position: absolute;
  left: -13em;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.chip-pins-left .chip-pin::before {
  content: '';
  display: block;
  height: 1em;
  width: 5em;
  background: linear-gradient(to left, transparent, $primary-text);
  animation: right_to_left 2s 0s infinite;
}

@keyframes right_to_left {
  0% {
    margin-left: 12.5em;
  }

  100% {
    margin-left: -5em;
  }
}

.chip-pins-right {
  width: 12.5em;
  height: 100%;
  position: absolute;
  right: -13.2em;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.chip-pins-right .chip-pin::before {
  content: '';
  display: block;
  height: 1em;
  width: 5em;
  background: linear-gradient(to right, transparent, $primary-text);
  animation: left_to_right 2s 0s infinite;
}

@keyframes left_to_right {
  0% {
    margin-left: -5em;
  }

  100% {
    margin-left: 12.5em;
  }
}

.chip-pins-right .chip-pin,
.chip-pins-left .chip-pin {
  width: 12.5em;
  height: 1em;
}
</style>