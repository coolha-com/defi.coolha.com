import { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { Address, formatUnits, parseUnits, keccak256, encodePacked } from 'viem';
import {
  MarketParams,
  MorphoMarket,
  UserPosition,
  MORPHO_BLUE_ADDRESS,
  MORPHO_BLUE_ABI,
  ERC20_ABI
} from '@/utils/morphoBlueSDK';

// 现在从 morphoBlueSDK 导入所有类型和常量

// Morpho API 基础 URL
const MORPHO_API_BASE_URL = 'https://blue-api.morpho.org/graphql';

// GraphQL 查询
const GET_MARKETS_QUERY = `
  query GetMarkets($chainId: Int!) {
    markets(
      first: 100
      orderBy: SupplyAssetsUsd
      orderDirection: Desc
      where: { chainId_in: [$chainId] }
    ) {
      items {
        uniqueKey
        lltv
        oracleAddress
        irmAddress
        loanAsset {
          address
          symbol
          decimals
        }
        collateralAsset {
          address
          symbol
          decimals
        }
        state {
          borrowAssets
          supplyAssets
          liquidityAssets
          borrowApy
          supplyApy
          utilization
          fee
        }
      }
    }
  }
`;

const GET_USER_POSITIONS_QUERY = `
  query GetUserPositions($userAddress: String!, $chainId: Int!) {
    marketPositions(
      first: 100
      where: {
        user: { address: $userAddress }
        market: { chainId_in: [$chainId] }
      }
    ) {
      items {
        market {
          uniqueKey
          chainId
        }
        user {
          address
        }
        state {
          collateral
          borrowAssets
          borrowAssetsUsd
        }
      }
    }
  }
`;

// 从 API 响应转换为 MarketParams
function apiResponseToMarketParams(apiMarket: any): MarketParams {
  // 添加空值检查以防止 TypeError
  if (!apiMarket.loanAsset || !apiMarket.collateralAsset) {
    throw new Error('市场数据不完整：缺少资产信息');
  }
  
  return {
    loanToken: apiMarket.loanAsset.address as Address,
    collateralToken: apiMarket.collateralAsset.address as Address,
    oracle: apiMarket.oracleAddress as Address,
    irm: apiMarket.irmAddress as Address,
    lltv: BigInt(apiMarket.lltv),
  };
}

// 从 API 响应转换为 MorphoMarket
function apiResponseToMorphoMarket(apiMarket: any): MorphoMarket {
  // 添加空值检查以防止 TypeError
  if (!apiMarket || !apiMarket.loanAsset || !apiMarket.collateralAsset) {
    throw new Error('市场数据不完整：缺少必要信息');
  }
  
  const marketParams = apiResponseToMarketParams(apiMarket);
  
  return {
    id: apiMarket.uniqueKey,
    marketParams,
    loanTokenSymbol: apiMarket.loanAsset.symbol || 'UNKNOWN',
    collateralTokenSymbol: apiMarket.collateralAsset.symbol || 'UNKNOWN',
    loanTokenDecimals: apiMarket.loanAsset.decimals || 18,
    collateralTokenDecimals: apiMarket.collateralAsset.decimals || 18,
    totalSupplyAssets: BigInt(apiMarket.state?.supplyAssets || '0'),
    totalBorrowAssets: BigInt(apiMarket.state?.borrowAssets || '0'),
    borrowAPY: parseFloat(apiMarket.state?.borrowApy || '0') * 100,
    supplyAPY: parseFloat(apiMarket.state?.supplyApy || '0') * 100,
    utilization: parseFloat(apiMarket.state?.utilization || '0') * 100,
    lltv: parseFloat(apiMarket.lltv || '0') / 1e18 * 100,
  };
}

// 调用 Morpho API
async function callMorphoAPI(query: string, variables: any = {}) {
  try {
    console.log('调用 Morpho API:', { 
      url: MORPHO_API_BASE_URL,
      query: query.substring(0, 100) + '...', 
      variables 
    });
    
    const response = await fetch(MORPHO_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 响应错误:', { status: response.status, statusText: response.statusText, body: errorText });
      throw new Error(`API 请求失败: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    // 检查响应数据是否为空
    if (!data || Object.keys(data).length === 0) {
      console.error('API 响应错误: 收到空响应', data);
      throw new Error('API 返回空响应');
    }
    
    if (data.errors) {
      console.error('GraphQL 错误详情:', data.errors);
      throw new Error(`GraphQL 错误: ${data.errors.map((e: any) => e.message).join(', ')}`);
    }

    // 检查是否有数据字段
    if (!data.data) {
      console.error('API 响应错误: 缺少data字段', data);
      throw new Error('API 响应格式错误：缺少data字段');
    }

    return data.data;
  } catch (error) {
    console.error('Morpho API 调用失败:', error);
    throw error;
  }
}

// 计算市场 ID (使用 Morpho Blue 的标准方法)
function getMarketId(marketParams: MarketParams): `0x${string}` {
  // 按照 Morpho Blue 协议的标准方法计算市场 ID
  // marketId = keccak256(abi.encode(marketParams))
  const encoded = encodePacked(
    ['address', 'address', 'address', 'address', 'uint256'],
    [
      marketParams.loanToken,
      marketParams.collateralToken,
      marketParams.oracle,
      marketParams.irm,
      marketParams.lltv
    ]
  );
  return keccak256(encoded);
}

// 模拟 APY 计算（在真实实现中应该从链上或 API 获取）
function calculateAPY(utilization: number, isSupply: boolean): number {
  const baseRate = 2; // 2% 基础利率
  const utilizationRate = utilization / 100;
  const borrowAPY = baseRate + (utilizationRate * 8); // 最高 10%
  
  if (isSupply) {
    return borrowAPY * utilizationRate * 0.9; // 供应方获得 90% 的利息
  }
  return borrowAPY;
}

export function useMorphoMarkets() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [markets, setMarkets] = useState<MorphoMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取代币信息
  const getTokenInfo = useCallback(async (tokenAddress: Address) => {
    if (!publicClient) return { symbol: 'UNKNOWN', decimals: 18 };
    
    try {
      const [symbol, decimals] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'symbol',
        }),
        publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'decimals',
        }),
      ]);
      
      return { symbol: symbol as string, decimals: decimals as number };
    } catch (error) {
      console.error('获取代币信息失败:', error);
      return { symbol: 'UNKNOWN', decimals: 18 };
    }
  }, [publicClient]);

  // 获取所有市场数据
  const fetchMarkets = useCallback(async (): Promise<MorphoMarket[]> => {
    try {
      const chainId = publicClient?.chain?.id || 8453; // 默认 Base 网络
      const data = await callMorphoAPI(GET_MARKETS_QUERY, { chainId });
      
      if (!data.markets?.items) {
        throw new Error('未获取到市场数据');
      }

      // 过滤并转换市场数据，跳过不完整的数据
      const validMarkets: MorphoMarket[] = [];
      
      for (const apiMarket of data.markets.items) {
        try {
          const market = apiResponseToMorphoMarket(apiMarket);
          validMarkets.push(market);
        } catch (error) {
          console.warn('跳过不完整的市场数据:', error);
          // 继续处理下一个市场，不中断整个流程
        }
      }
      
      return validMarkets;
    } catch (error) {
      console.error('获取市场数据失败:', error);
      throw error;
    }
  }, [publicClient]);

  // 获取单个市场数据
  const getMarketData = useCallback(async (marketId: string): Promise<MorphoMarket | null> => {
    try {
      const allMarkets = await fetchMarkets();
      return allMarkets.find(market => market.id === marketId) || null;
    } catch (error) {
      console.error('获取市场数据失败:', error);
      throw error;
    }
  }, [fetchMarkets]);

  // 加载所有市场
  const loadMarkets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const marketResults = await fetchMarkets();
      setMarkets(marketResults);
    } catch (error) {
      console.error('加载市场失败:', error);
      setError('加载市场数据失败');
    } finally {
      setLoading(false);
    }
  }, [fetchMarkets]);

  // 获取用户持仓
  const getUserPosition = useCallback(async (marketParams: MarketParams): Promise<UserPosition> => {
    if (!address) {
      return {
        collateralBalance: 0n,
        borrowBalance: 0n,
        healthFactor: 0,
        liquidationPrice: 0,
      };
    }

    try {
      const chainId = publicClient?.chain?.id || 8453;
      // 确保地址格式正确，并添加错误处理
      if (!address || address.length !== 42) {
        console.warn('无效的钱包地址格式，使用默认持仓数据');
        return {
          collateralBalance: 0n,
          borrowBalance: 0n,
          healthFactor: 0,
          liquidationPrice: 0,
        };
      }
      
      console.log('正在获取用户持仓数据...', { userAddress: address.toLowerCase(), chainId });
      
      const data = await callMorphoAPI(GET_USER_POSITIONS_QUERY, { 
        userAddress: address.toLowerCase(), 
        chainId: chainId
      });
      
      console.log('用户持仓API响应:', data);
      
      if (!data.marketPositions?.items) {
        return {
          collateralBalance: 0n,
          borrowBalance: 0n,
          healthFactor: 0,
          liquidationPrice: 0,
        };
      }

      // 查找对应市场的持仓
      const allMarkets = await fetchMarkets();
      const targetMarket = allMarkets.find(m => 
        m.marketParams.loanToken.toLowerCase() === marketParams.loanToken.toLowerCase() &&
        m.marketParams.collateralToken.toLowerCase() === marketParams.collateralToken.toLowerCase()
      );

      if (!targetMarket) {
        return {
          collateralBalance: 0n,
          borrowBalance: 0n,
          healthFactor: 0,
          liquidationPrice: 0,
        };
      }

      const position = data.marketPositions.items.find(
        (pos: any) => pos.market.uniqueKey === targetMarket.id
      );

      if (!position) {
        return {
          collateralBalance: 0n,
          borrowBalance: 0n,
          healthFactor: 0,
          liquidationPrice: 0,
        };
      }

      // 计算健康因子和清算价格 (简化版本)
      const collateralBalance = BigInt(position.state.collateral || '0');
      const borrowBalance = BigInt(position.state.borrowAssets || '0');
      const healthFactor = collateralBalance > 0n ? 1.5 : 0; // 简化计算
      const liquidationPrice = borrowBalance > 0n ? 1000 : 0; // 简化的清算价格计算

      return {
        collateralBalance,
        borrowBalance,
        healthFactor,
        liquidationPrice,
      };
    } catch (error) {
      console.error('获取用户持仓失败:', error);
      
      // 如果是网络错误或API错误，记录详细信息但不抛出错误
      if (error instanceof Error) {
        console.error('错误详情:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      
      // 当API请求失败时，返回默认的空持仓数据，避免应用崩溃
      console.warn('使用默认的空持仓数据');
      return {
        collateralBalance: 0n,
        borrowBalance: 0n,
        healthFactor: 0,
        liquidationPrice: 0,
      };
    }
  }, [address, publicClient, fetchMarkets]);

  // 供应抵押品
  const supplyCollateral = useCallback(async (
    marketParams: MarketParams,
    amount: string,
    tokenDecimals: number
  ) => {
    if (!walletClient || !address) throw new Error('钱包未连接');
    
    const assets = parseUnits(amount, tokenDecimals);
    
    // 首先检查并批准代币
    const allowance = await publicClient?.readContract({
      address: marketParams.collateralToken,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [address, MORPHO_BLUE_ADDRESS],
    });
    
    if (!allowance || allowance < assets) {
      // 需要批准代币
      const approveTx = await walletClient.writeContract({
        address: marketParams.collateralToken,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [MORPHO_BLUE_ADDRESS, assets],
      });
      
      // 等待批准交易确认
      await publicClient?.waitForTransactionReceipt({ hash: approveTx });
    }
    
    // 供应抵押品
    const tx = await walletClient.writeContract({
      address: MORPHO_BLUE_ADDRESS,
      abi: MORPHO_BLUE_ABI,
      functionName: 'supplyCollateral',
      args: [marketParams, assets, address, '0x'],
    });
    
    return tx;
  }, [walletClient, publicClient, address]);

  // 借贷资产
  const borrowAssets = useCallback(async (
    marketParams: MarketParams,
    amount: string,
    tokenDecimals: number
  ) => {
    if (!walletClient || !address) throw new Error('钱包未连接');
    
    const assets = parseUnits(amount, tokenDecimals);
    
    const tx = await walletClient.writeContract({
      address: MORPHO_BLUE_ADDRESS,
      abi: MORPHO_BLUE_ABI,
      functionName: 'borrow',
      args: [marketParams as any, assets, 0n, address, address],
    });
    
    return tx;
  }, [walletClient, address]);

  // 偿还债务
  const repayDebt = useCallback(async (
    marketParams: MarketParams,
    amount: string,
    tokenDecimals: number
  ) => {
    if (!walletClient || !address) throw new Error('钱包未连接');
    
    const assets = parseUnits(amount, tokenDecimals);
    
    // 首先检查并批准代币
    const allowance = await publicClient?.readContract({
      address: marketParams.loanToken,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [address, MORPHO_BLUE_ADDRESS],
    });
    
    if (!allowance || allowance < assets) {
      // 需要批准代币
      const approveTx = await walletClient.writeContract({
        address: marketParams.loanToken,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [MORPHO_BLUE_ADDRESS, assets],
      });
      
      // 等待批准交易确认
      await publicClient?.waitForTransactionReceipt({ hash: approveTx });
    }
    
    const tx = await walletClient.writeContract({
      address: MORPHO_BLUE_ADDRESS,
      abi: MORPHO_BLUE_ABI,
      functionName: 'repay',
      args: [marketParams, assets, 0n, address, '0x'],
    });
    
    return tx;
  }, [walletClient, publicClient, address]);

  // 提取抵押品
  const withdrawCollateral = useCallback(async (
    marketParams: MarketParams,
    amount: string,
    tokenDecimals: number
  ) => {
    if (!walletClient || !address) throw new Error('钱包未连接');
    
    const assets = parseUnits(amount, tokenDecimals);
    
    const tx = await walletClient.writeContract({
      address: MORPHO_BLUE_ADDRESS,
      abi: MORPHO_BLUE_ABI,
      functionName: 'withdrawCollateral',
      args: [marketParams as any, assets, address, address],
    });
    
    return tx;
  }, [walletClient, address]);

  // 初始化时加载市场
  useEffect(() => {
    loadMarkets();
  }, [loadMarkets]);

  return {
    markets,
    loading,
    error,
    loadMarkets,
    fetchMarkets,
    getMarketData,
    getUserPosition,
    supplyCollateral,
    borrowAssets,
    repayDebt,
    withdrawCollateral,
  };
}