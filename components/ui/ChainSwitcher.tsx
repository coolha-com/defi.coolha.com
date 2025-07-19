'use client'
import { useAccount, useConfig, useSwitchChain } from 'wagmi'
import { useState, useEffect } from 'react'
import Image from 'next/image'

// 链logo映射
const CHAIN_LOGOS: { [key: number]: string } = {
  1: '/chains/eth.png', // Ethereum
  8453: '/chains/base.png', // Base
  137: '/chains/polygon.png', // Polygon
  130: '/chains/unichain1.png', // Unichain
}

export default function ChainSwitcher() {
  const config = useConfig()
  const { chains, switchChain } = useSwitchChain()
  const { chainId } = useAccount()
  
  // React状态管理当前选中的链ID
  const [selectedChainId, setSelectedChainId] = useState<number>(chainId || chains[0]?.id)
  
  // 监听chainId变化，同步更新selectedChainId
  useEffect(() => {
    if (chainId) {
      setSelectedChainId(chainId)
    }
  }, [chainId])

  return (
    <div className="dropdown dropdown-end">

      
        <div tabIndex={0} role="button" className="btn btn-soft  btn-circle">
          <Image
            src={CHAIN_LOGOS[selectedChainId] || '/chains/default.svg'}
            alt="Current Chain"
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 gap-1 shadow">
        {chains.map(chain => (
          <li key={chain.id}>
            <button
              type="button"
              className={`justify-between ${selectedChainId === chain.id ? 'bg-primary font-bold text-black' : ''}`}
              disabled={chainId === chain.id}
              onClick={() => {
                setSelectedChainId(chain.id)
                switchChain({ chainId: chain.id })
              }}
            >
              <span className="flex items-center gap-2">
                <Image
                  src={CHAIN_LOGOS[chain.id] || '/chains/default.svg'}
                  alt={chain.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                {chain.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}