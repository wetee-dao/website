import { ApiPromise } from "@polkadot/api"
import { base64Encode } from "@polkadot/util-crypto";
import { getSpecTypes } from '@polkadot/types-known';
import type { Injected, MetadataDef } from '@polkadot/extension-inject/types';
import { formatBalance, isNumber } from "@polkadot/util";
import axios from "axios";
//@ts-ignore
import qs from "qs";

// 区块链链接
let client: ApiPromise | null = null
export let chainUrl = 'wss://xiaobai.asyou.me:30001/ws'
export let chainIndexer = 'https://xiaobai.asyou.me:30006/gql'
export let getChainHttpApi = () => {
  return chainUrl.replace('ws', 'http').replace("ws", "")
}


const chainHttpClient = {
  query: async (pallet: string, storageItem: string, keys: unknown[]) => {
    const response = await axios.get(getChainHttpApi() + "pallets/" + pallet + "/storage/" + storageItem, {
      params: { keys: keys },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    })
    return response.data.value
  },
  entries: async (pallet: string, storageItem: string, keys: unknown[]) => {
    const response = await axios.get(getChainHttpApi() + "pallets/" + pallet + "/storage/entries/" + storageItem, {
      params: { keys: keys },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    })
    return response.data.values
  }
}

export const getHttpApi = () => {
  return chainHttpClient
}


// 链对象
let chain: any = {
  Close: () => { },
}

// 获取链对象
export const getChainExt = () => {
  return chain
}

// 获取区块链连接
export const getChainClient = () => {
  return client
}

// 检测是否支持当前链
export async function checkMetaData(ext: Injected): Promise<boolean> {
  const api = client!
  const cmeta = (await ext.metadata!.get()).find((m) => m.genesisHash === api.genesisHash.toHex() && m.specVersion == api.runtimeVersion.specVersion.toNumber())
  if (cmeta) {
    return true
  }

  const meta = await getMetaData()
  return await ext.metadata!.provide(meta as MetadataDef)
}

// 获取元数据
export async function getMetaData() {
  const api = client!
  let chainInfo = await api.rpc.system.chain()
  const chainName = chainInfo.toHuman()

  const meta = {
    chain: chainName,
    chainType: 'substrate',
    color: undefined,
    genesisHash: api.genesisHash.toHex(),
    icon: "",
    metaCalls: base64Encode(api.runtimeMetadata.asCallsOnly.toU8a()),
    specVersion: api.runtimeVersion.specVersion.toNumber(),
    ss58Format: isNumber(api.registry.chainSS58)
      ? api.registry.chainSS58
      : 42,
    tokenDecimals: (api.registry.chainDecimals)[0],
    tokenSymbol: (api.registry.chainTokens || formatBalance.getDefaults().unit)[0],
    types: getSpecTypes(api.registry, chainName, api.runtimeVersion.specName, api.runtimeVersion.specVersion) as unknown as Record<string, string>
  }

  return meta as MetadataDef
}

// vue 插件入口
export default {
  install: function (app: any) {
    app.provide('wetee', getChainExt)
    // app.provide('weteeHttpApi', getHttpApi)

    // 获取全局区块链适配器
    app.config.globalProperties.$getClient = (): ApiPromise | null => {
      return client
    }

    // 获取全局区块链适配器
    app.config.globalProperties.$getChain = () => {
      return chain
    }

    // 设置全局区块链适配器
    app.config.globalProperties.$setClient = (cclient: ApiPromise) => {
      client = cclient
      chain.client = cclient
    }

    // 设置全局链状态
    app.config.globalProperties.$setChain = (cchain: any) => {
      cchain.client = client
      chain = cchain
    }
  }
}