import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { useLocation } from "wouter";

type Props = {
  children: ReactNode;
};

function Provider({ children }: Props) {
  const [, setLocation] = useLocation();

  const [queryClient] = useState(() => new QueryClient());

  queryClient.setDefaultOptions({
    queries: {
      retry(count, error) {
        if ("status" in error && error.status === 401) {
          return false;
        }
        return count === 0;
      },
    },
  });

  queryClient.getQueryCache().config.onError = (error) => {
    if ("status" in error && error.status === 401) {
      queryClient.cancelQueries();
      setLocation("/sign-in");
    }
  };

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { Provider as QueryClientProvider };
