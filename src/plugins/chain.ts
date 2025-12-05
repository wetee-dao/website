import { ApiPromise, HttpProvider, WsProvider } from "@polkadot/api"
import { base64Encode } from "@polkadot/util-crypto";
import { getSpecTypes } from '@polkadot/types-known';
import type { Injected, MetadataDef } from '@polkadot/extension-inject/types';
import { formatBalance, isNumber } from "@polkadot/util";
import axios from "axios";
//@ts-ignore
import qs from "qs";

import { getWallets, type Wallet } from '@talismn/connect-wallets';
import { chainJson } from '@/utils/chain';
import { SubstrateProvider } from '@/providers/substrate';
import { store, useGlobalStore } from "@/stores/global";
import type { SubmittableExtrinsic } from "@polkadot/api/types";
import { Loading } from "./pop";
import { getNetworkLatency } from "@/utils/net";
import type { WalletWrap } from "@/providers";
import type { ChainInterface } from "@/providers/chainapi";
import { Ink } from "@/providers/chainapi/ink";

export async function chainNetPing(): Promise<string> {
  // const chainNodes = chainUrls();
  // const results = await Promise.all(chainNodes.map(node => getNetworkLatency(getChainHttpApi(node.url)+"node/network")));
  // const rs = results.map((v,i)=>{
  //   return {i:i,v:v}
  // } ).filter((result:any) => result.v != null)

  // return rs[Math.floor(Math.random() * rs.length)].i
  return chainNodes[0].chainId
}

// 链节点
class ChainNode {
  name: string;
  type: string;
  chainId: string;
  chainUrl: string;
  queryUrl: string;
  secretUrl: string;
  rpcUrl: string;
  rpcWs: string
  constructor(name: string, type: string, chainId: string, chainUrl: string, queryUrl: string, secretUrl: string, rpcUrl: string, rpcWs:string) {
    this.name = name
    this.type = type
    this.chainId = chainId
    this.chainUrl = chainUrl
    this.queryUrl = queryUrl
    this.secretUrl = secretUrl
    this.rpcUrl = rpcUrl
    this.rpcWs = rpcWs
  }
}

// 链节点列表
export const chainNodes: ChainNode[] = [
  {
    name: 'DEV-LOCAL',
    chainId: "dev-local",
    type: "substrate",
    chainUrl: 'wss://xiaobai.asyou.me:30001/ws',
    rpcUrl: 'https://xiaobai.asyou.me:30111',
    rpcWs: 'wss://xiaobai.asyou.me:30111/websocket',
    queryUrl: 'https://xiaobai.asyou.me:30001/',
    secretUrl: 'https://xiaobai.asyou.me:30115/gql',
  },
]

// 获取当前链节点
export const CurrentChainNode = () => {
  const ins = useGlobalStore(store)
  const chainId = ins.chainId
  let c = chainNodes.find(node => node.chainId == chainId)
  if (!c) {
    c = chainNodes[0]
  }
  return c
}

// 初始化 API
export const initChainApi = (chainId: string) => {
  let node = chainNodes.find(node => node.chainId == chainId)
  if (!node) {
    node = chainNodes[0]
  }
  Ink.init(node.queryUrl, node.chainUrl)
}

export const CurrentSecretUrl = () => {
  return CurrentChainNode().secretUrl
}

// 获取交易对象
export const $getTxProvider = async (run: (chain: WalletWrap, builder: ChainInterface) => Promise<void>, isTry: boolean = false): Promise<void> => {
  const ins = useGlobalStore(store)
  const userInfo: any = ins.userInfo
  const loading = !isTry ? Loading("Connecting to chain...") : { close: () => { } }

  let wallet = undefined;
  const curl = CurrentChainNode().chainUrl;

  try {
    const provider = curl.startsWith("ws") ? new WsProvider(curl) : new HttpProvider(curl);
    const api = await ApiPromise.create({
      provider: provider,
      types: chainJson,
    });

    if (!userInfo || !userInfo.provider) {
      window.$notification["error"]({
        content: 'Error',
        meta: 'Please connect wallet first',
        duration: 2500,
        keepAliveOnHover: true
      })
      throw new Error("Please connect wallet first");
    }

    // await api.rpc.chain.getFinalizedHead();
    if (userInfo.provider == "metamask") {
      try {

      } catch (e) {
        throw e;
      }
    } else if (userInfo.provider == "substrate") {
      if (userInfo.type == "keyring") {
        wallet = new SubstrateProvider()
      } else {
        const wallet_ins: Wallet | undefined = getWallets().find(wallet => wallet.extensionName === userInfo.wallet);
        if (!wallet_ins) {
          throw new Error("polkadot.js " + userInfo.wallet + " not installed");
        }
        wallet = new SubstrateProvider()
      }
    }

    wallet!.client = api;
    loading.close();

    const callBuilder = $getQueryApi()

    await run(wallet as WalletWrap, callBuilder);
    wallet?.close();
  } catch (e) {
    loading.close();
    wallet?.close();
    console.log("chain connect error :", e);
  }
}

// 获取查询对象
export const $getQueryApi = (): ChainInterface => {
  const ins = useGlobalStore(store)
  const userInfo: any = ins.userInfo
  if (!userInfo || !userInfo.provider) {
    window.$notification["error"]({
      content: 'Error',
      meta: 'Please connect wallet first',
      duration: 2500,
      keepAliveOnHover: true
    })
    throw new Error("Please connect wallet first");
  }

  switch (userInfo.provider) {
    case "metamask":
      return Ink;
    case "substrate":
      return Ink;
    default:
      break;
  }

  window.$notification["error"]({
    content: 'Error',
    meta: 'wallet ' + userInfo.provider + ' not support',
    duration: 2500,
    keepAliveOnHover: true
  })

  throw new Error("wallet " + userInfo.provider + " not support");
}

export const getConfig = (): any => {
  if (localStorage.getItem("env") == "dev") {
    return {
      "Tokens": {
        "DEV": [
          "0"
        ],
      },
      "TokensAmount": {
        "DEV_0": async (api: ApiPromise, addr: string) => {
          let account: any = (await api.query.system.account(addr)).toHuman()
          return account.data;
        },
      },
      "Chains": {
        "0": {
          name: "DEV",
          icon: "/imgs/vStaking/DEV.svg",
          api: "wss://paseo-rpc.dwellir.com",
          isParent: true,
        },
      }
    }
  }

  return {
    "Tokens": {
      "PAS": [
        "0"
      ],
      "vDOT": [
        "2030"
      ],
    },
    "TokensAmount": {
      "PAS_0": async (api: ApiPromise, addr: string) => {
        let account: any = (await api.query.system.account(addr)).toHuman()
        return account.data;
      },
      "vDOT_2030": (api: ApiPromise) => { },
    },
    "Chains": {
      "0": {
        name: "Paseo",
        icon: "/imgs/vStaking/PAS.svg",
        api: "wss://paseo-rpc.dwellir.com",
        isParent: true,
      },
      "2030": {
        name: "Biforst",
        icon: "/imgs/chainBifrost.svg",
        api: "wss://bifrost-rpc.paseo.liebi.com/ws",
        isParent: false,
      }
    }
  }
}

// vue 插件入口
export default {
  install: function (app: any) {
    app.config.globalProperties.$CheckLogin = (callbak: Function) => {
      if (window.localStorage.getItem("userInfo")) {
        callbak()
      } else {
        window.$notification["error"]({
          content: 'Wallet not connected',
          meta: 'Please connect your wallet before performing this action.',
          duration: 2500,
          keepAliveOnHover: true
        })
      }
    };
  }
}