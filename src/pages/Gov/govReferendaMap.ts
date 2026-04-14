import { hexToSS58 } from '@/utils/chain'
import { bytesToString } from '@/utils/gov'
import { parseHumanNumber } from '@/utils/parseHumanNumber'
import { proposalStatusKey, type ProposalStatusKey } from '@/utils/proposalState'

export type TrackCategory = 'system' | 'treasury' | 'others'

export interface GovReferendumRow {
  id: number
  submitBlock: number
  proposer: string
  trackId: number
  trackCategory: TrackCategory
  status: ProposalStatusKey
  callLabel: string
  callContract: string
  callMethod: string
  callAmount: string
  comments?: number
}

export function shortCaller(caller: { t?: string | number; v?: string } | null | undefined): string {
  if (!caller?.v) return '—'
  if (String(caller.t) !== '1') return '—'
  const ss58 = hexToSS58(caller.v)
  return ss58.length > 14 ? `${ss58.slice(0, 6)}…${ss58.slice(-4)}` : ss58
}

export function trackCategoryFromName(name: string): TrackCategory {
  const s = name.toLowerCase()
  if (s.includes('root') || s.includes('wish') || s.includes('变更')) return 'system'
  if (
    s.includes('tipper') ||
    s.includes('spender') ||
    s.includes('treasurer') ||
    s.includes('treasury') ||
    s.includes('国库') ||
    s.includes('支出')
  ) {
    return 'treasury'
  }
  if (s.includes('whitelist') || s.includes('fellowship') || s.includes('白名单')) return 'others'
  return 'others'
}

export function buildTrackCategoryById(tracksResult: unknown): Map<number, TrackCategory> {
  const map = new Map<number, TrackCategory>()
  const rows = Array.isArray(tracksResult) ? tracksResult : []
  for (const item of rows) {
    const row = item as unknown[]
    const trackData = (row[1] ?? row) as Record<string, unknown>
    const id = parseHumanNumber(row[0] ?? trackData.id)
    const name = bytesToString(trackData.name) || `Track ${id}`
    map.set(id, trackCategoryFromName(name))
  }
  return map
}

export function normalizeSelectorHex(s: string): string {
  const t = s.toLowerCase().trim()
  if (!t) return ''
  return t.startsWith('0x') ? t : `0x${t}`
}

export function formatProposalCall(
  call: unknown,
  methodBySelector: Map<string, string>,
): { callLabel: string; callContract: string; callMethod: string; callAmount: string } {
  if (!call || typeof call !== 'object') {
    return { callLabel: '', callContract: '', callMethod: '', callAmount: '' }
  }
  let c = call as Record<string, unknown>
  if ('Some' in c && c.Some && typeof c.Some === 'object') {
    c = c.Some as Record<string, unknown>
  }
  const selector = normalizeSelectorHex(String(c.selector ?? ''))
  const contract = String(c.contract ?? 'gov')
  const amountRaw = c.amount
  const amount =
    amountRaw === undefined || amountRaw === null ? '' : String(amountRaw).replace(/,/g, '')
  if (!selector) {
    return { callLabel: '', callContract: '', callMethod: '', callAmount: amount }
  }
  const method = methodBySelector.get(selector) ?? selector
  return {
    callLabel: `${contract}.${method}`,
    callContract: contract,
    callMethod: method,
    callAmount: amount,
  }
}

export function mapProposal(
  p: Record<string, unknown>,
  categoryByTrackId: Map<number, TrackCategory>,
  methodBySelector: Map<string, string>,
  stateCode: number,
): GovReferendumRow {
  const trackId = parseHumanNumber(p.trackID)
  const { callLabel, callContract, callMethod, callAmount } = formatProposalCall(
    p.call,
    methodBySelector,
  )
  return {
    id: parseHumanNumber(p.id),
    submitBlock: parseHumanNumber(p.submitBlock),
    proposer: shortCaller(p.caller as { t?: string | number; v?: string }),
    trackId,
    trackCategory: categoryByTrackId.get(trackId) ?? 'others',
    status: proposalStatusKey(stateCode),
    callLabel,
    callContract,
    callMethod,
    callAmount,
  }
}
