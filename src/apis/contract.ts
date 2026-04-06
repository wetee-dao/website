import { CurrentSecretUrl } from "@/plugins/chain";
import { GraphqlClient } from "@/utils/gql";

import axios from "axios";
import { Abi } from "@polkadot/api-contract";
import { hexToU8a, u8aToBuffer, u8aToHex } from '@polkadot/util';
import { Bytes } from '@polkadot/types';
import type { AnyJson, Registry, TypeDef } from "@polkadot/types/types";
import { transformUserInput } from "@/utils/ink";

export class SecretContract {
    daoAbi: Abi | undefined
    daoContract: string
    daoAbiUrl: string

    constructor(ps: any) {
        this.daoContract = ps.daoContract
        this.daoAbiUrl = ps.daoAbiUrl
    }

    async members() {
        await this.contract_query("dao", "members", {})

        await this.contract_query("dao", "")
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
                message: "contract contract method not found: " + method,
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
        console.log("            abi args", methodAbi.args)
        console.log("                args", args)
        console.log("            hex args", argstrs)

        const response = await this.tryRun(userInfo.addr, contract, methodAbi.selector.toHex(), argstrs, methodAbi.isMutating || false, payValue)
        const bt = hexToU8a(response)
        let retutnData = decodeReturnValue(methodAbi.returnType, u8aToBuffer(bt), abi!.registry) as any

        return {
            dry: retutnData,
            params: {
                contract: contract,
                payValue: payValue.toString(),
            },
        }
    }

    // init contract
    async initContract(contract: string) {
        let abi: Abi | undefined = undefined;
        if (contract == this.daoContract) {
            if (!this.daoAbi) {
                this.daoAbi = await this.getAbi(this.daoAbiUrl)
            }
            abi = this.daoAbi
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

    async tryRun(caller: string, contract: string, method: string, args: string[], mut: Boolean, payValue: string) {
        const argStr = JSON.stringify(args)
        const response = await (new GraphqlClient(CurrentSecretUrl())).query({
            query: `query{
                    contractDryRun(
                        caller:"${caller}",
                        contract:"${contract}",
                        mut: ${mut},
                        method: "${method}",
                        args: ${argStr},
                    )
                }`,
        })

        return response.contractDryRun
    }

    // get caller info
    getCallerInfo() {
        let userInfo = null
        if (window.localStorage.getItem("userInfo")) {
            userInfo = JSON.parse(window.localStorage.getItem("userInfo") || "{}")
        }

        return userInfo
    }
}

function decodeReturnValue(
    returnType: TypeDef | null | undefined,
    data: Bytes,
    registry: Registry,
): AnyJson {
    let returnTypeName = getReturnTypeName(returnType);
    const resultInkErrSuffix = ', InkPrimitivesLangError>';
    if (
        returnTypeName.startsWith('Result<') &&
        returnTypeName.endsWith(resultInkErrSuffix)
    ) {
        returnTypeName = returnTypeName.slice(
            'Result<'.length,
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

export const SecretContractApi = new SecretContract({
    daoContract: "dao",
    daoAbiUrl: "contract/dao.json",
})

