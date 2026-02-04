import { CurrentChainNode } from "@/plugins/chain"
import { InkApi } from "@/providers/chainapi/ink"

class MainChainApi extends InkApi {
    constructor() {
        super({
            subnetContract: "0x1c8d2f0a79b2506d32739425cd7caaf0398a326b",
            subnetAbiUrl: "contract/subnet.json",
            cloudContract: "0x26d4b4099dd664e35700797e0522192a9e81faf4",
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