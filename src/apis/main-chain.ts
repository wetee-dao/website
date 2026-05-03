import { CurrentChainNode } from "@/plugins/chain"
import { Ink, InkApi } from "@/providers/chainapi/ink"
import { getMainChainCloudContract, getMainChainSubnetContract } from "@/config"

class MainChainApi extends InkApi {
    constructor() {
        super({
            subnetContract: getMainChainSubnetContract(),
            subnetAbiUrl: "contract/subnet.json",
            cloudContract: getMainChainCloudContract(),
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

/** bootstrap 从 GraphQL 写入 config 后调用，同步 Ink 与 MainChain 实例上的合约地址 */
export function syncMainChainInkContracts() {
    const subnet = getMainChainSubnetContract()
    const cloud = getMainChainCloudContract()
    Ink.subnetContract = subnet
    Ink.cloudContract = cloud
    MainChain.subnetContract = subnet
    MainChain.cloudContract = cloud
}

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