import { Address } from 'viem';

// 市场参数接口
export interface MarketParams {
  loanToken: Address;
  collateralToken: Address;
  oracle: Address;
  irm: Address;
  lltv: bigint;
}

// 市场数据接口
export interface MorphoMarket {
  id: `0x${string}`;
  marketParams: MarketParams;
  totalSupplyAssets: bigint;
  totalBorrowAssets: bigint;
  utilization: number;
  supplyAPY: number;
  borrowAPY: number;
  loanTokenSymbol: string;
  collateralTokenSymbol: string;
  loanTokenDecimals: number;
  collateralTokenDecimals: number;
  lltv: number;
}

// 用户持仓接口
export interface UserPosition {
  collateralBalance: bigint;
  borrowBalance: bigint;
  healthFactor: number;
  liquidationPrice: number;
}

// Morpho Blue 合约地址 (Base 网络)
export const MORPHO_BLUE_ADDRESS = '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb' as Address;

// Morpho Blue ABI (简化版本，包含主要功能)
export const MORPHO_BLUE_ABI = [
  {
    name: 'supplyCollateral',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'marketParams', type: 'tuple', components: [
        { name: 'loanToken', type: 'address' },
        { name: 'collateralToken', type: 'address' },
        { name: 'oracle', type: 'address' },
        { name: 'irm', type: 'address' },
        { name: 'lltv', type: 'uint256' }
      ]},
      { name: 'assets', type: 'uint256' },
      { name: 'onBehalf', type: 'address' },
      { name: 'data', type: 'bytes' }
    ],
    outputs: []
  },
  {
    name: 'borrow',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'marketParams', type: 'tuple', components: [
        { name: 'loanToken', type: 'address' },
        { name: 'collateralToken', type: 'address' },
        { name: 'oracle', type: 'address' },
        { name: 'irm', type: 'address' },
        { name: 'lltv', type: 'uint256' }
      ]},
      { name: 'assets', type: 'uint256' },
      { name: 'shares', type: 'uint256' },
      { name: 'onBehalf', type: 'address' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: [{ name: 'assetsBorrowed', type: 'uint256' }, { name: 'sharesBorrowed', type: 'uint256' }]
  },
  {
    name: 'repay',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'marketParams', type: 'tuple', components: [
        { name: 'loanToken', type: 'address' },
        { name: 'collateralToken', type: 'address' },
        { name: 'oracle', type: 'address' },
        { name: 'irm', type: 'address' },
        { name: 'lltv', type: 'uint256' }
      ]},
      { name: 'assets', type: 'uint256' },
      { name: 'shares', type: 'uint256' },
      { name: 'onBehalf', type: 'address' },
      { name: 'data', type: 'bytes' }
    ],
    outputs: [{ name: 'assetsRepaid', type: 'uint256' }, { name: 'sharesRepaid', type: 'uint256' }]
  },
  {
    name: 'withdrawCollateral',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'marketParams', type: 'tuple', components: [
        { name: 'loanToken', type: 'address' },
        { name: 'collateralToken', type: 'address' },
        { name: 'oracle', type: 'address' },
        { name: 'irm', type: 'address' },
        { name: 'lltv', type: 'uint256' }
      ]},
      { name: 'assets', type: 'uint256' },
      { name: 'onBehalf', type: 'address' },
      { name: 'receiver', type: 'address' }
    ],
    outputs: []
  },
  {
    name: 'position',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'id', type: 'bytes32' },
      { name: 'user', type: 'address' }
    ],
    outputs: [
      { name: 'supplyShares', type: 'uint128' },
      { name: 'borrowShares', type: 'uint128' },
      { name: 'collateral', type: 'uint256' }
    ]
  },
  {
    name: 'market',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'bytes32' }],
    outputs: [
      { name: 'totalSupplyAssets', type: 'uint128' },
      { name: 'totalSupplyShares', type: 'uint128' },
      { name: 'totalBorrowAssets', type: 'uint128' },
      { name: 'totalBorrowShares', type: 'uint128' },
      { name: 'lastUpdate', type: 'uint128' },
      { name: 'fee', type: 'uint128' }
    ]
  }
] as const;

// ERC20 ABI (用于代币操作)
export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }]
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }]
  }
] as const;