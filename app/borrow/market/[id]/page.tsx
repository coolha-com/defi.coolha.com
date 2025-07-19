'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useParams, useRouter } from 'next/navigation';
import { formatUnits } from 'viem';
import Link from 'next/link';
import TokenIcon from '../../../../components/ui/TokenIcon';
import { useMorphoMarkets } from '../../../../hooks/useMorphoMarkets';
import { type MorphoMarket, type UserPosition } from '../../../../utils/morphoBlueSDK';
import { config } from '@/config/wagmi_config';

// 简单的数字格式化函数
function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

export default function MarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected, chain } = useAccount({config});
  const {
    getMarketData,
    getUserPosition,
    supplyCollateral,
    borrowAssets,
    repayDebt,
    withdrawCollateral
  } = useMorphoMarkets();

  const [market, setMarket] = useState<MorphoMarket | null>(null);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [marketLoading, setMarketLoading] = useState(true);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [positionLoading, setPositionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'supply' | 'borrow' | 'repay' | 'withdraw'>('supply');
  const [amount, setAmount] = useState('');
  const [isTransacting, setIsTransacting] = useState(false);

  const marketId = params.id as string;

  // 加载市场数据
  useEffect(() => {
    const loadMarket = async () => {
      if (!params.id) return;

      setMarketLoading(true);
      setMarketError(null);
      try {
        const marketData = await getMarketData(decodeURIComponent(params.id as string));
        if (marketData) {
          setMarket(marketData);
        } else {
          setMarketError('市场不存在');
        }
      } catch (error) {
        console.error('获取市场数据失败:', error);
        setMarketError('获取市场数据失败');
      } finally {
        setMarketLoading(false);
      }
    };

    loadMarket();
  }, [params.id, getMarketData]);

  // 加载用户持仓
  useEffect(() => {
    const loadUserPosition = async () => {
      if (!isConnected || !address || !market) return;

      setPositionLoading(true);
      try {
        const position = await getUserPosition(market.marketParams);
        setUserPosition(position);
      } catch (error) {
        console.error('获取用户持仓失败:', error);
      } finally {
        setPositionLoading(false);
      }
    };

    loadUserPosition();
  }, [isConnected, address, market, getUserPosition]);

  // 处理交易
  const handleTransaction = async () => {
    if (!amount || !market || !address) return;

    setIsTransacting(true);
    try {
      let tx: string;
      const tokenDecimals = activeTab === 'supply' || activeTab === 'withdraw'
        ? market.collateralTokenDecimals
        : market.loanTokenDecimals;

      // 根据操作类型调用不同的合约函数
      switch (activeTab) {
        case 'supply':
          tx = await supplyCollateral(market.marketParams, amount, tokenDecimals);
          break;
        case 'borrow':
          tx = await borrowAssets(market.marketParams, amount, tokenDecimals);
          break;
        case 'repay':
          tx = await repayDebt(market.marketParams, amount, tokenDecimals);
          break;
        case 'withdraw':
          tx = await withdrawCollateral(market.marketParams, amount, tokenDecimals);
          break;
        default:
          throw new Error('未知操作类型');
      }

      console.log(`${getActionText(activeTab)}交易哈希:`, tx);
      alert(`${getActionText(activeTab)}成功！交易哈希: ${tx}`);
      setAmount('');

      // 重新加载用户持仓
      if (isConnected && address) {
        try {
          const position = await getUserPosition(market.marketParams);
          setUserPosition(position);
        } catch (error) {
          console.error('重新加载用户持仓失败:', error);
        }
      }
    } catch (error) {
      console.error('交易失败:', error);
      alert(`交易失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsTransacting(false);
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'supply': return '供应抵押品';
      case 'borrow': return '借贷资产';
      case 'repay': return '偿还债务';
      case 'withdraw': return '提取抵押品';
      default: return '操作';
    }
  };

  if (marketLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (marketError || !market) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{marketError || '市场未找到'}</h1>
          <Link href="/borrow" className="btn btn-primary">
            返回市场列表
          </Link>
        </div>
      </div>
    );
  }

  const maxLTV = Number(market.marketParams.lltv) / 1e18 * 100;
  const liquidity = market.totalSupplyAssets - market.totalBorrowAssets;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 面包屑导航 */}
      <div className="breadcrumbs text-sm mb-6">
        <ul>
          <li><Link href="/borrow">借贷市场</Link></li>
          <li>{market.collateralTokenSymbol} / {market.loanTokenSymbol}</li>
        </ul>
      </div>

      {/* 市场标题 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <TokenIcon
              symbol={market.collateralTokenSymbol}
              address={market.marketParams.collateralToken}
              size="xl"
            />
            <span className="text-2xl font-bold">→</span>
            <TokenIcon
              symbol={market.loanTokenSymbol}
              address={market.marketParams.loanToken}
              size="xl"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {market.collateralTokenSymbol} / {market.loanTokenSymbol}
            </h1>
            <p className="text-lg opacity-70">Morpho Blue 市场</p>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href={`https://app.morpho.org/${chain?.name.toLowerCase()}/market/${marketId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            🔗 官方页面
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：市场信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 市场统计 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">市场统计</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">贷款价值比 （LLTV）</div>
                  <div className="stat-value text-lg">{maxLTV.toFixed(2)}%</div>
                  <div className="stat-desc">清算阈值</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">借贷利率</div>
                  <div className="stat-value text-lg text-error">{market.borrowAPY.toFixed(2)}%</div>
                  <div className="stat-desc">年化利率</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">供应利率</div>
                  <div className="stat-value text-lg text-success">{market.supplyAPY.toFixed(2)}%</div>
                  <div className="stat-desc">年化收益</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">利用率</div>
                  <div className="stat-value text-lg">{market.utilization.toFixed(2)}%</div>
                  <div className="stat-desc">资金利用率</div>
                </div>
              </div>
            </div>
          </div>

          {/* 市场流动性 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">市场流动性</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">总供应量</div>
                  <div className="stat-value text-lg">
                    {formatNumber(Number(market.totalSupplyAssets) / Math.pow(10, market.loanTokenDecimals))}
                  </div>
                  <div className="stat-desc">{market.loanTokenSymbol}</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">总借贷量</div>
                  <div className="stat-value text-lg">
                    {formatNumber(Number(market.totalBorrowAssets) / Math.pow(10, market.loanTokenDecimals))}
                  </div>
                  <div className="stat-desc">{market.loanTokenSymbol}</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">可用流动性</div>
                  <div className="stat-value text-lg text-info">
                    {formatNumber(Number(liquidity) / Math.pow(10, market.loanTokenDecimals))}
                  </div>
                  <div className="stat-desc">{market.loanTokenSymbol}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 用户持仓（如果已连接钱包） */}
          {isConnected && userPosition && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">我的持仓</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">抵押品</div>
                    <div className="stat-value text-lg">
                      {formatNumber(Number(userPosition.collateralBalance) / Math.pow(10, market.collateralTokenDecimals))}
                    </div>
                    <div className="stat-desc">{market.collateralTokenSymbol}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">借贷金额</div>
                    <div className="stat-value text-lg">
                      {formatNumber(Number(userPosition.borrowBalance) / Math.pow(10, market.loanTokenDecimals))}
                    </div>
                    <div className="stat-desc">{market.loanTokenSymbol}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">健康因子</div>
                    <div className={`stat-value text-lg ${userPosition.healthFactor > 1.5 ? 'text-success' :
                      userPosition.healthFactor > 1.2 ? 'text-warning' : 'text-error'
                      }`}>
                      {userPosition.healthFactor.toFixed(2)}
                    </div>
                    <div className="stat-desc">安全指标</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg">
                    <div className="stat-title">清算价格</div>
                    <div className="stat-value text-lg">
                      ${userPosition.liquidationPrice.toLocaleString()}
                    </div>
                    <div className="stat-desc">{market.collateralTokenSymbol} 价格</div>
                  </div>
                </div>

                {userPosition.healthFactor < 1.5 && (
                  <div className="alert alert-warning mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>您的健康因子较低，建议增加抵押品或偿还部分债务以避免清算风险</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：交易操作 */}
        <div className="space-y-6">
          {!isConnected ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <h2 className="card-title justify-center mb-4">连接钱包</h2>
                <p className="mb-4">连接您的钱包开始借贷操作</p>
                <button className="btn btn-primary">连接钱包</button>
              </div>
            </div>
          ) : (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">交易操作</h2>

                {/* 操作选项卡 */}
                <div className="tabs tabs-boxed mb-4">
                  <button
                    className={`tab tab-sm ${activeTab === 'supply' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('supply')}
                  >
                    供应
                  </button>
                  <button
                    className={`tab tab-sm ${activeTab === 'borrow' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('borrow')}
                  >
                    借贷
                  </button>
                  <button
                    className={`tab tab-sm ${activeTab === 'repay' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('repay')}
                  >
                    偿还
                  </button>
                  <button
                    className={`tab tab-sm ${activeTab === 'withdraw' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('withdraw')}
                  >
                    提取
                  </button>
                </div>

                {/* 交易表单 */}
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        {activeTab === 'supply' && `供应 ${market.collateralTokenSymbol} 数量`}
                        {activeTab === 'borrow' && `借贷 ${market.loanTokenSymbol} 数量`}
                        {activeTab === 'repay' && `偿还 ${market.loanTokenSymbol} 数量`}
                        {activeTab === 'withdraw' && `提取 ${market.collateralTokenSymbol} 数量`}
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

                  {/* 操作提示 */}
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

                  <button
                    className={`btn btn-primary w-full ${isTransacting ? 'loading' : ''}`}
                    onClick={handleTransaction}
                    disabled={!amount || isTransacting}
                  >
                    {isTransacting ? '处理中...' : getActionText(activeTab)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 市场信息卡片 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">市场信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-70">抵押品代币:</span>
                  <span className="font-semibold">{market.collateralTokenSymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">借贷代币:</span>
                  <span className="font-semibold">{market.loanTokenSymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">预言机:</span>
                  <Link href={`${chain?.blockExplorers?.default?.url}/address/${market.marketParams.oracle}`} target="_blank" rel="noopener noreferrer" className='font-mono text-xs hover:text-primary'>
                    {market.marketParams.oracle.slice(0, 6)}...{market.marketParams.oracle.slice(-4)}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">利率模型:</span>
                  <Link href={`${chain?.blockExplorers?.default?.url}/address/${market.marketParams.irm}`} target="_blank" rel="noopener noreferrer" className='font-mono text-xs hover:text-primary'>
                    {market.marketParams.irm.slice(0, 6)}...{market.marketParams.irm.slice(-4)}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}