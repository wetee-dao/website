export function concatUint8Array(...parts: Uint8Array[]): Uint8Array {
    const len = parts.reduce((n, p) => n + p.length, 0)
    const out = new Uint8Array(len)
    let o = 0
    for (const p of parts) {
        out.set(p, o)
        o += p.length
    }
    return out
}