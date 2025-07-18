'use client';

import { use } from 'react';
import { useMorphoMarket } from '@/hooks/useMorphoMarkets';
import { PositionOverview } from '../../_components/PositionOverview';
import { BorrowActions } from '../../_components/BorrowActions';
import { AddressTruncate } from '@/utils/AddressTruncate';
import { formatNumber } from '@/utils/formatNumber';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import  ConnectWallet  from '@/components/ui/ConnectWallet';

interface MarketPageProps {
  params: Promise<{ id: string }>;
}

export default function MarketPage({ params }: MarketPageProps) {
  const { id } = use(params);
  const { address } = useAccount();
  const market = useMorphoMarket(decodeURIComponent(id));

  if (!market) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p>加载市场数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 面包屑导航 */}
      <div className="breadcrumbs text-sm mb-6">
        <ul>
          <li><Link href="/borrow">借贷市场</Link></li>
          <li>{market.collateralTokenSymbol || 'Unknown'}/{market.loanTokenSymbol || 'Unknown'}</li>
        </ul>
      </div>

      {/* 市场标题 */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {market.collateralTokenSymbol || 'Unknown'} / {market.loanTokenSymbol || 'Unknown'}
              </h1>
              <p className="text-lg opacity-70">
                抵押 {market.collateralTokenSymbol || 'Unknown'} 借贷 {market.loanTokenSymbol || 'Unknown'}
              </p>
            </div>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">最大 LTV</div>
                <div className="stat-value text-primary">
                  {formatNumber(Number(market.config.lltv) / 1e18 * 100, 1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!address ? (
        /* 未连接钱包状态 */
        <div className="text-center py-12">
          <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
            <div className="card-body">
              <h2 className="card-title justify-center mb-4">连接钱包</h2>
              <p className="mb-6">连接您的钱包以开始在此市场进行借贷</p>
              <ConnectWallet />
            </div>
          </div>
        </div>
      ) : (
        /* 已连接钱包状态 */
        <div className="space-y-8">
          {/* 市场统计 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat bg-base-100 shadow rounded-lg">
              <div className="stat-title">借贷利率</div>
              <div className="stat-value text-success">
                {market.marketData?.rateAtTarget ? 
                  `${((Math.pow(1 + Number(market.marketData.rateAtTarget) / 1e18, 31536000) - 1) * 100).toFixed(2)}%` : 
                  'Loading...'
                }
              </div>
              <div className="stat-desc">年化利率</div>
            </div>
            
            <div className="stat bg-base-100 shadow rounded-lg">
              <div className="stat-title">总供应</div>
              <div className="stat-value text-info">
                {market.marketData?.totalSupplyAssets ? 
                  `${(Number(market.marketData.totalSupplyAssets) / 1e18).toFixed(2)} ${market.loanTokenSymbol || 'Unknown'}` : 
                  'Loading...'
                }
              </div>
              <div className="stat-desc">总供应量</div>
            </div>
            
            <div className="stat bg-base-100 shadow rounded-lg">
              <div className="stat-title">总借贷</div>
              <div className="stat-value text-warning">
                {market.marketData?.totalBorrowAssets ? 
                  `${(Number(market.marketData.totalBorrowAssets) / 1e18).toFixed(2)} ${market.loanTokenSymbol || 'Unknown'}` : 
                  'Loading...'
                }
              </div>
              <div className="stat-desc">借贷资产总额</div>
            </div>
            
            <div className="stat bg-base-100 shadow rounded-lg">
              <div className="stat-title">利用率</div>
              <div className="stat-value text-error">
                {market.marketData?.totalSupplyAssets && market.marketData?.totalBorrowAssets ? 
                  `${(Number(market.marketData.totalBorrowAssets * 10000n / market.marketData.totalSupplyAssets) / 100).toFixed(1)}%` : 
                  'Loading...'
                }
              </div>
              <div className="stat-desc">资金利用率</div>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧：位置概览和市场详情 */}
            <div className="space-y-6">
              <PositionOverview marketParams={market} />
              
              {/* 市场详细信息 */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-4">市场详情</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm opacity-70 mb-1">抵押品代币</div>
                        <div className="font-semibold">
                          {market.collateralTokenSymbol || 'Unknown'}
                        </div>
                        <div className="font-mono text-xs opacity-60 break-all">
                          {market.config.collateralToken}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm opacity-70 mb-1">借贷代币</div>
                        <div className="font-semibold">
                          {market.loanTokenSymbol || 'Unknown'}
                        </div>
                        <div className="font-mono text-xs opacity-60 break-all">
                          {market.config.loanToken}
                        </div>
                      </div>
                    </div>
                    
                    <div className="divider"></div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm opacity-70 mb-1">预言机</div>
                        <div className="font-mono text-sm break-all">
                          {market.config.oracle}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm opacity-70 mb-1">利率模型</div>
                        <div className="font-mono text-sm break-all">
                          {market.config.irm}
                        </div>
                      </div>
                    </div>
                    
                    <div className="divider"></div>
                    
                    <div>
                      <div className="text-sm opacity-70 mb-1">清算阈值 (LLTV)</div>
                      <div className="text-lg font-semibold">
                        {formatNumber(Number(market.config.lltv) / 1e18 * 100, 2)}%
                      </div>
                      <div className="text-sm opacity-70">
                        当 LTV 达到此值时将触发清算
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 风险提示 */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-warning mb-4">⚠️ 风险提示</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-error">•</span>
                      <span>借贷资产会持续产生利息，债务金额会随时间增长</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-error">•</span>
                      <span>当健康因子低于 1.0 时，您的抵押品可能被清算</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-error">•</span>
                      <span>市场价格波动可能影响您的位置健康状况</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-error">•</span>
                      <span>清算时可能产生清算罚金，导致额外损失</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-warning">•</span>
                      <span>建议保持健康因子在 1.5 以上以确保安全</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：借贷操作 */}
            <div>
              <BorrowActions marketParams={market} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}