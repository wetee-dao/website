<template>
  <div class="banner__content container flex flex-col items-center md:flex-row md:justify-center md:items-center">
    <div class="flex-1 flex flex-col items-center md:items-start">
      <span class="banner__tagline ">Based on substrate</span>
      <h2 class="banner__title text-center md:text-left">Secure and easy Computational power</h2>
      <p class="banner__text text-center md:text-left">
        Utilizing decentralized trusted computing power in a cloud-like manner, providing hardware-level
        security
        assurance for Web3 applications and DeAI.
      </p>
      <div class="btns flex justify-center md:justify-start">
        <a target="_blank" href="https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fxiaobai.asyou.me%3A30001#/explorer"
          class="btn  btn--nephrite"><span>Chain Explorer</span>
        </a>
        <a target="_blank" href="https://dapp.wetee.app/" class="btn btn__primary "><span>Deploy Now</span>
        </a>
      </div>
    </div>

    <Chip class="chip">
      <div class="chip-text">Confidential computing, calculate trustworthy future</div>
    </Chip>

    <div class="banner__canvas">
      <AppCanvas />
    </div>
    <!-- end bg animation -->
  </div>
</template>

<script setup lang="ts">
import AppCanvas from './AppsBg.vue';
import Chip from './Chip.vue';

</script>

<style lang="scss" scoped>
.banner__content {
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: start;
  height: calc(100vh - 190px);
  min-height: 400px;
  border-radius: 20px;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
  margin-top: 55px;
}

.banner__content::before {
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #13131390;
  pointer-events: none;
  z-index: 3;
}

.banner__tagline {
  color: $primary-text;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  margin-bottom: 10px;
  text-align: center;
  position: relative;
  z-index: 3;
  background-color: rgb(84 84 84 / 30%);
  padding: 8px 16px;
  border-radius: 10px;
  display: inline-block;
}

.banner__title {
  font-size: 49px;
  line-height: 54px;
  color: #fff;
  font-weight: 700;
  margin-bottom: 20px;
  position: relative;
  z-index: 3;
  word-break: break-word;
}

.banner__text {
  font-size: 20px;
  line-height: 26px;
  color: #dedede;
  font-weight: 400;
  margin-bottom: 0;
  position: relative;
  z-index: 3;
}

.banner__canvas {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: transparent;
  pointer-events: none;
}

.chip-text {
  color: #abdeba;
  text-shadow: 0 2px 2px rgba(196, 196, 196, 0.87);
  font-size: 21px;
  text-align: center;
  font-family: "letter-font";
  font-weight: bold;
}

.chip {
  z-index: 10;
}

@media (max-width: 786px) {
  .banner__content {
    height: auto;
  }

  .chip {
    margin-top: 100px;
  }
}
</style>