import { CurrentChainNode } from "@/plugins/chain"
import { ReconnectingWebSocket } from "@/utils/ws"
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
    const url = CurrentChainNode().rpcUrl + "/blockchain?t="+new Date().getTime()
    const resp = await axios.get(url)
    return resp.data.result 
}

export const GetNowTx = async (block:string) => {
    const url = CurrentChainNode().rpcUrl + "/tx_search?query=\"tx.height<="+block+"\"&per_page=30&order_by=\"desc\""
    const resp = await axios.get(url)
    return resp.data.result 
}

/** 按区块高度查询该区块的交易 */
export const GetTxByHeight = async (height: string | number) => {
    const url = CurrentChainNode().rpcUrl + "/tx_search?query=\"tx.height=" + String(height) + "\"&per_page=100&order_by=\"asc\""
    const resp = await axios.get(url)
    return resp.data.result
}

/** CometBFT: 根据高度获取区块详情 */
export const GetBlockByHeight = async (height: string | number) => {
    const url = CurrentChainNode().rpcUrl + "/block?height=" + String(height) + "&t=" + Date.now()
    const resp = await axios.get(url)
    return resp.data.result
}

export const SubNewBlock = (back: ((this: ReconnectingWebSocket, ev: MessageEvent<any>) => any) | { handleEvent: (event: MessageEvent<any>) => any }) => {
  const ws = new ReconnectingWebSocket(CurrentChainNode().rpcWs, {});
  ws.addEventListener("message", back);
  ws.onopen = () => {
    console.log("open")
  };
  ws.onclose = () => {
    console.log("onclose")
  };

  ws.onerror = () => {
    console.log("on error")
    ws.close();
  };

  ws.send(`{"jsonrpc": "2.0","method": "subscribe","id": 0,"params": {"query": "tm.event='NewBlock'"}}`);

  return ws
}