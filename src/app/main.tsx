import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { RouterProvider } from '@tanstack/react-router';
import './styles/index.css';
import './styles/App.css';
import '@shared/config/i18n';
import { AppPrefetch } from '@app/providers/AppPrefetch';
import { router } from '@app/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const queryPersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'react-tsx-query-cache',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        maxAge: 1000 * 60 * 60 * 24,
        buster: 'react-tsx-cache-v1',
      }}
    >
      <AppPrefetch />
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  </StrictMode>,
);
