import { CurrentSecretUrl } from '@/plugins/chain'
import { GraphqlClient } from '@/utils/gql'

/** 与 tee-dsecret `ChainInfo` 对齐 */
export interface ChainContractsSlice {
  is_main: boolean
  cloud_contract: string
  subnet_contract: string
  network_label: string
  /** 预留；GraphQL 可能未返回 */
  token?: string[]
}

const QUERY = `query ChainContractsSlice {
  chain_info {
    is_main
    cloud_contract
    subnet_contract
    network_label
  }
}`

/** 返回 `chain_info` 列表；常见用法取首条合并进主链卡片 */
export async function fetchChainContractsSlice(): Promise<ChainContractsSlice[]> {
  const data = await new GraphqlClient(CurrentSecretUrl()).query({ query: QUERY })
  const rows = data?.chain_info
  return Array.isArray(rows) ? rows : []
}
