[English](README.md) | [中文](README_zh-CN.md)

---

# PlusWeb2

**Run any program with privacy. Deploy to any chain.**

PlusWeb2 is a TEE-backed confidential computing platform that connects off-chain programs with on-chain smart contracts. Pay with USDT, ETH, BNB, or SOL — no new token required.

[Website](https://wetee.app) · [Docs](https://docs.wetee.app) · [Twitter](https://x.com/plus_web2)

---

## The Problem

```
Off-chain programs     →     On-chain contracts
──────────────────────────────────────────────
Private execution      →     Transparent (no privacy)
Fast & cheap          →     Slow & expensive
Easy to build         →     Hard to build
```

Web2 programs are fast and private but can't interact with blockchain logic.
Smart contracts are transparent and decentralized but can't run complex programs.

**PlusWeb2 bridges both.**

---

## How It Works

```
Your Program
     ↓
TEE Hardware (Intel SGX/TDX/SEV-SNP)
     ↓
Confidential Execution
     ↓
On-chain Verification
     ↓
Smart Contract
```

1. **Deploy** your program to TEE VM
2. **Run** with hardware-level privacy
3. **Verify** results on-chain
4. **Trigger** smart contracts without a trusted oracle

---

## Products

| Product | Status | Description |
|---------|--------|-------------|
| **TEE VM** | ✅ Live | Confidential computing VM. Run any program with hardware-level privacy. |
| **TEE Store** | ✅ Live | App marketplace. One-click deploy TEE-protected applications. |
| **TEE Bridge** | 🔜 Soon | Bridge TEE ↔️ Contracts. Bring confidential computation on-chain. |
| **TEE Miner** | 🔜 Soon | Earn by running TEE nodes. Hardware or cloud. |
| **TEE MPC** | 🔜 Soon | Secure multi-party computation. No trusted setup. |

---

## Why PlusWeb2

| | |
|-|---|
| **Any Program** | Not just AI — any off-chain program |
| **Any Chain** | Polkadot, Ethereum, BSC, Solana — one API |
| **No Token** | Pay with USDT, ETH, BNB, or SOL |
| **TEE Protected** | Intel SGX/TDX/SEV-SNP hardware-backed privacy |
| **On-chain Verified** | Not a black box — results can be verified |
| **No Oracle** | Direct TEE → Smart contract execution |

---

## Tech Stack

- **Blockchain:** Polkadot (Substrate), EVM compatible chains
- **Privacy:** TEE (Intel SGX/TDX/SEV-SNP)
- **Execution:** Off-chain TEE programs, on-chain verification

---

## Community

- [Twitter](https://x.com/plus_web2) — product updates & threads
- [Discord](https://discord.gg/PlusWeb2) — developer chat
- [Telegram](https://t.me/weteedao) — announcements

---

## Status

| Component | Status |
|-----------|--------|
| Website | ✅ Live at [wetee.app](https://wetee.app) |
| TEE VM | ✅ Live |
| TEE Store | ✅ Live |
| TEE Bridge | 🔜 Coming soon |
| TEE Miner | 🔜 Coming soon |
| TEE MPC | 🔜 Coming soon |

---

## Contributing

PRs welcome. Check [open issues](./issues).

## License

MIT
