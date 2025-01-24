import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
      gcTime: 0
    }
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
       <MantineProvider withGlobalStyles withNormalizeCSS>

    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
    </MantineProvider>


  </StrictMode>,
)
