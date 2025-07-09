// viewmodels/ComponentViewModel/layout/useNavLinksVM.ts
'use client';

import { usePathname } from 'next/navigation';
import { BiSolidCategory } from 'react-icons/bi';
import { GoHomeFill } from 'react-icons/go';
import { MdFastfood } from 'react-icons/md';
import { PiShoppingCartSimpleFill } from 'react-icons/pi';
import React from 'react'; 

export interface NavLinkItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
}

export function useNavLinksVM() {
  const pathname = usePathname();

  const links: NavLinkItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: React.createElement(GoHomeFill), isActive: pathname === '/dashboard' },
    { name: 'Orders', href: '/orders', icon: React.createElement(PiShoppingCartSimpleFill), isActive: pathname === '/orders' },
    { name: 'Categories', href: '/categories', icon: React.createElement(BiSolidCategory), isActive: pathname === '/categories' },
    { name: 'Food Items', href: '/foodItem', icon: React.createElement(MdFastfood), isActive: pathname === '/foodItem' },
  ];

  return { links };
}
