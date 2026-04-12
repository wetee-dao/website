/**
 * 与后端 gov ProposalStatus 一致（uint8）
 * Pending→Ongoing→Confirming→Confirmed→Approved / Rejected / Canceled
 */
export const ProposalState = {
  Pending: 0,
  Ongoing: 1,
  Confirming: 2,
  /** 已确认，确认期结束，等待执行 */
  Confirmed: 3,
  /** 已批准，提案通过 */
  Approved: 4,
  Rejected: 5,
  Canceled: 6,
} as const

/** 与 ProposalState 字段名一一对应，用于展示与 i18n */
export type ProposalStatusKey = keyof typeof ProposalState

export function proposalStatusKey(code: number): ProposalStatusKey {
  switch (code) {
    case ProposalState.Pending:
      return 'Pending'
    case ProposalState.Ongoing:
      return 'Ongoing'
    case ProposalState.Confirming:
      return 'Confirming'
    case ProposalState.Confirmed:
      return 'Confirmed'
    case ProposalState.Approved:
      return 'Approved'
    case ProposalState.Rejected:
      return 'Rejected'
    case ProposalState.Canceled:
      return 'Canceled'
    default:
      return 'Pending'
  }
}
