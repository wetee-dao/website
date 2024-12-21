<template>
  <div class="banner__content container flex flex-col items-center md:flex-row md:justify-center md:items-center">
    <div class="flex-1 flex flex-col items-center md:items-start md:pr-10">
      <span class="banner__tagline ">Based on substrate</span>
      <h2 class="top__title text-center md:text-left">Make confidential computing decentralization and easy
        , Make WEB2 programs contract-like
      </h2>
      <p class="top__text text-center md:text-left">
        Utilizing decentralized trusted computing power in a cloud-like manner, providing hardware-level
        security assurance for WEB3 applications and DeAI.
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

    <!-- <div class="banner__canvas">
      <AppCanvas />
    </div> -->
    <!-- end bg animation -->
  </div>
</template>

<script setup lang="ts">
import AppCanvas from './AppsBg.vue';
import Chip from './Chip.vue';

</script>

<style lang="scss" scoped>
.banner__content {
  min-height: 400px;
  border-radius: 20px;
  padding: 20px 0px;
  position: relative;
  overflow: hidden;
  margin-top: 70px;
}

.banner__content::before {
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background-color: #13131390;
  pointer-events: none;
  z-index: 3;
}

.banner__tagline {
  color: $primary-text;
  font-weight: 700;
  font-size: 15px;
  line-height: 100%;
  margin-bottom: 10px;
  text-align: center;
  position: relative;
  z-index: 3;
  padding: 8px 12px;
  display: inline-block;
  border: 3Px double rgba($primary-text-rgb, 0.3);
  filter: grayscale(60%);
}


.chip-text {
  color: #abdeba;
  text-shadow: 0 2px 2px rgba(196, 196, 196, 0.87);
  font-size: 21px;
  text-align: center;
  font-family: "letter-font";
  font-weight: bold;
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


.chip {
  z-index: 5;
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