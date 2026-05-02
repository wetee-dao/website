import { CurrentSecretUrl } from '@/plugins/chain'
import { GraphqlClient } from '@/utils/gql'

/** 仅拉取链上合约地址与支持 token（与 `chain.graphqls` 字段一致） */
export interface ChainContractsSlice {
  cloud_contract: string
  subnet_contract: string
  token: string[]
}

const QUERY = `query ChainContractsSlice {
  chain_info {
    cloud_contract
    subnet_contract
    is_main
  }
}`

/** 返回 `chain_info` 列表；常见用法取首条合并进主链卡片 */
export async function fetchChainContractsSlice(): Promise<ChainContractsSlice[]> {
  const data = await new GraphqlClient(CurrentSecretUrl()).query({ query: QUERY })
  const rows = data?.chain_info
  return Array.isArray(rows) ? rows : []
}
