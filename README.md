# Web2Plus

> 让所有程序都能以 TEE 保护的方式运行，并部署到任何区块链。

**Web2Plus** 是一个 TEE 机密计算平台，将链外程序与链上智能合约连接起来。支持 USDT、ETH、BNB、SOL 支付，无需新代币。

[官网](https://wetee.app) · [文档](https://docs.wetee.app) · [Twitter](https://twitter.com/web2plus)

---

## 解决的问题

```
链外程序           →         链上合约
────────────────────────────────────────────
私密执行           →         公开透明（无隐私）
快速且便宜         →         缓慢且昂贵
容易开发           →         开发困难
```

Web2 程序快速且私密，但无法与区块链逻辑交互。
智能合约透明且去中心化，但无法运行复杂程序。

**Web2Plus 桥接两者。**

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
3. **验证** 链上验证结果
4. **触发** 智能合约，无需可信预言机

---

## 产品

| 产品 | 状态 | 描述 |
|------|------|------|
| **TEE VM** | ✅ 已上线 | 机密计算虚拟机。任何程序，硬件级隐私保护。 |
| **TEE Store** | ✅ 已上线 | 应用商店。点击部署 TEE 保护的应用。 |
| **TEE Bridge** | 🔜 即将上线 | Bridge TEE ↔️ Contracts。将机密计算带到链上。 |
| **TEE Miner** | 🔜 即将上线 | 运行 TEE 节点赚取收益。硬件或云端。 |
| **TEE MPC** | 🔜 即将上线 | 安全多方计算。无需可信初始化。 |

---

## 核心优势

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

- **区块链：** Polkadot (Substrate)，EVM 兼容链
- **隐私：** TEE (Intel SGX/TDX/SEV-SNP)
- **执行：** 链外 TEE 程序，链上验证

---

## 社区

- [Twitter](https://twitter.com/web2plus) — 产品更新和技术帖子
- [Discord](https://discord.gg/web2plus) — 开发者交流
- [Telegram](https://t.me/web2plus) — 公告

---

## 项目状态

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
