'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * Provides TanStack Query client and devtools to the component tree.
 * @param props - Provider props containing children.
 * @returns The query client provider wrapping children with devtools.
 */
export function QueryProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
