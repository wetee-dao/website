<template>
  <div class="chain-mint">
    <div class="bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { $getChainProvider } from '@/plugins/chain';
import { useGlobalStore } from '@/stores/global';
import { onMounted, onUnmounted } from 'vue';

const userStore = useGlobalStore()

onMounted(async () => {
  await $getChainProvider(async (chain): Promise<void> => {
    const signer = userStore.userInfo.addr;
    const client = chain!.client!;
    let call = client.tx.session.setKeys({
      aura: client!.createType('AccountId32', signer).toHex(),
    }, '0x00')

    await chain.signAndSend(call, signer, () => {
      window.$notification["success"]({
        content: 'Success',
        meta: "Staking successful, the staking rewards will be calculated in the next cycle.",
        duration: 2500,
        keepAliveOnHover: true
      })
    }, () => {

    })
  })
})

onUnmounted(async () => {

})

</script>

<style lang="scss" scoped>
.chain-mint {}
</style>
