'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount, usePublicClient } from 'wagmi';
import { ChainId, getChainAddresses, MarketId } from '@morpho-org/blue-sdk';
import { fetchPosition } from '@morpho-org/blue-sdk-viem';
import type { IPosition } from '@morpho-org/blue-sdk';
import { Address } from 'viem';
import { ExtendedMarketConfig } from './useMorphoMarkets';

export interface UserPosition {
  collateral: bigint;
  borrowShares: bigint;
  borrowAssets: bigint;
  healthFactor: number;
  ltv: number;
  liquidationThreshold: number;
}

export function useMorphoPosition(
  marketParams: ExtendedMarketConfig | null,
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
        // 确保市场ID是正确的 MarketId 格式
        const marketId = marketParams.id as MarketId;
        
        // 验证 marketId 格式
        if (!marketId || !marketId.startsWith('0x')) {
          throw new Error(`Invalid market ID format: ${marketId}`);
        }
        
        // 添加超时处理
        const fetchPromise = fetchPosition(address, marketId, publicClient);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Position fetch timeout')), 8000)
        );
        
        const position = await Promise.race([fetchPromise, timeoutPromise]) as IPosition;

        // 计算健康因子和 LTV
        const collateralValue = position.collateral; // 需要根据价格计算实际价值
        const borrowValue = position.borrowShares;
        
        const ltv = collateralValue > 0n 
          ? Number(borrowValue * 10000n / collateralValue) / 100
          : 0;
        
        const liquidationThreshold = Number(marketParams.config.lltv) / 1e18 * 100;
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
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });
}