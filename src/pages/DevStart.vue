<template>
    <div class="dev-start flex flex-col justify-around items-center">
        <div class="btn" @click="setChainId">setChainId</div>
        <div class="btn" @click="addPrantChainToken">addPrantChainToken</div>
        <div class="btn" @click="initToken">initToken</div>
        <div class="btn" @click="initToken">initRpc</div>
    </div>
</template>

<script setup lang="ts">
import { $getChainProvider, getConfig } from '@/plugins/chain';
import { useGlobalStore } from '@/stores/global';
import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import Keyring from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { ISubmittableResult } from '@polkadot/types/types';
import { onMounted, onUnmounted } from 'vue';

const userStore = useGlobalStore()

onMounted(async () => {

})

onUnmounted(async () => {

})

const setChainId = async () => {
    await $getChainProvider(async (chain): Promise<void> => {
        const client = chain!.client!;

        const keyring = new Keyring({ type: 'sr25519' });
        const alice = keyring.addFromUri('//Alice');


        let call = client.tx.sudo.sudo(
            client.tx.asset.setChainId(4545)
        )
        await send(client, call, alice)
    })
}

const addPrantChainToken = async () => {
    await $getChainProvider(async (chain): Promise<void> => {
        const client = chain!.client!;

        const keyring = new Keyring({ type: 'sr25519' });
        const alice = keyring.addFromUri('//Alice');


        let call = client.tx.sudo.sudo(
            client.tx.asset.parachainAssetRegister(0, "0x00", {
                name: "DEV",
                symbol: "DEV",
                decimals: 12,
            })
        )
        await send(client, call, alice)
    })
}

const initToken = async () => {
    await $getChainProvider(async (chain): Promise<void> => {
        const signer = userStore.userInfo.addr;
        const client = chain!.client!;

        const keyring = new Keyring({ type: 'sr25519' });
        const alice = keyring.addFromUri('//Alice');


        let call = client.tx.balances.transferAllowDeath(signer, 1000_000_000_000_000);
        await send(client, call, alice)
    })

    const config = getConfig()
    const chainConfig = config.Chains[0]
    await $getChainProvider(async (chain): Promise<void> => {
        const signer = userStore.userInfo.addr;
        const client = chain!.client!;

        const keyring = new Keyring({ type: 'sr25519' });
        const alice = keyring.addFromUri('//Alice');


        let call = client.tx.balances.transferAllowDeath(signer, 1000_000_000_000_000);
        await send(client, call, alice)
    }, chainConfig.api)
}

const send = async (api: ApiPromise, call: SubmittableExtrinsic<"promise", ISubmittableResult>, user: KeyringPair) => {
    const { nonce }: any = await api.query.system.account(user.address);

    return new Promise(async (resolve, reject) => {
        await call.signAndSend(user, { nonce }, ({ events = [], status,dispatchError }) => {
            console.log('Transaction status:', status.type);

            if (dispatchError) {
                reject("err")
            }

            if (status.isInBlock) {
                console.log('Included at block hash', status.asInBlock.toHex());
                console.log('Events:');

                events.forEach(({ event: { data, method, section }, phase }) => {
                    console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                });

                resolve("success")
            } else if (status.isFinalized) {
                console.log('Finalized block hash', status.asFinalized.toHex());
                resolve("success")
            }
        });
    });
}
</script>

<style lang="scss" scoped>
.dev-start {
    margin-top: 100px;
    height: calc(100vh - 100px);
}
</style>