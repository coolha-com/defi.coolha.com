'use client';

import { useMorphoRewards } from '@/hooks/useMorphoRewards';
import { formatNumber } from '@/utils/formatNumber';
import { AddressTruncate } from '@/utils/AddressTruncate';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export function RewardsPanel() {
  const { address } = useAccount();
  const { data: rewards, isLoading } = useMorphoRewards();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!address) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-center">
            <div className="loading loading-spinner loading-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!rewards || rewards.distributions.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">🎁 奖励</h3>
          <p className="text-center py-4 opacity-60">暂无可用奖励</p>
        </div>
      </div>
    );
  }

  const unclaimedRewards = rewards.distributions.filter(dist => !dist.claimed);
  const claimedRewards = rewards.distributions.filter(dist => dist.claimed);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title">🎁 奖励</h3>
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '收起' : '展开'}
          </button>
        </div>
        
        {/* 奖励概览 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">可领取奖励</div>
            <div className="stat-value text-success text-lg">
              {formatNumber(Number(rewards.totalUnclaimed), 4)}
            </div>
            <div className="stat-desc">{unclaimedRewards.length} 个奖励</div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">已领取奖励</div>
            <div className="stat-value text-info text-lg">
              {formatNumber(Number(rewards.totalClaimed), 4)}
            </div>
            <div className="stat-desc">{claimedRewards.length} 个奖励</div>
          </div>
        </div>
        
        {/* 可领取奖励列表 */}
        {unclaimedRewards.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-success">🎯 可领取奖励</h4>
            {unclaimedRewards.slice(0, isExpanded ? undefined : 3).map((reward, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-success/10 rounded-lg border border-success/20">
                <div>
                  <div className="font-semibold">
                    {formatNumber(Number(reward.amount), 4)} 代币
                  </div>
                  <div className="text-sm opacity-70">
                    代币: {AddressTruncate(reward.token)}
                  </div>
                  <div className="text-sm opacity-70">
                    链: {reward.chainId}
                  </div>
                </div>
                <button className="btn btn-success btn-sm">
                  领取
                </button>
              </div>
            ))}
            
            {!isExpanded && unclaimedRewards.length > 3 && (
              <div className="text-center">
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsExpanded(true)}
                >
                  查看更多 ({unclaimedRewards.length - 3} 个)
                </button>
              </div>
            )}
            
            {unclaimedRewards.length > 1 && (
              <button className="btn btn-success w-full">
                一键领取所有奖励
              </button>
            )}
          </div>
        )}
        
        {/* 已领取奖励列表 */}
        {isExpanded && claimedRewards.length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="font-semibold text-info">✅ 已领取奖励</h4>
            {claimedRewards.map((reward, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                <div>
                  <div className="font-semibold">
                    {formatNumber(Number(reward.amount), 4)} 代币
                  </div>
                  <div className="text-sm opacity-70">
                    代币: {AddressTruncate(reward.token)}
                  </div>
                  <div className="text-sm opacity-70">
                    链: {reward.chainId}
                  </div>
                </div>
                <div className="badge badge-success">已领取</div>
              </div>
            ))}
          </div>
        )}
        
        {/* 奖励说明 */}
        <div className="mt-6 p-3 bg-info/10 rounded-lg border border-info/20">
          <div className="text-sm">
            <div className="font-semibold mb-2">💡 关于奖励</div>
            <ul className="list-disc list-inside space-y-1 opacity-70">
              <li>奖励来自 Morpho Markets 的激励计划</li>
              <li>供应抵押品和借贷都可能获得奖励</li>
              <li>奖励会定期更新，请及时领取</li>
              <li>不同链上的奖励需要分别领取</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}