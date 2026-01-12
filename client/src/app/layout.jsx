'use client';

import * as React from 'react';
import { Provider } from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '@/styles/global.css';
import {store} from '@/redux/store';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SnackbarProvider } from '@/redux/store/SnackbarProvider';

// export const viewport = { width: 'device-width', initialScale: 1 }; 

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthWrapper>
            <LocalizationProvider>
              <ThemeProvider>
                <SnackbarProvider>
                {children}
                 <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light" // or "dark"
                  />
                </SnackbarProvider>
                </ThemeProvider>
            </LocalizationProvider>
          </AuthWrapper>
        </Provider>
      </body>
    </html>
  );
}
