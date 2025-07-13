'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount, usePublicClient } from 'wagmi';
import { ChainId, getChainAddresses } from '@morpho-org/blue-sdk';
import { fetchPosition } from '@morpho-org/blue-sdk-viem';
import { Address } from 'viem';
import { MarketConfig } from './useMorphoMarkets';

export interface UserPosition {
  collateral: bigint;
  borrowShares: bigint;
  borrowAssets: bigint;
  healthFactor: number;
  ltv: number;
  liquidationThreshold: number;
}

export function useMorphoPosition(
  marketParams: MarketConfig | null,
  chainId: ChainId = ChainId.EthMainnet
) {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['morpho-position', address, marketParams?.id, chainId],
    queryFn: async (): Promise<UserPosition | null> => {
      if (!publicClient || !address || !marketParams) {
        return null;
      }
      
      const addresses = getChainAddresses(chainId);
      
      try {
        // 生成市场ID
        const marketId = {
          loanToken: marketParams.loanToken,
          collateralToken: marketParams.collateralToken,
          oracle: marketParams.oracle,
          irm: marketParams.irm,
          lltv: marketParams.lltv,
        };
        
        const position = await fetchPosition(address, marketId, publicClient);

        // 计算健康因子和 LTV
        const collateralValue = position.collateral; // 需要根据价格计算实际价值
        const borrowValue = position.borrowShares;
        
        const ltv = collateralValue > 0n 
          ? Number(borrowValue * 10000n / collateralValue) / 100
          : 0;
        
        const liquidationThreshold = Number(marketParams.lltv) / 1e18 * 100;
        const healthFactor = liquidationThreshold > 0 ? liquidationThreshold / ltv : Infinity;

        return {
          collateral: position.collateral,
          borrowShares: position.borrowShares,
          borrowAssets: position.borrowShares,
          healthFactor: isFinite(healthFactor) ? healthFactor : Infinity,
          ltv,
          liquidationThreshold,
        };
      } catch (error) {
        console.error('Failed to fetch position:', error);
        return null;
      }
    },
    enabled: !!publicClient && !!address && !!marketParams,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 15 * 1000, // 15 seconds
  });
}

export function useMorphoPositions(chainId: ChainId = ChainId.EthMainnet) {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['morpho-positions', address, chainId],
    queryFn: async () => {
      if (!publicClient || !address) return [];
      
      // 这里可以获取用户在所有市场的位置
      // 实际实现中需要调用 Morpho API 或遍历所有市场
      return [];
    },
    enabled: !!publicClient && !!address,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}