import { createApp, defineAsyncComponent } from "vue"
import LoadingBox from '../components/Loading.vue'
import Login from "@/components/Login.vue";

export default {
  install: function (app: any) {
    app.config.globalProperties.$Loading = (router: Object, store: Object, ps: any, close: Function) => {
      return openPop(app, router, store, LoadingBox, "Loading", ps, close)
    };

    app.config.globalProperties.$Login = (router: Object, store: Object, ps: any, close: Function) => {
      return openPop(app, router, store, Login, "Login", ps, close)
    };
  }
}

export const Loading = (title: string | null): any => {
  return openPop(null, {}, {}, LoadingBox, "xLoading", { title: title }, () => {

  })
};

let pops: any = {};
window.addEventListener('popstate', function (event) {
  for (let i in pops) {
    pops[i]?.close()
  }
  pops = {};
});

function openPop(app: any, router: Object, store: Object, pop: any, popid: string, params: any, close: Function) {
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
    store,
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