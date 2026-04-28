<template>
  <div class="home gradient-body">
    <div class="container">
      <!-- section title -->
      <div class="token-title">
        <div class="flex">
          <div class="iconfont plogo">&#xe612;</div>
          <div class="flex-1 flex flex-col justify-center">
            <strong>{{ t('launch.economy.title') }}</strong>
            <h2 v-html="t('launch.economy.heroHtml')" />
          </div>
        </div>
      </div>
      <!-- end section title -->

      <div class="token-item">
        <div class="token-item-title">
          {{ t('launch.economy.usage.title') }}
        </div>
        <div class="token-item-body" v-html="t('launch.economy.usage.bodyHtml')" />
      </div>

      <div class="token-item">
        <div class="token-item-title">
          {{ t('launch.economy.voteSplit.title') }}
        </div>
        <!-- chart -->
        <div class="token-item-body flex flex-col md:flex-row">
          <div class="md:w-2/3 flex flex-col justify-center">
            <table class="table">
              <thead>
                <tr>
                  <th style="width:160px">{{ t('launch.economy.voteSplit.table.party') }}</th>
                  <th style="width:160px">{{ t('launch.economy.voteSplit.table.vote') }}</th>
                  <th>{{ t('launch.economy.voteSplit.table.desc') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ t('launch.economy.voteSplit.rows.consumer.party') }}</td>
                  <td>{{ t('launch.economy.voteSplit.rows.consumer.vote') }}</td>
                  <td>{{ t('launch.economy.voteSplit.rows.consumer.desc') }}</td>
                </tr>
                <tr>
                  <td>{{ t('launch.economy.voteSplit.rows.compute.party') }}</td>
                  <td>{{ t('launch.economy.voteSplit.rows.compute.vote') }}</td>
                  <td>{{ t('launch.economy.voteSplit.rows.compute.desc') }}</td>
                </tr>
                <tr>
                  <td>{{ t('launch.economy.voteSplit.rows.consensus.party') }}</td>
                  <td>{{ t('launch.economy.voteSplit.rows.consensus.vote') }}</td>
                  <td>{{ t('launch.economy.voteSplit.rows.consensus.desc') }}</td>
                </tr>
                <tr>
                  <td colspan="3">
                    {{ t('launch.economy.voteSplit.note') }}
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
          {{ t('launch.economy.fees.title') }}
        </div>
        <div class="token-item-body" v-html="t('launch.economy.fees.bodyHtml')" />
      </div>

      <div class="token-item">
        <div class="token-item-title">
          {{ t('launch.economy.treasury.title') }}
        </div>
        <div class="token-item-body" v-html="t('launch.economy.treasury.bodyHtml')" />
      </div>

      <div class="token-item">
        <div class="token-item-title">
          {{ t('launch.economy.govRole.title') }}
        </div>
        <div class="token-item-body" v-html="t('launch.economy.govRole.bodyHtml')" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onUnmounted, ref } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

const { t } = useI18n()

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

// 每笔消费对应的 VOTE 分配比例（归一化成 100% 用于图表展示）
// 消费者: 2, 算力节点: 1, 共识打包节点: 当前交易VOTE/3 = (2 + 1)/3 = 1  => total = 4
const TX_VOTE_BASE = 2 + 1
const CONSENSUS_VOTE = TX_VOTE_BASE / 3
const SPLIT_TOTAL = 2 + 1 + CONSENSUS_VOTE
const tokens = ref([
  { name: t('launch.economy.voteSplit.legend.consumer'), amount: Number(((2 / SPLIT_TOTAL) * 100).toFixed(2)), color: '#e076b6' },
  { name: t('launch.economy.voteSplit.legend.compute'), amount: Number(((1 / SPLIT_TOTAL) * 100).toFixed(2)), color: '#6378d6' },
  { name: t('launch.economy.voteSplit.legend.consensus'), amount: Number(((CONSENSUS_VOTE / SPLIT_TOTAL) * 100).toFixed(2)), color: '#e8c189' },
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
  padding-top: 100px;
  min-height: 100vh;
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
  padding-left: 135px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    display: block;
    width: 40px;
    height: 2px;
    background-color: #cecdcd;
    top: 15px;
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

  .token-item-body {
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

.token-total {
  width: 100%;
  max-width: 400px;
  border: 5px solid #ffffffb8;
  margin-top: 5px;
}
</style>