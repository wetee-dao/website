<template>
    <div class="data grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:gap-0 flex-1">
        <div class="flex items-center justify-end" v-for="item in items">
            <a class="outline-none flex-1 md:flex-none flex group items-center" target="_blank" :href="item.link">
                <div class="texts pr-2 lg:pr-4 flex flex-1 justify-center flex-auto flex-col items-end">
                    <div class="tag text-sm inline !text-xs">{{ item.name }}</div>
                    <div class="text-base inline ">{{ item.value }}</div>
                </div>
                <Svgimg class="icon" color="#e6007a" :name="item.icon" />
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref } from "vue";
import Svgimg from "@/components/svg/SvgImg.vue"
const props = defineProps(["params"])
const items = ref([
    {
        name: "Finalized Blocks",
        icon: "block",
        link: "https://polkadot.subscan.io/block",
        value: "-",
    },
    {
        name: "Signed Extrinsics",
        icon: "approve",
        link: "https://polkadot.subscan.io/extrinsic",
        value: "-",
    },
    {
        name: "Holders / Accounts",
        icon: "user",
        link: "https://polkadot.subscan.io/account",
        value: "-",
    },
    {
        name: "Transfers",
        icon: "transfer",
        link: "https://polkadot.subscan.io/transfer",
        value: "-",
    }
])

onMounted(() => {
    axios({
        method: 'post',
        url: 'https://polkadot.api.subscan.io/api/scan/metadata',
        headers: {
            'x-api-key': '4d0c8ba32dde4a06bda83d52af49120f'
        }
    }).then(function (response) {
        const data = response.data.data;
        items.value[0].value = data.blockNum
        items.value[1].value = data.count_signed_extrinsic
        items.value[2].value = data.count_account + "/" + data.count_account_all
        items.value[3].value = data.count_transfer
    });
})
</script>

<style lang='scss' scoped>
.data {
    color: #c0c0c0;

    .tag {
        color: #717171;
    }

    &>div {
        border: 2px solid rgba(60, 60, 60, 0.25);
        padding-left: 10px;
        margin: 0 0 8px 8px;

        &>a {
            height: 100%;
        }

        .texts {
            height: 100%;
            border-right: 1px solid rgba(60, 60, 60, 0.25);
        }
    }

    .icon {
        width: 25px;
        height: 25px;
        margin: 15px;
        min-height: 25px;
        max-height: 25px;
        opacity: 0.5;
    }
}

@media (max-width: 600px) {
    .data > div {
        padding-left: 0px;
        margin-left: 0px;
    }
}
</style>