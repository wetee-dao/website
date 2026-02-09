<template>
  <div class="">
    <SectionHead />
    <div class="container section flex">
      <div class="flex flex-col items-center md:flex-row md:justify-center md:items-center w-full">
        <div class="flex-1 md:pr-20">
          <div class="top__title">{{ t('productsCloud.title') }}</div>
          <div class="top__text">{{ t('productsCloud.subtitle') }}</div>
          <div class="btns mt-10">
            <RouterLink to="/tee-store" class="btn  btn--nephrite"><span>{{ t('productsCloud.teeStore') }}</span></RouterLink>
            <a target="_blank" href="/dapp" class="btn btn__primary "><span>{{ t('productsCloud.deployContainer') }}</span></a>
          </div>
        </div>
        <div class="hidden icon md:block">
          <Dbox/>
        </div>
      </div>
    </div>
    <div class="container section-first">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-6">
        <div class="confidentials confidentials--first">
          <h3 class="confidentials__title">{{ t('productsCloud.card1Title') }}</h3>
          <p class="confidentials__text">{{ t('productsCloud.card1Text') }}</p>
        </div>
        <div class="confidentials confidentials--yellow">
          <h3 class="confidentials__title">{{ t('productsCloud.card2Title') }}</h3>
          <p class="confidentials__text">{{ t('productsCloud.card2Text') }}</p>
        </div>
        <div class="confidentials confidentials--nephrite">
          <h3 class="confidentials__title">{{ t('productsCloud.card3Title') }}</h3>
          <p class="confidentials__text">{{ t('productsCloud.card3Text') }}</p>
        </div>
        <div class="confidentials confidentials--yellow">
          <h3 class="confidentials__title">{{ t('productsCloud.card4Title') }}</h3>
          <p class="confidentials__text">{{ t('productsCloud.card4Text') }}</p>
        </div>
        <div class="confidentials confidentials--nephrite">
          <h3 class="confidentials__title">{{ t('productsCloud.card5Title') }}</h3>
          <p class="confidentials__text">{{ t('productsCloud.card5Text') }}</p>
        </div>
        <div class="confidentials confidentials--first">
          <h3 class="confidentials__title">{{ t('productsCloud.card6Title') }}</h3>
          <p class="confidentials__text">{{ t('productsCloud.card6Text') }}</p>
        </div>
      </div>
    </div>
    <div class="features section section--bt">
      <div class="container  ">
        <div class="box flex">
          <div class=" md:w-2/3 flex flex-col justify-center">
            <div class="title">{{ t('productsCloud.featureTitle') }}</div>
            <div class="feature">
              <div class="name">{{ t('productsCloud.feature1Name') }}</div>
              <div class="desc">{{ t('productsCloud.feature1Desc') }}</div>
            </div>
            <div class="feature">
              <div class="name">{{ t('productsCloud.feature2Name') }}</div>
              <div class="desc">{{ t('productsCloud.feature2Desc') }}</div>
            </div>
            <div class="feature">
              <div class="name">{{ t('productsCloud.feature3Name') }}</div>
              <div class="desc">{{ t('productsCloud.feature3Desc') }}</div>
            </div>
            <div class="feature">
              <div class="name">{{ t('productsCloud.feature4Name') }}</div>
              <div class="desc">{{ t('productsCloud.feature4Desc') }}</div>
            </div>
            <div class="feature">
              <div class="name">{{ t('productsCloud.feature5Name') }}</div>
              <div class="desc">{{ t('productsCloud.feature5Desc') }}</div>
            </div>
          </div>
          <div class="md:w-1/3 flex justify-center items-center p-20">
            <Shadow bg="#151616">
              <Container />
            </Shadow>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionHead from '@/components/SectionHead.vue'
import Shadow from '@/components/Shadow.vue'
import Dbox from '@/components/anim/3Dbox.vue'
import Footer from '@/components/Footer.vue'
import Container from '@/components/svg/Container.vue'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.icon {
  width: 200px;
  height: 200px;
}

.confidentials {
  background-color: $primary-bg;
  padding: 30px 20px;
  // border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  overflow: hidden;

  .confidentials__title {
    font-size: 24px;
    color: #fff;
    font-weight: 600;
    position: relative;
    z-index: 3;
    padding-top: 19px;
    margin-bottom: 10px;

    &::before {
      content: '';
      position: absolute;
      display: block;
      width: 60px;
      height: 4px;
      border-radius: 2px;
      background-color: $primary-text;
      top: 0;
      left: 0;
      transition: 0.5s ease;
    }
  }

  .confidentials__text {
    position: relative;
    z-index: 3;
    font-size: 16px;
    line-height: 26px;
    color: $secondary-text;
    ;
    margin-bottom: 0;
    word-break: break-all;
  }
}

.confidentials--yellow .confidentials__title::before {
  background-color: #e8d189;
}

.confidentials--nephrite .confidentials__title::before {
  background-color: #5d5d5d;
}

.features {
  border: none;
  background-color: rgb(0, 13, 0);
  margin-top: 60px;

  .box {
    position: relative;
    background: #151616;
    padding: 30px;
    // border-radius: 2px;
  }

  .title {
    color: #fff;
    margin-top: 40px;
    margin-bottom: 40px;
    font-size: 45px;
    font-weight: 600;
  }

  .feature {
    .name {
      font-size: 30px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #fff;
    }

    .desc {
      color: $secondary-text;
      font-size: 20px;
      line-height: 26px;
      margin-bottom: 30px;
    }
  }
}
</style>