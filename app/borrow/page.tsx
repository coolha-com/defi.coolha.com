'use client';

import { useState } from 'react';
import { MarketList } from './_components/MarketList';
import { PositionOverview } from './_components/PositionOverview';
import { BorrowActions } from './_components/BorrowActions';
import { RewardsPanel } from './_components/RewardsPanel';
import { useMorphoMarkets, MarketConfig } from '@/hooks/useMorphoMarkets';
import { useAccount } from 'wagmi';
import ConnectWallet from '@/components/ui/ConnectWallet';

export default function BorrowPage() {
  const { address } = useAccount();
  const { data: markets } = useMorphoMarkets();
  const [selectedMarket, setSelectedMarket] = useState<MarketConfig | null>(null);

  // 如果有市场数据且没有选中市场，默认选择第一个
  if (markets && markets.length > 0 && !selectedMarket) {
    setSelectedMarket(markets[0]);
  }

  return (
    <div className="container mx-auto px-4 py-8">


      {!address ? (
        /* 未连接钱包状态 */
        <div className="text-center py-12">
          <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
            <div className="card-body">
              <h2 className="card-title justify-center mb-4">开始借贷</h2>
              <p className="mb-6">连接您的钱包以访问 Morpho Markets 借贷功能</p>
              <ConnectWallet />
            </div>
          </div>
        </div>
      ) : (
        /* 已连接钱包状态 */
        <div className="space-y-8">
          {/* 市场选择器 */}
          {markets && markets.length > 0 && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">选择市场</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {markets.map((market) => {
                    if (!market) return null;

                    return (
                      <button
                        key={market.id}
                        className={`btn btn-outline h-auto p-4 ${selectedMarket?.id === market.id ? 'btn-active' : ''
                          }`}
                        onClick={() => setSelectedMarket(market)}
                      >
                        <div className="text-left">
                          <div className="font-semibold">
                            {market.collateralToken.slice(0, 6)}.../{market.loanToken.slice(0, 6)}...
                          </div>
                          <div className="text-sm opacity-70">
                            最大 LTV: {(Number(market.lltv) / 1e18 * 100).toFixed(1)}%
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧：位置概览 */}
            <div className="space-y-6">
              <PositionOverview marketParams={selectedMarket} />

              {/* 奖励面板 */}
              <RewardsPanel />

              {/* 市场信息 */}
              {selectedMarket && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title mb-4">市场信息</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="opacity-70">抵押品代币:</span>
                        <span className="font-mono">{selectedMarket.collateralToken}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">借贷代币:</span>
                        <span className="font-mono">{selectedMarket.loanToken}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">最大 LTV:</span>
                        <span className="font-semibold">
                          {(Number(selectedMarket.lltv) / 1e18 * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">预言机:</span>
                        <span className="font-mono text-sm">{selectedMarket.oracle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">利率模型:</span>
                        <span className="font-mono text-sm">{selectedMarket.irm}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 右侧：借贷操作 */}
            <div>
              <BorrowActions marketParams={selectedMarket} />
            </div>
          </div>


          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Morpho Markets 借贷</h1>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              通过 Morpho Markets 进行去中心化借贷，享受隔离风险、高资本效率和深度流动性
            </p>
          </div>
        </div>
      )}

      
      {/* 功能特性说明 */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title mb-4">Morpho Markets 特性</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">隔离风险</h4>
              <p className="text-sm opacity-70">
                每个市场的风险都是独立的，一个市场的问题不会影响其他市场的偿付能力
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-secondary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">高资本效率</h4>
              <p className="text-sm opacity-70">
                底层利率模型专为高利用率设计，为借贷双方提供更优的利率
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-accent-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">深度流动性</h4>
              <p className="text-sm opacity-70">
                通过公共分配器，流动性可以在市场间按需流动，确保深度流动性
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}