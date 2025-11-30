"use client";

import React, { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner";


export default function Providers({ children }: { children: React.ReactNode }) {

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnMount: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );



  useEffect(() => {
    return () => {
      queryClient.cancelQueries();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      
        <main>
          <Toaster position="top-right" />
          {children}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </main>
    </QueryClientProvider>
  );
}