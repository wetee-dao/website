<template>
  <header :class="props.shadow ? 'header' : 'header header-shadow'">
    <div class="header__content container">
      <!-- btn -->
      <button v-if="group == 'main'" :class="'header__btn  block md:hidden ' + (isActivce ? 'header__btn--active' : '')" type="button"
        @click="toggleMenu()">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <!-- end btn -->

      <!-- logo -->
      <div v-if="group == 'main'" class="header__logo" @click="home()">
        <img src="/imgs/logo.svg" />
      </div>
      <!-- end logo -->

      <!-- logo -->
      <div v-if="group != 'main'" class="header_back_logo flex items-center" @click="home()">
        <i class="iconfont">&#xe602;</i>
        <img src="/imgs/logo.svg" />
        <!-- img v-if="group == 'lanch'" src="/imgs/logo-lanch.svg" /-->
      </div>
      <!-- end logo -->

      <!-- navigation -->
      <ul v-if="group == 'main'" :class="'header__nav ' + (isActivce ? 'header__nav--active' : '')">
        <li :class="path.indexOf('/products') > -1 ? 'active' : ''">
          <a href="javascript:void(0)">Products <i class="iconfont">&#xe68f;</i></a>
          <ul v-if="props.shadow && showSub" class="header__dropdown">
            <li>
              <RouterLink to="/products/cloud" @click="unfocus">
                <div class="flex items-center ">
                  <Cloud />
                  <div class="title-wrap">
                    <div class="title">TEE Vm Cloud</div>
                    <div class="subtitle">Decentralized confidential containers</div>
                  </div>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products/bridge" @click="unfocus">
                <div class="flex items-center">
                  <Bridge/>
                  <div class="title-wrap">
                    <div class="title">TEE Oracle</div>
                    <div class="subtitle">Trustless channel between WEB3 and WEB2</div>
                  </div>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products/miner" @click="unfocus">
                <div class="flex items-center">
                  <Miner />
                  <div class="title-wrap">
                    <div class="title">TEE Miner</div>
                    <div class="subtitle">Provide computing power to earn</div>
                  </div>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products/store" @click="unfocus">
                <div class="flex items-center">
                  <Store/>
                  <div class="title-wrap">
                    <div class="title">TEE Storage</div>
                    <div class="subtitle">Decentralized encrypted storage</div>
                  </div>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products/mpc" @click="unfocus">
                <div class="flex items-center">
                  <MPC class="icon" />
                  <div class="title-wrap">
                    <div class="title">TEE MPC</div>
                    <div class="subtitle">MPC base on blockchain and TEE</div>
                  </div>
                </div>
              </RouterLink>
            </li>
          </ul>
        </li>
        <li :class="path == '/use-cases' ? 'active' : ''">
          <RouterLink to="/use-cases">Use Cases
            <!-- <i class="iconfont">&#xe68f;</i> -->
          </RouterLink>
        </li>
        <li :class="path == '/launch/stake' ? 'active' : ''">
          <a target="_blank" href="/launch/stake">Fair Launch</a>
        </li>
        <li :class="path == '/contacts' ? 'active' : ''">
          <RouterLink class="trans" tkey="nav_contact" to="/contacts">Contacts</RouterLink>
        </li>
        <li>
          <a class="trans" tkey="nav_white_paper" target="_blank" href="https://wetee.gitbook.io/docment">Docs</a>
        </li>
      </ul>
      <!-- end navigation -->

      <!-- lanch navigation -->
      <ul v-if="group == 'lanch'" :class="'header__nav ' + (isActivce ? 'header__nav--active' : '')">
        <li :class="path == '/launch/economy' ? 'active' : ''">
          <RouterLink to="/launch/economy">Token Economy</RouterLink>
        </li>
        <li :class="path == '/launch/stake' ? 'active' : ''">
          <RouterLink to="/launch/stake">Fair Launch</RouterLink>
        </li>
        <li :class="path == '/launch/cross' ? 'active' : ''">
          <RouterLink to="/launch/cross">Cross Chain</RouterLink>
        </li>
      </ul>
      <!-- end lanch navigation -->

      <div class="space flex justify-end items-center">
        <a target="_blank" href="https://github.com/wetee-dao" class="coin__btn hidden md:block" title="github code">
          <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4251"
            width="256" height="256">
            <path
              d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"
              p-id="4252">
            </path>
          </svg>
        </a>

        <!-- wallet -->
        <div class="header__cta connect" @click="login" v-if="!userInfo">
          <span class="text" tkey="nav_connect">&nbsp;Connect</span>
        </div>
        <div class="header__cta connect" @click="login" v-if="userInfo">
          <Identicon class="uicon" :key="userInfo.addr" @click="login" :hash="ss58toHex(userInfo.addr)" :padding="0.28"
            :foreground="[80, 250, 130, 255]" :background="[80, 255, 130, 0]" :size="16" />
          <span class="text" tkey="nav_connect">{{ userInfo.name }}</span>
        </div>
        <!-- end wallet -->

        <!-- dapp -->
        <a target="_blank" href="/dapp" class="header__cta inverse" title="Decentralization trust cloud">
          <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12882"
            width="256" height="256">
            <path
              d="M836.7616 217.4976l-239.9744-142.9504a165.5296 165.5296 0 0 0-169.5744 0L187.1872 217.6C134.912 248.6272 102.4 306.688 102.4 368.9984v285.9008c0 62.3104 32.512 120.32 84.7872 151.552l239.9744 142.8992a165.5296 165.5296 0 0 0 169.6256 0l240.0256-142.8992c52.2752-31.232 84.7872-89.2416 84.7872-151.552V369.0496c0-62.3104-32.512-120.3712-84.8384-151.552zM723.456 440.8832l-165.2736 94.72-3.4304 214.4256a43.0592 43.0592 0 0 1-42.3936 43.008h-0.7168a43.1616 43.1616 0 0 1-41.6768-44.4416l3.3792-208.7424L300.544 440.832a44.4928 44.4928 0 0 1-16.4352-59.4944 41.728 41.728 0 0 1 57.6512-16.9984L512 461.9776l170.24-97.5872c20.48-11.7248 46.2848-4.096 57.6512 16.9984a44.544 44.544 0 0 1-16.4864 59.4944z"
              p-id="12883"></path>
          </svg>
          <span class="text" tkey="nav_connect">DAPP</span>
        </a>
        <!-- end dapp -->
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { useNotification } from 'naive-ui'
import { ss58toHex } from "@/utils/chain";
import { useGlobalStore } from '@/stores/global';
import useGlobelProperties from '@/plugins/globel';
import Identicon from "./identicon.vue";
import router from '@/router';
import MPC from './svg/MPC.vue';
import Miner from './svg/Miner.vue';
import Bridge from './svg/Bridge.vue';
import Store from './svg/Store.vue';
import Cloud from './svg/Cloud.vue';

const props = defineProps(["shadow"])
const userStore = useGlobalStore()
const notification = useNotification()

const group = ref("main")
const showSub = ref(true)

const getPath = (paths: any) => {
  group.value = "main"
  if (paths.length === 0) return '/'

  const lpath = paths[paths.length - 1]
  if (lpath.meta && lpath.meta.group) {
    group.value = lpath.meta.group
  }

  return paths[paths.length - 1].path
}
const path = ref(getPath(userStore.paths))
const userInfo = ref(userStore.userInfo)
const isActivce = ref(false)
const global = useGlobelProperties()

if (!props.shadow) {
  window.$app = global;
  window.$notification = notification;
  global.$notification = notification;
}

const toggleMenu = () => {
  isActivce.value = !isActivce.value
}

const login = () => {
  global.$Login()
}

userStore.$subscribe((mutation, state) => {
  path.value = getPath(state.paths)
  userInfo.value = state.userInfo
  isActivce.value = false
}, { detached: true })

const home = () => {
  router.push("/")
}

const unfocus = () => {
  showSub.value = false
  setTimeout(() => {
    showSub.value = true
  }, 200)
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9;
  border-bottom: 1px solid rgba(236, 236, 236, 0.08);
  background-color: transparent;
  transition: background - color 0.5s ease;
  background-image: radial - gradient(transparent 1px, #040406 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
}

.header-shadow {
  z-index: 8;
  backdrop-filter: none;
  left: -4px;
  top: 2px;
  border: none;
  background: transparent;

  :deep(.header__logo) {
    height: 23px;
  }

  :deep(.active) {
    &:after {
      display: none;
    }
  }

  .header__nav a {
    color: #fff !important;
  }

  .active {
    &:after {
      display: none;
    }
  }
}

.header__content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 80px;

  .header__logo {
    width: auto;
    height: 23px;
    align-items: center;
    margin-left: 4px;
    margin-right: 10px;
    cursor: pointer;

    img {
      height: 100%;
      width: auto;
    }
  }

  .header_back_logo {
    width: auto;
    height: 38px;
    align-items: center;
    margin-left: 4px;
    margin-right: 10px;
    cursor: pointer;
    background-color: rgba($secondary-text-rgb, 0.04);
    border-radius: 3px;
    padding: 11px 10px;
    font-size: 16px;

    img {
      height: 100%;
      width: auto;
      margin-right: 5px;
      margin-left: 5px;
    }

    .iconfont {
      display: inline-block;
      font-size: 16px;
      margin-right: 2px;
      transform: rotate(180deg);
    }
  }

  .header__btn {
    width: 24px;
    height: 22px;
    margin-right: 10px;
    position: relative;
    top: 1px;

    span {
      position: absolute;
      left: 0;
      display: block;
      width: 24px;
      height: 2px;
      background-color: #ffffff;
      border-radius: 3px;
      transition: 0.5s ease;
    }

    span:nth-child(1) {
      top: 0;
    }

    span:nth-child(2) {
      top: 10px;
      width: 16px;
    }

    span:nth-child(3) {
      top: 20px;
      width: 8px;
    }
  }

  .header__btn--active {
    span:first-child {
      transform: rotate(45deg);
      top: 10px;
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:last-child {
      width: 24px;
      transform: rotate(-45deg);
      top: 10px;
    }
  }

  .header__tagline {
    display: none;
  }

  .header__tagline div {
    font-size: 16px;
    font-weight: 800;
  }

  .header__nav {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: transparent;
    top: auto;
    bottom: auto;
    left: auto;
    right: auto;
    width: auto;
    transform: translate3d(0, 0, 0);
    padding: 0;
    margin-right: auto;
    border-top: none;
    z-index: 2;
    height: 80px;
    position: relative;
    top: 2px;
  }

  .header__nav--active {
    transform: translate3d(0, 0, 0);
  }

  .header__nav>li {
    display: block;
    margin-left: 2vw;
    margin-bottom: 0;
    position: relative;
    padding: 10px 0;

    &.active {
      &:after {
        content: ' ';
        width: 130%;
        height: 70%;
        background-color: rgba($secondary-text-rgb, 0.1);
        position: absolute;
        bottom: 15%;
        left: -15%;
      }
    }

    &:hover {
      .header__dropdown {
        display: block;
      }
    }

    .iconfont {
      font-size: 11px;
    }

    .header__dropdown {
      display: none;
      position: absolute;
      top: 45px;
      background-color: rgba($secondary-text-rgb, 0.07);
      border-bottom: none;
      z-index: 10;
      left: -15%;
      padding: 5px;

      li {
        background-color: rgba($primary-bg-rgb, 1);
        border-bottom: 1px solid rgba($secondary-text-rgb, 0.1);
        width: 330px;
        padding: 15px 15px;

        a {
          text-align: left;
        }

        .icon{
          height: 35px;
          width: 35px;
          margin-right: 10px;
        }

        .title{
          font-size: 16px;
          margin-bottom: 2px;
        }

        .subtitle{
          font-size: 12px;
          color: rgba($secondary-text-rgb, 0.5);
        }
      }
    }
  }

  .header__nav a {
    display: inline-block;
    font-size: 15px;
    line-height: 15px;
    font-weight: bold;
    text-align: center;
    color: #fff !important;
    background: transparent !important;
    width: 100%;
    cursor: pointer;
    display: block;
    padding: 6px 0;
  }

  .header__nav a:hover,
  .header__nav a[aria-expanded="true"] {
    color: $primary-text;
  }

  .header__nav a:hover svg,
  .header__nav a[aria-expanded="true"] svg {
    fill: $primary-text;
  }

  .coin__btn {
    width: 45px;
    margin-right: 3px;
    padding: 10px;

    svg {
      width: 100%;
      height: auto;
      fill: rgba($secondary-text-rgb, 1);
    }
  }

  .header__cta {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 38px;
    background-color: transparent;
    overflow: hidden;
    margin-right: 0px;
    padding: 0 9px 0 3px;
    border: 2Px solid rgba($primary-text-rgb, 1);
    cursor: pointer;
    filter: grayscale(50%);

    &.inverse {
      background-color: rgba($primary-text-rgb, 1);

      svg {
        fill: #040406;
      }

      span {
        color: #040406;
        letter-spacing: -1px;
      }
    }

    .uicon {
      width: 36px;
      height: 36px;
      cursor: pointer;
      margin-left: -3px;
      margin-right: -2px;
    }

    svg {
      width: 23px;
      height: auto;
      fill: $primary-text;
    }

    span {
      display: block;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      font-size: 16px;
      font-weight: bold;
      line-height: 16px;
      color: $primary-text;
      transition: 0.5s ease;
      word-break: break-all;
    }
  }

  @media (max-width: 765px) {
    .header__nav {
      background-color: #090909;
      position: fixed;
      top: 80px;
      left: 0;
      height: 100vh;
      padding: 25px 45px;
      display: none;
      width: 100vw;

      li {
        width: 250px;
        margin: 0 auto;

        &:first-child {
          display: block;
        }

        &.active {
          &:after {
            width: 120%;
            left: -10%;
            height: 100%;
            bottom: 0;
          }
        }

        a {
          padding: 10px;
        }

        .header__dropdown {
          background-color: transparent;
          display: block;
          position: relative;
          top: 0;
          left: 0;

          li {
            width: 100%;

            a {
              text-align: center;
            }
          }
        }
      }
    }

    .connect{
      display: none;
    }

    .header__dropdown{
      li{
        padding: 0 !important;
      }
      .icon{
        display: none;
      }
      .title-wrap{
        width: 100%;
      }
      .title{
        width: 100%;
        text-align: center;
      }
      .subtitle{
        display: none;
      }
    }

    .header__nav--active {
      display: block;
    }
  }
}
</style>