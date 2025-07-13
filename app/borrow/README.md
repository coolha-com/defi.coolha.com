# Morpho Markets 借贷功能

本模块实现了基于 Morpho Markets 的去中心化借贷功能，允许用户供应抵押品、借贷资产、还款和提取抵押品。

## 功能特性

### 🏦 核心借贷功能
- **供应抵押品**: 用户可以供应支持的代币作为抵押品
- **借贷资产**: 基于抵押品价值借贷其他资产
- **还款**: 偿还借贷的资产和利息
- **提取抵押品**: 在保持健康位置的前提下提取抵押品

### 📊 位置管理
- **实时健康因子监控**: 显示位置的健康状况
- **LTV 跟踪**: 监控贷款价值比
- **清算风险警告**: 当位置接近清算时提供警告
- **位置概览**: 完整的抵押品和债务信息

### 🎁 奖励系统
- **奖励发现**: 自动发现可用的激励奖励
- **奖励跟踪**: 显示累积、待领取和可领取的奖励
- **一键领取**: 支持批量领取多个奖励
- **多链支持**: 处理不同链上的奖励代币

### 🔒 风险管理
- **隔离风险**: 每个市场的风险独立，不会相互影响
- **实时价格更新**: 基于预言机的实时价格数据
- **健康因子计算**: 精确的风险评估
- **清算保护**: 明确的风险提示和保护机制

## 技术架构

### Hooks
- `useMorphoMarkets`: 获取可用的借贷市场
- `useMorphoPosition`: 跟踪用户在特定市场的位置
- `useMorphoActions`: 执行借贷相关的交易操作
- `useMorphoRewards`: 获取和管理用户奖励

### 组件
- `MarketList`: 显示可用市场列表
- `PositionOverview`: 用户位置概览
- `BorrowActions`: 借贷操作界面
- `RewardsPanel`: 奖励管理面板

### 路由
- `/borrow`: 借贷主页面
- `/borrow/market/[id]`: 单个市场详情页

## 集成方式

本实现采用 **Method 2: Offchain Integration (TypeScript SDK)** 方式，使用以下 SDK:

- `@morpho-org/blue-sdk`: 核心 SDK
- `@morpho-org/blue-sdk-viem`: Viem 集成
- `@morpho-org/bundler-sdk-viem`: 批量操作支持
- `@morpho-org/simulation-sdk`: 模拟和预测

## 安全考虑

1. **交易前验证**: 所有交易前都会验证用户余额和授权
2. **健康因子检查**: 防止用户执行会导致清算的操作
3. **滑点保护**: 在价格波动时保护用户
4. **错误处理**: 完善的错误处理和用户反馈

## 使用流程

1. **连接钱包**: 用户首先需要连接 Web3 钱包
2. **选择市场**: 从可用市场中选择合适的借贷对
3. **供应抵押品**: 提供抵押品以建立借贷能力
4. **执行借贷**: 基于抵押品价值借贷所需资产
5. **监控位置**: 持续监控健康因子和市场变化
6. **管理位置**: 根据需要还款、增加抵押品或提取资产
7. **领取奖励**: 定期领取激励奖励

## 风险提示

⚠️ **重要风险提示**:
- 借贷资产会持续产生利息
- 市场价格波动可能影响位置健康
- 健康因子低于 1.0 时可能被清算
- 清算时会产生额外的清算罚金
- 建议保持健康因子在 1.5 以上

## 支持的网络

- Ethereum Mainnet
- Polygon
- Base
- Optimism
- Unichain

## 相关链接

- [Morpho 官方文档](https://docs.morpho.org/)
- [Morpho Markets 借贷指南](https://docs.morpho.org/build/borrow/getting-started)
- [TypeScript SDK 教程](https://docs.morpho.org/build/borrow/tutorials/assets-flow#method-2-offchain-integration-typescript-sdk)
- [奖励 API](https://rewards.morpho.org/)