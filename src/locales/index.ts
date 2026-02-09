import { createI18n } from 'vue-i18n'
import en from './messages/en'
import zhCN from './messages/zh-CN'

const LOCALE_STORAGE_KEY = 'wetee_locale'

export type LocaleId = 'en' | 'zh-CN'

const supportedLocales: LocaleId[] = ['en', 'zh-CN']

function getInitialLocale(): LocaleId {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY) as LocaleId | null
  if (saved && supportedLocales.includes(saved)) return saved
  const browser = navigator.language
  if (browser.startsWith('zh')) return 'zh-CN'
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN,
  },
})

export function setLocale(locale: LocaleId) {
  i18n.global.locale.value = locale
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }
}

export function getLocale(): LocaleId {
  return i18n.global.locale.value as LocaleId
}

export { supportedLocales, LOCALE_STORAGE_KEY }
