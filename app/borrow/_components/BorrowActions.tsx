'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useMorphoMarkets } from '@/hooks/useMorphoMarkets';
import { formatNumber } from '@/utils/formatNumber';
import ConnectWallet from '@/components/ui/ConnectWallet';

interface BorrowActionsProps {
  marketId: string;
}

export default function BorrowActions({ marketId }: BorrowActionsProps) {
  const { address, isConnected } = useAccount();
  const { getMarketData, getUserPosition, supplyCollateral, borrowAssets } = useMorphoMarkets();
  const [activeTab, setActiveTab] = useState<'supply' | 'borrow'>('supply');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isConnected) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">连接钱包</h2>
          <p>请先连接钱包以进行借贷操作</p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  const handleSupplyCollateral = async () => {
    if (!amount || !address) return;
    
    setIsLoading(true);
    try {
      const market = await getMarketData(marketId);
      if (!market) throw new Error('市场不存在');
      
      const tx = await supplyCollateral(
        market.marketParams,
        amount,
        market.collateralTokenDecimals
      );
      
      console.log('供应抵押品交易哈希:', tx);
      alert(`抵押品供应成功！交易哈希: ${tx}`);
      setAmount('');
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
      const market = await getMarketData(marketId);
      if (!market) throw new Error('市场不存在');
      
      const tx = await borrowAssets(
        market.marketParams,
        amount,
        market.loanTokenDecimals
      );
      
      console.log('借贷交易哈希:', tx);
      alert(`借贷成功！交易哈希: ${tx}`);
      setAmount('');
    } catch (error) {
      console.error('借贷失败:', error);
      alert(`交易失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">借贷操作</h2>
        
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
                {activeTab === 'supply' ? '供应数量' : '借贷数量'}
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

          <button 
            className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
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