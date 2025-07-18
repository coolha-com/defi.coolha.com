'use client';

import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { ChainId, getChainAddresses, Market, MarketId as MorphoMarketId } from '@morpho-org/blue-sdk';
import '@morpho-org/blue-sdk-viem/lib/augment/Market';
import { Address } from 'viem';

export interface MarketConfig {
  id: string;
  loanToken: Address;
  collateralToken: Address;
  oracle: Address;
  irm: Address;
  lltv: bigint;
  loanTokenSymbol?: string;
  collateralTokenSymbol?: string;
}

export function useMorphoMarkets(chainId: ChainId = ChainId.EthMainnet) {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['morpho-markets', chainId],
    queryFn: async () => {
      if (!publicClient) throw new Error('Public client not available');
      
      const addresses = getChainAddresses(chainId);
      
      // 生产环境市场配置
      const productionMarkets = [
        // wstETH/WETH 市场
        {
          loanToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as Address, // WETH
          collateralToken: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0' as Address, // wstETH
          oracle: '0x2a01EB9496094dA03c4E364Def50f5aD1280AD72' as Address,
          irm: '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC' as Address,
          lltv: BigInt('945000000000000000'), // 94.5%
          loanTokenSymbol: 'WETH',
          collateralTokenSymbol: 'wstETH',
        },
        // WETH/USDT 市场 (用户提供的市场ID)
        {
          loanToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as Address, // USDT
          collateralToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as Address, // WETH
          oracle: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419' as Address, // ETH/USD Oracle
          irm: '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC' as Address,
          lltv: BigInt('860000000000000000'), // 86%
          marketId: '0xdbffac82c2dc7e8aa781bd05746530b0068d80929f23ac1628580e27810bc0c5', // 用户提供的市场ID
          loanTokenSymbol: 'USDT',
          collateralTokenSymbol: 'WETH',
        },
        // USDC/WETH 市场
        {
          loanToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as Address, // USDC
          collateralToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as Address, // WETH
          oracle: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6' as Address, // USDC/USD Oracle
          irm: '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC' as Address,
          lltv: BigInt('860000000000000000'), // 86%
          loanTokenSymbol: 'USDC',
          collateralTokenSymbol: 'WETH',
        },
      ];

      const markets = await Promise.all(
        productionMarkets.map(async (market) => {
          try {
            // 使用预定义的市场ID或生成一个临时ID
            const marketId = (market.marketId || `${market.loanToken}-${market.collateralToken}`) as MorphoMarketId;
            
            // 尝试获取真实市场数据
            let marketData;
            try {
              // 添加超时处理
              const fetchPromise = Market.fetch(marketId, publicClient);
              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Market fetch timeout')), 8000)
              );
              
              marketData = await Promise.race([fetchPromise, timeoutPromise]);
              console.log('Successfully fetched market data for:', marketId);
              
              // 如果市场数据中包含代币符号信息，使用它们
              if (marketData?.loanAsset?.symbol) {
                market.loanTokenSymbol = marketData.loanAsset.symbol;
              }
              if (marketData?.collateralAsset?.symbol) {
                market.collateralTokenSymbol = marketData.collateralAsset.symbol;
              }
            } catch (apiError) {
              console.warn('Failed to fetch real market data, using fallback:', apiError);
              // 如果API调用失败，返回基础配置
              marketData = null;
            }
            
            return {
              id: marketId,
              ...market,
              marketData,
            };
          } catch (error) {
            console.error('Failed to process market config:', error);
            return null;
          }
        })
      );

      return markets.filter(Boolean);
    },
    enabled: !!publicClient,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });
}

export function useMorphoMarket(marketId: string, chainId: ChainId = ChainId.EthMainnet) {
  const { data: markets } = useMorphoMarkets(chainId);
  
  return markets?.find(market => market?.id === marketId) || null;
}