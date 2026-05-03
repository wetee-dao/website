import { CurrentSecretUrl } from '@/plugins/chain'
import { setMainChainContracts } from '@/config'
import { GraphqlClient } from '@/utils/gql'

/** 与 tee-dsecret `ChainInfo` 对齐 */
export interface ChainContractsSlice {
  is_main: boolean
  cloud_contract: string
  subnet_contract: string
  network_label: string
  chain_type: string
  /** 预留；GraphQL 可能未返回 */
  token?: string[]
}

const QUERY = `query ChainContractsSlice {
  chain_info {
    is_main
    cloud_contract
    subnet_contract
    network_label
    chain_type
  }
}`

/** 返回 `chain_info` 列表；常见用法取首条合并进主链卡片 */
export async function fetchChainContractsSlice(): Promise<ChainContractsSlice[]> {
  const data = await new GraphqlClient(CurrentSecretUrl()).query({ query: QUERY })
  const rows = data?.chain_info
  return Array.isArray(rows) ? rows : []
}

/**
 * 应用启动：必须通过 GraphQL `fetchChainContractsSlice` 拿到主链合约并写入全局 config。
 * 无数据、缺字段或地址非法时抛错（由 main 捕获并阻断挂载）。
 */
export async function bootstrapApplyMainChainContractsFromSlice(): Promise<void> {
  const slice = await fetchChainContractsSlice()
  if (!slice.length) {
    throw new Error('chain_info: empty list')
  }
  const info = slice.find((r) => r.is_main) ?? slice[0]
  const subnet = (info.subnet_contract ?? '').trim()
  const cloud = (info.cloud_contract ?? '').trim()
  if (!subnet || !cloud) {
    throw new Error('chain_info: missing subnet_contract or cloud_contract')
  }
  setMainChainContracts(subnet, cloud)
}
