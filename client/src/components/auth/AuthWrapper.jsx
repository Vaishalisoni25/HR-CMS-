'use client';

import * as React from 'react';
import { useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';

export function AuthWrapper({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isAuthenticated && pathname !== '/auth/sign-in') {
      router.replace('/auth/sign-in');
      return;
    }

    if (isAuthenticated && pathname === '/auth/sign-in') {
      router.replace('/dashboard');
      return;
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
