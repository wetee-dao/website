/** 与 wetee-dapp 一致：按 `network_label` / `chain_type` 选图（website 使用 public 静态路径） */
const POLKADOT_MINI = '/imgs/polkadot_mini.svg'
const PASEO_MINI = '/imgs/paseo_mini.svg'
const DEFAULT_CHAIN_ICON = '/imgs/chainWetee.svg'

export function iconUrlForChainNetwork(networkLabel: string, chainType?: string): string {
  const hay = `${networkLabel ?? ''} ${chainType ?? ''}`.toLowerCase()
  if (hay.includes('paseo')) return PASEO_MINI
  if (hay.includes('polkadot')) return POLKADOT_MINI
  return DEFAULT_CHAIN_ICON
}
