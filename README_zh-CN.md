[English](README.md) | [中文](README_zh-CN.md)

---

# Web2Plus

**运行任何程序，保护隐私，部署到任何链。**

Web2Plus 是一个基于 TEE 的机密计算平台，将链外程序与链上智能合约连接起来。支持 USDT、ETH、BNB、SOL 支付，无需新代币。

[官网](https://wetee.app) · [文档](https://docs.wetee.app) · [Twitter](https://x.com/plus_web2)

---

## 问题

```
链外程序           →        链上合约
──────────────────────────────────────────────
私密执行           →        公开（无隐私）
快速且便宜        →        缓慢且昂贵
容易开发          →        难以开发
```

Web2 程序快速且私密，但无法与区块链逻辑交互。
智能合约透明且去中心化，但无法运行复杂程序。

**Web2Plus 打通两者。**

---

## 工作原理

```
你的程序
     ↓
TEE 硬件 (Intel SGX/TDX/SEV-SNP)
     ↓
机密执行
     ↓
链上验证
     ↓
智能合约
```

1. **部署** 你的程序到 TEE VM
2. **运行** 硬件级隐私保护
3. **验证** 结果上链
4. **触发** 智能合约，无需可信预言机

---

## 产品

| 产品 | 状态 | 描述 |
|------|------|------|
| **TEE VM** | ✅ 已上线 | 机密计算虚拟机。任何程序，硬件级隐私保护。 |
| **TEE Store** | ✅ 已上线 | 应用市场。点击部署 TEE 保护的应用。 |
| **TEE Bridge** | 🔜 即将上线 | Bridge TEE ↔️ Contracts。将机密计算带到链上。 |
| **TEE Miner** | 🔜 即将上线 | 运行 TEE 节点赚取收益。硬件矿机或云端节点。 |
| **TEE MPC** | 🔜 即将上线 | 安全多方计算。无需可信初始化。 |

---

## 为什么选 Web2Plus

| | |
|-|---|
| **任何程序** | 不只是 AI — 任何链外程序 |
| **任何链** | Polkadot、Ethereum、BSC、Solana — 一个 API |
| **无需新代币** | 使用 USDT、ETH、BNB、SOL 支付 |
| **TEE 保护** | Intel SGX/TDX/SEV-SNP 硬件级隐私 |
| **链上可验证** | 不是黑盒 — 结果可密码学验证 |
| **无需预言机** | 直接 TEE → 智能合约执行 |

---

## 技术栈

- **区块链:** Polkadot (Substrate), EVM 兼容链
- **隐私:** TEE (Intel SGX/TDX/SEV-SNP)
- **执行:** 链外 TEE 程序，链上验证

---

## 社区

- [Twitter](https://x.com/plus_web2) — 产品更新和技术讨论
- [Discord](https://discord.gg/web2plus) — 开发者交流
- [Telegram](https://t.me/weteedao) — 公告

---

## 开发状态

| 组件 | 状态 |
|------|------|
| 官网 | ✅ 已上线 [wetee.app](https://wetee.app) |
| TEE VM | ✅ 已上线 |
| TEE Store | ✅ 已上线 |
| TEE Bridge | 🔜 即将上线 |
| TEE Miner | 🔜 即将上线 |
| TEE MPC | 🔜 即将上线 |

---

## 贡献

欢迎提交 PR。查看 [open issues](./issues)。

## 许可证

MIT
