import { hexToSS58 } from '@/utils/chain'

export function bytesToString(bytes: unknown): string {
  if (!bytes) return ''
  if (typeof bytes === 'string') return bytes
  if (Array.isArray(bytes)) {
    return String.fromCharCode(...bytes.filter((b: number) => b !== 0))
  }
  return String(bytes)
}

/**
 * 将区块数格式化为「N blocks」形式（不换算为分钟/小时/天）。
 * 组件内对用户可见文案优先使用 i18n：`t('gov.blockCount', { count })`。
 */
export function formatBlocks(blocks: number): string {
  if (!blocks) return '0 blocks'
  return `${blocks} blocks`
}

export type InkCaller = { t?: string | number; v?: string } | null | undefined

export function callerToSs58(caller: InkCaller): string {
  if (!caller?.v) return '—'
  if (String(caller.t) !== '1') return '—'
  return hexToSS58(caller.v)
}
