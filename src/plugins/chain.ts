import { ApiPromise } from "@polkadot/api"
import { base64Encode } from "@polkadot/util-crypto";
import { getSpecTypes } from '@polkadot/types-known';
import type { Injected, MetadataDef } from '@polkadot/extension-inject/types';
import { formatBalance, isNumber } from "@polkadot/util";
import axios from "axios";
//@ts-ignore
import qs from "qs";

export let chainUrl = 'wss://paseo.asyou.me/ws'
export let getChainHttpApi = () => {
  return chainUrl.replace('ws', 'http').replace("ws", "")
}

// chain http client
const chainHttpClient = {
  query: async (pallet: string, storageItem: string, keys: unknown[]) => {
    let c = $getClient();
    if (c != undefined) {
      let resp = await c.query[pallet][storageItem](...keys);
      return resp.toHuman()
    }
    const response = await axios.get(getChainHttpApi() + "pallets/" + pallet + "/storage/" + storageItem, {
      params: { keys: keys },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    })
    return response.data.value
  },

  entries: async (pallet: string, storageItem: string, keys: unknown[]) => {
    let c = $getClient();
    if (c != undefined) {
      let resp = await c.query[pallet][storageItem].entries(...keys);

      let values: any = []
      resp.forEach(([key, exposure]) => {
        const k = key.toHuman()
        values.push({
          keys: k,
          value: exposure.toHuman()
        })
      });

      return values
    }

    const response = await axios.get(getChainHttpApi() + "pallets/" + pallet + "/storage/entries/" + storageItem, {
      params: { keys: keys },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
    })
    return response.data.values
  }
}

// 链对象封装
interface ChainWrap {
  client: ApiPromise | undefined;
  close: () => void;
}

// 链对象
let chain: ChainWrap = {
  client: undefined,
  close: (): void => { }
}

// 获取 http query api
export const getHttpApi = () => {
  return chainHttpClient
}

// 获取链对象
export const getChainExt = () => {
  return chain
}

// 获取区块链连接
export const getChainClient = (): ApiPromise | undefined => {
  return chain.client
}

// 检测是否支持当前链
export async function checkMetaData(ext: Injected): Promise<boolean> {
  const api = getChainClient()!;
  const cmeta = (await ext.metadata!.get()).find((m) => m.genesisHash === api.genesisHash.toHex() && m.specVersion == api.runtimeVersion.specVersion.toNumber())
  if (cmeta) {
    return true
  }

  const meta = await getMetaData()
  return await ext.metadata!.provide(meta as MetadataDef)
}

// 获取元数据
export async function getMetaData() {
  const api = getChainClient()!;
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

export const $setChain = (c: ChainWrap) => {
  chain = c
}

export const $getChain = () => {
  return chain
}

export const $setClient = (client: ApiPromise) => {
  chain.client = client
  return chain
}

export const $getClient = () => {
  return chain.client
}

// vue 插件入口
export default {
  install: function (app: any) {

  }
}