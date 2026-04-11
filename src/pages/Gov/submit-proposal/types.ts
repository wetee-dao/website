/** 与链上 Curve 一致，表单用 number；提交时原样传入 contract */
export type CurveTypeId = 'LinearDecreasing' | 'SteppedDecreasing' | 'Reciprocal'

export interface CurveFormModel {
  type: CurveTypeId
  linearBegin: number
  linearEnd: number
  linearLength: number
  stepBegin: number
  stepEnd: number
  stepSize: number
  stepPeriod: number
  reciprocalFactor: number
  reciprocalXScale: number
  reciprocalXOffset: number
  reciprocalYOffset: number
}

export function createDefaultCurveForm(): CurveFormModel {
  return {
    type: 'LinearDecreasing',
    linearBegin: 10000,
    linearEnd: 50,
    linearLength: 100,
    stepBegin: 0,
    stepEnd: 0,
    stepSize: 0,
    stepPeriod: 0,
    reciprocalFactor: 0,
    reciprocalXScale: 0,
    reciprocalXOffset: 0,
    reciprocalYOffset: 0,
  }
}

/** 传给 gov add_track 的 Curve 对象（camelCase，与 toHuman 一致） */
export function curveFormToContract(m: CurveFormModel) {
  return {
    type: m.type,
    linearBegin: m.linearBegin,
    linearEnd: m.linearEnd,
    linearLength: m.linearLength,
    stepBegin: m.stepBegin,
    stepEnd: m.stepEnd,
    stepSize: m.stepSize,
    stepPeriod: m.stepPeriod,
    reciprocalFactor: m.reciprocalFactor,
    reciprocalXScale: m.reciprocalXScale,
    reciprocalXOffset: m.reciprocalXOffset,
    reciprocalYOffset: m.reciprocalYOffset,
  }
}

/** 添加轨道表单（minEnactmentPeriod 提交时由父级补全） */
export interface AddTrackFormModel {
  name: string
  preparePeriod: number
  decisionPeriod: number
  confirmPeriod: number
  maxDeciding: number
  decisionDeposit: string
  maxBalance: string
  minApproval: CurveFormModel
  minSupport: CurveFormModel
}

/** 国库支出表单 */
export type UniAddrInput = { t: 1 | 2; v: string }

export interface TreasurySpendFormModel {
  to: UniAddrInput | null
  amount: string
}

export function createDefaultAddTrackForm(): AddTrackFormModel {
  const c = createDefaultCurveForm()
  return {
    name: '',
    preparePeriod: 100,
    decisionPeriod: 100,
    confirmPeriod: 100,
    maxDeciding: 10,
    decisionDeposit: '1000000000000',
    maxBalance: '1000000000000000',
    minApproval: { ...c },
    minSupport: { ...c },
  }
}

export function createDefaultTreasurySpendForm(): TreasurySpendFormModel {
  return { to: null, amount: '' }
}

export type ProposalSubmitPayload =
  | {
      action: 'addTrack'
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
        minApproval: ReturnType<typeof curveFormToContract>
        minSupport: ReturnType<typeof curveFormToContract>
      }
    }
  | {
      action: 'spend'
      proposalTrackId: number
      to: UniAddrInput
      amount: string
    }
  | {
      action: 'setDefaultTrack'
      proposalTrackId: number
      defaultTrackId: number
    }
