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
  width: 200px;
  height: 200px;
  margin: 55px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  background-color: #000;
  padding: 20px 30px;
  // box-shadow: 0 0 30px rgba(132, 249, 79, 0.28);
  animation: chip_diffuse 2s 0s infinite;
  position: relative;
}

@keyframes chip_diffuse {
  0% {
    // margin-top: 50px;
    box-shadow: 0 0 0px rgba(132, 249, 79, 0.28);
  }

  80% {
    box-shadow: 0 0 40px rgba(132, 249, 79, 0.28);
  }

  100% {
    box-shadow: 0 0 0px rgba(132, 249, 79, 0.28);
  }
}

.chip-pins {
  width: 100%;
  height: 50px;
  position: absolute;
  left: 0;
  top: -51px;
  display: flex;
  justify-content: space-around;
}

.chip-pin {
  width: 4px;
  height: 50px;
  background-color: #2b352e;
  overflow: hidden;
}

.chip-pins .chip-pin::before {
  content: '';
  display: block;
  height: 20px;
  width: 4px;
  background: linear-gradient(to top, transparent, $primary-text);
  animation: bottom_to_top 2s 0s infinite;
}

@keyframes bottom_to_top {
  0% {
    margin-top: 50px;
  }

  100% {
    margin-top: -20px;
  }
}

.chip-pins-bottom {
  width: 100%;
  height: 50px;
  position: absolute;
  left: 0;
  bottom: -51px;
  display: flex;
  justify-content: space-around;
}

.chip-pins-bottom .chip-pin::before {
  content: '';
  display: block;
  height: 20px;
  width: 4px;
  background: linear-gradient(to bottom, transparent, $primary-text);
  animation: top_to_bottom 2s 0s infinite;
}

@keyframes top_to_bottom {
  0% {
    margin-top: -20px;
  }

  100% {
    margin-top: 50px;
  }
}

.chip-pins-left {
  width: 50px;
  height: 100%;
  position: absolute;
  left: -51px;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.chip-pins-left .chip-pin::before {
  content: '';
  display: block;
  height: 4px;
  width: 20px;
  background: linear-gradient(to left, transparent, $primary-text);
  animation: right_to_left 2s 0s infinite;
}

@keyframes right_to_left {
  0% {
    margin-left: 50px;
  }

  100% {
    margin-left: -20px;
  }
}

.chip-pins-right {
  width: 50px;
  height: 100%;
  position: absolute;
  right: -51px;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.chip-pins-right .chip-pin::before {
  content: '';
  display: block;
  height: 4px;
  width: 20px;
  background: linear-gradient(to right, transparent, $primary-text);
  animation: left_to_right 2s 0s infinite;
}

@keyframes left_to_right {
  0% {
    margin-left: -20px;
  }

  100% {
    margin-left: 50px;
  }
}

.chip-pins-right .chip-pin,
.chip-pins-left .chip-pin {
  width: 50px;
  height: 4px;
}
</style>