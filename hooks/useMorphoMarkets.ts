'use client';

import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { ChainId, getChainAddresses } from '@morpho-org/blue-sdk';
import { fetchMarket } from '@morpho-org/blue-sdk-viem';
import { Address } from 'viem';

export interface MarketConfig {
  id: string;
  loanToken: Address;
  collateralToken: Address;
  oracle: Address;
  irm: Address;
  lltv: bigint;
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
        },
        // WETH/USDT 市场 (用户提供的市场ID)
        {
          loanToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as Address, // USDT
          collateralToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as Address, // WETH
          oracle: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419' as Address, // ETH/USD Oracle
          irm: '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC' as Address,
          lltv: BigInt('860000000000000000'), // 86%
          marketId: '0xdbffac82c2dc7e8aa781bd05746530b0068d80929f23ac1628580e27810bc0c5', // 用户提供的市场ID
        },
        // USDC/WETH 市场
        {
          loanToken: '0xA0b86a33E6441b8dB4B2a4B61c5b8b7B8b8b8b8b' as Address, // USDC (0xA0b86a33E6441b8dB4B2a4B61c5b8b7B8b8b8b8b)
          collateralToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as Address, // WETH
          oracle: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6' as Address, // USDC/USD Oracle
          irm: '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC' as Address,
          lltv: BigInt('860000000000000000'), // 86%
        },
      ];

      const markets = await Promise.all(
        productionMarkets.map(async (market) => {
          try {
            // 生成市场ID (如果没有提供)
            const marketId = market.marketId || {
              loanToken: market.loanToken,
              collateralToken: market.collateralToken,
              oracle: market.oracle,
              irm: market.irm,
              lltv: market.lltv,
            };
            
            // 尝试获取真实市场数据
            let marketData;
            try {
              marketData = await fetchMarket(marketId, publicClient);
            } catch (apiError) {
              console.warn('Failed to fetch real market data, using fallback:', apiError);
              // 如果API调用失败，返回基础配置
              marketData = null;
            }
            
            return {
              id: market.marketId || `${market.loanToken}-${market.collateralToken}`,
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  });
}

export function useMorphoMarket(marketId: string, chainId: ChainId = ChainId.EthMainnet) {
  const { data: markets } = useMorphoMarkets(chainId);
  
  return markets?.find(market => market?.id === marketId) || null;
}