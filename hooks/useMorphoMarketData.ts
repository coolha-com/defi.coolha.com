'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { Address } from 'viem';
import {
  MarketParams,
  MorphoMarket,
  UserPosition,
  MORPHO_BLUE_ADDRESS,
  MORPHO_BLUE_ABI,
  ERC20_ABI
} from '@/utils/morphoBlueSDK';

// 市场数据 Hook
export function useMorphoMarketData() {
  const publicClient = usePublicClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取市场数据
  const getMarketData = useCallback(async (marketParams: MarketParams) => {
    if (!publicClient) {
      throw new Error('Public client not available');
    }

    setLoading(true);
    setError(null);

    try {
      // 这里可以添加获取市场数据的逻辑
      // 例如从链上读取市场状态、计算 APY 等
      
      // 示例返回数据
      const marketData = {
        totalSupplyAssets: 0n,
        totalBorrowAssets: 0n,
        utilization: 0,
        supplyAPY: 0,
        borrowAPY: 0,
      };

      return marketData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  // 获取代币信息
  const getTokenInfo = useCallback(async (tokenAddress: Address) => {
    if (!publicClient) {
      return { symbol: 'UNKNOWN', decimals: 18 };
    }

    try {
      const [symbol, decimals] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'symbol',
        }) as Promise<string>,
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'decimals',
        }) as Promise<number>,
      ]);

      return { symbol, decimals };
    } catch (error) {
      console.error('获取代币信息失败:', error);
      return { symbol: 'UNKNOWN', decimals: 18 };
    }
  }, [publicClient]);

  return {
    getMarketData,
    getTokenInfo,
    loading,
    error,
  };
}

export default useMorphoMarketData;