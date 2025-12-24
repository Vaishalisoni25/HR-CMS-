'use client';

import * as React from 'react';
import { Provider } from 'react-redux';

import '@/styles/global.css';
import {store} from '@/redux/store';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

// export const viewport = { width: 'device-width', initialScale: 1 }; 

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthWrapper>
            <LocalizationProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </LocalizationProvider>
          </AuthWrapper>
        </Provider>
      </body>
    </html>
  );
}
