
import { http, createConfig, injected, createStorage, cookieStorage } from 'wagmi'
import { mainnet, polygon, base, unichain, } from 'wagmi/chains'

import { coinbaseWallet } from 'wagmi/connectors'

const rpcConfig = {
    timeout: 8000,
    retryCount: 2,
    retryDelay: 1000,
};

export const config = createConfig({
    chains: [mainnet, polygon, base, unichain,],
    transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [base.id]: http(),
        [unichain.id]: http()
    },
    connectors: [
        injected(),
        coinbaseWallet({
            appName: 'OnchainKit',
            preference: 'smartWalletOnly',
            version: '4',
        }),
    ],
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
})

