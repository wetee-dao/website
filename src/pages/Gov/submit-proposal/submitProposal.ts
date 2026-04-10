import { CallContent, SecretContractApi } from '@/apis/contract'
import type { WalletWrap } from '@/providers'
import type { ProposalSubmitPayload } from './types'

export function assertGovDryRunOk(dry: unknown): void {
  if (dry && typeof dry === 'object' && dry !== null && 'Err' in dry) {
    throw new Error(`Gov dry-run failed: ${JSON.stringify(dry)}`)
  }
}

/** dry-run + 构造 submit_proposal 用的 call */
export async function dryRunGovBusinessMessage(
  method: string,
  args: Record<string, unknown>,
): Promise<CallContent> {
  const call = await SecretContractApi.buildCallContent('gov', method, args, 0)
  return call
}

export async function submitProposalPayload(
  wallet: WalletWrap,
  payload: ProposalSubmitPayload,
): Promise<void> {
  if (payload.action === 'addTrack') {
    const call = await dryRunGovBusinessMessage('addTrack', { track: payload.trackData })
    await SecretContractApi.submitProposal(wallet, call, payload.proposalTrackId)
    return
  }
  if (payload.action === 'spend') {
    const call = await dryRunGovBusinessMessage('spend', {
      to: payload.to,
      amount: payload.amount,
      trackID: payload.proposalTrackId,
    })
    await SecretContractApi.submitProposal(wallet, call, payload.proposalTrackId)
    return
  }
  throw new Error('Unknown proposal action')
}
