# 代币Logo系统

## 概述

本项目实现了一个智能的代币logo显示系统，支持多种数据源和自动fallback机制，确保代币图标能够正确显示。

## 功能特性

### 🎯 **多数据源支持**
- **预定义映射**: 包含50+主流代币的高质量logo
- **Trust Wallet Assets**: 基于代币地址的GitHub资源
- **1inch Token List**: 1inch平台的代币图标
- **Uniswap Assets**: Uniswap官方代币资源
- **CoinGecko API**: 备用图标源

### 🔄 **智能Fallback机制**
- 自动尝试多个URL源
- 加载失败时无缝切换到下一个源
- 最终fallback到美观的文字图标
- 使用代币品牌色彩的渐变背景

### 🎨 **灵活的尺寸支持**
- `sm`: 24x24px (w-6 h-6)
- `md`: 32x32px (w-8 h-8) - 默认
- `lg`: 40x40px (w-10 h-10)
- `xl`: 48x48px (w-12 h-12)

### ⚡ **性能优化**
- 图片预加载和缓存
- 平滑的加载动画
- 最小化重新渲染

## 使用方法

### 基础用法

```tsx
import TokenIcon from '@/components/ui/TokenIcon';

// 最简单的用法
<TokenIcon symbol="USDC" />

// 带代币地址（推荐）
<TokenIcon 
  symbol="USDC" 
  address="0xA0b86a33E6441c8C06DD2b7c94b7E6E42342f8e" 
/>

// 自定义尺寸
<TokenIcon 
  symbol="ETH" 
  size="lg" 
/>

// 自定义样式
<TokenIcon 
  symbol="WBTC" 
  className="border-2 border-gray-300" 
/>
```

### 在表格中使用

```tsx
<td>
  <div className="flex items-center gap-3">
    <TokenIcon 
      symbol={market.collateralTokenSymbol}
      address={market.marketParams.collateralToken}
      size="md"
    />
    <div>
      <div className="font-semibold">{market.collateralTokenSymbol}</div>
      <div className="text-xs opacity-70">抵押品</div>
    </div>
  </div>
</td>
```

## 配置文件

### 添加新代币

在 `config/tokenLogos.ts` 中添加新的代币配置：

```typescript
export const TOKEN_LOGOS: Record<string, TokenLogoConfig> = {
  // 添加新代币
  'NEW_TOKEN': {
    symbol: 'NEW_TOKEN',
    logoUrl: 'https://example.com/new-token-logo.svg',
    fallbackUrls: [
      'https://backup1.com/new-token.png',
      'https://backup2.com/new-token.jpg'
    ],
    color: '#FF6B35' // 品牌色彩
  },
};
```

### TokenLogoConfig 接口

```typescript
interface TokenLogoConfig {
  symbol: string;        // 代币符号
  logoUrl: string;       // 主要logo URL
  fallbackUrls?: string[]; // 备用URL列表
  color?: string;        // fallback背景色
}
```

## 支持的代币列表

### 稳定币
- USDC, USDT, DAI, FRAX, LUSD

### 主要加密货币
- ETH, WETH, BTC, WBTC

### DeFi代币
- UNI, AAVE, COMP, MKR, SNX, CRV, BAL, SUSHI

### 流动性质押代币
- stETH, rETH, cbETH

### Layer 2代币
- MATIC, OP, ARB

## 最佳实践

### 1. 总是提供代币地址
```tsx
// ✅ 推荐 - 有更多fallback选项
<TokenIcon symbol="USDC" address="0xA0b86a33E6441c8C06DD2b7c94b7E6E42342f8e" />

// ❌ 不推荐 - 只能使用预定义映射
<TokenIcon symbol="USDC" />
```

### 2. 选择合适的尺寸
```tsx
// 列表项使用 md
<TokenIcon symbol="ETH" size="md" />

// 详情页标题使用 xl
<TokenIcon symbol="ETH" size="xl" />

// 小图标使用 sm
<TokenIcon symbol="ETH" size="sm" />
```

### 3. 考虑加载状态
组件内置了加载状态处理，会显示带品牌色的文字fallback直到图片加载完成。

## 故障排除

### 图片不显示
1. 检查网络连接
2. 验证代币符号拼写
3. 确认代币地址格式正确
4. 查看浏览器控制台错误信息

### 添加新代币支持
1. 在 `config/tokenLogos.ts` 中添加配置
2. 提供多个fallback URL
3. 设置合适的品牌色彩
4. 测试各种尺寸下的显示效果

### 性能优化
- 使用 `unoptimized` 属性允许外部图片
- 图片会被浏览器自动缓存
- 避免频繁更改 symbol 或 address props

## 技术实现

### 核心特性
- **渐进式加载**: 从高质量源开始，逐步降级
- **状态管理**: 使用 React hooks 管理加载状态
- **错误处理**: 优雅处理网络错误和404
- **样式系统**: 基于 Tailwind CSS 的响应式设计

### 文件结构
```
components/ui/TokenIcon.tsx     # 主组件
config/tokenLogos.ts           # 配置文件
docs/token-logos.md           # 文档
```

这个系统确保了代币logo的可靠显示，提升了用户体验，同时保持了良好的性能和可维护性。