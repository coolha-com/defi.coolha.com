// 代币logo配置文件
// 支持多种数据源和fallback机制

export interface TokenLogoConfig {
  symbol: string;
  logoUrl: string;
  fallbackUrls?: string[];
  color?: string; // 用于fallback背景色
}

// 主要代币logo映射
export const TOKEN_LOGOS: Record<string, TokenLogoConfig> = {
  // === 主要稳定币 ===
  'USDC': {
    symbol: 'USDC',
    logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86a33E6441c8C06DD2b7c94b7E6E42342f8e/logo.png'
    ],
    color: '#2775CA'
  },
  'USDT': {
    symbol: 'USDT',
    logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/325/small/Tether.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
    ],
    color: '#26A17B'
  },
  'DAI': {
    symbol: 'DAI',
    logoUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
    ],
    color: '#F5AC37'
  },
  'FRAX': {
    symbol: 'FRAX',
    logoUrl: 'https://cryptologos.cc/logos/frax-frax-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/13422/small/FRAX_icon.png'
    ],
    color: '#000000'
  },
  'LUSD': {
    symbol: 'LUSD',
    logoUrl: 'https://cryptologos.cc/logos/liquity-usd-lusd-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/14666/small/Group_3.png'
    ],
    color: '#745DDF'
  },

  // === 主要加密货币 ===
  'ETH': {
    symbol: 'ETH',
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
    ],
    color: '#627EEA'
  },
  'WETH': {
    symbol: 'WETH',
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/2518/small/weth.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
    ],
    color: '#627EEA'
  },
  'BTC': {
    symbol: 'BTC',
    logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
    ],
    color: '#F7931A'
  },
  'WBTC': {
    symbol: 'WBTC',
    logoUrl: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png'
    ],
    color: '#F09242'
  },

  // === DeFi代币 ===
  'UNI': {
    symbol: 'UNI',
    logoUrl: 'https://cryptologos.cc/logos/uniswap-uni-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/12504/small/uni.jpg',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'
    ],
    color: '#FF007A'
  },
  'AAVE': {
    symbol: 'AAVE',
    logoUrl: 'https://cryptologos.cc/logos/aave-aave-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png'
    ],
    color: '#B6509E'
  },
  'COMP': {
    symbol: 'COMP',
    logoUrl: 'https://cryptologos.cc/logos/compound-comp-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/10775/small/COMP.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png'
    ],
    color: '#00D395'
  },
  'MKR': {
    symbol: 'MKR',
    logoUrl: 'https://cryptologos.cc/logos/maker-mkr-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png'
    ],
    color: '#1AAB9B'
  },
  'SNX': {
    symbol: 'SNX',
    logoUrl: 'https://cryptologos.cc/logos/synthetix-snx-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/3406/small/SNX.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png'
    ],
    color: '#5FCDF9'
  },
  'CRV': {
    symbol: 'CRV',
    logoUrl: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/12124/small/Curve.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png'
    ],
    color: '#40649F'
  },
  'BAL': {
    symbol: 'BAL',
    logoUrl: 'https://cryptologos.cc/logos/balancer-bal-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/11683/small/Balancer.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png'
    ],
    color: '#1E1E1E'
  },
  'SUSHI': {
    symbol: 'SUSHI',
    logoUrl: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png'
    ],
    color: '#FA52A0'
  },

  // === 流动性质押代币 ===
  'stETH': {
    symbol: 'stETH',
    logoUrl: 'https://cryptologos.cc/logos/lido-staked-ether-steth-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/13442/small/steth_logo.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84/logo.png'
    ],
    color: '#00A3FF'
  },
  'rETH': {
    symbol: 'rETH',
    logoUrl: 'https://cryptologos.cc/logos/rocket-pool-rpl-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/20764/small/reth.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xae78736Cd615f374D3085123A210448E74Fc6393/logo.png'
    ],
    color: '#FF6B35'
  },
  'cbETH': {
    symbol: 'cbETH',
    logoUrl: 'https://cryptologos.cc/logos/coinbase-wrapped-staked-eth-cbeth-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/27008/small/cbeth.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xBe9895146f7AF43049ca1c1AE358B0541Ea49704/logo.png'
    ],
    color: '#0052FF'
  },

  // === Layer 2代币 ===
  'MATIC': {
    symbol: 'MATIC',
    logoUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png'
    ],
    color: '#8247E5'
  },
  'OP': {
    symbol: 'OP',
    logoUrl: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/25244/small/Optimism.png'
    ],
    color: '#FF0420'
  },
  'ARB': {
    symbol: 'ARB',
    logoUrl: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg',
    fallbackUrls: [
      'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg'
    ],
    color: '#28A0F0'
  },
};

// 获取代币logo配置
export function getTokenLogoConfig(symbol: string): TokenLogoConfig | null {
  return TOKEN_LOGOS[symbol.toUpperCase()] || null;
}

// 获取代币logo URL（包含fallback逻辑）
export function getTokenLogoUrl(symbol: string, address?: string): string[] {
  const config = getTokenLogoConfig(symbol);
  const urls: string[] = [];
  
  if (config) {
    // 添加主要URL
    urls.push(config.logoUrl);
    
    // 添加fallback URLs
    if (config.fallbackUrls) {
      urls.push(...config.fallbackUrls);
    }
  }
  
  // 如果有地址，添加基于地址的URL
  if (address) {
    // Trust Wallet Assets
    urls.push(`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`);
    
    // 1inch token list
    urls.push(`https://tokens.1inch.io/${address.toLowerCase()}.png`);
    
    // Uniswap token list
    urls.push(`https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${address}/logo.png`);
  }
  
  return urls;
}

// 获取代币fallback颜色
export function getTokenFallbackColor(symbol: string): string {
  const config = getTokenLogoConfig(symbol);
  return config?.color || '#6366f1'; // 默认使用 indigo-500
}