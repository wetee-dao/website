/**
 * ink / Polkadot `toHuman()` 常把数字格式成带千分位的字符串，例如 "71,530"。
 */
export function parseHumanNumber(v: unknown): number {
  if (typeof v === 'number') return v
  return Number(String(v ?? '').replace(/,/g, '')) || 0
}
