'use client'
import { AddressTruncate } from '@/utils/AddressTruncate'
import { FaWallet } from 'react-icons/fa'
import { useAccount, useConnect, useDisconnect, useEnsName, useConfig } from 'wagmi'

export default function ConnectWallet() {
  const config = useConfig()
  const { isConnected, address } = useAccount({config})
  const { connect, connectors, } = useConnect({config})
  const { disconnect } = useDisconnect({config})
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