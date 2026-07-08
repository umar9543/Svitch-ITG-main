/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// i18n
import 'src/locales/i18n';

// ----------------------------------------------------------------------

import PropTypes from 'prop-types';

import { LocalizationProvider } from 'src/locales';

import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';
import { CheckoutProvider } from 'src/sections/checkout/context';
import ClientAuthGuard from './ClientAuthGuard'; // Import your new component

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: 'Svitch',
  description: 'Svitch Demo',
  keywords: 'react,material,application,dashboard,admin,svitch',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon/favicon.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon/favicon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon/favicon.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/favicon/android-chrome-192x192.png' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <ClientAuthGuard>
          <MainLayout>{children}</MainLayout>
        </ClientAuthGuard>
      </body>
    </html>
  );
}

// Define the main layout structure, so it's reusable
function MainLayout({ children }) {
  return (
    <LocalizationProvider>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'light',
          themeDirection: 'ltr',
          themeContrast: 'default',
          themeLayout: 'vertical',
          themeColorPresets: 'blue',
          themeStretch: true,
        }}
      >
        <ThemeProvider>
          <MotionLazy>
            <SnackbarProvider>
              <CheckoutProvider>
                <SettingsDrawer />
                <ProgressBar />
                {children}
              </CheckoutProvider>
            </SnackbarProvider>
          </MotionLazy>
        </ThemeProvider>
      </SettingsProvider>
    </LocalizationProvider>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node,
};

MainLayout.propTypes = {
  children: PropTypes.node,
};
