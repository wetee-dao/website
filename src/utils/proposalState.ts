import { parseHumanNumber } from '@/utils/parseHumanNumber'

/** 与链上 gov 合约 Proposal 状态枚举一致 */
export const ProposalState = {
  Pending: 0,
  Ongoing: 1,
  Confirming: 2,
  Approved: 3,
  Rejected: 4,
  Canceled: 5,
} as const

export type GovProposalUiStatus =
  | 'Deciding'
  | 'Preparing'
  | 'Executed'
  | 'TimedOut'
  | 'Rejected'

/** 从 `proposal.status` 或 `status.state` 读出数值枚举 */
export function readProposalStateCode(status: unknown): number {
  if (status == null) return ProposalState.Pending
  if (typeof status === 'number' && Number.isFinite(status)) return status
  if (typeof status === 'object' && status !== null && 'state' in status) {
    return readProposalStateCode((status as { state: unknown }).state)
  }
  const n = parseHumanNumber(status)
  return Number.isFinite(n) ? n : ProposalState.Pending
}

/** 映射到页面用的五种状态文案/样式 */
export function proposalStateToGovUi(code: number): GovProposalUiStatus {
  switch (code) {
    case ProposalState.Pending:
      return 'Preparing'
    case ProposalState.Ongoing:
      return 'Deciding'
    case ProposalState.Confirming:
      return 'Deciding'
    case ProposalState.Approved:
      return 'Executed'
    case ProposalState.Rejected:
      return 'Rejected'
    case ProposalState.Canceled:
      return 'TimedOut'
    default:
      return 'Deciding'
  }
}
