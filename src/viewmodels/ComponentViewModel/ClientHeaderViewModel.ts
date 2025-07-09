'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const navMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/orders': 'Orders',
  '/categories': 'Food Categories',
  '/foodItem': 'Food Items',
};

export function useClientHeaderVM() {
  const pathname = usePathname();

  const title = useMemo(() => {
    return navMap[pathname] || '';
  }, [pathname]);

  return { title };
}
