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