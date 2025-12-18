<template>
    <div class="data grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:gap-0 flex-1">
        <div class="flex items-center justify-end" v-for="item in items">
            <RouterLink class="outline-none flex-1 md:flex-none flex group items-center" :to="item.link">
                <Svgimg class="icon" color="#50fa82" :name="item.icon" />
                <div class="texts pl-2 lg:pl-4 flex flex-1 justify-center flex-auto flex-col">
                    <div class="tag text-sm inline !text-xs">{{ item.name }}</div>
                    <div class="text-base inline">{{ item.value }}</div>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Svgimg from "@/components/svg/SvgImg.vue"
import { GetNowTx, GetSideChainNodes, GetSideChainStatus } from "@/apis/side";
const props = defineProps(["params"])
const items = ref([
    {
        name: "Finalized Blocks",
        icon: "block",
        link: "/chain/blocks",
        value: "-",
    },
    {
        name: "Transfers",
        icon: "transfer",
        link:  "/chain/txs",
        value: "-",
    },
    {
        name: "Secret Nodes",
        icon: "secret",
        link: "/nodes",
        value: "-",
    },
    {
        name: "TEE Applications",
        icon: "applications",
        link: "/apps",
        value: "-",
    }
])

onMounted(() => {
    GetSideChainStatus().then(async (data) => {
        items.value[0].value = data.sync_info.latest_block_height

        const tx = await GetNowTx(data.sync_info.latest_block_height)
        items.value[1].value = tx.total_count

    })
    GetSideChainNodes().then((data) => {
        items.value[2].value = data.n_peers
    })
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
        // padding-left: 10px;
        padding-right: 10px;
        margin: 0 8px 8px 0;

        &>a {
            width: 100%;
            height: 100%;
        }

        .texts {
            height: 100%;
            border-left: 1px solid rgba(60, 60, 60, 0.25);
        }
    }

    .icon {
        width: 25px;
        height: 25px;
        margin: 15px;
        min-height: 25px;
        max-height: 25px;
    }
}

@media (max-width: 600px) {
    .data>div {
        padding-right: 0px;
        margin-right: 0px;
    }
}
</style>