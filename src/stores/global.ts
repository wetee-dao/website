import { createPinia, defineStore } from 'pinia'

let userInfo = null
let chainId: string | null = "";
if (window.localStorage.getItem("userInfo")) {
  userInfo = JSON.parse(window.localStorage.getItem("userInfo") || "{}")
}
if (window.localStorage.getItem("chainId")) {
  chainId = window.localStorage.getItem("chainId") ? window.localStorage.getItem("chainId") : "";
}

export const useGlobalStore = defineStore('global', {
  state: () => ({
    paths: [] as any[],
    account: [] as any[],
    userInfo: userInfo as any,
    chainId: chainId,
  }), actions: {
    setPaths(paths: any[]) {
      this.paths = paths
    },
    setAccount(account: any[]) {
      this.account = account
    },
    setUserInfo(userInfo: any) {
      if (!userInfo) {
        window.localStorage.removeItem("userInfo");
      } else {
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
      console.log("setUserInfo", userInfo)
      this.userInfo = userInfo
    },
    setChain(id: any) {
      if (!id) {
        window.localStorage.removeItem("chainId");
      } else {
        window.localStorage.setItem("chainId", id);
      }

      this.chainId = id;
    },
  },
})

export const store = createPinia();