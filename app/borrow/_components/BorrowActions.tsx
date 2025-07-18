'use client';

import { useState } from 'react';
import { useMorphoActions } from '@/hooks/useMorphoActions';
import { useMorphoPosition } from '@/hooks/useMorphoPosition';
import { ExtendedMarketConfig } from '@/hooks/useMorphoMarkets';
import { formatNumber } from '@/utils/formatNumber';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

interface BorrowActionsProps {
  marketParams: ExtendedMarketConfig | null;
}

type ActionType = 'supply' | 'borrow' | 'repay' | 'withdraw';

export function BorrowActions({ marketParams }: BorrowActionsProps) {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<ActionType>('supply');
  const [amount, setAmount] = useState('');
  
  const { data: position } = useMorphoPosition(marketParams);
  const { supplyCollateral, borrow, repay, withdrawCollateral } = useMorphoActions();

  if (!address) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h3 className="card-title justify-center">连接钱包</h3>
          <p>请先连接钱包以使用借贷功能</p>
        </div>
      </div>
    );
  }

  if (!marketParams) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h3 className="card-title justify-center">选择市场</h3>
          <p>请先选择一个借贷市场</p>
        </div>
      </div>
    );
  }

  const handleAction = async () => {
    if (!amount || !marketParams) return;
    
    try {
      switch (activeTab) {
        case 'supply':
          await supplyCollateral.mutateAsync({
            marketParams,
            amount,
            decimals: 18,
          });
          break;
        case 'borrow':
          await borrow.mutateAsync({
            marketParams,
            amount,
            decimals: 18,
          });
          break;
        case 'repay':
          await repay.mutateAsync({
            marketParams,
            amount,
            decimals: 18,
          });
          break;
        case 'withdraw':
          await withdrawCollateral.mutateAsync({
            marketParams,
            amount,
            decimals: 18,
          });
          break;
      }
      setAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const isLoading = supplyCollateral.isPending || borrow.isPending || repay.isPending || withdrawCollateral.isPending;
  
  const getMaxAmount = () => {
    if (!position) return '0';
    
    switch (activeTab) {
      case 'supply':
        return '1000'; // 这里应该从用户余额获取
      case 'borrow':
        // 基于抵押品价值和 LTV 计算最大借贷额
        const maxBorrow = Number(formatUnits(position.collateral, 18)) * (Number(marketParams.config.lltv) / 1e18) * 0.8; // 80% 安全边际
        return maxBorrow.toString();
      case 'repay':
        return formatUnits(position.borrowAssets, 18);
      case 'withdraw':
        // 考虑健康因子，计算可提取的最大抵押品
        const safeWithdraw = Number(formatUnits(position.collateral, 18)) * 0.5; // 50% 安全边际
        return safeWithdraw.toString();
      default:
        return '0';
    }
  };

  const getActionText = () => {
    switch (activeTab) {
      case 'supply': return '供应抵押品';
      case 'borrow': return '借贷资产';
      case 'repay': return '还款';
      case 'withdraw': return '提取抵押品';
    }
  };

  const getTokenSymbol = () => {
    switch (activeTab) {
      case 'supply':
      case 'withdraw':
        return 'wstETH'; // 抵押品代币
      case 'borrow':
      case 'repay':
        return 'WETH'; // 借贷代币
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title mb-4">借贷操作</h3>
        
        {/* 标签页 */}
        <div className="tabs tabs-boxed mb-6">
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
            借贷
          </button>
          <button 
            className={`tab ${activeTab === 'repay' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('repay')}
          >
            还款
          </button>
          <button 
            className={`tab ${activeTab === 'withdraw' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('withdraw')}
          >
            提取
          </button>
        </div>
        
        {/* 输入区域 */}
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">数量</span>
              <span className="label-text-alt">
                最大: {formatNumber(Number(getMaxAmount()), 4)} {getTokenSymbol()}
              </span>
            </label>
            <div className="input-group">
              <input
                type="number"
                placeholder="0.0"
                className="input input-bordered flex-1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.0001"
                min="0"
              />
              <button 
                className="btn btn-outline"
                onClick={() => setAmount(getMaxAmount())}
              >
                最大
              </button>
              <span className="btn btn-ghost">{getTokenSymbol()}</span>
            </div>
          </div>
          
          {/* 预览信息 */}
          {amount && Number(amount) > 0 && (
            <div className="bg-base-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>操作类型:</span>
                <span className="font-semibold">{getActionText()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>数量:</span>
                <span>{formatNumber(Number(amount), 4)} {getTokenSymbol()}</span>
              </div>
              {activeTab === 'borrow' && position && (
                <div className="flex justify-between text-sm">
                  <span>预计新 LTV:</span>
                  <span className="font-semibold">
                    {formatNumber(
                      (Number(formatUnits(position.borrowAssets, 18)) + Number(amount)) / 
                      Number(formatUnits(position.collateral, 18)) * 100,
                      2
                    )}%
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* 操作按钮 */}
          <button
            className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
            onClick={handleAction}
            disabled={!amount || Number(amount) <= 0 || isLoading}
          >
            {isLoading ? '处理中...' : getActionText()}
          </button>
          
          {/* 错误信息 */}
          {(supplyCollateral.error || borrow.error || repay.error || withdrawCollateral.error) && (
            <div className="alert alert-error">
              <span>
                操作失败: {(
                  supplyCollateral.error || 
                  borrow.error || 
                  repay.error || 
                  withdrawCollateral.error
                )?.message}
              </span>
            </div>
          )}
        </div>
        
        {/* 风险提示 */}
        <div className="mt-6 space-y-2">
          <div className="text-sm opacity-70">
            <div className="font-semibold mb-2">风险提示:</div>
            <ul className="list-disc list-inside space-y-1">
              <li>借贷资产会产生利息，请及时关注债务变化</li>
              <li>当健康因子低于 1 时，您的抵押品可能被清算</li>
              <li>市场波动可能影响您的位置健康状况</li>
              <li>请确保您了解相关风险后再进行操作</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}