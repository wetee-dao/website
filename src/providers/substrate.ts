import { Loading } from "@/plugins/pop";
import { keyring } from "@/utils/chain";
import { ApiPromise } from "@polkadot/api";
import type { SubmittableExtrinsic } from "@polkadot/api/types";
import { type Wallet, getWallets } from "@talismn/connect-wallets";

// Substrate 交易对象
export class SubstrateProvider {
  // 区块链链接
  client: ApiPromise | undefined;
  unsubscribe: any;

  // 提交交易
  SignAndSend = async (tx: SubmittableExtrinsic<'promise'>, signer: string, onSeccess: onCallFn, onError: onCallFn) => {
    let keypair = JSON.parse(window.localStorage.getItem("keypair") || "{}")
    let ps = [];
    if (keypair[signer]) {
      const pair = keyring.addFromUri(keypair[signer], { name: 'x' }, 'sr25519');
      ps = [pair];
    } else {
      let userInfo = null
      if (window.localStorage.getItem("userInfo")) {
        userInfo = JSON.parse(window.localStorage.getItem("userInfo") || "{}")
      }

      const wallet: Wallet | undefined = getWallets().find(wallet => wallet.extensionName === userInfo.wallet);
      await wallet!.enable("WeTEE");
      const account = (await wallet!.getAccounts()).find(account => account.address === signer);
      if (!account) {
        //@ts-ignore
        window.$notification["error"]({
          content: 'Error',
          meta: 'Account ' + signer + ' not found',
          duration: 2500,
          keepAliveOnHover: true
        })
        return
      }
      ps = [signer, { signer: account!.wallet!.signer }];
    }

    const loading = Loading(null)

    try {
      // @ts-ignore
      const unsub = await tx.signAndSend(...ps, (result: any) => {
        if (result.dispatchError) {
          let error = "";
          if (result.dispatchError.isModule) {
            const decoded = this.client!.registry.findMetaError(result.dispatchError.asModule);
            const { docs, name, section } = decoded;
            error = `${section}.${name}: ${docs.join(' ')}`;
          } else {
            error = `client.dispatchError.toString())`
          }
          loading.close();
          unsub();

          //@ts-ignore
          window.$notification["error"]({
            content: 'Error',
            meta: error,
            duration: 2500,
            keepAliveOnHover: true
          })

          onError(error);
          return
        }
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
          loading.close();
          unsub();
          onSeccess(result);
        } else if (result.status.isFinalized) {
          console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
          loading.close();
          unsub();
          onSeccess(result);
        }
      });
    } catch (e: any) {
      loading.close();

      //@ts-ignore
      window.$notification["error"]({
        content: 'Error',
        meta: e.toString(),
        duration: 2500,
        keepAliveOnHover: true
      })
      onError(e)
    }
  }

  // 提交代理交易
  ProxySignAndSend = async (tx: SubmittableExtrinsic<'promise'>, ProjectId: string, signer: string, onSeccess: onCallFn, onError: onCallFn) => {
    // 构建代理交易
    const proxyTx = ProjectId != "-1" ? this.client!.tx.weTEEProject.proxyCall(
      parseInt(ProjectId),
      tx,
    ) : tx;

    await this.SignAndSend(proxyTx, signer, onSeccess, onError)
  }

  close() {
    this.client?.disconnect();
    this.unsubscribe && this.unsubscribe();
  }
}

type onCallFn = (result: any) => void;