<template>
  <header :class="props.shadow ? 'header' : 'header header-shadow'">
    <div class="header__content container">
      <!-- btn -->
      <button v-if="group == 'main'" :class="'header__btn  block md:hidden ' + (isActivce ? 'header__btn--active' : '')"
        type="button" aria-label="Toggle navigation" @click="toggleMenu()">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <!-- end btn -->

      <!-- logo -->
      <div v-if="group == 'main'" class="header__logo flex" @click="home()">
        <!-- <img src="/imgs/TTE.svg" /> -->
        <Logo :fill="true" />
        <!-- <span>3+2</span> -->
      </div>
      <!-- end logo -->

      <!-- logo -->
      <div v-if="group != 'main'" class="header_back_logo flex items-center" @click="home()">
        <i class="iconfont">&#xe602;</i>
        <!-- <img src="/imgs/TTE.svg" /> -->
        <Logo :fill="true" />
        <!-- legacy group == 'lanch' removed -->
      </div>
      <!-- end logo -->

      <div v-if="isActivce" class="header__overlay md:hidden" @click="closeMenu" />

      <!-- navigation -->
      <ul v-if="group == 'main'" :class="'header__nav ' + (isActivce ? 'header__nav--active' : '')">
        <li :class="path.indexOf('/chain') > -1 ? 'active' : ''">
          <a href="javascript:void(0)">{{ t('nav.blockchain') }} <i class="iconfont">&#xe68f;</i></a>
          <ul v-if="props.shadow && showSub" class="header__dropdown">
            <li>
              <RouterLink to="/chain/contracts" @click="onNavItemClick">
                <div class="flex items-center">
                  <MainchainContracts class="icon icon--mainchain" />
                  <div class="title-wrap">
                    <div class="title">{{ t('nav.mainchainContracts') }}</div>
                    <div class="subtitle">{{ t('nav.mainchainContractsSubtitle') }}</div>
                  </div>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/chain/blocks" @click="onNavItemClick">
                <div class="flex items-center ">
                  <Svgimg class="icon" name="block" />
                  <div class="title-wrap">
                    <div class="title">{{ t('nav.blocks') }}</div>
                    <div class="subtitle">{{ t('nav.blocksSubtitle') }}</div>
                  </div>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/chain/txs" @click="onNavItemClick">
                <div class="flex items-center">
                  <Svgimg class="icon" name="transfer" />
                  <div class="title-wrap">
                    <div class="title">{{ t('nav.transfers') }}</div>
                    <div class="subtitle">{{ t('nav.transfersSubtitle') }}</div>
                  </div>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/chain/nodes" @click="onNavItemClick">
                <div class="flex items-center">
                  <Svgimg class="icon" name="secret" />
                  <div class="title-wrap">
                    <div class="title">{{ t('nav.nodes') }}</div>
                    <div class="subtitle">{{ t('nav.nodesSubtitle') }}</div>
                  </div>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/chain/pods" @click="onNavItemClick">
                <div class="flex items-center">
                  <Svgimg class="icon" name="applications" />
                  <div class="title-wrap">
                    <div class="title">{{ t('nav.trustApps') }}</div>
                    <div class="subtitle">{{ t('nav.trustAppsSubtitle') }}</div>
                  </div>
                </div>
              </RouterLink>
            </li>
          </ul>
        </li>
        <li :class="path.indexOf('/products') > -1 ? 'active' : ''">
          <a href="javascript:void(0)">{{ t('nav.products') }} <i class="iconfont">&#xe68f;</i></a>
          <ul v-if="props.shadow && showSub" class="header__dropdown">
            <li>
              <RouterLink to="/products/cloud" @click="onNavItemClick">
                <div class="flex items-center ">
                  <Cloud class="icon" />
                  <div class="title-wrap">
                    <div class="title">{{ t('nav.teeVmCloud') }}</div>
                    <div class="subtitle">{{ t('nav.cloudSubtitle') }}</div>
                  </div>
                </div>
              </RouterLink>
            </li>
            <!-- <li>
              <RouterLink to="/products/bridge" @click="unfocus">
                <div class="flex items-center">
                  <Bridge class="icon" />
                  <div class="title-wrap">
                    <div class="title">{{ t('nav.teeBridge') }}</div>
                    <div class="subtitle">{{ t('nav.bridgeSubtitle') }}</div>
                  </div>
                </div>
              </RouterLink>
            </li> -->
            <!-- <li>
              <RouterLink to="/products/miner" @click="unfocus">
                <div class="flex items-center">
                  <Miner class="icon" />
                  <div class="title-wrap">
                    <div class="title">{{ t('nav.teeMiner') }}</div>
                    <div class="subtitle">{{ t('nav.minerSubtitle') }}</div>
                  </div>
                </div>
              </RouterLink>
            </li> -->
            <li>
              <RouterLink to="/products/store" @click="onNavItemClick">
                <div class="flex items-center">
                  <Store class="icon" />
                  <div class="title-wrap">
                    <div class="title">{{ t('nav.teeStorage') }}</div>
                    <div class="subtitle">{{ t('nav.storeSubtitle') }}</div>
                  </div>
                </div>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products/mpc" @click="onNavItemClick">
                <div class="flex items-center">
                  <MPC class="icon" />
                  <div class="title-wrap">
                    <div class="title">{{ t('nav.teeMpc') }}</div>
                    <div class="subtitle">{{ t('nav.mpcSubtitle') }}</div>
                  </div>
                </div>
              </RouterLink>
            </li>
          </ul>
        </li>
        <li :class="path.indexOf('/launch/economy') > -1 ? 'active' : ''">
          <RouterLink to="/launch/economy" @click="closeMenu">{{ t('nav.tokenEconomy') }}</RouterLink>
        </li>
        <li :class="path == '/gov' ? 'active' : ''">
          <RouterLink to="/gov" @click="closeMenu">{{ t('nav.openGov') }}</RouterLink>
        </li>
        <li :class="path.indexOf('/docs') > -1 ? 'active' : ''">
          <RouterLink to="/docs" @click="closeMenu">{{ t('common.docs') }}</RouterLink>
        </li>
      </ul>
      <!-- end navigation -->

      <!-- (removed legacy lanch navigation) -->

      <div class="flex space justify-end items-center gap-1">
        <a target="_blank" href="https://github.com/wetee-dao" class="coin__btn hidden md:block" title="github code">
          <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4251"
            width="256" height="256">
            <path
              d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"
              p-id="4252">
            </path>
          </svg>
        </a>

        <!-- language switcher -->
        <div class="header__lang flex items-center overflow-hidden">
          <button type="button" :class="['header__lang-btn', locale === 'en' ? 'header__lang-btn--active' : '']"
            @click="switchLocale('en')">
            EN
          </button>
          <button type="button" :class="['header__lang-btn', locale === 'zh-CN' ? 'header__lang-btn--active' : '']"
            @click="switchLocale('zh-CN')">
            中文
          </button>
        </div>

        <!-- wallet -->
        <div class="header__cta connect" @click="login" v-if="!userInfo">
          <span class="text">&nbsp;{{ t('common.connect') }}</span>
        </div>
        <div class="header__cta connect" @click="login" v-if="userInfo">
          <img class="uicon wallet-logo" :src="walletIcon(userInfo)" :alt="userInfo?.name || 'wallet'" />
          <span class="text">{{ userInfo.name }}</span>
        </div>
        <!-- end wallet -->

        <!-- dapp -->
        <a target="_blank" href="/dapp" class="header__cta inverse" title="Decentralization trust cloud">
          <span class="text">{{ t('common.dapp') }}</span>
        </a>
        <!-- end dapp -->
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@nuxt/ui/composables'
import { getWallets, type Wallet } from '@talismn/connect-wallets'
import { useGlobalStore } from '@/stores/global'
import useGlobelProperties from '@/plugins/globel'
import { setLocale, getLocale, type LocaleId } from '@/locales'
import router from '@/router'
import Svgimg from '@/components/svg/SvgImg.vue'
import MPC from './svg/MPC.vue'
import Miner from './svg/Miner.vue'
import Bridge from './svg/Bridge.vue'
import Store from './svg/Store.vue'
import Cloud from './svg/Cloud.vue'
import MainchainContracts from './svg/MainchainContracts.vue'
import Logo from './svg/Logo2.vue'

const { t } = useI18n()
const locale = ref<LocaleId>(getLocale())

const switchLocale = (l: LocaleId) => {
  setLocale(l)
  locale.value = getLocale()
}

const props = defineProps(['shadow'])
const userStore = useGlobalStore()
const toast = useToast()
const supportedWallets: Wallet[] = getWallets()

const walletIcon = (info: any) => {
  const walletName = String(info?.wallet ?? '').toLowerCase()
  const target = supportedWallets.find((wallet) => wallet.extensionName.toLowerCase() === walletName)
  if (target?.logo?.src) return target.logo.src
  if (walletName === 'demo-login') return '/imgs/by_polkadot.svg'
  return '/imgs/by_polkadot.svg'
}

const group = ref("main")
const showSub = ref(true)

const getPath = (paths: any) => {
  group.value = "main"
  if (paths.length === 0) return '/'

  const lpath = paths[paths.length - 1]
  // legacy: meta.group (e.g. "lanch") removed

  return paths[paths.length - 1].path
}
const path = ref(getPath(userStore.paths))
const userInfo = ref(userStore.userInfo)
const isActivce = ref(false)
const global = useGlobelProperties()

if (!props.shadow) {
  window.$app = global;
  window.$toast = toast;
  global.$toast = toast;
}

const toggleMenu = () => {
  isActivce.value = !isActivce.value
}

const closeMenu = () => {
  isActivce.value = false
}

const onNavItemClick = () => {
  unfocus()
  closeMenu()
}

const login = () => {
  global.$Login()
}

userStore.$subscribe((mutation, state) => {
  path.value = getPath(state.paths)
  userInfo.value = state.userInfo
  closeMenu()
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

watch(isActivce, (active) => {
  // 避免移动端菜单打开时页面滚动穿透
  document.body.style.overflow = active ? 'hidden' : ''
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
@use "sass:color";

.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 20;
  // border-bottom: 1px solid rgba(236, 236, 236, 0.04);
  background-color: rgba($primary-bg-rgb, 0.92);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.header-shadow {
  z-index: 8;
  left: -3px;
  top: 1.5px;
  border: none;
  background: transparent;
  box-shadow: none;

  :deep(.header__logo) {
    svg {
      // filter: grayscale(100%);
      transform: scale(1.2);
      position: relative;
      top: -2px;
      left: 3px;
    }
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
    height: 22px;
    align-items: center;
    cursor: pointer;
    margin: 3px 50px 3px 4px;

    svg {
      height: 100%;
      width: auto;
      // filter: grayscale(100%) brightness(100);
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
    padding: 10px; // 提升移动端可点击区域
    margin-left: -10px;

    span {
      position: absolute;
      left: 0;
      display: block;
      width: 24px;
      height: 2px;
      background-color: rgba($secondary-text-rgb, 0.6);
      
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
    justify-content: center;
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
    z-index: 20;
    height: 80px;
    position: relative;
    top: 2px;
    margin-left: 20px;
  }

  .header__nav--active {
    transform: translate3d(0, 0, 0);
  }

  .header__nav>li {
    display: block;
    margin-left: 0.9vw;
    margin-right: 0.9vw;
    margin-bottom: 0;
    position: relative;
    padding: 6px 0;

    &.active {
      &:after {
        content: ' ';
        width: 126%;
        height: 60%;
        background-color: rgba($secondary-text-rgb, 0.1);
        position: absolute;
        bottom: 20%;
        left: -13%;
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
      top: 40px;
      background-color: rgba($secondary-text-rgb, 0.07);
      border-bottom: none;
      z-index: 20;
      left: -7%;
      // left: calc(-170px + 50%);
      padding: 5px;

      li {
        background-color: rgba($primary-bg-rgb, 1);
        border-bottom: 1px solid rgba($secondary-text-rgb, 0.1);
        width: 330px;
        padding: 15px 15px;

        a {
          text-align: left;
        }

        .icon {
          height: 30px;
          width: 30px;
          margin-right: 10px;
          color: $primary-text;
          fill: $primary-text;
        }
        
        .title {
          font-size: 16px;
          margin-bottom: 2px;
        }

        .subtitle {
          font-size: 12px;
          color: rgba($secondary-text-rgb, 0.5);
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

  .header__nav a {
    display: inline-block;
    font-size: 13px;
    line-height: 16px;
    text-align: center;
    color: rgba($secondary-text-rgb, 0.5) !important;
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

  .header__lang {
    height: 28px;
    background: color.adjust(#000, $lightness: 15%);

    .header__lang-btn {
      padding: 0 8px;
      height: 100%;
      font-size: 12px;
      color: rgba($secondary-text-rgb, 0.6);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: color 0.2s, background 0.2s;

      &:hover {
        color: $primary-text;
      }

      &--active {
        color: $primary-bg;
        background: rgba($primary-text-rgb, 0.9);
      }
    }
  }

  .coin__btn {
    width: 45px;
    margin-right: 3px;
    padding: 10px;

    svg {
      width: 100%;
      height: auto;
      fill: rgba($secondary-text-rgb, 0.5);
    }
  }

  .header__cta {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 30px;
    background-color: transparent;
    overflow: hidden;
    margin-right: -3px;
    padding: 0 9px 0 3px;
    cursor: pointer;
    border-right: none;

    &.inverse {
      padding: 0 15px;
      background-color: rgba($primary-text-rgb, 1);

      span {
        color: #040406;
        letter-spacing: -1px;
      }
    }

    &.connect {
      background: color.adjust(#000, $lightness: 15%);
    }

    .uicon {
      width: 30px;
      height: 30px;
      cursor: pointer;
      margin-left: -3px;
      margin-right: 9px;
    }

    .wallet-logo {
      object-fit: contain;
    }

    svg {
      width: 23px;
      height: auto;
      fill: $primary-text;
    }

    span {
      display: block;
      letter-spacing: 0.4px;
      // text-transform: uppercase;
      font-size: 13px;
      line-height: 16px;
      color: $primary-text;
      transition: 0.5s ease;
      word-break: break-all;
    }
  }

  .header__overlay {
    position: fixed;
    inset: 0;
    top: 80px;
    background: rgba(0, 0, 0, 0.62);
    // flat: no blur/glass effect
    z-index: 18;
  }

  @media (max-width: 765px) {
    .header__nav {
      // premium drawer (no gradients)
      background: rgba(12, 12, 14, 0.98);
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      // flat: no shadows, no blur
      position: fixed;
      top: 80px;
      left: 0;
      height: calc(100vh - 80px);
      padding: 12px 12px 18px;
      display: block;
      width: min(360px, 92vw);
      margin-left: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      transform: translate3d(-100%, 0, 0);
      transition: transform 0.28s cubic-bezier(0.2, 0.9, 0.2, 1);
      z-index: 19;

      li {
        width: 100%;
        margin: 0;

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
          padding: 12px 12px;
          border-radius: 10px;
          text-align: left;
          font-size: 14px;
          line-height: 18px;
          font-weight: 600;
          letter-spacing: 0.15px;
          color: rgba($secondary-text-rgb, 0.86) !important;
        }

        .header__dropdown {
          background-color: transparent;
          display: block;
          position: relative;
          top: 0;
          left: 0;
          padding: 6px 0 12px;

          li {
            width: 100%;
            background: transparent;

            a {
              text-align: left;
              font-size: 13px;
              line-height: 16px;
              font-weight: 500;
              color: rgba($secondary-text-rgb, 0.62) !important;
              padding: 10px 12px 10px 30px;
              position: relative;
              border-radius: 10px;

              &:before {
                content: "";
                position: absolute;
                left: 16px;
                top: 10px;
                bottom: 10px;
                width: 1px;
                background: rgba(255, 255, 255, 0.10);
              }
            }
          }
        }
      }
    }

    .connect {
      display: none;
    }

    .header__dropdown {
      li {
        padding: 0 !important;
      }

      .icon {
        display: none;
      }

      .title-wrap {
        width: 100%;
      }

      .title {
        width: 100%;
        text-align: center;
      }

      .subtitle {
        display: none;
      }
    }

    .header__nav--active {
      transform: translate3d(0, 0, 0);
    }

    .header__nav>li {
      .header__dropdown {
        margin-top: 4px;
      }
    }

    :deep(.header__nav>li) {
      &.active {
        // active 背景在移动端更柔和，避免“块状遮挡”
        &:after {
          opacity: 0.6;
        }
      }
    }

    // subtle separators between top-level items
    .header__nav>li {
      padding: 4px 2px;

      &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      > a {
        transition: background-color 0.15s ease, color 0.15s ease;

        &:active {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
      }
    }

  }
}
</style>
