import { CurrentChainNode } from "@/plugins/chain"
import axios from "axios"

export const GetSideChainStatus = async () => {
    const url = CurrentChainNode().rpcUrl + "/status"
    const resp = await axios.get(url)
    return resp.data.result
}

export const GetSideChainNodes = async () => {
    const url = CurrentChainNode().rpcUrl + "/net_info"
    const resp = await axios.get(url)
    return resp.data.result
}

export const GetNowBlocks = async () => {
    const url = CurrentChainNode().rpcUrl + "/blockchain"
    const resp = await axios.get(url)
    return resp.data.result 
}

export const GetNowTx = async (block:string) => {
    const url = CurrentChainNode().rpcUrl + "/tx_search?query=\"tx.height<="+block+"\"&per_page=30&order_by=\"desc\""
    const resp = await axios.get(url)
    return resp.data.result 
}


export const SubNewBlock = async () => {
    // const 
}