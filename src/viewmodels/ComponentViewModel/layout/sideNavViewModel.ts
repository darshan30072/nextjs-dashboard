'use client';

import { useRouter } from 'next/navigation';
import { removeCookie } from '@/constant/cookie';

export function useSideNavVM(setCollapsed: (value: boolean) => void, collapsed: boolean) {
  const router = useRouter();

  const handleLogout = () => {
    removeCookie('token');
    router.replace('/login');
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return {
    handleLogout,
    toggleCollapse,
  };
}
