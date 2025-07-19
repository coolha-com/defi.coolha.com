'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import ConnectWallet from '@/components/ui/ConnectWallet';
import TokenIcon from '@/components/ui/TokenIcon';
import { formatNumber } from '@/utils/formatNumber';
import { useMorphoMarkets } from '@/hooks/useMorphoMarkets';
import { type MorphoMarket } from '@/utils/morphoBlueSDK';

export default function BorrowPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { 
    markets, 
    loading, 
    error, 
    loadMarkets
  } = useMorphoMarkets();
  const [selectedMarket, setSelectedMarket] = useState<MorphoMarket | null>(null);

/*   if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">

          
          <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
            <div className="card-body">
     
              <p className="mb-6">连接您的钱包提供抵押品，借入任何资产</p>
              <ConnectWallet />
            </div>
          </div>

        </div>
      </div>
    );
  } */

  return (
    <div className="container mx-auto py-8">


      {/* 市场统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">总市场数</div>
          <div className="stat-value text-primary">{markets.length}</div>
          <div className="stat-desc">活跃借贷市场</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">总供应量</div>
          <div className="stat-value text-info">
            ${formatNumber(markets.reduce((sum, market) => sum + Number(market.totalSupplyAssets) / Math.pow(10, market.loanTokenDecimals), 0) * 2000)}
          </div>
          <div className="stat-desc">所有市场总和</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">总借贷量</div>
          <div className="stat-value text-warning">
            ${formatNumber(markets.reduce((sum, market) => sum + Number(market.totalBorrowAssets) / Math.pow(10, market.loanTokenDecimals), 0) * 2000)}
          </div>
          <div className="stat-desc">所有市场总和</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">平均利用率</div>
          <div className="stat-value text-success">
            {markets.length > 0 ? (markets.reduce((sum, market) => sum + market.utilization, 0) / markets.length).toFixed(1) : 0}%
          </div>
          <div className="stat-desc">资金利用效率</div>
        </div>
      </div>

      {/* 市场列表 */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">可用市场</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="alert alert-error max-w-md mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">加载失败</h3>
                  <div className="text-xs">{error}</div>
                </div>
              </div>
              <button 
                className="btn btn-primary mt-4"
                onClick={loadMarkets}
              >
                重新加载
              </button>
            </div>
          ) : (
            <>
            {/* 桌面端表格视图 */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="bg-base-200">
                    <th className="text-left font-semibold">抵押品</th>
                    <th className="text-left font-semibold">借贷资产</th>
                    <th className="text-left font-semibold">LLTV</th>
                    <th className="text-left font-semibold">总供应量</th>
                    <th className="text-left font-semibold">可用流动性</th>
                    <th className="text-left font-semibold">借贷利率</th>
                    <th className="text-left font-semibold">利用率</th>
                    <th className="text-left font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((market) => {
                    const liquidity = market.totalSupplyAssets - market.totalBorrowAssets;
                    const ltv = Number(market.marketParams.lltv) / 1e18 * 100;
                    
                    return (
                      <tr key={market.id} className="hover:bg-base-200">
                        <td>
                          <div className="flex items-center gap-3">
                            <TokenIcon 
                              symbol={market.collateralTokenSymbol}
                              address={market.marketParams.collateralToken}
                              size="md"
                            />
                            <div>
                              <div className="font-semibold">{market.collateralTokenSymbol}</div>
                              <div className="text-xs opacity-70">抵押品</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <TokenIcon 
                              symbol={market.loanTokenSymbol}
                              address={market.marketParams.loanToken}
                              size="md"
                            />
                            <div>
                              <div className="font-semibold">{market.loanTokenSymbol}</div>
                              <div className="text-xs opacity-70">借贷资产</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="font-semibold">{ltv.toFixed(2)}%</span>
                        </td>
                        <td>
                          <div>
                            <div className="font-semibold">
                              {formatNumber(Number(market.totalSupplyAssets) / Math.pow(10, market.loanTokenDecimals))} {market.loanTokenSymbol}
                            </div>
                            <div className="text-xs opacity-70">总供应量</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="font-semibold">
                              {formatNumber(Number(liquidity) / Math.pow(10, market.loanTokenDecimals))} {market.loanTokenSymbol}
                            </div>
                            <div className="text-xs opacity-70">可借贷</div>
                          </div>
                        </td>
                        <td>
                          <div className="font-semibold text-success">
                            {market.borrowAPY.toFixed(2)}%
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{market.utilization.toFixed(2)}%</div>
                            <progress 
                              className="progress progress-primary w-16" 
                              value={market.utilization} 
                              max="100"
                            ></progress>
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => setSelectedMarket(market)}
                            >
                              快速借贷
                            </button>
                            <button 
                              className="btn btn-outline btn-sm"
                              onClick={() => router.push(`/borrow/market/${encodeURIComponent(market.id)}`)}
                            >
                              详情
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 移动端卡片视图 */}
            <div className="lg:hidden space-y-4">
              {markets.map((market) => {
                const liquidity = market.totalSupplyAssets - market.totalBorrowAssets;
                const ltv = Number(market.marketParams.lltv) / 1e18 * 100;
                
                return (
                  <div key={market.id} className="card bg-base-200 shadow-sm">
                    <div className="card-body p-4">
                      {/* 代币对标题 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <TokenIcon 
                              symbol={market.collateralTokenSymbol}
                              address={market.marketParams.collateralToken}
                              size="sm"
                            />
                            <span className="font-semibold text-sm">{market.collateralTokenSymbol}</span>
                          </div>
                          <span className="text-lg">→</span>
                          <div className="flex items-center gap-2">
                            <TokenIcon 
                              symbol={market.loanTokenSymbol}
                              address={market.marketParams.loanToken}
                              size="sm"
                            />
                            <span className="font-semibold text-sm">{market.loanTokenSymbol}</span>
                          </div>
                        </div>
                        <div className="badge badge-primary">{ltv.toFixed(1)}% LLTV</div>
                      </div>

                      {/* 市场数据网格 */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-base-100 rounded-lg p-3">
                          <div className="text-xs opacity-70 mb-1">借贷利率</div>
                          <div className="font-semibold text-success">{market.borrowAPY.toFixed(2)}%</div>
                        </div>
                        <div className="bg-base-100 rounded-lg p-3">
                          <div className="text-xs opacity-70 mb-1">利用率</div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{market.utilization.toFixed(1)}%</span>
                            <progress 
                              className="progress progress-primary w-12 h-2" 
                              value={market.utilization} 
                              max="100"
                            ></progress>
                          </div>
                        </div>
                        <div className="bg-base-100 rounded-lg p-3">
                          <div className="text-xs opacity-70 mb-1">总供应量</div>
                          <div className="font-semibold text-sm">
                            {formatNumber(Number(market.totalSupplyAssets) / Math.pow(10, market.loanTokenDecimals))} {market.loanTokenSymbol}
                          </div>
                        </div>
                        <div className="bg-base-100 rounded-lg p-3">
                          <div className="text-xs opacity-70 mb-1">可用流动性</div>
                          <div className="font-semibold text-sm">
                            {formatNumber(Number(liquidity) / Math.pow(10, market.loanTokenDecimals))} {market.loanTokenSymbol}
                          </div>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-primary btn-sm flex-1"
                          onClick={() => setSelectedMarket(market)}
                        >
                          快速借贷
                        </button>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => router.push(`/borrow/market/${encodeURIComponent(market.id)}`)}
                        >
                          详情
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </>
          )}
        </div>
      </div>

      {/* 借贷操作模态框 */}
      {selectedMarket && (
        <BorrowModal 
          market={selectedMarket} 
          onClose={() => setSelectedMarket(null)}
        />
      )}
    </div>
  );
}

// 借贷操作模态框组件
function BorrowModal({ market, onClose }: { market: MorphoMarket; onClose: () => void }) {
  const { address } = useAccount();
  const { supplyCollateral, borrowAssets } = useMorphoMarkets();
  const [activeTab, setActiveTab] = useState<'supply' | 'borrow'>('supply');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSupplyCollateral = async () => {
    if (!amount || !address) return;
    
    setIsLoading(true);
    try {
      const tx = await supplyCollateral(
        market.marketParams,
        amount,
        market.collateralTokenDecimals
      );
      
      console.log('供应抵押品交易哈希:', tx);
      alert(`抵押品供应成功！交易哈希: ${tx}`);
      onClose();
    } catch (error) {
      console.error('供应抵押品失败:', error);
      alert(`交易失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!amount || !address) return;
    
    setIsLoading(true);
    try {
      const tx = await borrowAssets(
        market.marketParams,
        amount,
        market.loanTokenDecimals
      );
      
      console.log('借贷交易哈希:', tx);
      alert(`借贷成功！交易哈希: ${tx}`);
      onClose();
    } catch (error) {
      console.error('借贷失败:', error);
      alert(`交易失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const maxLTV = Number(market.marketParams.lltv) / 1e18 * 100;

  return (
    <div className="modal modal-open">
      <div className="modal-box ">
        <h3 className="font-bold text-lg mb-4">
          {market.collateralTokenSymbol} / {market.loanTokenSymbol} 市场
        </h3>
        
        {/* 市场信息 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">最大 LTV</div>
            <div className="stat-value text-sm">{maxLTV.toFixed(2)}%</div>
          </div>
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">借贷利率</div>
            <div className="stat-value text-sm">{market.borrowAPY.toFixed(2)}%</div>
          </div>
        </div>

        {/* 操作选项卡 */}
        <div className="tabs tabs-boxed mb-4">
          <button 
            className={`tab ${activeTab === 'supply' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('supply')}
          >
            供应抵押品
          </button>
          <button 
            className={`tab ${activeTab === 'borrow' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('borrow')}
          >
            借贷资产
          </button>
        </div>

        {/* 操作表单 */}
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                {activeTab === 'supply' 
                  ? `供应 ${market.collateralTokenSymbol} 数量` 
                  : `借贷 ${market.loanTokenSymbol} 数量`
                }
              </span>
            </label>
            <input
              type="number"
              placeholder="0.0"
              className="input input-bordered"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {activeTab === 'supply' && (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>供应抵押品后，您可以借贷最多 {maxLTV.toFixed(1)}% 的抵押品价值</span>
            </div>
          )}

          {activeTab === 'borrow' && (
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>确保您有足够的抵押品，当 LTV 超过 {maxLTV.toFixed(1)}% 时将面临清算风险</span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>取消</button>
          <button 
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            onClick={activeTab === 'supply' ? handleSupplyCollateral : handleBorrow}
            disabled={!amount || isLoading}
          >
            {isLoading 
              ? '处理中...' 
              : activeTab === 'supply' 
                ? '供应抵押品' 
                : '借贷资产'
            }
          </button>
        </div>
      </div>
    </div>
  );
}