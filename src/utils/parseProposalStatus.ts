import { parseHumanNumber } from '@/utils/parseHumanNumber'

function unwrapOk(v: unknown): unknown {
  if (v != null && typeof v === 'object') {
    const o = v as Record<string, unknown>
    if ('Ok' in o) return unwrapOk(o.Ok)
    if ('ok' in o) return unwrapOk(o.ok)
  }
  return v
}

function unwrapOptionSome(v: unknown): unknown | null {
  if (v == null) return null
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    if ('None' in o || 'none' in o) return null
    if ('Some' in o) return unwrapOk((o as { Some: unknown }).Some)
    if ('some' in o) return unwrapOk((o as { some: unknown }).some)
  }
  return v
}

function num(v: unknown): number {
  if (typeof v === 'bigint') return Number(v)
  return parseHumanNumber(v)
}

/** 与 `proposalStatus` 查询结果对齐（含新旧字段兼容） */
export type ParsedProposalStatus = {
  stateCode: number
  /** 当前块高度，沿用原 Block 语义，供投票起点 / 解锁等 */
  statusBlock: number
  /** 尝试次数（链上 confirmedNumber） */
  confirmedNumber: number
  /** 确认期基准块；确认期内已过区块 ≈ statusBlock − lastConfirmedBlock */
  lastConfirmedBlock: number
}

/** 解析 `proposal_status` 查询：`Result<Option<ProposalStatus>, _>` 或平铺对象 */
export function parseProposalStatusResult(raw: unknown): ParsedProposalStatus | null {
  if (raw != null && typeof raw === 'object') {
    const top = raw as Record<string, unknown>
    if ('Err' in top || 'err' in top) return null
  }
  const inner = unwrapOptionSome(unwrapOk(raw))
  if (inner == null || typeof inner !== 'object') return null
  const o = inner as Record<string, unknown>
  const state = o.state ?? o.State
  const blockHeightRaw =
    o.blockHeight ?? o.BlockHeight ?? o.Block ?? o.block
  const confirmedNumberRaw = o.confirmedNumber ?? o.ConfirmedNumber
  const lastConfirmedRaw = o.lastConfirmedBlock ?? o.LastConfirmedBlock

  const stateCode = num(state)
  const bh = num(blockHeightRaw)
  const statusBlock = Number.isFinite(bh) ? bh : 0
  const cn = num(confirmedNumberRaw)
  const lcb = num(lastConfirmedRaw)

  if (!Number.isFinite(stateCode)) return null
  return {
    stateCode,
    statusBlock,
    confirmedNumber: Number.isFinite(cn) ? cn : 0,
    lastConfirmedBlock: Number.isFinite(lcb) ? lcb : 0,
  }
}
