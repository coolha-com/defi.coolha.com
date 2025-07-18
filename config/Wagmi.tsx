'use client'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmi_config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: 'offlineFirst',
    },
  },
})

export function Wagmi({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>

                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}