import { ApiPromise, WsProvider } from '@polkadot/api'
import { BN, formatBalance, hexToU8a, u8aConcat, u8aToString } from '@polkadot/util'
import type { Codec } from '@polkadot/types/types'

export interface TreasuryTokenRow {
  id: string
  symbol: string
  assetLabel: string
  networkLabel: string
  balance: string
}

const CONNECT_MS = 25_000

/** 按 tee-dsecret `network_label` 选择 Asset Hub 公共 WS；可用 VITE_* 覆盖 */
export function resolveAssetHubWsUrl(networkLabel: string): string {
  const label = networkLabel.trim()
  const env = import.meta.env as Record<string, string | undefined>
  const lower = label.toLowerCase()

  if (lower.includes('local')) {
    const w = env.VITE_TREASURY_WS_LOCAL?.trim()
    if (w) return w
    return 'wss://asset-hub-paseo.ibp.network'
  }
  if (lower.includes('polkadot') && lower.includes('asset hub')) {
    const w = env.VITE_TREASURY_WS_POLKADOT?.trim()
    if (w) return w
    return 'wss://polkadot-asset-hub-rpc.polkadot.io'
  }
  if (lower.includes('paseo') && lower.includes('asset hub')) {
    const w = env.VITE_TREASURY_WS_PASEO?.trim()
    if (w) return w
    return 'wss://asset-hub-paseo.ibp.network'
  }

  if (lower.includes('paseo')) {
    const w = env.VITE_TREASURY_WS_PASEO?.trim()
    if (w) return w
    return 'wss://asset-hub-paseo.ibp.network'
  }
  if (lower.includes('polkadot')) {
    const w = env.VITE_TREASURY_WS_POLKADOT?.trim()
    if (w) return w
    return 'wss://polkadot-asset-hub-rpc.polkadot.io'
  }

  const w = env.VITE_TREASURY_WS_DEFAULT?.trim()
  if (w) return w
  return 'wss://asset-hub-paseo.ibp.network'
}

function parseExtraAssetIds(): string[] {
  const raw = (import.meta.env.VITE_TREASURY_EXTRA_ASSET_IDS as string | undefined)?.trim()
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseH160Bytes(cloudAddress: string): Uint8Array {
  const hex = cloudAddress.trim().startsWith('0x') ? cloudAddress.trim() : `0x${cloudAddress.trim()}`
  const u8a = hexToU8a(hex)
  if (u8a.length !== 20) {
    throw new Error('cloud_contract must be a 20-byte EVM hex address')
  }
  return u8a
}

/**
 * pallet_revive `AccountId32Mapper`：H160 → 原生 AccountId32。
 * 优先走运行时 `reviveApi.accountId`，以尊重 OriginalAccount 映射；否则使用与链上一致的 fallback（20 字节地址 + 12×0xEE）。
 */
async function h160ToNativeAccountId(api: ApiPromise, cloudAddress: string): Promise<Codec> {
  const u8a20 = parseH160Bytes(cloudAddress)
  const h160 = api.registry.createType('H160', u8a20)

  const revive = api.call?.reviveApi as { accountId?: (addr: Codec) => Promise<unknown> } | undefined
  if (typeof revive?.accountId === 'function') {
    try {
      const raw = await revive.accountId(h160)
      if (raw != null) {
        const r = raw as Codec
        if (typeof r?.toU8a === 'function' && r.toU8a(true).length === 32) {
          return r
        }
        return api.registry.createType('AccountId', raw as string | Uint8Array)
      }
    } catch {
      /* 使用 fallback */
    }
  }

  const suffix = new Uint8Array(12).fill(0xee)
  const id32 = u8aConcat(u8a20, suffix)
  return api.registry.createType('AccountId', id32)
}

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let t: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => {
    t = setTimeout(() => reject(new Error(`${label} (>${ms}ms)`)), ms)
  })
  try {
    return await Promise.race([p, timeout])
  } finally {
    clearTimeout(t!)
  }
}

/**
 * 通过 Polkadot.js 连接对应 Asset Hub，查询 Cloud 地址原生余额；
 * 可选 `VITE_TREASURY_EXTRA_ASSET_IDS`（逗号分隔 asset id）补充 assets pallet 余额。
 */
export async function fetchCloudTreasuryTokenRows(params: {
  cloudAddress: string
  networkLabel: string
  tAssetKind: (key: string) => string
  /** 若传入则优先于 network_label 推导的 WS */
  assetHubWs?: string
}): Promise<TreasuryTokenRow[]> {
  const ws = (params.assetHubWs?.trim() || resolveAssetHubWsUrl(params.networkLabel)).replace(/\/$/, '')
  const whoBytes = params.cloudAddress.trim()
  if (!whoBytes) return []

  const provider = new WsProvider(ws)
  let api: ApiPromise | undefined
  try {
    api = await withTimeout(
      ApiPromise.create({ provider, noInitWarn: true }),
      CONNECT_MS,
      'Asset Hub RPC connection timed out',
    )
    const who = await h160ToNativeAccountId(api, whoBytes)

    const rows: TreasuryTokenRow[] = []
    const net = params.networkLabel
    const nativeKind = params.tAssetKind('native')

    const accountInfo = (await api.query.system.account(who)) as unknown as {
      data: { free: BN | { toString: () => string } }
    }
    const free = accountInfo.data.free
    const dec = api.registry.chainDecimals[0] ?? 10
    const unit = api.registry.chainTokens[0] ?? ''
    const nativeBal = formatBalance(free as BN, { decimals: dec, withUnit: unit })
    rows.push({
      id: `native:${net}`,
      symbol: unit || '—',
      assetLabel: nativeKind,
      networkLabel: net,
      balance: nativeBal,
    })

    const extraIds = parseExtraAssetIds()
    if (extraIds.length && api.query.assets?.account && api.query.assets?.metadata) {
      const assetsKind = params.tAssetKind('assets')
      for (const idStr of extraIds) {
        try {
          const assetId = api.registry.createType('u32', Number.parseInt(idStr, 10))
          const acctOpt = (await api.query.assets.account(assetId, who)) as unknown as {
            isNone: boolean
            unwrap: () => { balance: { toString: () => string } }
          }
          if (acctOpt.isNone) continue
          const balRaw = acctOpt.unwrap().balance.toString()
          const metaOpt = (await api.query.assets.metadata(assetId)) as unknown as {
            isSome: boolean
            unwrap: () => { decimals: { toNumber: () => number }; symbol: Codec }
          }
          let sym = `#${idStr}`
          let dec = 0
          if (metaOpt.isSome) {
            const m = metaOpt.unwrap()
            dec = m.decimals.toNumber()
            try {
              sym = u8aToString(m.symbol.toU8a(true))
            } catch {
              sym = m.symbol.toString()
            }
          }
          const bal = formatBalance(new BN(balRaw), { decimals: dec, withUnit: false })
          rows.push({
            id: `asset:${idStr}:${net}`,
            symbol: sym.trim() || `#${idStr}`,
            assetLabel: assetsKind,
            networkLabel: net,
            balance: bal,
          })
        } catch {
          /* 忽略单个资产查询失败 */
        }
      }
    }

    return rows
  } finally {
    try {
      await api?.disconnect()
    } catch {
      /* ignore */
    }
    try {
      await provider.disconnect()
    } catch {
      /* ignore */
    }
  }
}
