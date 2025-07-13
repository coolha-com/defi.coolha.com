'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { Address } from 'viem';

export interface RewardDistribution {
  chainId: number;
  token: Address;
  amount: string;
  proof: string[];
  index: number;
  claimed: boolean;
}

export interface UserRewards {
  distributions: RewardDistribution[];
  totalUnclaimed: string;
  totalClaimed: string;
}

export function useMorphoRewards() {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['morpho-rewards', address],
    queryFn: async (): Promise<UserRewards | null> => {
      if (!address) return null;
      
      try {
        // 调用 Morpho Rewards API
        const response = await fetch(
          `https://rewards.morpho.org/v1/users/${address}/distributions`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch rewards');
        }
        
        const data = await response.json();
        
        // 计算总的未领取和已领取奖励
        let totalUnclaimed = 0;
        let totalClaimed = 0;
        
        data.distributions?.forEach((dist: RewardDistribution) => {
          const amount = parseFloat(dist.amount);
          if (dist.claimed) {
            totalClaimed += amount;
          } else {
            totalUnclaimed += amount;
          }
        });
        
        return {
          distributions: data.distributions || [],
          totalUnclaimed: totalUnclaimed.toString(),
          totalClaimed: totalClaimed.toString(),
        };
      } catch (error) {
        console.error('Failed to fetch Morpho rewards:', error);
        return {
          distributions: [],
          totalUnclaimed: '0',
          totalClaimed: '0',
        };
      }
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // 1 minute
  });
}

export function useMorphoRewardsByChain(chainId: number) {
  const { data: rewards } = useMorphoRewards();
  
  if (!rewards) return null;
  
  const chainRewards = rewards.distributions.filter(
    (dist) => dist.chainId === chainId
  );
  
  const totalUnclaimed = chainRewards
    .filter((dist) => !dist.claimed)
    .reduce((sum, dist) => sum + parseFloat(dist.amount), 0);
    
  const totalClaimed = chainRewards
    .filter((dist) => dist.claimed)
    .reduce((sum, dist) => sum + parseFloat(dist.amount), 0);
  
  return {
    distributions: chainRewards,
    totalUnclaimed: totalUnclaimed.toString(),
    totalClaimed: totalClaimed.toString(),
  };
}