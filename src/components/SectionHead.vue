<template>
  <!-- section head -->
  <div class="section__head">
    <div class="container">
      <div class="row">
        <!-- breadcrumb -->
        <ul class="breadcrumb">
          <li class="breadcrumb__item">
            <RouterLink class="iconfont" to="/">&#xe6a4;</RouterLink>
          </li>
          <li class="breadcrumb__item" v-for="p in paths" :key="p.path">
            <RouterLink :to="p.path">{{ sectionTitleForPath(p.path, p.name) }}</RouterLink>
          </li>
        </ul>
        <!-- end breadcrumb -->

        <!-- section title -->
        <div class="section__title section__title--left section__title--page" style="text-indent: -1px;">
          <h1>{{ sectionTitleForPath(currentPath, currentName) }}</h1>
        </div>
        <!-- end section title -->
      </div>
    </div>

    <!-- bg animation -->
    <!-- <div class="section__canvas">
      <AppCanvas />
    </div> -->
    <!-- end bg animation -->
  </div>
  <!-- end section head -->
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppCanvas from '@/components/AppsBg.vue'
import { useGlobalStore } from '@/stores/global'

const { t } = useI18n()
const route = useRoute()
const userStore = useGlobalStore()
const paths = ref(userStore.paths)

const pathToTitleKey: Record<string, string> = {
  '/products/cloud': 'productsCloud.sectionTitle',
  '/products/store': 'products.store',
  '/products/miner': 'products.miner',
  '/products/bridge': 'products.bridge',
  '/products/mpc': 'products.mpc',
  '/gov': 'gov.title',
  '/chain/blocks': 'chain.blocks',
  '/chain/txs': 'chain.txs',
  '/chain/nodes': 'chain.nodes',
  '/chain/pods': 'chain.pods',
  '/tee-store': 'footer.teeStore',
  '/launch/economy': 'launch.tokenEconomy',
  '/launch/stake': 'launch.fairLaunch',
  '/launch/cross': 'launch.crossChain',
  '/contacts': 'common.contacts',
}

function sectionTitleForPath(path: string, fallbackName?: string): string {
  const key = pathToTitleKey[path]
  return key ? t(key) : (fallbackName ?? path)
}

const currentPath = computed(() => paths.value[paths.value.length - 1]?.path ?? route.path)
const currentName = computed(() => paths.value[paths.value.length - 1]?.name ?? '')

watch(() => userStore.paths, (p) => { paths.value = p }, { immediate: true })
</script>

<style lang="scss" scoped>
.section__head {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-bottom: 1px solid rgba(170, 114, 206, 0.12);
  padding-top: 60px;
  padding-bottom: 15px;

  // &::before {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   background-color: rgba(13, 12, 12, 0.69);
  //   pointer-events: none;
  //   z-index: -1;
  // }

  .breadcrumb {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 35px;

    .breadcrumb__item {
      font-size: 14px;
      line-height: 22px;
      color: #d2d2d2;
      transition: color 0.5s ease;
      position: relative;
      margin-right: 32px;

      &::before {
        content: '';
        position: absolute;
        left: 100%;
        top: 2px;
        bottom: 0;
        width: 32px;
        background: url("/imgs/breadcrumb.svg") no-repeat center/16px auto;
        opacity: 0.7;
      }

      &:last-child::before {
        display: none;
      }
    }
  }

  .section__title--page {
    margin-top: 5px;

    h1 {
      font-size: 30px;
      line-height: 40px;
      font-weight: bold;
    }
  }

  .section__canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -2;
    background-color: transparent;
    pointer-events: none;
  }
}
</style>