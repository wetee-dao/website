/** 添加轨道表单（不含 minEnactmentPeriod，提交时由父级补全） */
export interface AddTrackFormModel {
  name: string
  preparePeriod: number
  decisionPeriod: number
  confirmPeriod: number
  maxDeciding: number
  decisionDeposit: string
  maxBalance: string
}

/** 国库支出表单 */
export interface TreasurySpendFormModel {
  to: string
  amount: string
}

export function createDefaultAddTrackForm(): AddTrackFormModel {
  return {
    name: '',
    preparePeriod: 100,
    decisionPeriod: 100,
    confirmPeriod: 100,
    maxDeciding: 10,
    decisionDeposit: '1000000000000',
    maxBalance: '1000000000000000',
  }
}

export function createDefaultTreasurySpendForm(): TreasurySpendFormModel {
  return { to: '', amount: '' }
}

export type ProposalSubmitPayload =
  | {
      action: 'addTrack'
      /** submit_proposal 的轨道；业务 add_track 的 TrackData 在 trackData */
      proposalTrackId: number
      trackData: {
        name: string
        preparePeriod: number
        decisionPeriod: number
        confirmPeriod: number
        maxDeciding: number
        minEnactmentPeriod: number
        decisionDeposit: string
        maxBalance: string
      }
    }
  | {
      action: 'spend'
      /** 与业务 spend 内 trackID、submit_proposal 的 trackID 一致（当前为所选轨道） */
      proposalTrackId: number
      to: string
      amount: string
    }
