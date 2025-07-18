
import { http, createConfig, injected, createStorage, cookieStorage } from 'wagmi'
import { mainnet, polygon, base, unichain, optimism /* baseSepolia */ } from 'wagmi/chains'

import { coinbaseWallet } from 'wagmi/connectors'

const rpcConfig = {
    timeout: 8000,
    retryCount: 2,
    retryDelay: 1000,
};

export const config = createConfig({
    chains: [mainnet, polygon, base, unichain, optimism /* baseSepolia */],
    transports: {
        [mainnet.id]: http('https://eth-mainnet.public.blastapi.io', rpcConfig),
        [polygon.id]: http('https://polygon-rpc.com', rpcConfig),
        [base.id]: http('https://base-rpc.publicnode.com', rpcConfig),
        [unichain.id]: http('https://sepolia.unichain.org', rpcConfig),
        [optimism.id]: http('https://mainnet.optimism.io', rpcConfig),
        /* [baseSepolia.id]: http(`https://sepolia.base.org`), */
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

