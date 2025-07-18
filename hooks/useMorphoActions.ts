'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { ChainId, getChainAddresses } from '@morpho-org/blue-sdk';
import { Address, parseUnits, erc20Abi } from 'viem';
import { ExtendedMarketConfig } from './useMorphoMarkets';

const MORPHO_ABI = [
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
  }
] as const;

export function useMorphoActions(chainId: ChainId = ChainId.EthMainnet) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();
  
  const addresses = getChainAddresses(chainId);
  const morphoAddress = addresses.morpho;

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['morpho-position'] });
    queryClient.invalidateQueries({ queryKey: ['morpho-markets'] });
  };

  // 供应抵押品
  const supplyCollateral = useMutation({
    mutationFn: async ({ marketParams, amount, decimals = 18 }: {
      marketParams: ExtendedMarketConfig;
      amount: string;
      decimals?: number;
    }) => {
      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet not connected');
      }

      const assets = parseUnits(amount, decimals);
      
      // 首先批准代币
      const approveTx = await walletClient.writeContract({
        address: marketParams.config.collateralToken,
        abi: erc20Abi,
        functionName: 'approve',
        args: [morphoAddress, assets],
      });
      
      await publicClient.waitForTransactionReceipt({ hash: approveTx });
      
      // 供应抵押品
      const tx = await walletClient.writeContract({
        address: morphoAddress,
        abi: MORPHO_ABI,
        functionName: 'supplyCollateral',
        args: [
          {
            loanToken: marketParams.config.loanToken,
            collateralToken: marketParams.config.collateralToken,
            oracle: marketParams.config.oracle,
            irm: marketParams.config.irm,
            lltv: marketParams.config.lltv,
          },
          assets,
          address,
          '0x'
        ],
      });
      
      return await publicClient.waitForTransactionReceipt({ hash: tx });
    },
    onSuccess: invalidateQueries,
  });

  // 借贷
  const borrow = useMutation({
    mutationFn: async ({ marketParams, amount, decimals = 18 }: {
      marketParams: ExtendedMarketConfig;
      amount: string;
      decimals?: number;
    }) => {
      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet not connected');
      }

      const assets = parseUnits(amount, decimals);
      
      const tx = await walletClient.writeContract({
        address: morphoAddress,
        abi: MORPHO_ABI,
        functionName: 'borrow',
        args: [
          {
            loanToken: marketParams.config.loanToken,
            collateralToken: marketParams.config.collateralToken,
            oracle: marketParams.config.oracle,
            irm: marketParams.config.irm,
            lltv: marketParams.config.lltv,
          },
          assets,
          0n, // shares = 0, use assets
          address,
          address
        ],
      });
      
      return await publicClient.waitForTransactionReceipt({ hash: tx });
    },
    onSuccess: invalidateQueries,
  });

  // 还款
  const repay = useMutation({
    mutationFn: async ({ marketParams, amount, decimals = 18, useShares = false }: {
      marketParams: ExtendedMarketConfig;
      amount: string;
      decimals?: number;
      useShares?: boolean;
    }) => {
      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet not connected');
      }

      const value = parseUnits(amount, decimals);
      
      // 批准代币
      const approveTx = await walletClient.writeContract({
        address: marketParams.config.loanToken,
        abi: erc20Abi,
        functionName: 'approve',
        args: [morphoAddress, value],
      });
      
      await publicClient.waitForTransactionReceipt({ hash: approveTx });
      
      const tx = await walletClient.writeContract({
        address: morphoAddress,
        abi: MORPHO_ABI,
        functionName: 'repay',
        args: [
          {
            loanToken: marketParams.config.loanToken,
            collateralToken: marketParams.config.collateralToken,
            oracle: marketParams.config.oracle,
            irm: marketParams.config.irm,
            lltv: marketParams.config.lltv,
          },
          useShares ? 0n : value,
          useShares ? value : 0n,
          address,
          '0x'
        ],
      });
      
      return await publicClient.waitForTransactionReceipt({ hash: tx });
    },
    onSuccess: invalidateQueries,
  });

  // 提取抵押品
  const withdrawCollateral = useMutation({
    mutationFn: async ({ marketParams, amount, decimals = 18 }: {
      marketParams: ExtendedMarketConfig;
      amount: string;
      decimals?: number;
    }) => {
      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet not connected');
      }

      const assets = parseUnits(amount, decimals);
      
      const tx = await walletClient.writeContract({
        address: morphoAddress,
        abi: MORPHO_ABI,
        functionName: 'withdrawCollateral',
        args: [
          {
            loanToken: marketParams.config.loanToken,
            collateralToken: marketParams.config.collateralToken,
            oracle: marketParams.config.oracle,
            irm: marketParams.config.irm,
            lltv: marketParams.config.lltv,
          },
          assets,
          address,
          address
        ],
      });
      
      return await publicClient.waitForTransactionReceipt({ hash: tx });
    },
    onSuccess: invalidateQueries,
  });

  return {
    supplyCollateral,
    borrow,
    repay,
    withdrawCollateral,
  };
}