<template>
  <Header />
  <Header class="header-shadow" />
  <RouterView v-if="inited" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import { onMounted, ref } from 'vue';
import useGlobelProperties from './plugins/globel';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { chainType } from './utils/chain';
import { chainUrl } from './plugins/chain';

const global = useGlobelProperties();
const inited = ref(false);

onMounted(async () => {
  try {
    const wsProvider = new WsProvider(chainUrl);
    const api = await ApiPromise.create({
      provider: wsProvider,
      types: chainType,
    });

    await api.rpc.chain.getFinalizedHead()
    global.$setClient(api);
    console.info("connect chain success")
  } catch {
    console.error("connect chain error")
  }

  inited.value = true;
  document.getElementById('loader')!.style.display = "none";
  document.getElementById('app')!.style.visibility = "visible";
})
</script>


<style lang="scss" scoped>
.header-shadow {
  z-index: 98;
  background: transparent;
  backdrop-filter: none;
  left: -4px;
  top: 2px;
  border: none;

  :deep(.header__logo) {
    height: 23px;
  }

  :deep(.active) {
    &:after {
      display: none;
    }
  }
}

.header-shadow .header__nav a {
  color: #fff !important;
}
</style>
