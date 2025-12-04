<template>
    <svg :class="svgClass" aria-hidden="true">
        <use class="svg-use" :href="symbolId" :color="color" />
        <title v-if="iconTitle">{{ iconTitle }}</title>
    </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
    name: 'SvgIcon',
    props: {
        prefix: {
            type: String,
            default: 'icon'
        },
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: '',
        },
        className: {
            type: String,
            default: ''
        },
        iconTitle: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        const symbolId = computed(() => `#${props.name}`)
        const svgClass = computed(() => {
            if (props.className) {
                return `svg-icon ${props.className}`
            }
            return 'svg-icon'
        })
        return { symbolId, svgClass }
    }
})
</script>
<style scope>
.svg-icon {
    vertical-align: -0.1em;
    fill: currentColor;
    overflow: hidden;
}
</style>
