'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, useMemo } from 'react';

function formatRouteTitle(path: string) {
  const segments = path.split('/').filter(Boolean);
  if (segments[0] === 'foodItem') return 'Food Items';
  const last = segments[segments.length - 1] || 'Unknown';
  return last.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function useAdminLayoutVM() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const pageTitle = useMemo(() => formatRouteTitle(pathname), [pathname]);

  const goToNotifications = useCallback(() => {
    router.push('/notification');
  }, [router]);

  const goToProfile = useCallback(() => {
    router.push('/profile');
  }, [router]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setCollapsed(prev => {
        const newCollapsed = width >= 1024 && width < 1280;
        return prev === newCollapsed ? prev : newCollapsed;  // Only update if changed
      });
    };

    handleResize(); // run once
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    sidebarOpen,
    setSidebarOpen,
    collapsed,
    setCollapsed,
    pageTitle,
    goToNotifications,
    goToProfile,
  };
}
