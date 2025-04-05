import { createPinia, defineStore } from 'pinia'

let userInfo = null
let chainUrl: any = null;
if (window.localStorage.getItem("userInfo")) {
  userInfo = JSON.parse(window.localStorage.getItem("userInfo") || "{}")
}
if (window.localStorage.getItem("chainUrl")) {
  chainUrl = window.localStorage.getItem("chainUrl") ? JSON.parse(window.localStorage.getItem("chainUrl")||"{}"): null;
}

export const useGlobalStore = defineStore('global', {
  state: () => ({
    paths: [] as any[],
    account: [] as any[],
    userInfo: userInfo as any,
    chainUrl: chainUrl as any,
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
    setChainUrl(param:any) {
      if (!param) {
        window.localStorage.removeItem("chainUrl");
      }else{
        window.localStorage.setItem("chainUrl", JSON.stringify(param));
      }
      
      this.chainUrl = param;
    },
  },
})

export const store  = createPinia();