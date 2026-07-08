'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from 'src/auth/context/jwt';

export default function ClientAuthGuard({ children }) {
  const pathname = usePathname();

  // Pages that do not require authentication
  const noAuthPages = ['/about', '/contact'];

  // Regex pattern to match dynamic routes like '/SupplierOnboard/[slug]'
  const dynamicNoAuthRoutes = /^\/SupplierOnboard\/.+$/;

  // Determine if authentication is required
  const isAuthRequired = !noAuthPages.includes(pathname) && !dynamicNoAuthRoutes.test(pathname);

  if (isAuthRequired) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  // If no authentication is required, just render the children without AuthProvider
  return <>{children}</>;
}
