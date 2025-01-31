<template>
  <div class="home">
    <Banner />
    <div class="container section">
      <div class="grid grid-cols-1 md:grid-cols-3 grid-flow-row gap-6">
        <div class="features features--first">
          <h3 class="features__title">Confidential Cloud</h3>
          <p class="features__text">A decentralized platform for deploying
            confidential applications, designed specifically for confidential computing.</p>
        </div>
        <div class="features features--yellow">
          <h3 class="features__title">WEB2 transition to WEB3</h3>
          <p class="features__text">All WEB2 applications, once deployed, possess the characteristics of smart
            contracts.</p>
        </div>
        <div class="features features--nephrite">
          <h3 class="features__title">Confidential AI</h3>
          <p class="features__text">Provide a decentralized training and deployment solution for AI, ensuring
            confidential computing throughout the entire process of training and deployment.</p>
        </div>
      </div>
    </div>

    <div id="economics" class="section section--bt">
      <div class="container">
        <div class="flex flex-col md:flex-row">
          <!-- section title -->
          <div class="md:w-2/3 flex flex-col justify-center">
            <div class="token-title">
              <strong>100% fairlanch</strong>
              <h2>Token &amp; economics</h2>
              <p>
                In the design of the economic model, the following principles are fundamentally adhered to:<br>
                1. Adopting the DAO model for issuing and maintaining tool software and blockchain<br>
                2. Striving to achieve maximum decentralization<br>
                3. Reducing user costs<br>
                4. Attempting to minimize the entry barriers for block producers and node operation expenses<br>
                5. Avoiding high consensus security maintenance costs
              </p>
            </div>

            <ul class="tokenomics">
              <li v-for="t in tokens">
                <div class="dot" :style="'background-color:' + t.color">
                </div>{{ t.name }} – {{ t.amount }}%
              </li>
            </ul>
          </div>
          <!-- end section title -->

          <!-- chart -->
          <div class="md:w-1/3 flex justify-center items-center">
            <div class="section__chart">
              <Doughnut :data="tokenData" :options="options" />
            </div>
          </div>
          <!-- end chart -->
        </div>
      </div>
    </div>
    
    <div id="roadmap" class="roadmaps section section--bt tbg">
      <div class="container">
        <div class="section__title section__title--carousel">
          <h2 id="hash1366708796">Roadmap</h2>
        </div>
        <div class="slides">
          <Splide :options="slideoptions" :has-track="false">
            <div class="splide__arrows">
              <button class="splide__arrow splide__arrow--prev">
                <i class="iconfont">&#xe602;</i>
              </button>
              <button class="splide__arrow splide__arrow--next">
                <i class="iconfont">&#xe602;</i>
              </button>
            </div>
            <SplideTrack>
              <SplideSlide v-for="r in roadmaps">
                <div class="roadmap roadmap--active">
                  <h3 class="roadmap__title">{{ r.title }}</h3>
                  <ul class="roadmap__list">
                    <li v-for="item in r.list">{{ item }}</li>
                  </ul>
                </div>
              </SplideSlide>
            </SplideTrack>
          </Splide>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
// @ts-ignore
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import Banner from '@/components/Banner.vue'
import Footer from '@/components/Footer.vue'
import { tokenRatio } from '@/utils/tokens';


ChartJS.register(ArcElement, Tooltip, Legend)
onUnmounted(() => {
  ChartJS.unregister(ArcElement, Tooltip, Legend)
})

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      caretSize: 0,
      callbacks: {
        label: function (context: any) {
          return context.raw + "%"
        },
      }
    }
  },
})

const tokens = ref(tokenRatio)
const tokenLabels = tokens.value.map(t => t.name)
const tokenValueData = tokens.value.map(t => t.amount)
const tokenColors = tokens.value.map(t => t.color)
const tokenData = ref({
  labels: tokenLabels,
  datasets: [
    {
      backgroundColor: tokenColors,
      data: tokenValueData,
      pointLabel: false,
      borderWidth: 0,
    }
  ]
})

const roadmaps = ref([
  {
    title: '2023 Q4',
    list: [
      'On-Chain worker mortgage / create',
      'On-Chain TEE App create',
      'On-Chain TEE task create',
      'Worker K8S operator in TEE',
      'Worker App deploy',
      'Worker task deploy',
      'TEE image build-tool',
    ]
  }, {
    title: '2024 Q1',
    list: [
      'Worker sgx attestation',
      'WeTEE Dapp front end',
      'WeTEE test network',
      'WeTEE main network',
      'Auction Kusama slots',
      'On-Chain App Store',
    ]
  }, {
    title: '2024 Q2',
    list: [
      'Integrate paritytech frontier, compatible with ETH accounts and EVM',
      'WeTEE & DTIM are compatible with Ethereum, achieving heterogeneous cross-chain functionality',
      'Web Dapp login with metamask',
    ]
  }, {
    title: '2024 Q3',
    list: [
      "Intel TDX's new libos proposal for a new solution",
      "AMD SEV's new libos proposal for a new solution",
      "Ink! and Solidity's runtime environment",
      "TEE and contract invocation protocol",
    ]
  }
])
const slideoptions = ref({
  gap: '1rem',
  perPage: 4,
  breakpoints: {
    1250: {
      perPage: 3,
    },
    1024: {
      perPage: 2,
    },
    640: {
      perPage: 1,
    },
  },
});
</script>

<style lang="scss" scoped>
.home {
  padding-top: 80px;
}

.features {
  background-color: #2121215c;
  padding: 30px 20px;
  // border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  overflow: hidden;

  .features__title {
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
      border-radius: 4px;
      background-color: $primary-text;
      top: 0;
      left: 0;
      transition: 0.5s ease;
    }
  }

  .features__text {
    position: relative;
    z-index: 3;
    font-size: 16px;
    line-height: 26px;
    color: $secondary-text;
    margin-bottom: 0;
    word-break: break-all;
  }
}

.features--yellow .features__title::before {
  background-color: #e8d189;
}

.features--nephrite .features__title::before {
  background-color: #5d5d5d;
}

.token-title {
  strong {
    color: $primary-text;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 14px;
    line-height: 100%;
    margin-bottom: 15px;
  }

  h2 {
    font-size: 30px;
    color: #fff;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: left;
    line-height: 44px;
  }

  p {
    font-size: 16px;
    line-height: 26px;
    color: $secondary-text;
    margin-bottom: 20px;
    text-align: left;
  }
}

.tokenomics {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 10px;

  li {
    margin: 10px 25px 0 0;
    color: #fff;
    font-size: 16px;
    line-height: 26px;
    position: relative;
    padding-left: 25px;

    .dot {
      background-color: #e8c189;
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.section__chart {
  width: 100%;
  min-height: 500px;
  filter: grayscale(30%);
}

.roadmaps {
  border: none;
  // background-color: #0f0f0f;

  .slides {
    position: relative;
    background: rgba(40, 40, 40, 0.35);
    padding: 30px;
    // border-radius: 20px;

    .splide__arrows {
      position: absolute;
      right: -10px;
      top: -105px;
      display: flex;
    }

    .splide__arrow {
      padding: 10px;
      border-radius: 0;
      background-color: #5252525a;
      position: relative;
      transform: none;
      margin-left: 10px;
      left: 0;
    }

    :deep(.splide__pagination) {
      bottom: -15px;
    }

    &::before {
      content: '';
      position: absolute;
      display: block;
      height: 4px;
      top: 82px;
      right: 30px;
      left: 30px;
      background-color: $primary-text;
    }

    .splide__arrow--prev {
      transform: rotate(180deg);
    }
  }

  h2 {
    font-size: 30px;
    color: #fff;
    font-weight: 600;
    margin-bottom: 36px;
    padding-top: 15px;
    text-align: left;
    line-height: 44px;
  }

  .roadmap::before {
    width: 24px;
    height: 24px;
    left: 0;
    top: 42px;
    background-color: #fff;
    opacity: 0.12;
    z-index: 1;
    content: '';
    position: absolute;
    display: block;
    border-radius: 50%;
  }

  .roadmap::after {
    content: "";
    position: absolute;
    display: block;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    left: 5px;
    top: 47px;
    background-color: $primary-text;
    z-index: 2;
  }

  .roadmap__title {
    font-size: 20px;
    color: #fff;
    font-weight: 600;
    display: block;
    margin-bottom: 50px;
    margin-left: 10px;
  }

  .roadmap__list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 0;
    margin-top: 0;
    padding: 0;
    margin-left: 8px;

    li {
      color: #fff;
      font-size: 16px;
      line-height: 26px;
      margin-bottom: 12px;
      padding-left: 16px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        background-color: $primary-text;
        opacity: 1;
        top: 50%;
        margin-top: -1px;
        left: 1px;
        border-radius: 50%;
      }
    }
  }
}
</style>