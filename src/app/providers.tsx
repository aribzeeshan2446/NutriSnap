'use client';

import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState, useEffect } from 'react';

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = React.useState(() => new QueryClient());
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after initial mount
    setShowDevtools(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
