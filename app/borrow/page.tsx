'use client';

import { useMorphoMarkets } from '@/hooks/useMorphoMarkets';
import { useAccount } from 'wagmi';
import ConnectWallet from '@/components/ui/ConnectWallet';
import ErrorBoundary, { NetworkErrorFallback } from '@/components/ui/ErrorBoundary';
import { NetworkIndicator } from '@/components/ui/NetworkStatus';
import { useRouter } from 'next/navigation';

export default function BorrowPage() {
  const { address } = useAccount();
  const { data: markets } = useMorphoMarkets();
  const router = useRouter();
  if (!address) {
    return (
      /* 未连接钱包状态 */
      <div className="container mx-auto px-4 py-8">

        <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
          <div className="card-body">
            <h2 className="card-title justify-center mb-4">开始借贷</h2>
            <p className="mb-6">连接您的钱包提供抵押品,借入任何资产</p>
            <ConnectWallet />
          </div>
        </div>

        {/* 功能特性说明 */}
        <div className="card bg-base-100 shadow-xl mt-8">
          <div className="card-body">
            <h3 className="card-title flex justify-center mb-4">Morpho Markets 特性</h3>
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 网络状态指示器 */}
      <NetworkIndicator className="mb-4" />

      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Morpho Markets 借贷</h1>
          <p className="text-lg opacity-70 max-w-2xl mx-auto">
            通过 Morpho Markets 进行去中心化借贷，享受隔离风险、高资本效率和深度流动性
          </p>
        </div>

        {/* 筛选器和控制栏 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">In Wallet:</span>
              <div className="badge badge-primary">🔵</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Collateral:</span>
              <select className="select select-bordered select-sm">
                <option>All</option>
                <option>WETH</option>
                <option>USDC</option>
                <option>wstETH</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Loan:</span>
              <select className="select select-bordered select-sm">
                <option>All</option>
                <option>WETH</option>
                <option>USDC</option>
                <option>USDT</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-70">🔍</span>
            <input
              type="text"
              placeholder="Filter markets"
              className="input input-bordered input-sm w-48"
            />
          </div>
        </div>

        {/* 市场表格 */}
        <ErrorBoundary fallback={NetworkErrorFallback}>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                <thead>
                  <tr className="bg-base-200">
                    <th className="text-left font-semibold">Collateral </th>
                    <th className="text-left font-semibold">Loan</th>
                    <th className="text-left font-semibold">LLTV</th>
                    <th className="text-left font-semibold">Total Market Size</th>
                    <th className="text-left font-semibold">Total Liquidity</th>
                    <th className="text-left font-semibold">Rate</th>
                    <th className="text-left font-semibold">Vault Listing</th>
                  </tr>
                </thead>
                <tbody>
                  {markets && markets.map((market, index) => {
                    if (!market) return null;

                    // 从真实市场数据获取信息
                    const marketData = market.marketData;
                    
                    // 格式化市场数据
                    const formatMarketData = () => {
                      // 使用真实的代币符号
                      const loanSymbol = market.loanTokenSymbol || 'Unknown';
                      const collateralSymbol = market.collateralTokenSymbol || 'Unknown';
                      
                      if (!marketData) {
                        return {
                          totalSupply: 'Loading...',
                          totalBorrow: 'Loading...',
                          liquidity: 'Loading...',
                          utilization: 'Loading...',
                          borrowRate: 'Loading...',
                          supplyRate: 'Loading...',
                          loanSymbol,
                          collateralSymbol
                        };
                      }
                      
                      const totalSupplyAssets = marketData.totalSupplyAssets || 0n;
                      const totalBorrowAssets = marketData.totalBorrowAssets || 0n;
                      const liquidity = totalSupplyAssets - totalBorrowAssets;
                      const utilization = totalSupplyAssets > 0n ? 
                        Number(totalBorrowAssets * 10000n / totalSupplyAssets) / 100 : 0;

                      
                      return {
                        totalSupply: `${(Number(totalSupplyAssets) / 1e18).toFixed(2)} ${loanSymbol}`,
                        totalBorrow: `${(Number(totalBorrowAssets) / 1e18).toFixed(2)} ${loanSymbol}`,
                        liquidity: `${(Number(liquidity) / 1e18).toFixed(2)} ${loanSymbol}`,
                        utilization: `${utilization.toFixed(1)}%`,
                        borrowRate: marketData.rateAtTarget ? 
                            `${((Math.pow(1 + Number(marketData.rateAtTarget) / 1e18, 31536000) - 1) * 100).toFixed(2)}%` : 'N/A',
                        supplyRate: marketData.rateAtTarget ? 
                            `${((Math.pow(1 + Number(marketData.rateAtTarget) / 1e18, 31536000) - 1) * utilization * (1 - Number(marketData.fee || 0) / 1e18) * 100).toFixed(2)}%` : 'N/A',
                        loanSymbol,
                        collateralSymbol
                      };
                    };
                    
                    const data = formatMarketData();

                    return (
                        <tr 
                          key={market.id}
                          className="hover:bg-base-200 cursor-pointer"
                          onClick={() => router.push(`/borrow/market/${encodeURIComponent(market.id)}`)}
                        >
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                  <span className="text-xs font-bold text-primary-content">
                                    {data.collateralSymbol && data.collateralSymbol.slice(0, 2)}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {data.collateralSymbol}
                                </div>
                                <div className="text-xs opacity-70">
                                  抵押品
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                  <span className="text-xs font-bold text-secondary-content">
                                    {data.loanSymbol && data.loanSymbol.slice(0, 2)}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {data.loanSymbol}
                                </div>
                                <div className="text-xs opacity-70">
                                  借贷资产
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="font-semibold">
                              {(Number(market.config.lltv) / 1e18 * 100).toFixed(2)}%
                            </span>
                          </td>
                          <td>
                            <div>
                              <div className="font-semibold">{data.totalSupply}</div>
                              <div className="text-xs opacity-70">总供应量</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="font-semibold">{data.liquidity}</div>
                              <div className="text-xs opacity-70">可用流动性</div>
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-col">
                              <div className="font-semibold text-success">
                                {data.borrowRate}
                              </div>
                              <div className="text-xs opacity-70">
                                借贷利率
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1">
                              {/* 模拟头像列表 */}
                              <div className="avatar-group -space-x-2">
                                <div className="avatar w-6 h-6">
                                  <div className="rounded-full bg-accent flex items-center justify-center">
                                    <span className="text-xs">M</span>
                                  </div>
                                </div>
                                <div className="avatar w-6 h-6">
                                  <div className="rounded-full bg-warning flex items-center justify-center">
                                    <span className="text-xs">S</span>
                                  </div>
                                </div>
                              </div>
                              {index < 3 && (
                                <span className="text-xs ml-1">+{index + 1}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                    );
                  })}
                </tbody>
                </table>
              </div>
            </div>
          </div>
        </ErrorBoundary>


      </div>




    </div>
  );
}