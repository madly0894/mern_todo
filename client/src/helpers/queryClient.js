import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         retry: false,
         retryOnMount: false,
         refetchOnMount: false,
         refetchOnWindowFocus: false,
         refetchOnReconnect: false,
      },
   },
});

export default queryClient;
