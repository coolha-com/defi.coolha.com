'use client';

import { useMorphoPosition } from '@/hooks/useMorphoPosition';
import { ExtendedMarketConfig } from '@/hooks/useMorphoMarkets';
import { formatNumber } from '@/utils/formatNumber';
import { formatUnits } from 'viem';

interface PositionOverviewProps {
  marketParams: ExtendedMarketConfig | null;
}

export function PositionOverview({ marketParams }: PositionOverviewProps) {
  const { data: position, isLoading } = useMorphoPosition(marketParams);

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

  if (!position || !marketParams) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">我的位置</h3>
          <p className="text-center py-8 opacity-60">暂无借贷位置</p>
        </div>
      </div>
    );
  }

  const hasPosition = position.collateral > 0n || position.borrowShares > 0n;
  
  if (!hasPosition) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">我的位置</h3>
          <p className="text-center py-8 opacity-60">暂无借贷位置</p>
        </div>
      </div>
    );
  }

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 2) return 'text-success';
    if (hf >= 1.5) return 'text-warning';
    return 'text-error';
  };

  const getHealthFactorBadge = (hf: number) => {
    if (hf >= 2) return 'badge-success';
    if (hf >= 1.5) return 'badge-warning';
    return 'badge-error';
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title">我的位置</h3>
          <div className={`badge ${getHealthFactorBadge(position.healthFactor)} badge-lg`}>
            健康因子: {position.healthFactor === Infinity ? '∞' : formatNumber(position.healthFactor, 2)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 抵押品信息 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg border-b pb-2">抵押品</h4>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">已供应抵押品</div>
              <div className="stat-value text-primary">
                {formatNumber(Number(formatUnits(position.collateral, 18)), 4)}
              </div>
              <div className="stat-desc">ETH 等值</div>
            </div>
          </div>
          
          {/* 借贷信息 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg border-b pb-2">借贷</h4>
            
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">已借贷资产</div>
              <div className="stat-value text-secondary">
                {formatNumber(Number(formatUnits(position.borrowShares, 18)), 4)}
              </div>
              <div className="stat-desc">WETH 等值</div>
            </div>
          </div>
        </div>
        
        <div className="divider"></div>
        
        {/* 风险指标 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm opacity-70">当前 LTV</div>
            <div className={`text-2xl font-bold ${position.ltv > 80 ? 'text-error' : position.ltv > 60 ? 'text-warning' : 'text-success'}`}>
              {formatNumber(position.ltv, 1)}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm opacity-70">清算阈值</div>
            <div className="text-2xl font-bold text-error">
              {formatNumber(position.liquidationThreshold, 1)}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm opacity-70">健康因子</div>
            <div className={`text-2xl font-bold ${getHealthFactorColor(position.healthFactor)}`}>
              {position.healthFactor === Infinity ? '∞' : formatNumber(position.healthFactor, 2)}
            </div>
          </div>
        </div>
        
        {/* 风险警告 */}
        {position.healthFactor < 1.5 && position.healthFactor !== Infinity && (
          <div className="alert alert-warning mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>
              {position.healthFactor < 1.2 
                ? '⚠️ 高风险：您的位置接近清算，请立即还款或增加抵押品！'
                : '⚠️ 中等风险：建议还款或增加抵押品以提高健康因子'}
            </span>
          </div>
        )}
        
        {/* 进度条显示 LTV */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>LTV 使用率</span>
            <span>{formatNumber(position.ltv, 1)}% / {formatNumber(position.liquidationThreshold, 1)}%</span>
          </div>
          <progress 
            className={`progress w-full ${
              position.ltv > position.liquidationThreshold * 0.9 ? 'progress-error' :
              position.ltv > position.liquidationThreshold * 0.7 ? 'progress-warning' :
              'progress-success'
            }`} 
            value={position.ltv} 
            max={position.liquidationThreshold}
          ></progress>
        </div>
      </div>
    </div>
  );
}