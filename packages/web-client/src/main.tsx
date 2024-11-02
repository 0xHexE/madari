import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { styletronEngine } from '@/utils/styletron.ts';
import { IntlProvider } from 'react-intl';
import { AppTheme } from '@/utils/theme.ts';
import AddonProviders from '@/features/addon/provider/AddonProviders.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/query-client.ts';
import { Provider as JotaiProvider } from 'jotai';
import AppSkeleton from '@/features/common/components/Loader';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router.tsx';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <IntlProvider locale="en">
        <StyletronProvider value={styletronEngine}>
          <BaseProvider theme={AppTheme} zIndex={20}>
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={<AppSkeleton />}>
                <AddonProviders
                  addons={[
                    'https://v3-cinemeta.strem.io/manifest.json',
                    'https://7a82163c306e-stremio-netflix-catalog-addon.baby-beamup.club/ZG5wLGFtcCxhdHAsaGJtLG5meCxjcnUsaHN0LHplZSxkcGUsY3RzOjppbjoxNzI3MzgyNzI4OTMx/manifest.json',
                  ]}
                >
                  <JotaiProvider>
                    <RouterProvider router={router} />
                  </JotaiProvider>
                </AddonProviders>
              </Suspense>
            </QueryClientProvider>
          </BaseProvider>
        </StyletronProvider>
      </IntlProvider>
    </StrictMode>,
  );
} else {
  console.error("Can't find #root element to render the React application");
}