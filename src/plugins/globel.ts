import { type ComponentInternalInstance, getCurrentInstance } from "vue";
export default function useGlobelProperties() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance;
    //@ts-ignore
    window.$app = appContext.config.globalProperties;
    return appContext.config.globalProperties;
}