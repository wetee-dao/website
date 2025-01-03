import { createApp, defineAsyncComponent } from "vue"
import LoadingBox from '../components/Loading.vue'
import Login from "@/pages/pop/Login.vue";
import VStake from "@/pages/pop/VStake.vue";
import Cross from "@/pages/pop/Cross.vue";

export default {
  install: function (app: any) {
    app.config.globalProperties.$Loading = (router: Object, ps: any, close: Function) => {
      return openPop(app, router, LoadingBox, "Loading", ps, close)
    };

    app.config.globalProperties.$VStake = (router: Object, ps: any, close: Function) => {
      return openPop(app, router, VStake, "VStake", ps, close)
    };

    app.config.globalProperties.$Login = (router: Object, ps: any, close: Function) => {
      return openPop(app, router, Login, "Login", ps, close)
    };

    app.config.globalProperties.$CrossIn = (router: Object, ps: any, close: Function) => {
      return openPop(app, router, Cross, "CrossIn", ps, close)
    };

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

export const Loading = (title: string | null): any => {
  console.log(title)
  return openPop(null, {}, LoadingBox, "xLoading", { title: title }, () => {

  })
};

let pops: any = {};
window.addEventListener('popstate', function (event) {
  for (let i in pops) {
    pops[i]?.close()
  }
  pops = {};
});

function openPop(app: any, router: Object, pop: any, popid: string, params: any, close: Function) {
  if (pops[popid]) {
    return
  }
  let messageInstance: any = null;
  let div = document.createElement("div")
  const closeFn = (ps: any) => {
    if (close) {
      try {
        close(ps)
      } catch (e) { }
    }

    if (!pops[popid]) {
      return
    }
    message.unmount()
    document.body.removeChild(div)
    delete pops[popid]
  };

  let message = createApp(pop, {
    close: closeFn,
    router,
    app,
    params
  })

  div.id = popid
  document.body.appendChild(div)
  messageInstance = message.mount("#" + popid)
  pops[popid] = {
    close: closeFn,
    ins: messageInstance
  };

  return {
    ins: message,
    id: popid,
    close: closeFn
  }
}