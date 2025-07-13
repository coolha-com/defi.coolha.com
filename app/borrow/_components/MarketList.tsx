'use client';

import { useMorphoMarkets } from '@/hooks/useMorphoMarkets';
import { formatNumber } from '@/utils/formatNumber';
import { AddressTruncate } from '@/utils/AddressTruncate';
import Link from 'next/link';

export function MarketList() {
  const { data: markets, isLoading, error } = useMorphoMarkets();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>加载市场数据失败: {error.message}</span>
      </div>
    );
  }

  if (!markets || markets.length === 0) {
    return (
      <div className="alert alert-info">
        <span>暂无可用市场</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">借贷市场</h2>
      
      <div className="grid gap-4">
        {markets.map((market) => {
          if (!market) return null;
          
          return (
            <Link 
              key={market.id} 
              href={`/borrow/market/${market.id}`}
              className="block"
            >
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="card-title text-lg">
                        <span className="badge badge-primary mr-2">抵押品</span>
                        {AddressTruncate(market.collateralToken)}
                      </h3>
                      <p className="text-sm opacity-70 mt-1">
                        <span className="badge badge-secondary mr-2">借贷资产</span>
                        {AddressTruncate(market.loanToken)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="stat-value text-lg text-primary">
                        {formatNumber(Number(market.lltv) / 1e18 * 100, 1)}%
                      </div>
                      <div className="stat-desc">最大 LTV</div>
                    </div>
                  </div>
                  
                  <div className="divider my-4"></div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-success">借贷利率</div>
                      <div className="text-lg">~5.2%</div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-info">总供应</div>
                      <div className="text-lg">$2.5M</div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-warning">总借贷</div>
                      <div className="text-lg">$1.8M</div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-error">利用率</div>
                      <div className="text-lg">72%</div>
                    </div>
                  </div>
                  
                  <div className="card-actions justify-end mt-4">
                    <div className="badge badge-outline">
                      Oracle: {AddressTruncate(market.oracle)}
                    </div>
                    <div className="badge badge-outline">
                      IRM: {AddressTruncate(market.irm)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}