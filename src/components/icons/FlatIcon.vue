<template>
  <svg
    class="flat-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Products -->
    <g v-if="name === 'prod-vm'">
      <rect x="5" y="4" width="14" height="5" rx="1" stroke="currentColor" stroke-width="1.5" />
      <rect x="5" y="11" width="14" height="5" rx="1" stroke="currentColor" stroke-width="1.5" />
      <rect x="5" y="18" width="14" height="3" rx="0.5" stroke="currentColor" stroke-width="1.5" />
    </g>
    <g v-else-if="name === 'prod-store'">
      <path
        d="M6 10h12v10a1 1 0 01-1 1H7a1 1 0 01-1-1V10z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M8 10V8a4 4 0 018 0v2"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path d="M9 14h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </g>
    <g v-else-if="name === 'prod-bridge'">
      <circle cx="8" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
      <circle cx="16" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
      <path d="M11 12h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </g>
    <g v-else-if="name === 'prod-mpc'">
      <circle cx="12" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5" />
      <circle cx="6" cy="17" r="2.5" stroke="currentColor" stroke-width="1.5" />
      <circle cx="18" cy="17" r="2.5" stroke="currentColor" stroke-width="1.5" />
      <path d="M10.5 8L7.5 15M13.5 8l3 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </g>
    <!-- Use cases -->
    <g v-else-if="name === 'use-ai'">
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
      <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </g>
    <g v-else-if="name === 'use-lock'">
      <rect x="6" y="11" width="12" height="10" rx="1" stroke="currentColor" stroke-width="1.5" />
      <path
        d="M8 11V8a4 4 0 018 0v3"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </g>
    <g v-else-if="name === 'use-link'">
      <path d="M10 14l-2 2a4 4 0 010-6l3-3a4 4 0 015 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M14 10l2-2a4 4 0 010 6l-3 3a4 4 0 01-5 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </g>
    <g v-else-if="name === 'use-defi'">
      <path d="M6 18V8M10 18v-6M14 18V5M18 18v-9" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
    </g>
    <g v-else-if="name === 'use-game'">
      <rect x="4" y="8" width="16" height="8" rx="2" stroke="currentColor" stroke-width="1.5" />
      <path d="M8 12h2M9 11v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="16" cy="13" r="1" fill="currentColor" />
      <circle cx="14" cy="11" r="1" fill="currentColor" />
    </g>
    <!-- Why -->
    <g v-else-if="name === 'why-pay'">
      <rect x="5" y="8" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.5" />
      <path d="M8 8V7a4 4 0 018 0v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M5 12h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </g>
    <g v-else-if="name === 'why-chain'">
      <path d="M4 8h16M4 12h16M4 16h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="16" cy="12" r="1.5" fill="currentColor" />
      <circle cx="10" cy="16" r="1.5" fill="currentColor" />
    </g>
    <g v-else-if="name === 'why-shield'">
      <path
        d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    </g>
    <g v-else-if="name === 'why-bolt'">
      <path
        d="M13 2L4 14h6.5l-1.5 8L18 10h-6.5L13 2z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    </g>
    <g v-else-if="name === 'why-code'">
      <path d="M8 9l-3 3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16 9l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M14 7l-4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  name:
    | 'prod-vm'
    | 'prod-store'
    | 'prod-bridge'
    | 'prod-mpc'
    | 'use-ai'
    | 'use-lock'
    | 'use-link'
    | 'use-defi'
    | 'use-game'
    | 'why-pay'
    | 'why-chain'
    | 'why-shield'
    | 'why-bolt'
    | 'why-code'
}>()
</script>

<style scoped>
.flat-icon {
  display: block;
  flex-shrink: 0;
}
</style>
