import { CurrentChainNode } from "@/plugins/chain"
import { InkApi } from "@/providers/chainapi/ink"
import { MAIN_CHAIN_CLOUD_CONTRACT, MAIN_CHAIN_SUBNET_CONTRACT } from "@/config";

class MainChainApi extends InkApi {
    constructor() {
        super({
            subnetContract: MAIN_CHAIN_SUBNET_CONTRACT,
            subnetAbiUrl: "contract/subnet.json",
            cloudContract: MAIN_CHAIN_CLOUD_CONTRACT,
            cloudAbiUrl: "contract/cloud.json",
        })
        this.init(CurrentChainNode().MainChainUrl)
    }

    // get nodes
    async getNodes() {
        const nodes = await this.ink_query(this.subnetContract, "secrets", {})
        return nodes
    }

    // get workers
    async getWorkers(start: string | null, size: number) {
        const workers = await this.ink_query(this.subnetContract, "workers", {
            start: start,
            size: size
        })
        return workers
    }

    // get pods
    async getPods(start: string | null, size: number) {
        const pods = await this.ink_query(this.cloudContract, "pods", {
            start: start,
            size: size
        })
        return pods
    }

    // get pod extended info (containers with image, etc.)
    async getPodExtInfo(podId: string) {
        return this.podExtInfo(podId)
    }
}

const MainChain = new MainChainApi()
export const GetNodes = async () => {
    const nodes = await MainChain.getNodes()
    return nodes
}

export const GetWorkers = async (start: string | null, size: number) => {
    const workers = await MainChain.getWorkers(start, size)
    return workers
}

export const GetPods = async (start: string | null, size: number) => {
    const pods = await MainChain.getPods(start, size)
    return pods
}

export const GetPodExtInfo = async (podId: string) => {
    return MainChain.getPodExtInfo(podId)
}