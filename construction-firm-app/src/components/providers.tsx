'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'
import { useState } from 'react'
import { httpBatchLink } from '@trpc/client'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
