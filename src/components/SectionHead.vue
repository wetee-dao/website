<template>
  <!-- section head -->
  <div class="section__head">
    <div class="container">
      <div class="row">
        <!-- breadcrumb -->
        <ul class="breadcrumb">
          <li class="breadcrumb__item">
            <RouterLink to="/">home</RouterLink>
          </li>
          <li class="breadcrumb__item" v-for="path in paths">
            <RouterLink :to="path.path">{{ path.name }}</RouterLink>
          </li>
        </ul>
        <!-- end breadcrumb -->

        <!-- section title -->
        <div class="section__title section__title--left section__title--page" style="text-indent: -3px;">
          <h1>{{ paths[paths.length - 1].name }}</h1>
        </div>
        <!-- end section title -->
      </div>
    </div>

    <!-- bg animation -->
    <div class="section__canvas">
      <AppCanvas />
    </div>
    <!-- end bg animation -->
  </div>
  <!-- end section head -->
</template>

<script setup lang="ts">
import AppCanvas from '@/components/AppsBg.vue'
import { useBreadcrumbStore } from '@/stores/global';
import { ref } from 'vue';
const userStore = useBreadcrumbStore()
const paths = ref(userStore.paths)
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
      color: #dedede;
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
      }

      &:last-child::before {
        display: none;
      }
    }
  }

  .section__title--page {
    margin-top: 5px;

    h1 {
      font-size: 40px;
      line-height: 54px;
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