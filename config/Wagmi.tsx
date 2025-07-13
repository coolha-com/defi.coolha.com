'use client'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmi_config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Wagmi({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>

                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}