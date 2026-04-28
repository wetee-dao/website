<template>
    <div class="loading-box">
        <div class="loader">
            <span class="loader-text">{{ text }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps(["text"])
const text = ref(props.text || "Loading...");
</script>

<style lang='scss' scoped>
.loading-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5px;

    .loader {
        width: fit-content;
        font-family: "letter-font", Serif;
        letter-spacing: 1em;
        background: rgba($secondary-text-rgb, 0.04);
        animation: none;
        height: 8em;
        line-height: 8em;
        padding: 0 1em;
    }

    .loader-text {
        color: $primary-text;
        font-size: 4.2em;
        padding: 0 0.5em;
        -webkit-background-clip: text;
        background-clip: text;
    }

}
</style>