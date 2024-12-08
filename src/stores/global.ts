import { defineStore } from 'pinia'

let userInfo = null
if (window.localStorage.getItem("userInfo")) {
  userInfo = JSON.parse(window.localStorage.getItem("userInfo") || "{}")
}

export const useGlobalStore = defineStore('global', {
  state: () => ({
    paths: [] as any[],
    account: [] as any[],
    userInfo: userInfo as any,
  }), actions: {
    setPaths(paths: any[]) {
      this.paths = paths
    },
    setAccount(account: any[]) {
      this.account = account
    },
    setUserInfo(userInfo: any) {
      window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
      console.log("setUserInfo", userInfo)
      this.userInfo = userInfo
    }
  },
})
