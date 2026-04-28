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
    <slot />
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
  // animation disabled — keep chip visually quiet
  position: relative;
}

@keyframes chip_diffuse {
  0% {
    box-shadow: none;
  }

  80% {
    box-shadow: none;
  }

  100% {
    box-shadow: none;
  }
}

.chip-pins {
  width: 100%;
  height: 12.5em;
  position: absolute;
  left: 0;
  top: -12.5em;
  display: flex;
  justify-content: space-around;
}

.chip-pin {
  width: 2px;
  height: 12.5em;
  background-color: rgba(255, 255, 255, 0.0588235294);
  overflow: hidden;
}

.chip-pins .chip-pin::before {
  content: '';
  display: block;
  height: 5em;
  width: 2px;
  background: $primary-text;
  animation: bottom_to_top 4s 0s infinite;
}

.chip-pins .chip-pin:nth-child(1)::before { animation-delay: 0s; }
.chip-pins .chip-pin:nth-child(2)::before { animation-delay: -0.33s; }
.chip-pins .chip-pin:nth-child(3)::before { animation-delay: -0.66s; }
.chip-pins .chip-pin:nth-child(4)::before { animation-delay: -1s; }
.chip-pins .chip-pin:nth-child(5)::before { animation-delay: -1.33s; }
.chip-pins .chip-pin:nth-child(6)::before { animation-delay: -1.66s; }

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
  bottom: -12.5em;
  display: flex;
  justify-content: space-around;
}

.chip-pins-bottom .chip-pin::before {
  content: '';
  display: block;
  height: 5em;
  width: 2px;
  background: $primary-text;
  animation: top_to_bottom 4s 0s infinite;
}

.chip-pins-bottom .chip-pin:nth-child(1)::before { animation-delay: -1.66s; }
.chip-pins-bottom .chip-pin:nth-child(2)::before { animation-delay: -1.33s; }
.chip-pins-bottom .chip-pin:nth-child(3)::before { animation-delay: -1s; }
.chip-pins-bottom .chip-pin:nth-child(4)::before { animation-delay: -0.66s; }
.chip-pins-bottom .chip-pin:nth-child(5)::before { animation-delay: -0.33s; }
.chip-pins-bottom .chip-pin:nth-child(6)::before { animation-delay: 0s; }

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
  left: -12.5em;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.chip-pins-left .chip-pin::before {
  content: '';
  display: block;
  height: 2px;
  width: 5em;
  background: $primary-text;
  animation: right_to_left 4s 0s infinite;
}

.chip-pins-left .chip-pin:nth-child(1)::before { animation-delay: 0s; }
.chip-pins-left .chip-pin:nth-child(2)::before { animation-delay: -0.33s; }
.chip-pins-left .chip-pin:nth-child(3)::before { animation-delay: -0.66s; }
.chip-pins-left .chip-pin:nth-child(4)::before { animation-delay: -1s; }
.chip-pins-left .chip-pin:nth-child(5)::before { animation-delay: -1.33s; }
.chip-pins-left .chip-pin:nth-child(6)::before { animation-delay: -1.66s; }

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
  right: -12.5em;
  bottom: 0px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.chip-pins-right .chip-pin::before {
  content: '';
  display: block;
  height: 2px;
  width: 5em;
  background: $primary-text;
  animation: left_to_right 4s 0s infinite;
}

.chip-pins-right .chip-pin:nth-child(1)::before { animation-delay: -1.66s; }
.chip-pins-right .chip-pin:nth-child(2)::before { animation-delay: -1.33s; }
.chip-pins-right .chip-pin:nth-child(3)::before { animation-delay: -1s; }
.chip-pins-right .chip-pin:nth-child(4)::before { animation-delay: -0.66s; }
.chip-pins-right .chip-pin:nth-child(5)::before { animation-delay: -0.33s; }
.chip-pins-right .chip-pin:nth-child(6)::before { animation-delay: 0s; }

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
  height: 2px;
}
</style>