import { SecretContractApi } from '@/apis/contract'
import { parseHumanNumber } from '@/utils/parseHumanNumber'

export type VoteRefKey = { ProposalID: number; VoteIndex: number }

export function voteRefMapKey(ProposalID: number, VoteIndex: number): string {
  return `${ProposalID}-${VoteIndex}`
}

/** 解析 vote_unlock_statuses 返回的 Result<Vec<VoteUnlockStatus>> */
export function parseVoteUnlockStatusesResult(raw: unknown): Map<string, boolean> {
  const map = new Map<string, boolean>()
  let list: unknown[] = []
  if (Array.isArray(raw)) {
    list = raw
  } else if (raw && typeof raw === 'object' && 'Ok' in (raw as Record<string, unknown>)) {
    const inner = (raw as Record<string, unknown>).Ok
    if (Array.isArray(inner)) list = inner
  }
  for (const row of list) {
    if (!row || typeof row !== 'object') continue
    const o = row as Record<string, unknown>
    const pid = parseHumanNumber( o.proposalID)
    const idx = parseHumanNumber(o.voteIndex)
    const unlocked = Boolean(o.unlocked )
    map.set(voteRefMapKey(pid, idx), unlocked)
  }
  return map
}

const DEFAULT_CHUNK = 256

/** 分批调用 vote_unlock_statuses，合并为 proposalId-VoteIndex → 是否已链上解锁 */
export async function fetchVoteUnlockStatusMap(
  keys: VoteRefKey[],
  chunkSize = DEFAULT_CHUNK,
): Promise<Map<string, boolean>> {
  const merged = new Map<string, boolean>()
  if (keys.length === 0) return merged
  for (let i = 0; i < keys.length; i += chunkSize) {
    const chunk = keys.slice(i, i + chunkSize)
    const raw = await SecretContractApi.voteUnlockStatuses(chunk)
    const m = parseVoteUnlockStatusesResult(raw)
    m.forEach((v, k) => merged.set(k, v))
  }
  return merged
}
