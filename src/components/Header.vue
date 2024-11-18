<template>
  <header class="header">
    <div class="header__content container">
      <!-- btn -->
      <button :class="'header__btn  block md:hidden ' + (isActivce ? 'header__btn--active' : '')" type="button"
        @click="toggleMenu()">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <!-- end btn -->

      <!-- logo -->
      <RouterLink to="/" class="header__logo">
        <img src="/imgs/logo.svg" alt="">
      </RouterLink>
      <!-- end logo -->

      <!-- tagline -->
      <!-- <span class="space"></span> -->
      <!-- end tagline -->

      <!-- navigation -->
      <ul :class="'header__nav ' + (isActivce ? 'header__nav--active' : '')">
        <li :class="path == '/' ? 'active' : ''">
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li :class="path == '/vm' ? 'active' : ''">
          <RouterLink to="/vm">TEE vm</RouterLink>
        </li>
        <li :class="path == '/use-cases' ? 'active' : ''">
          <RouterLink to="/use-cases">Use Cases</RouterLink>
        </li>
        <li :class="path == '/tee-store' ? 'active' : ''">
          <RouterLink to="/tee-store">TEE Store</RouterLink>
        </li>
        <!-- <li class="dropdown">
          <RouterLink to="/tee-store">Developers</RouterLink>
        </li>
        <li class="dropdown">
          <RouterLink to="/tee-store">Token</RouterLink>
        </li> -->
        <!-- <li class="dropdown">
          <a href="/tee-store">TEE Store</a>
        </li> -->
        <li class="dropdown header__dropdown">
          <a class="trans" tkey="nav_white_paper" target="_blank" href="https://wetee.gitbook.io/docment">Docs</a>
        </li>
        <li :class="path == '/contacts' ? 'active' : ''">
          <RouterLink class="trans" tkey="nav_contact" to="/contacts">Contacts</RouterLink>
        </li>
      </ul>
      <!-- end navigation -->

      <span class="space"></span>

      <a target="_blank" href="https://github.com/wetee-dao" class="coin__btn" title="github code">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4251"
          width="256" height="256">
          <path
            d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"
            p-id="4252">
          </path>
        </svg>
      </a>

      <!-- wallet -->
      <a target="_blank" href="https://dapp.wetee.app/" class="header__cta" title="Decentralization trust clooud">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12882"
          width="256" height="256">
          <path
            d="M836.7616 217.4976l-239.9744-142.9504a165.5296 165.5296 0 0 0-169.5744 0L187.1872 217.6C134.912 248.6272 102.4 306.688 102.4 368.9984v285.9008c0 62.3104 32.512 120.32 84.7872 151.552l239.9744 142.8992a165.5296 165.5296 0 0 0 169.6256 0l240.0256-142.8992c52.2752-31.232 84.7872-89.2416 84.7872-151.552V369.0496c0-62.3104-32.512-120.3712-84.8384-151.552zM723.456 440.8832l-165.2736 94.72-3.4304 214.4256a43.0592 43.0592 0 0 1-42.3936 43.008h-0.7168a43.1616 43.1616 0 0 1-41.6768-44.4416l3.3792-208.7424L300.544 440.832a44.4928 44.4928 0 0 1-16.4352-59.4944 41.728 41.728 0 0 1 57.6512-16.9984L512 461.9776l170.24-97.5872c20.48-11.7248 46.2848-4.096 57.6512 16.9984a44.544 44.544 0 0 1-16.4864 59.4944z"
            p-id="12883"></path>
        </svg>&nbsp;
        <span class="trans" tkey="nav_connect">DAPP</span>
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBreadcrumbStore } from '@/stores/global';

const userStore = useBreadcrumbStore()
const getPath = (paths: any) => {
  if (paths.length === 0) return '/'
  return paths[paths.length - 1].path
}
const path = ref(getPath(userStore.paths))
const isActivce = ref(false)

const toggleMenu = () => {
  isActivce.value = !isActivce.value
}

userStore.$subscribe((mutation, state) => {
  path.value = getPath(state.paths)
  isActivce.value = false
}, { detached: true })

</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 99;
  border-bottom: 1px solid rgba(236, 236, 236, 0.08);
  background-color: transparent;
  transition: background - color 0.5s ease;
  background-image: radial - gradient(transparent 1px, #040406 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
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
    margin-bottom: 5px;

    img {
      height: 100%;
      width: auto;
    }
  }

  .header__btn {
    width: 24px;
    height: 22px;
    margin-right: 10px;
    position: relative;
    top: 2px;

    span {
      position: absolute;
      left: 0;
      display: block;
      width: 24px;
      height: 2px;
      background-color: #50fa82;
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
  }

  .header__nav--active {
    transform: translate3d(0, 0, 0);
  }

  .header__nav li {
    display: block;
    margin-left: 30px;
    margin-bottom: 0;

    &:first-child {
      display: none;
    }

    &.active {
      position: relative;

      &:after {
        content: ' ';
        border-radius: 6px;
        width: 130%;
        height: 120%;
        background-color: rgba($secondary-text-rgb, 0.05);
        position: absolute;
        bottom: -10%;
        left: -15%;
      }
    }
  }

  .header__nav a {
    display: inline-block;
    font-size: 15px;
    font-weight: bold;
    line-height: 24px;
    color: #fff !important;
    background: transparent !important;
    width: 100%;
    cursor: pointer;
  }

  .header__nav a svg {
    fill: #fff;
    width: 14px;
    height: auto;
    transition: 0.5s ease;
    margin-left: 1px;
    margin-top: 2px;
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
    margin-right: 10px;
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
    height: 42px;
    background-color: transparent;
    filter: grayscale(60%);
    overflow: hidden;
    margin-right: 0px;
    padding: 0 10px;
    border: 3px solid $primary-text;

    svg {
      width: 21px;
      height: auto;
      fill: $primary-text;
    }

    span {
      display: block;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      font-size: 16px;
      // font-family: "letter-font";
      // font-weight: 700;
      color: $primary-text;
      transition: 0.5s ease;
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

      li {
        margin: 0;
        width: 150px;

        &:first-child {
          display: block;
        }


        a {
          padding: 10px;
        }
      }
    }

    .header__nav--active {
      display: block;
    }
  }

}
</style>