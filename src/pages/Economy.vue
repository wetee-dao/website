<template>
  <div class="home">
    <div class="container">
      <!-- section title -->
      <div class="token-title">
        <div class="flex">
          <div class="iconfont plogo">&#xe612;</div>
          <div class="flex-1 flex flex-col justify-center">
            <strong>Token &amp; economics</strong>
            <h2>
              WeTEE is a non-profit-oriented decentralized project that issues and maintains tool software and blockchain using the DAO model. WTE is the core token behind WeTEE. Coordination between governance token holders and mining stakeholders is crucial for successful decentralized governance, and WTE serves as the tool to facilitate this coordination. WTE can be used to participate in WeTEE's OpenGov voting.
            </h2>
          </div>
        </div>
      </div>
      <!-- end section title -->

      <div class="token-item">
        <div class="token-item-title">
          Total Supply: 5,000,000
        </div>
        <div class="token-item-body">
          100% fairlanch<br/>
          No financing<br/>
          No founding team token
        </div>
      </div>

      <div class="token-item">
        <div class="token-item-title">
          WTE allocation has different proportions of vesting, as shown below:
        </div>
        <!-- chart -->
        <div class="token-item-body flex flex-col md:flex-row">
          <div class="md:w-2/3 flex flex-col justify-center">
            <table class="table">
              <thead>
                <tr>
                  <th style="width:120px">Distribution of Tokens</th>
                  <th style="width:120px">Share</th>
                  <th>Vesting</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Chain Mint</td>
                  <td>10%</td>
                  <td>Nodes participating in the consensus of blockchain will receive 10% of the block reward after
                    mining a block.</td>
                </tr>
                <tr>
                  <td>App Mint</td>
                  <td>10%</td>
                  <td>Upload the application template to the TEE application repository, and the applications will
                    share 5% of the current block's reward.</td>
                </tr>
                <tr>
                  <td>TEE Mint</td>
                  <td>40%</td>
                  <td>By staking TOKEN and providing TEE hardware to connect to the network, all miners will share 40%
                    of the current block's reward.</td>
                </tr>
                <tr>
                  <td>Staking</td>
                  <td>40%</td>
                  <td>Users participating in staking with vDOT/vETH/vBNC will share 40% of the current block's reward.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="md:w-1/3 pl-12 flex flex-col justify-center items-center">
            <div class="section__chart">
              <Doughnut :data="tokenData" :options="options" />
            </div>
            <ul class="tokenomics">
              <li v-for="t in tokens">
                <div class="dot" :style="'background-color:' + t.color">
                </div>{{ t.name }} – {{ t.amount }}%
              </li>
            </ul>
          </div>
        </div>
        <!-- end chart -->
      </div>

      <div class="token-item">
        <div class="token-item-title">
          Token Mint
        </div>
        <div class="token-item-body">
          The reward for each block on the first day is 0.1645834 WTE.<br/>
          The block reward decreases by 0.000474 (four ten-thousandths) every day (14400 blocks), meaning it halves in approximately four years, reducing to 0.08236 WTE (0.999526^1460=0.500471780053).<br/>
          The total issuance approaches 50,000,018 WTE.
          <img class="token-total" src="/public/imgs/token-total.png"/>
        </div>
      </div>

      <div class="token-item">
        <div class="token-item-title">
          Staking Mint
        </div>
        <div class="token-item-body">
          1. vDOT
          2. vETH
          3. vBNC
        </div>
      </div>

      <div class="token-item">
        <div class="token-item-title">
          Treasury
        </div>
        <div class="token-item-body">
          Treasury does not hold WTE, all proceeds will be channeled into the national treasury, which is managed
    using an openGOV approach.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

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

const tokens = ref([
  {
    name: 'Staking-DOT',
    amount: 35,
    color: '#e8c189',
  },
  {
    name: 'Staking-vETH',
    amount: 15,
    color: '#8c7ad1',
  },
  {
    name: 'Staking-stETH',
    amount: 15,
    color: '#f3efbd',
  },
  // {
  //   name: 'TEE APP Mint',
  //   amount: 10,
  //   color: '#5d5d5d',
  // },
  {
    name: 'TEE Mint',
    amount: 15,
    color: '#6378d6',
  },
  {
    name: 'Chain Node Mint',
    amount: 10,
    color: '#e076b6',
  },
])
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
</script>

<style lang="scss" scoped>
.home {
  padding-top: 80px;
}

.plogo {
  font-size: 115px;
  margin-left: -42px;
  margin-right: -20px
}

.token-title {
  margin-bottom: 20px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 2px;
    height: 50px;
    background-color: #cecdcd;
    bottom: -27px;
    left: 56px;
    transition: 0.5s ease;
  }

  strong {
    color: $primary-text;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 16px;
    line-height: 100%;
    margin-bottom: 8px;
    display: block;
  }

  h2 {
    font-size: 18px;
    color: #fff;
    text-align: left;
    line-height: 1.5;
    font-weight: lighter;
  }

  p {
    font-size: 18px;
    line-height: 26px;
    // color: $secondary-text;
    margin-bottom: 20px;
    text-align: left;
  }
}

.tokenomics {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 10px;

  li {
    margin: 5px 7px 0 7px;
    color: #fff;
    font-size: 12px;
    line-height: 14px;
    position: relative;
    padding-left: 19px;

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
  width: 80%;
  // min-height: 500px;
  filter: grayscale(30%);
}

.token-item {
  padding-left: 110px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    display: block;
    width: 30px;
    height: 2px;
    background-color: #cecdcd;
    top: 13px;
    left: 56px;
    transition: 0.5s ease;
  }

  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 2px;
    height: 100%;
    background-color: #cecdcd;
    top: 0px;
    left: 56px;
    transition: 0.5s ease;
  }

  .token-item-title {
    font-size: 18px;
  }

  .token-item-body{
    margin-bottom: 30px;
    color: #8e8c8c;
    font-size: 15px;
  }
}

.chart-title {
  margin-bottom: 6px;
}

.table {
  width: 100%;
  border-collapse: collapse;

  &,
  tr {
    border: 1px solid #ffffff28;
  }

  th,
  td {
    padding: 10px;
    text-align: left;
    border-left: 1px solid #ffffff28;
    text-align: center;
  }
}

.token-total{
  width: 100%;
  max-width: 400px;
  border: 5px solid #ffffffb8;
  margin-top: 5px;
}
</style>