<template>
    <div class="loading-box">
        <div class="loader"></div>
    </div>
</template>

<script setup lang="ts">
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
        background: linear-gradient(90deg, rgba($secondary-text-rgb, 0.04) 50%, #0000 0) right/200% 100%;
        animation: l21 2s infinite linear;
        height: 8em;
        line-height: 8em;
        padding: 0 1em;
    }

    .loader::before {
        content: "Loading...";
        color: $primary-text;
        font-size: 4.2em;
        padding: 0 0.5em;
        -webkit-background-clip: text;
        background-clip: text;
    }

    @keyframes l21 {
        100% {
            background-position: left
        }
    }
}
</style>