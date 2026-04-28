<template>
  <div class="min-h-screen pt-[100px] gradient-body">
    <!-- Hero -->
    <section
      class="box-border flex flex-col h-[calc(100vh-120px)] min-h-[760px] sm:min-h-[650px] md:min-h-[640px] lg:min-h-[720px] xl:min-h-[600px]"
    >
      <div
        class="hero-banner container relative flex min-h-0 flex-1 flex-col overflow-hidden border-4 border-[#ffffff0f] bg-[rgba(var(--g-primary-bg-rgb),0.35)]"
      >
        <PixelBg />
        <div class="hud-corner tl"></div>
        <div class="hud-corner tr"></div>
        <div class="hud-corner bl"></div>
        <div class="hud-corner br"></div>
        <div
          class="relative z-[1] flex min-h-0 flex-1 flex-col justify-center px-4 py-10 text-center lg:px-8 lg:py-14"
        >
          <h1
            class="mx-auto max-w-[52rem] text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight text-[var(--g-primary-text)]"
          >
            {{ t('home.hero.title') }}
          </h1>
          <p class="mt-4 text-[1.05rem] text-[rgba(var(--g-secondary-text-rgb),0.85)]">
            {{ t('home.hero.subtitle') }}
          </p>
          <p class="mt-3 text-[0.95rem] text-[rgba(var(--g-secondary-text-rgb),0.65)] opacity-80">
            {{ t('home.hero.bullets') }}
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/dapp" :class="homeBtnPrimary">{{ t('home.hero.ctaStart') }}</a>
            <a
              target="_blank"
              :href="docsEntryUrl()"
              :class="homeBtnOutline"
              >{{ t('home.hero.ctaDocs') }}</a
            >
          </div>
          <div class="mt-12 flex flex-wrap justify-center gap-4 lg:gap-6">
            <div
              class="chain-box min-w-[140px] border border-white/[0.06] px-5 py-4 text-center"
            >
              <div class="text-[0.95rem] font-semibold text-[var(--g-primary-text)]">
                {{ t('home.hero.featVm') }}
              </div>
              <div class="mt-1.5 text-[0.8rem] text-[rgba(var(--g-secondary-text-rgb),0.55)]">
                {{ t('home.hero.featVmSub') }}
              </div>
            </div>
            <div
              class="chain-box min-w-[140px] border border-white/[0.06] px-5 py-4 text-center"
            >
              <div class="text-[0.95rem] font-semibold text-[var(--g-primary-text)]">
                {{ t('home.hero.featBridge') }}
              </div>
              <div class="mt-1.5 text-[0.8rem] text-[rgba(var(--g-secondary-text-rgb),0.55)]">
                {{ t('home.hero.featBridgeSub') }}
              </div>
            </div>
            <div
              class="chain-box min-w-[140px] border border-white/[0.06] px-5 py-4 text-center"
            >
              <div class="text-[0.95rem] font-semibold text-[var(--g-primary-text)]">
                {{ t('home.hero.featMpc') }}
              </div>
              <div class="mt-1.5 text-[0.8rem] text-[rgba(var(--g-secondary-text-rgb),0.55)]">
                {{ t('home.hero.featMpcSub') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Use cases -->
    <section
      class="section-panel section-panel--light text-[rgba(var(--g-secondary-text-rgb),0.88)]"
    >
      <div class="container py-8 lg:py-12">
        <header class="max-w-[42rem]">
          <h2
            class="block w-full text-start text-[clamp(1.35rem,2.6vw,1.75rem)] font-medium leading-tight tracking-[-0.03em] text-[rgba(var(--g-secondary-text-rgb),0.94)]"
          >
            {{ t('home.useCases.sectionTitle') }}
          </h2>
          <div
            class="mb-7 mt-4 h-px w-11 max-w-[2.75rem] bg-gradient-to-r from-[rgba(var(--g-primary-text-rgb),0.85)] to-transparent"
          ></div>
        </header>
        <div class="grid w-full grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-2.5">
          <RouterLink to="/use-cases" :class="ucCardClass">
            <div :class="ucIconWrapClass" aria-hidden="true"><FlatIcon name="use-ai" /></div>
            <div class="min-w-0 flex-1">
              <div :class="ucTitleClass">{{ t('home.useCases.ai') }}</div>
              <div :class="ucSubClass">{{ t('home.useCases.aiSub') }}</div>
            </div>
          </RouterLink>
          <RouterLink to="/use-cases" :class="ucCardClass">
            <div :class="ucIconWrapClass" aria-hidden="true"><FlatIcon name="use-lock" /></div>
            <div class="min-w-0 flex-1">
              <div :class="ucTitleClass">{{ t('home.useCases.privacy') }}</div>
              <div :class="ucSubClass">{{ t('home.useCases.privacySub') }}</div>
            </div>
          </RouterLink>
          <RouterLink to="/use-cases" :class="ucCardClass">
            <div :class="ucIconWrapClass" aria-hidden="true"><FlatIcon name="use-link" /></div>
            <div class="min-w-0 flex-1">
              <div :class="ucTitleClass">{{ t('home.useCases.cross') }}</div>
              <div :class="ucSubClass">{{ t('home.useCases.crossSub') }}</div>
            </div>
          </RouterLink>
          <RouterLink to="/use-cases" :class="ucCardClass">
            <div :class="ucIconWrapClass" aria-hidden="true"><FlatIcon name="use-defi" /></div>
            <div class="min-w-0 flex-1">
              <div :class="ucTitleClass">{{ t('home.useCases.defi') }}</div>
              <div :class="ucSubClass">{{ t('home.useCases.defiSub') }}</div>
            </div>
          </RouterLink>
          <RouterLink to="/use-cases" :class="ucCardClass">
            <div :class="ucIconWrapClass" aria-hidden="true"><FlatIcon name="use-game" /></div>
            <div class="min-w-0 flex-1">
              <div :class="ucTitleClass">{{ t('home.useCases.game') }}</div>
              <div :class="ucSubClass">{{ t('home.useCases.gameSub') }}</div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Products -->
    <section
      class="section-panel section-panel--muted text-[rgba(var(--g-secondary-text-rgb),0.88)]"
    >
      <div class="container py-8 lg:py-12">
        <header class="max-w-[42rem]">
          <h2
            class="block w-full text-start text-[clamp(1.35rem,2.6vw,1.75rem)] font-medium leading-tight tracking-[-0.03em] text-[rgba(var(--g-secondary-text-rgb),0.94)]"
          >
            {{ t('home.products.sectionTitle') }}
          </h2>
          <div
            class="mb-7 mt-4 h-px w-11 max-w-[2.75rem] bg-gradient-to-r from-[rgba(var(--g-primary-text-rgb),0.85)] to-transparent"
          ></div>
        </header>
        <div class="grid w-full grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-2.5">
          <RouterLink to="/products/cloud" :class="prodCardLinkClass">
            <div :class="prodIconClass" aria-hidden="true"><FlatIcon name="prod-vm" /></div>
            <div :class="prodMainClass">
              <div :class="prodNameClass">{{ t('home.products.teeVm') }}</div>
              <div :class="prodSubClass">{{ t('home.products.teeVmSub') }}</div>
              <span :class="prodCtaClass">{{ t('home.products.use') }} →</span>
            </div>
          </RouterLink>
          <RouterLink to="/products/store" :class="prodCardLinkClass">
            <div :class="prodIconClass" aria-hidden="true"><FlatIcon name="prod-store" /></div>
            <div :class="prodMainClass">
              <div :class="prodNameClass">{{ t('home.products.teeStore') }}</div>
              <div :class="prodSubClass">{{ t('home.products.teeStoreSub') }}</div>
              <span :class="prodCtaClass">{{ t('home.products.use') }} →</span>
            </div>
          </RouterLink>
          <div :class="prodCardDisabledClass">
            <div :class="prodIconMutedClass" aria-hidden="true"><FlatIcon name="prod-bridge" /></div>
            <div :class="prodMainClass">
              <div :class="prodNameClass">{{ t('home.products.teeBridge') }}</div>
              <div :class="prodSubClass">{{ t('home.products.teeBridgeSub') }}</div>
              <span :class="prodBadgeClass">{{ t('home.products.comingSoon') }}</span>
            </div>
          </div>
          <div :class="prodCardDisabledClass">
            <div :class="prodIconMutedClass" aria-hidden="true"><FlatIcon name="prod-mpc" /></div>
            <div :class="prodMainClass">
              <div :class="prodNameClass">{{ t('home.products.teeMpc') }}</div>
              <div :class="prodSubClass">{{ t('home.products.teeMpcSub') }}</div>
              <span :class="prodBadgeClass">{{ t('home.products.comingSoon') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="section-panel section-panel--light text-[rgba(var(--g-secondary-text-rgb),0.88)]">
      <div class="container py-8 lg:py-12">
        <h2
          class="m-0 block w-full text-start text-2xl font-bold text-[rgba(var(--g-secondary-text-rgb),0.95)]"
        >
          {{ t('home.how.sectionTitle') }}
        </h2>
        <div
          class="my-3 mb-6 h-[3px] w-full max-w-[200px] bg-gradient-to-r from-[rgba(var(--g-primary-text-rgb),0.95)] to-transparent opacity-90"
        ></div>
        <div class="grid w-full grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <div class="chain-box border border-white/[0.06] p-6">
            <div class="mb-2 text-2xl opacity-80">①</div>
            <div class="text-[1.05rem] font-bold text-[rgba(var(--g-secondary-text-rgb),0.95)]">
              {{ t('home.how.step1Title') }}
            </div>
            <div
              class="mt-1 text-[0.8rem] tracking-[0.02em] text-[rgba(var(--g-secondary-text-rgb),0.45)]"
            >
              {{ t('home.how.step1Sub') }}
            </div>
            <p class="mt-3 text-[0.9rem] text-[rgba(var(--g-secondary-text-rgb),0.55)]">
              {{ t('home.how.step1Desc') }}
            </p>
          </div>
          <div class="chain-box border border-white/[0.06] p-6">
            <div class="mb-2 text-2xl opacity-80">②</div>
            <div class="text-[1.05rem] font-bold text-[rgba(var(--g-secondary-text-rgb),0.95)]">
              {{ t('home.how.step2Title') }}
            </div>
            <div
              class="mt-1 text-[0.8rem] tracking-[0.02em] text-[rgba(var(--g-secondary-text-rgb),0.45)]"
            >
              {{ t('home.how.step2Sub') }}
            </div>
            <p class="mt-3 text-[0.9rem] text-[rgba(var(--g-secondary-text-rgb),0.55)]">
              {{ t('home.how.step2Desc') }}
            </p>
          </div>
          <div class="chain-box border border-white/[0.06] p-6">
            <div class="mb-2 text-2xl opacity-80">③</div>
            <div class="text-[1.05rem] font-bold text-[rgba(var(--g-secondary-text-rgb),0.95)]">
              {{ t('home.how.step3Title') }}
            </div>
            <div
              class="mt-1 text-[0.8rem] tracking-[0.02em] text-[rgba(var(--g-secondary-text-rgb),0.45)]"
            >
              {{ t('home.how.step3Sub') }}
            </div>
            <p class="mt-3 text-[0.9rem] text-[rgba(var(--g-secondary-text-rgb),0.55)]">
              {{ t('home.how.step3Desc') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Web2Plus -->
    <section
      class="section-panel section-panel--dark text-[rgba(var(--g-secondary-text-rgb),0.88)]"
    >
      <div class="container py-8 lg:py-12">
        <header class="max-w-[42rem]">
          <h2
            class="block w-full text-start text-[clamp(1.35rem,2.6vw,1.75rem)] font-medium leading-tight tracking-[-0.03em] text-[rgba(var(--g-secondary-text-rgb),0.93)]"
          >
            {{ t('home.why.sectionTitle') }}
          </h2>
          <div
            class="mb-7 mt-4 h-px w-11 max-w-[2.75rem] bg-gradient-to-r from-[rgba(var(--g-primary-text-rgb),0.7)] to-transparent"
          ></div>
        </header>
        <div class="grid w-full grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
          <div :class="whyCardClass">
            <div class="home-why-icon mb-3.5 text-[rgba(var(--g-primary-text-rgb),0.88)]">
              <FlatIcon name="why-pay" />
            </div>
            <div class="text-[1.0625rem] font-medium leading-snug tracking-tight text-[rgba(var(--g-secondary-text-rgb),0.96)]">
              {{ t('home.why.noToken') }}
            </div>
            <p class="mt-2.5 text-[0.8125rem] leading-relaxed text-[rgba(var(--g-secondary-text-rgb),0.46)]">
              {{ t('home.why.noTokenDesc') }}
            </p>
          </div>
          <div :class="whyCardClass">
            <div class="home-why-icon mb-3.5 text-[rgba(var(--g-primary-text-rgb),0.88)]">
              <FlatIcon name="why-chain" />
            </div>
            <div class="text-[1.0625rem] font-medium leading-snug tracking-tight text-[rgba(var(--g-secondary-text-rgb),0.96)]">
              {{ t('home.why.multichain') }}
            </div>
            <p class="mt-2.5 text-[0.8125rem] leading-relaxed text-[rgba(var(--g-secondary-text-rgb),0.46)]">
              {{ t('home.why.multichainDesc') }}
            </p>
          </div>
          <div :class="whyCardClass">
            <div class="home-why-icon mb-3.5 text-[rgba(var(--g-primary-text-rgb),0.88)]">
              <FlatIcon name="why-shield" />
            </div>
            <div class="text-[1.0625rem] font-medium leading-snug tracking-tight text-[rgba(var(--g-secondary-text-rgb),0.96)]">
              {{ t('home.why.tee') }}
            </div>
            <p class="mt-2.5 text-[0.8125rem] leading-relaxed text-[rgba(var(--g-secondary-text-rgb),0.46)]">
              {{ t('home.why.teeDesc') }}
            </p>
          </div>
          <div :class="whyCardClass">
            <div class="home-why-icon mb-3.5 text-[rgba(var(--g-primary-text-rgb),0.88)]">
              <FlatIcon name="why-bolt" />
            </div>
            <div class="text-[1.0625rem] font-medium leading-snug tracking-tight text-[rgba(var(--g-secondary-text-rgb),0.96)]">
              {{ t('home.why.ready') }}
            </div>
            <p class="mt-2.5 text-[0.8125rem] leading-relaxed text-[rgba(var(--g-secondary-text-rgb),0.46)]">
              {{ t('home.why.readyDesc') }}
            </p>
          </div>
          <div :class="whyCardClass">
            <div class="home-why-icon mb-3.5 text-[rgba(var(--g-primary-text-rgb),0.88)]">
              <FlatIcon name="why-code" />
            </div>
            <div class="text-[1.0625rem] font-medium leading-snug tracking-tight text-[rgba(var(--g-secondary-text-rgb),0.96)]">
              {{ t('home.why.dev') }}
            </div>
            <p class="mt-2.5 text-[0.8125rem] leading-relaxed text-[rgba(var(--g-secondary-text-rgb),0.46)]">
              {{ t('home.why.devDesc') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech proof：链上最新区块 + 交易（原独立页同款布局） -->
    <section class="section-panel section-panel--muted text-[rgba(var(--g-secondary-text-rgb),0.88)]">
      <div class="container py-8 lg:py-12">
        <h2
          class="m-0 block w-full text-start text-2xl font-bold text-[rgba(var(--g-secondary-text-rgb),0.95)]"
        >
          {{ t('home.tech.sectionTitle') }}
        </h2>
        <div
          class="my-3 mb-6 h-[3px] w-full max-w-[200px] bg-gradient-to-r from-[rgba(var(--g-primary-text-rgb),0.95)] to-transparent opacity-90"
        />
        <div class="home-chain-explorer border-rgb flex mb-4 flex-col lg:flex-row">
          <div class="chain-box flex lg:mb-0 flex-col flex-1 overflow-y-auto border border-white/[0.06] border-r-1 border-b-0  lg:border-r-0 lg:border-b-1">
            <div class="title-wrap flex p-[15px] lg:p-5 flex-wrap justify-between items-center">
              <div class="title flex">
                <Svgimg class="chain-logo animate-ping-rotate mr-2 flex-shrink-0" name="lineblock" />
                <div class="inline opacity-50 truncate">{{ t('home.latestBlocks') }}</div>
              </div>
              <div class="flex">
                <a class="outline-none" href="/chain/blocks">
                  <button
                    type="button"
                    class="border outline-none whitespace-nowrap border-none px-[10px] py-[10px] text-xs clickable link-bg"
                  >
                    {{ t('common.viewAll') }}
                  </button>
                </a>
              </div>
            </div>
            <div class="flex flex-col divide-y w-full h-[390px] overflow-y-auto overflow-x-hidden">
              <div class="flex justify-between p-5 block" v-for="block in blocks" :key="block.header.height">
                <div class="flex flex-col">
                  <div class="flex space-x-2 mb-1 items-center">
                    <div class="text-sm inline">{{ t('common.block') }}</div>
                    <a
                      class="outline-none font-semibold !text-base number"
                      :href="`/chain/block/${block.header.height}`"
                      >{{ block.header.height }}</a
                    >
                  </div>
                  <div class="flex space-x-2">
                    <div class="text-sm inline">{{ t('common.includes') }}</div>
                    <a class="outline-none text-sm link" :href="`/chain/txs?height=${block.header.height}`"
                      >{{ block.num_txs }} {{ t('common.txs') }}</a
                    >
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="flex whitespace-nowrap text-sm">
                    <div data-state="closed" class="inline-block leading-none">
                      {{ formatTimeDiff(block.header.time, now) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="chain-box flex lg:mb-0 flex-col flex-1 overflow-y-auto border border-white/[0.06]">
            <div class="title-wrap flex p-[15px] lg:p-5 flex-wrap justify-between items-center">
              <div class="title flex">
                <Svgimg class="chain-logo mr-2 flex-shrink-0" name="transfer" />
                <div class="inline opacity-50 truncate">{{ t('home.transfers') }}</div>
              </div>
              <div class="flex">
                <div class="flex space-x-3">
                  <a class="outline-none text-sm" href="/chain/txs">
                    <button
                      type="button"
                      class="outline-none whitespace-nowrap border-none px-[10px] py-[10px] text-xs clickable link-bg"
                    >
                      {{ t('common.viewAll') }}
                    </button>
                  </a>
                </div>
              </div>
            </div>
            <div class="flex flex-col divide-y w-full h-[390px] overflow-y-auto overflow-x-hidden">
              <div
                class="flex justify-between p-5 block"
                v-for="tx in txs"
                :key="`${tx.height}-${tx.index}`"
              >
                <div class="flex flex-1 flex-col">
                  <div class="flex space-x-2 mb-1 items-center">
                    <div class="text-sm inline">{{ t('common.tx') }}</div>
                    <RouterLink
                      class="outline-none text-sm whitespace-nowrap font-semibold !text-base number link"
                      :to="`/chain/tx/${tx.hash}`"
                      >{{ tx.height }}-{{ tx.index }}</RouterLink
                    >
                  </div>
                  <div class="flex flex-col md:space-x-2 md:items-center md:flex-row">
                    <div class="flex space-x-2 items-center">
                      <div class="text-sm">{{ t('common.hash') }}</div>
                      <RouterLink :to="`/chain/tx/${tx.hash}`" class="text-sm hash flex-1 link">{{
                        tx.hash
                      }}</RouterLink>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col ml-4 items-end justify-center">
                  <div class="flex items-center">
                    <Svgimg class="w-6 h-6 status-ok" name="success" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section>
      <div
        class="cta-banner container relative mb-10 overflow-hidden border-4 border-[#ffffff0f] bg-[rgba(var(--g-primary-bg-rgb),0.35)]"
      >
        <PixelBg />
        <div class="hud-corner tl"></div>
        <div class="hud-corner tr"></div>
        <div class="hud-corner bl"></div>
        <div class="hud-corner br"></div>
        <div class="relative z-[1] min-h-0 px-4 py-12 text-center lg:py-16">
          <h2
            class="text-[clamp(1.35rem,3vw,2rem)] font-bold text-[var(--g-primary-text)]"
          >
            {{ t('home.cta.title') }}
          </h2>
          <p
            class="mx-auto mt-4 max-w-xl text-base text-[rgba(var(--g-secondary-text-rgb),0.8)] opacity-90"
          >
            {{ t('home.cta.subtitle') }}
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/dapp" :class="homeBtnPrimary">{{ t('home.cta.start') }}</a>
            <a
              target="_blank"
              :href="docsEntryUrl()"
              :class="homeBtnOutline"
              >{{ t('home.cta.docs') }}</a
            >
            <a target="_blank" href="https://github.com/wetee-dao" :class="homeBtnOutline">{{
              t('home.cta.github')
            }}</a>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Footer from '@/components/Footer.vue'
import PixelBg from '@/components/anim/PixelBg.vue'
import Svgimg from '@/components/svg/SvgImg.vue'
import FlatIcon from '@/components/icons/FlatIcon.vue'
import { GetNowBlocks, GetNowTx, SubNewBlock } from '@/apis/side'
import { formatTimeDiff } from '@/utils/time'
import { ReconnectingWebSocket } from '@/utils/ws'

const { t, locale } = useI18n()

const docsLang = () => (String(locale.value).toLowerCase().startsWith('zh') ? 'zh' : 'en')
const docsEntryUrl = () => `https://asyou.me/_book/${docsLang()}/user/intro/what-is-wetee.html`

/** 首页按钮（替代原 .btn / .btn-primary / .btn-outline） */
const homeBtnBase =
  'inline-flex min-h-12 items-center justify-center border-2 px-6 text-[0.95rem] font-semibold no-underline transition-opacity hover:opacity-[0.92]'
const homeBtnPrimary = `${homeBtnBase} border-[rgb(var(--g-primary-text-rgb))] bg-[rgb(var(--g-primary-text-rgb))] text-[#040406]`
const homeBtnOutline = `${homeBtnBase} border-[rgba(var(--g-primary-text-rgb),0.5)] bg-transparent text-[var(--g-primary-text)]`

/** Use cases 卡片 */
const ucCardClass =
  'chain-box flex flex-row items-start gap-4 border border-white/[0.06] !bg-transparent px-4 py-[1.125rem] no-underline transition-colors hover:border-white/[0.12] hover:!bg-white/[0.03]'
const ucIconWrapClass =
  'uc-icon-wrap mt-0.5 w-[1.375rem] shrink-0 border-0 bg-transparent p-0 text-[rgba(var(--g-primary-text-rgb),0.72)]'
const ucTitleClass = 'text-base font-medium leading-snug tracking-tight text-[rgba(var(--g-secondary-text-rgb),0.95)]'
const ucSubClass = 'mt-1.5 text-[0.8125rem] leading-relaxed text-[rgba(var(--g-secondary-text-rgb),0.4)]'

/** Products 卡片 */
const prodCardLinkClass =
  'chain-box flex min-h-0 flex-row items-start gap-[1.125rem] border border-white/[0.06] !bg-transparent px-[1.125rem] py-5 no-underline text-inherit transition-colors hover:border-white/[0.12] hover:!bg-white/[0.035]'
const prodCardDisabledClass =
  'chain-box flex min-h-0 cursor-default flex-row items-start gap-[1.125rem] border border-white/[0.06] !bg-transparent px-[1.125rem] py-5 opacity-[0.85]'
const prodIconClass =
  'prod-icon mt-0.5 flex w-6 shrink-0 items-start justify-center border-0 bg-transparent p-0 text-[rgba(var(--g-primary-text-rgb),0.78)]'
const prodIconMutedClass = `${prodIconClass} text-[rgba(var(--g-secondary-text-rgb),0.35)]`
const prodMainClass = 'flex min-h-[6.5rem] min-w-0 flex-1 flex-col'
const prodNameClass =
  'text-[1.0625rem] font-medium leading-snug tracking-tight text-[rgba(var(--g-secondary-text-rgb),0.95)]'
const prodSubClass = 'mt-1.5 text-[0.8125rem] leading-relaxed text-[rgba(var(--g-secondary-text-rgb),0.5)]'
const prodCtaClass =
  'mt-auto pt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[rgba(var(--g-primary-text-rgb),0.75)]'
const prodBadgeClass =
  'mt-auto pt-4 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-[rgba(var(--g-secondary-text-rgb),0.35)]'

const whyCardClass =
  'group rounded-sm border-l-2 border-l-[rgba(var(--g-primary-text-rgb),0.38)] bg-[rgba(255,255,255,0.02)] px-5 py-6 pl-5 transition-[border-color,background-color] duration-300 hover:border-white/[0.1] hover:border-l-[rgba(var(--g-primary-text-rgb),0.55)] hover:bg-[rgba(255,255,255,0.03)]'

const blocks = ref<any[]>([])
const txs = ref<any[]>([])
const now = ref(new Date().getTime())

let ws: ReconnectingWebSocket
let timeIns: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timeIns = setInterval(() => {
    now.value = new Date().getTime()
  }, 6000)

  GetNowBlocks().then(async (datas) => {
    blocks.value = datas.block_metas
    const txResult = await GetNowTx(datas.last_height)
    txs.value = txResult.txs
  })

  ws = SubNewBlock(async (e) => {
    const result = JSON.parse(e.data)
    if (!result.result.data) {
      return
    }
    const block = result.result.data.value.block
    blocks.value.unshift({
      header: block.header,
      num_txs: block.data.txs.length
    })
    const txResult = await GetNowTx(block.header.height)
    txs.value = txResult.txs
  })
})

onUnmounted(() => {
  ws?.close()
  if (timeIns != null) {
    clearInterval(timeIns)
  }
})
</script>

<style lang="scss" scoped>
/* 与全局主题变量配合：链上 / 角标 / 子组件 svg */
.chain-box {
  background-color: rgba($primary-bg-rgb, 0.55);
  border-color: #ffffff0f;
}

.section-panel--light .chain-box {
  background: rgba($primary-bg-rgb, 0.72);
  border-color: rgba(255, 255, 255, 0.06);
}

.section-panel--muted .chain-box {
  background: rgba($primary-bg-rgb, 0.65);
  border-color: rgba(255, 255, 255, 0.06);
}

.uc-icon-wrap :deep(.flat-icon) {
  width: 1.375rem;
  height: 1.375rem;
}

.prod-icon :deep(.flat-icon) {
  width: 1.5rem;
  height: 1.5rem;
}

.home-why-icon :deep(.flat-icon) {
  width: 1.35rem;
  height: 1.35rem;
}

/* 链上双栏列表（区块 / 交易） */
.home-chain-explorer {
  width: 100%;

  .border-rgb {
    border-width: 4px;
    border-color: #ffffff0f;
  }

  .chain-box {
    background-color: rgba($primary-bg-rgb, 0.55);
    border-color: #ffffff0f;

    .title-wrap {
      border-bottom: 1px solid rgba(255, 255, 255, 0.0588235294);
    }

    .title {
      font-size: 16px;

      & > .inline {
        line-height: 31px;
      }

      .chain-logo {
        width: 30px;
        height: 30px;
        color: $primary-text;
      }
    }

    .status-ok {
      color: $primary-text;
    }
  }

  .link-bg {
    background-color: #ffffff1f;
  }

  .block {
    color: #858585;
    border-color: #ffffff08;

    .number {
      color: rgba($primary-text-rgb, 0.4);
    }

    .link {
      color: rgba($primary-text-rgb, 0.4);
      text-decoration: none;

      &:hover {
        color: rgba($primary-text-rgb, 0.7);
      }
    }

    .hash {
      height: 20px;
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      line-clamp: 1;
    }
  }
}

@keyframes home-pingrotate {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  to {
    transform: rotate(1turn);
  }
}

.home-chain-explorer .animate-ping-rotate {
  animation: home-pingrotate 4s infinite;
}

.hud-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  z-index: 2;
  pointer-events: none;
  opacity: 0.5;

  &.tl {
    top: 0;
    left: 0;
    border-top: 1px solid $primary-text;
    border-left: 1px solid $primary-text;
  }
  &.tr {
    top: 0;
    right: 0;
    border-top: 1px solid $primary-text;
    border-right: 1px solid $primary-text;
  }
  &.bl {
    bottom: 0;
    left: 0;
    border-bottom: 1px solid $primary-text;
    border-left: 1px solid $primary-text;
  }
  &.br {
    bottom: 0;
    right: 0;
    border-bottom: 1px solid $primary-text;
    border-right: 1px solid $primary-text;
  }
}
</style>
