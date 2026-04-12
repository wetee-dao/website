import { CurrentSecretUrl } from "@/plugins/chain";
import { GraphqlClient } from "@/utils/gql";

import axios from "axios";
import { Abi } from "@polkadot/api-contract";
import { hexToU8a, stringToHex, stringToU8a, u8aToBuffer, u8aToHex } from '@polkadot/util';
import { Bytes } from '@polkadot/types';
import type { AnyJson, Registry, TypeDef } from "@polkadot/types/types";
import { transformUserInput } from "@/utils/ink";
import type { WalletWrap } from "@/providers";
import { hexToSS58, ss58toHex } from "@/utils/chain";
import { store } from "@/stores/global";
import { concatUint8Array } from "@/utils/buffer";

export class SecretContract {
    govAbi: Abi | undefined
    govContract: string
    govAbiUrl: string

    constructor(ps: any) {
        this.govContract = ps.govContract
        this.govAbiUrl = ps.govAbiUrl
    }

    // ============ Token & Allowance ============
    /** 查询授权额度 */
    async allowance(owner: string, spender: string) {
        return await this.contract_query("gov", "allowance", { owner, spender })
    }

    /** 授权额度 */
    async approve(wallet: WalletWrap, spender: string, value: string) {
        const result = await this.contract_builder("gov", "approve", { spender, value }, "0")
        return await this.call(wallet, result.params)
    }

    /** 查询余额 */
    async balanceOf(owner: string) {
        return await this.contract_query("gov", "balanceOf", {
            owner: {
                T: 1,
                V: ss58toHex(owner)
            }
        })
    }

    /** 查询锁定余额 */
    async lockBalanceOf(owner: string) {
        return await this.contract_query("gov", "lockBalanceOf", {
            owner: {
                T: 1,
                V: ss58toHex(owner)
            }
        })
    }

    /** 转账 */
    async transfer(wallet: WalletWrap, to: string, value: string) {
        const result = await this.contract_builder("gov", "transfer", { to, value }, "0")
        return await this.call(wallet, result.params)
    }

    /** 从授权账户转账 */
    async transferFrom(wallet: WalletWrap, from: string, to: string, amount: string) {
        const result = await this.contract_builder("gov", "transferFrom", { from, to, amount }, "0")
        return await this.call(wallet, result.params)
    }

    /** 查询总供应量 */
    async totalSupply() {
        return await this.contract_query("gov", "totalSupply", {})
    }

    // ============ Member Management ============
    /** 查询成员列表 */
    async members() {
        return await this.contract_query("gov", "members", {})
    }

    /** 加入DAO */
    async join(wallet: WalletWrap, newUser: string, balance: string) {
        const result = await this.contract_builder("gov", "join", {
            newUser: {
                T: 1,
                V: ss58toHex(newUser)
            }, balance
        }, "0")

        return await this.call(wallet, result.params)
    }

    /** 退出DAO */
    async leave(wallet: WalletWrap) {
        const result = await this.contract_builder("gov", "leave", {}, "0")
        return await this.call(wallet, result.params)
    }

    /** 退出并销毁 */
    async leaveWithBurn(wallet: WalletWrap) {
        const result = await this.contract_builder("gov", "leaveWithBurn", {}, "0")
        return await this.call(wallet, result.params)
    }

    /** 查询是否允许公开加入 */
    async getPublicJoin() {
        return await this.contract_query("gov", "getPublicJoin", {})
    }

    /** 设置是否允许公开加入（需经公投：仅返回 CallContent） */
    async setPublicJoin(publicJoin: boolean) {
        return await this.buildCallContent("gov", "setPublicJoin", { publicJoin }, 0)
    }

    /** 公开加入 */
    async publicJoin(wallet: WalletWrap) {
        const result = await this.contract_builder("gov", "publicJoin", {}, "0")
        return await this.call(wallet, result.params)
    }

    // ============ Track Management ============
    /** 查询默认Track */
    async defaultTrack() {
        return await this.contract_query("gov", "defaultTrack", {})
    }

    /**
     * 设置默认 Track（需经公投：仅返回 CallContent，由业务层 dry-run 后 submitProposal）。
     */
    async setDefaultTrack(trackId: number) {
        return await this.buildCallContent("gov", "setDefaultTrack", { trackID: trackId }, 0)
    }

    /** 添加 Track（需经公投：仅返回 CallContent） */
    async addTrack(track: any) {
        return await this.buildCallContent("gov", "addTrack", { track }, 0)
    }

    /** 查询Track */
    async track(id: number) {
        return await this.contract_query("gov", "track", { id })
    }

    /** 查询所有Tracks */
    async tracks() {
        return await this.contract_query("gov", "tracks", {})
    }

    // ============ Proposal Management ============
    async submitProposal(wallet: WalletWrap, call: CallContent, proposalTrackId: number) {
        const result = await this.contract_builder("gov", "submitProposal", { call, trackID: proposalTrackId }, "0")
        return await this.call(wallet, result.params)
    }

    /** 查询提案 */
    async proposal(id: number) {
        let result = await this.contract_query("gov", "proposal", { id })
        return {
            ...result.proposal,
            id: result.id,
        }
    }

    /** 查询提案状态 */
    async proposalStatus(id: number) {
        return await this.contract_query("gov", "proposalStatus", { id })
    }

    /** 查询所有提案 */
    async proposals() {
        let result = await this.contract_query("gov", "proposals", {
            startKey: null,
            size: 20,
        })

        return result.map((item: any) => {
            return {
                ...item.proposal,
                id: item.id,
            }
        })
    }

    /** 取消提案 */
    async cancelProposal(wallet: WalletWrap, proposalId: number) {
        const result = await this.contract_builder("gov", "cancelProposal", { proposalId }, "0")
        return await this.call(wallet, result.params)
    }

    /** 存入提案押金（需经公投：仅返回 CallContent） */
    async depositProposal(proposalId: number, amount: string) {
        return await this.buildCallContent("gov", "depositProposal", { proposalID: proposalId, amount }, 0)
    }

    /** 存入提案押金（直接发交易） */
    async depositProposalTx(wallet: WalletWrap, proposalId: number, amount: string) {
        const result = await this.contract_builder("gov", "depositProposal", { proposalID: proposalId, amount }, "0")
        return await this.call(wallet, result.params)
    }

    /** 执行提案 */
    async execProposal(wallet: WalletWrap, proposalID: number) {
        const result = await this.contract_builder("gov", "execProposal", { proposalID }, "0")
        return await this.call(wallet, result.params)
    }

    // ============ Voting ============
    // Abi（gov.json）：submit_vote(proposal_i_d, opinion_yes, lock_amount) → proposalID, opinionYes, lockAmount
    /** 提交投票 */
    async submitVote(wallet: WalletWrap, proposalId: number, opinionYes: boolean, lockAmount: string) {
        const result = await this.contract_builder("gov", "submitVote", {
            proposalID: proposalId,
            opinionYes,
            lockAmount,
        }, "0")
        return await this.call(wallet, result.params)
    }

    // Abi：vote(proposal_i_d, index) → proposalID, index
    /** 按提案与投票序号查询单条投票 */
    async vote(proposalId: number, index: number) {
        return await this.contract_query("gov", "vote", { proposalID: proposalId, index })
    }

    // Abi：votes(proposal_i_d, start_key: Option<Vote>, size) → proposalID, startKey, size
    /** 分页查询某提案下的投票；首屏 startKey 传 null */
    async votes(proposalId: number, startKey: unknown | null = null, size = 512) {
        return await this.contract_query("gov", "votes", {
            proposalID: proposalId,
            startKey,
            size,
        })
    }

    // Abi：cancel_vote(proposal_i_d, index)
    /** 取消投票（提案 ID + 投票序号 index） */
    async cancelVote(wallet: WalletWrap, proposalId: number, index: number) {
        const result = await this.contract_builder("gov", "cancelVote", {
            proposalID: proposalId,
            index,
        }, "0")
        return await this.call(wallet, result.params)
    }

    // Abi：unlock(proposal_i_d, index)
    /** 解锁投票（提案 ID + 投票序号 index） */
    async unlock(wallet: WalletWrap, proposalId: number, index: number) {
        const result = await this.contract_builder("gov", "unlock", {
            proposalID: proposalId,
            index,
        }, "0")
        return await this.call(wallet, result.params)
    }

    // ============ Treasury ============

    /** 国库支出申请（需经公投：仅返回 CallContent） */
    async spend(to: string, amount: string, trackId: number) {
        return await this.buildCallContent("gov", "spend", { to, amount, trackID: trackId }, 0)
    }

    /** 领取支出 */
    async payout(wallet: WalletWrap, spendId: number) {
        const result = await this.contract_builder("gov", "payout", { spendId }, "0")
        return await this.call(wallet, result.params)
    }

    // query contract
    async contract_query(contract: string, method: string, args: Record<string, unknown>) {
        const data = await this.contract_builder(contract, method, args, "0")
        if (data.dry == 'Decoding error') {
            throw new Error("Decoding error")
        }
        return data.dry
    }

    // build contractcall params
    async contract_builder(contract: string, method: string, args: Record<string, unknown>, payValue: string) {
        const abi = await this.initContract(contract)
        const methodAbi = abi.messages.find(item => item.method === method)
        if (!methodAbi) {
            window.$notification["error"]({
                content: 'Error',
                description: "contract contract method not found: " + method,
                duration: 2500,
                keepAliveOnHover: true
            })
            throw new Error("method not found")
        }

        const userInfo = this.getCallerInfo()
        const params = transformUserInput(abi!.registry, methodAbi.args, args)

        const argstrs = methodAbi.args.map(({ type: { lookupName, type } }, index) => {
            let p = abi.registry.createType(lookupName || type, params[index]).toU8a()
            if (type == "Address") {
                p = p.slice(1)
            }
            return u8aToHex(p)
        })


        console.log("tee-secret  contract", contract)
        console.log("              method", methodAbi.method)
        // console.log("            abi args", methodAbi.args)
        console.log("                args", args)
        console.log("            hex args", argstrs)

        const response = await this.tryRun(userInfo.addr, contract, methodAbi.selector.toHex(), argstrs, methodAbi.isMutating || false)
        const bt = hexToU8a(response)
        let retutnData = decodeReturnValue(methodAbi.returnType, u8aToBuffer(bt), abi!.registry) as any

        console.log(methodAbi.method, retutnData)

        return {
            dry: retutnData,
            params: {
                caller: ss58toHex(userInfo.addr),
                contract: contract,
                method: methodAbi.selector.toHex(),
                args: argstrs,
                payValue: payValue.toString(),
            },
        }
    }

    async buildCallContent(contract: string, method: string, args: Record<string, unknown>, payValue: number): Promise<CallContent> {
        const abi = await this.initContract(contract)
        const methodAbi = abi.messages.find(item => item.method === method)
        if (!methodAbi) {
            throw new Error("contract method not found: " + method)
        }
        const params = transformUserInput(abi.registry, methodAbi.args, args)
        const argBts = methodAbi.args.map(({ type: { lookupName, type } }, index) => {
            let p = abi.registry.createType(lookupName || type, params[index]).toHex()
            return p
        })

        console.log("contract", stringToHex(contract))
        console.log("selector", methodAbi.selector.toU8a())
        console.log("args", argBts)
        console.log("payValue", payValue)

        return new CallContent(stringToHex(contract), methodAbi.selector.toU8a(), argBts, payValue)
    }

    // init contract
    async initContract(contract: string) {
        let abi: Abi | undefined = undefined;
        if (contract == this.govContract) {
            if (!this.govAbi) {
                this.govAbi = await this.getAbi(this.govAbiUrl)
            }
            abi = this.govAbi
        }

        if (!abi) {
            throw new Error("abi not found")
        }

        return abi!
    }

    // read contract abi
    async getAbi(url: string): Promise<Abi> {
        const response = await axios.get("/" + url)
        return new Abi(response.data)
    }

    /** gov 合约：selector 十六进制（如 0xdf60a515）→ ink 方法名（如 add_track），供提案 call 展示 */
    async getGovSelectorMethodMap(): Promise<Map<string, string>> {
        const abi = await this.initContract("gov")
        const map = new Map<string, string>()
        for (const msg of abi.messages) {
            map.set(msg.selector.toHex().toLowerCase(), msg.method)
        }
        return map
    }

    async tryRun(caller: string, contract: string, method: string, args: string[], mut: boolean) {
        const argStr = JSON.stringify(args)
        const response = await (new GraphqlClient(CurrentSecretUrl())).query({
            query: `query{
                    contractDryRun(
                        caller:"${ss58toHex(caller)}",
                        callerType: 1,
                        contract:"${contract}",
                        mut: ${mut},
                        method: "${method}",
                        args: ${argStr}
                    )
                }`,
        })

        return response.contractDryRun
    }

    async call(wallet: WalletWrap, params: { caller: string, contract: string, method: string, args: string[] }) {
        const { caller, contract, method, args } = params
        const argStr = JSON.stringify(args)
        const data = concatUint8Array(
            stringToU8a(contract),
            hexToU8a(method),
            ...args.map((v) => hexToU8a(v)),
        )

        const sig = (await wallet.signMsg(data, hexToSS58(caller))).replace(/^0x/i, '');
        const response = await (new GraphqlClient(CurrentSecretUrl())).mut({
            query: `mutation{
                    contractCall(
                        caller:"${ss58toHex(caller)}",
                        callerType: 1,
                        contract:"${contract}",
                        method: "${method}",
                        args: ${argStr},
                        signature: "${sig}"
                    )
                }`,
        })

        return response.contractCall
    }

    // get caller info
    getCallerInfo() {
        return store.state.value.global.userInfo
    }
}

function decodeReturnValue(
    returnType: TypeDef | null | undefined,
    data: Bytes,
    registry: Registry,
): AnyJson {
    let returnTypeName = getReturnTypeName(returnType);
    console.log(returnTypeName)

    const resultInkErrPrefix = 'Result<';
    const resultInkErrSuffix = ', InkPrimitivesLangError>';
    if (
        returnTypeName.startsWith(resultInkErrPrefix) &&
        returnTypeName.endsWith(resultInkErrSuffix)
    ) {
        returnTypeName = returnTypeName.slice(
            resultInkErrPrefix.length,
            returnTypeName.length - resultInkErrSuffix.length,
        );
    }

    let r: AnyJson = 'Decoding error';
    try {
        r = returnType ? registry.createTypeUnsafe(returnTypeName, [data]).toHuman() : '()';
    } catch (exception) {
        console.error(exception);
    }
    return r;
}

function getReturnTypeName(type: TypeDef | null | undefined) {
    return type?.lookupName || type?.type || '';
}

export class CallContent {
    contract: string
    selector: Uint8Array
    args: string[]
    amount: number

    constructor(contract: string, selector: Uint8Array, args: string[], amount: number) {
        this.contract = contract
        this.selector = selector
        this.args = args
        this.amount = amount
    }
}

export const SecretContractApi = new SecretContract({
    govContract: "gov",
    govAbiUrl: "contract/gov.json",
})
