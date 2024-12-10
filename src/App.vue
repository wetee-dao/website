<template>
  <NConfigProvider :theme="darkTheme">
    <NNotificationProvider>
      <Header />
      <Header :shadow="true" />
      <RouterView />
    </NNotificationProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import { onMounted, ref } from 'vue';
import useGlobelProperties from './plugins/globel';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { chainJson } from './utils/chain';
import { chainUrl } from './plugins/chain';
import { useGlobalStore } from "@/stores/global";
import { Metamask } from './providers/MetaSnap';
import { MetaMaskProvider } from './providers/metamask';
import { SubstrateProvider } from './providers/substrate';
import { getWallets, type Wallet } from '@talismn/connect-wallets';
import { NNotificationProvider, NConfigProvider, darkTheme } from 'naive-ui';
import { sleep } from './utils/time';

const global = useGlobelProperties();
const userStore = useGlobalStore()

onMounted(async () => {
  document.getElementById('loader')!.style.display = "none";
  document.getElementById('app')!.style.visibility = "visible";
  try {
    const wsProvider = new WsProvider(chainUrl);
    const api = await ApiPromise.create({
      provider: wsProvider,
      types: chainJson,
    });

    await api.rpc.chain.getFinalizedHead()
    await sleep(800)

    if (userStore.userInfo && userStore.userInfo.provider) {
      if (userStore.userInfo.provider == "metamask") {
        try {
          const MataMaskSnap = await Metamask.enable!("WeTEE")
          const chain = new MetaMaskProvider(MataMaskSnap)

          chain.snap = MataMaskSnap
          global.$setChain(chain)
        } catch (e) {
          global.$notification["error"]({
            content: 'Error',
            meta: "请安装 metamask 插件,错误 => " + JSON.stringify(e),
            duration: 2500,
            keepAliveOnHover: true
          })
          return;
        }
      } else if (userStore.userInfo.provider == "substrate") {
        if (userStore.userInfo.type == "keyring") {
          global.$setChain(new SubstrateProvider())
        } else {
          const wallet: Wallet | undefined = getWallets().find(wallet => wallet.extensionName === userStore.userInfo.wallet);
          if (!wallet) {
            global.$notification["error"]({
              content: 'Error',
              meta: "插件 " + userStore.userInfo.wallet + " 未安装",
              duration: 2500,
              keepAliveOnHover: true
            })
            return;
          }
        }

        for (let i = 0; i < 10; i++) {
          await sleep(800)
          try {
            global.$setChain(new SubstrateProvider())
            i = 10
          } catch (e) {
            global.$notification["error"]({
              content: 'Error',
              meta: "请安装 polkadot 插件,错误 => " + JSON.stringify(e),
              duration: 2500,
              keepAliveOnHover: true
            })
            return;
          }
        }
      }
    } else {
      global.$setChain(new SubstrateProvider())
    }

    global.$setClient(api);

    console.info("connect chain success")
  } catch {
    // notification["error"]({
    //   content: 'Error',
    //   meta: "connect chain error",
    //   duration: 2500,
    //   keepAliveOnHover: true
    // })
  }
})
</script>


<style lang="scss" scoped>
.header-shadow {
  z-index: 8;
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
</style>
