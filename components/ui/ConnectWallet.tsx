'use client'
import { AddressTruncate } from '@/utils/AddressTruncate'
import { FaWallet } from 'react-icons/fa'
import { useAccount, useConnect, useDisconnect, useEnsName, useConfig } from 'wagmi'

export default function ConnectWallet() {
  const config = useConfig()
  const chains = config.chains
  const { isConnected, address, chainId } = useAccount()
  const { connect, connectors, } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address, config })

  if (isConnected) {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-primary">
          {ensName ? ensName : AddressTruncate(address)}
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 gap-1 shadow">
          {chains.map(chain => (
            <li key={chain.id}>
              <button
                type="button"
                className={`justify-between ${chainId === chain.id ? 'bg-primary font-bold text-black' : ''}`}
                disabled={chainId === chain.id}
                onClick={async () => {
                  if (window.ethereum && chainId !== chain.id) {
                    try {
                      await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${chain.id.toString(16)}` }],
                      });
                    } catch (switchError) {
                      // 可选：处理错误
                    }
                  }
                }}
              >
                {chain.name}
              </button>
            </li>
          ))}
          <li>
            <a className='my-4 hover:bg-error'>
              <button type="button" onClick={() => disconnect()}>Disconnect</button>
            </a>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => connect({ connector: connectors[0] || connectors[1], })}
      className='btn btn-primary'
    >
      <FaWallet />
      连接
    </button>
  )
}