'use client';

import { useRouter } from 'next/navigation';
import { removeCookie } from '@/constant/cookie';

export function useSideNavVM() {
  const router = useRouter();

  const handleLogout = () => {
    removeCookie('token');
    router.replace('/login');
  };

  return {
    handleLogout,
  };
}
