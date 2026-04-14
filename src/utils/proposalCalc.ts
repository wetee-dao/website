/**
 * 提案状态计算工具
 * 与后端 gov/vote.go calculateProposalStatus 保持一致
 */

import { BN } from '@polkadot/util'
import { type Curve, curveY, parseCurveFromApi } from './curve'

/**
 * 提案状态常量
 * 与后端 gov/types.go 保持一致
 */
export const ProposalStatus = {
  Pending: 0,    // 待质押，提案已提交但尚未支付押金
  Ongoing: 1,    // 进行中，正在投票阶段
  Confirming: 2, // 确认中，阈值已满足，正在等待确认期结束
  Confirmed: 3,  // 已确认，确认期结束，等待执行
  Approved: 4,   // 已批准，提案通过
  Rejected: 5,   // 已拒绝，提案被否决
  Canceled: 6,   // 已取消，提案被取消
} as const

export type ProposalStatusType = typeof ProposalStatus[keyof typeof ProposalStatus]

/**
 * 投票记录
 */
export interface Vote {
  index: number
  proposalId: number
  caller: string
  pledge: BN
  opinionYes: boolean
  voteWeight: BN
  unlockBlock: number
  voteBlock: number
  deleted: boolean
}

/**
 * 轨道数据
 */
export interface TrackData {
  id: number
  name: string
  preparePeriod: number
  maxDeciding: number
  confirmPeriod: number
  decisionPeriod: number
  minEnactmentPeriod: number
  decisionDeposit: BN
  maxBalance: BN
  minApproval: Curve
  minSupport: Curve
}

/**
 * 投票统计结果
 */
export interface VoteTally {
  yes: BN                // 加权后的同意票
  no: BN                 // 加权后的反对票
  support: BN            // 参与投票的总质押量（未加权）
  totalSupply: BN        // 总发行量
  approvalRatio: number  // yes / (yes + no) * 10000（万分比）
  supportRatio: number   // support / totalSupply * 10000（万分比）
}

/**
 * 计算投票统计
 */
export function calculateTally(votes: Vote[], totalSupply: BN): VoteTally {
  const yes = new BN(0)
  const no = new BN(0)
  const support = new BN(0)

  for (const vote of votes) {
    if (vote.deleted) continue

    const pledge = vote.pledge
    const weightedPledge = pledge.mul(vote.voteWeight)
    support.iadd(pledge)

    if (vote.opinionYes) {
      yes.iadd(weightedPledge)
    } else {
      no.iadd(weightedPledge)
    }
  }

  const totalVotes = yes.add(no)
  let approvalRatio = 0
  let supportRatio = 0

  if (totalVotes.gt(new BN(0)) && totalSupply.gt(new BN(0))) {
    approvalRatio = yes.muln(10000).div(totalVotes).toNumber()
    supportRatio = support.muln(10000).div(totalSupply).toNumber()
  }

  return { yes, no, support, totalSupply, approvalRatio, supportRatio }
}

/**
 * 计算提案状态
 * 
 * 返回提案状态码（uint8）：
 *   Pending(0) -> 待质押
 *   Ongoing(1) -> 进行中
 *   Confirming(2) -> 确认中
 *   Confirmed(3) -> 已确认
 *   Approved(4) -> 已批准
 *   Rejected(5) -> 已拒绝
 *   Canceled(6) -> 已取消
 * 
 * 通过条件：
 *   1. approvalRatio >= minApproval && supportRatio >= minSupport
 *   2. 连续满足条件的时间 > confirmPeriod（在投票记录中或当前区块）
 *   3. 确认期完成时间 <= endBlock + decisionPeriod
 */
export function calculateProposalStatus(
  votes: Vote[],
  track: TrackData,
  totalSupply: BN,
  depositBlock: number,
  currentBlock: number
): number {
  const endBlock = depositBlock + track.maxDeciding

  // 按投票区块排序
  const sortedVotes = [...votes].sort((a, b) => a.voteBlock - b.voteBlock)

  // 确认期逻辑
  let lastAchieveBlock = 0
  const confirmPeriod = track.confirmPeriod
  const decisionPeriod = track.decisionPeriod

  // 逐票计算
  const yes = new BN(0)
  const no = new BN(0)
  const support = new BN(0)

  for (const vote of sortedVotes) {
    if (vote.deleted) continue

    const voteBlock = vote.voteBlock
    const voteOffset = voteBlock - depositBlock

    // 使用投票时的区块号计算阈值
    const minApproval = curveY(track.minApproval, voteOffset)
    const minSupport = curveY(track.minSupport, voteOffset)

    // 累计投票
    const pledge = vote.pledge
    const weightedPledge = pledge.mul(vote.voteWeight)
    support.iadd(pledge)

    if (vote.opinionYes) {
      yes.iadd(weightedPledge)
    } else {
      no.iadd(weightedPledge)
    }

    // 计算比率
    const totalVotes = yes.add(no)
    if (totalVotes.gt(new BN(0)) && totalSupply.gt(new BN(0))) {
      const approvalRatio = yes.muln(10000).div(totalVotes).toNumber()
      const supportRatio = support.muln(10000).div(totalSupply).toNumber()

      // 检查是否满足阈值
      if (approvalRatio >= minApproval && supportRatio >= minSupport) {
        // 检查确认期（在投票记录中）
        if (lastAchieveBlock > 0 && voteBlock - lastAchieveBlock > confirmPeriod) {
          // 检查是否有足够时间完成确认期
          if (lastAchieveBlock + confirmPeriod <= endBlock + decisionPeriod) {
            // 已确认，等待执行
            return ProposalStatus.Confirmed
          }
          // 确认期时间不够，拒绝
          return ProposalStatus.Rejected
        }

        // 记录首次满足阈值的区块
        if (lastAchieveBlock === 0) {
          lastAchieveBlock = voteBlock
        }
      } else {
        // 不满足阈值，重置
        lastAchieveBlock = 0
      }
    }
  }

  // 检查当前区块与最后满足阈值区块之间是否已超过确认期
  if (lastAchieveBlock > 0 && currentBlock - lastAchieveBlock > confirmPeriod) {
    // 检查是否有足够时间完成确认期（必须在 decisionPeriod 结束前）
    if (lastAchieveBlock + confirmPeriod <= endBlock + decisionPeriod) {
      // 已确认，等待执行
      return ProposalStatus.Confirmed
    }
    // 确认期时间不够，拒绝
    return ProposalStatus.Rejected
  }

  // 超过截止区块，拒绝
  if (currentBlock > endBlock) {
    return ProposalStatus.Rejected
  }

  // 正在确认中，检查是否有足够时间完成确认期
  if (lastAchieveBlock > 0) {
    if (lastAchieveBlock + confirmPeriod > endBlock + decisionPeriod) {
      // 确认期时间不够，拒绝
      return ProposalStatus.Rejected
    }
    return ProposalStatus.Confirming
  }

  // 进行中
  return ProposalStatus.Ongoing
}

/**
 * 从 API 数据解析轨道数据
 */
export function parseTrackFromApi(id: number, data: any): TrackData {
  return {
    id,
    name: String(data.name || ''),
    preparePeriod: Number(data.prepare_period || data.preparePeriod || 0),
    maxDeciding: Number(data.max_deciding || data.maxDeciding || 0),
    confirmPeriod: Number(data.confirm_period || data.confirmPeriod || 0),
    decisionPeriod: Number(data.decision_period || data.decisionPeriod || 0),
    minEnactmentPeriod: Number(data.min_enactment_period || data.minEnactmentPeriod || 0),
    decisionDeposit: new BN(String(data.decision_deposit || data.decisionDeposit || 0).replace(/,/g, '')),
    maxBalance: new BN(String(data.max_balance || data.maxBalance || 0).replace(/,/g, '')),
    minApproval: parseCurveFromApi(data.min_approval || data.minApproval),
    minSupport: parseCurveFromApi(data.min_support || data.minSupport),
  }
}

/**
 * 从 API 数据解析投票数据
 */
export function parseVoteFromApi(data: any): Vote {
  return {
    index: Number(data.index || 0),
    proposalId: Number(data.proposalId || 0),
    caller: String(data.caller || ''),
    pledge: new BN(String(data.pledge || 0).replace(/,/g, '')),
    opinionYes: Boolean(data.opinionYes),
    voteWeight: new BN(String(data.voteWeight || 1).replace(/,/g, '')),
    unlockBlock: Number(data.unlockBlock || 0),
    voteBlock: Number(data.voteBlock || 0),
    deleted: Boolean(data.deleted),
  }
}
