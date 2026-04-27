<template>
  <div class="docs-page gradient-body">
    <SectionHead />
    <div class="container section">
      <!-- Hero -->
      <div class="docs-hero">
        <h1 class="docs-hero__title">{{ t('docs.heroTitle') }}</h1>
        <p class="docs-hero__subtitle">{{ t('docs.heroSubtitle') }}</p>
        <div class="docs-hero__actions">
          <a :href="gitbookUrl" target="_blank" class="docs-btn docs-btn--primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L1.74 6v12L12 24l10.26-6V6L12 0zm3.12 13.93l-3.12 3.12-3.12-3.12-.83.83 3.95 3.95 3.95-3.95-.83-.83zM5.3 7.56L3.86 6.12l-.83.83 1.44 1.44.83-.83zM18.14 6.12l-1.44 1.44.83.83 1.44-1.44-.83-.83z"/></svg>
            {{ t('docs.readDocs') }}
          </a>
          <a :href="githubUrl" target="_blank" class="docs-btn docs-btn--outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            {{ t('docs.viewSource') }}
          </a>
        </div>
      </div>

      <!-- Category Cards -->
      <div class="docs-grid">
        <a
          v-for="cat in categories"
          :key="cat.id"
          :href="cat.url"
          target="_blank"
          class="docs-card"
        >
          <div class="docs-card__icon" v-html="cat.icon"></div>
          <div class="docs-card__content">
            <h3 class="docs-card__title">{{ cat.title }}</h3>
            <p class="docs-card__desc">{{ cat.desc }}</p>
          </div>
          <div class="docs-card__arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </a>
      </div>

      <!-- Quick Links -->
      <div class="docs-quick">
        <h2 class="docs-quick__title">{{ t('docs.quickStart') }}</h2>
        <div class="docs-quick__grid">
          <a
            v-for="link in quickLinks"
            :key="link.href"
            :href="link.href"
            target="_blank"
            class="docs-quick__item"
          >
            <span class="docs-quick__item-title">{{ link.title }}</span>
            <span class="docs-quick__item-arrow">→</span>
          </a>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionHead from '@/components/SectionHead.vue'
import Footer from '@/components/Footer.vue'

const { t } = useI18n()

const gitbookUrl = 'https://wetee.gitbook.io/docment'
const githubUrl = 'https://github.com/wetee-dao'

const categories = computed(() => [
  {
    id: 'products',
    title: t('docs.catProducts'),
    desc: t('docs.catProductsDesc'),
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    url: `${gitbookUrl}/products`,
  },
  {
    id: 'miner',
    title: t('docs.catMiner'),
    desc: t('docs.catMinerDesc'),
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,
    url: `${gitbookUrl}/minner-installation-guides`,
  },
  {
    id: 'dev',
    title: t('docs.catDev'),
    desc: t('docs.catDevDesc'),
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    url: `${gitbookUrl}/development-guides`,
  },
  {
    id: 'golang',
    title: t('docs.catGolang'),
    desc: t('docs.catGolangDesc'),
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>`,
    url: `${gitbookUrl}/for-golang-developer`,
  },
  {
    id: 'mint',
    title: t('docs.catMint'),
    desc: t('docs.catMintDesc'),
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
    url: `${gitbookUrl}/mint`,
  },
  {
    id: 'api',
    title: t('docs.catApi'),
    desc: t('docs.catApiDesc'),
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path></svg>`,
    url: `${gitbookUrl}/development-guides/blockchain-validation-node`,
  },
])

const quickLinks = computed(() => [
  { title: t('docs.linkQuickStart'), href: `${gitbookUrl}` },
  { title: t('docs.linkConfService'), href: `${gitbookUrl}/products/confidential-service` },
  { title: t('docs.linkRunMiner'), href: `${gitbookUrl}/development-guides/run-tee-miner` },
  { title: t('docs.linkGolangSdk'), href: `${gitbookUrl}/for-golang-developer/libos-ego-sdk` },
  { title: t('docs.linkDeployTee'), href: `${gitbookUrl}/for-golang-developer/deploy-tee-program-on-wetee` },
  { title: t('docs.linkChainMint'), href: `${gitbookUrl}/mint/blockchain-mint` },
])
</script>

<style lang="scss" scoped>
.docs-page {
  min-height: 100vh;
  padding-bottom: 60px;
}

.docs-hero {
  text-align: center;
  padding: 40px 0 60px;

  &__title {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 700;
    color: rgba(var(--g-primary-text-rgb), 1);
    margin-bottom: 12px;
  }

  &__subtitle {
    font-size: 1.05rem;
    color: rgba(var(--g-secondary-text-rgb), 0.75);
    max-width: 520px;
    margin: 0 auto 32px;
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
}

.docs-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }

  &--primary {
    background: rgba(var(--g-primary-text-rgb), 1);
    color: #040406;
  }

  &--outline {
    background: transparent;
    border: 1px solid rgba(var(--g-primary-text-rgb), 0.4);
    color: rgba(var(--g-primary-text-rgb), 1);
  }
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 60px;
}

.docs-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(var(--g-primary-bg-rgb), 0.15);
  border: 1px solid rgba(var(--g-primary-text-rgb), 0.08);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: rgba(var(--g-primary-text-rgb), 0.25);
    background: rgba(var(--g-primary-bg-rgb), 0.25);

    .docs-card__arrow {
      transform: translateX(4px);
    }
  }

  &__icon {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--g-primary-text-rgb), 0.06);
    border-radius: 10px;
    color: rgba(var(--g-primary-text-rgb), 0.9);
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: rgba(var(--g-primary-text-rgb), 1);
    margin-bottom: 4px;
  }

  &__desc {
    font-size: 13px;
    color: rgba(var(--g-secondary-text-rgb), 0.65);
    line-height: 1.5;
  }

  &__arrow {
    flex-shrink: 0;
    color: rgba(var(--g-primary-text-rgb), 0.4);
    transition: transform 0.2s;
  }
}

.docs-quick {
  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    color: rgba(var(--g-primary-text-rgb), 0.85);
    margin-bottom: 16px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 8px;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(var(--g-primary-bg-rgb), 0.1);
    border: 1px solid rgba(var(--g-primary-text-rgb), 0.06);
    border-radius: 8px;
    text-decoration: none;
    color: rgba(var(--g-primary-text-rgb), 0.8);
    font-size: 14px;
    transition: background 0.2s, border-color 0.2s;

    &:hover {
      background: rgba(var(--g-primary-bg-rgb), 0.2);
      border-color: rgba(var(--g-primary-text-rgb), 0.15);
    }

    &-title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-arrow {
      margin-left: 12px;
      flex-shrink: 0;
      color: rgba(var(--g-primary-text-rgb), 0.4);
    }
  }
}
</style>
