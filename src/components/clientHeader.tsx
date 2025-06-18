'use client';

import { usePathname } from "next/navigation";

const navMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/orders': 'Orders',
  '/categories': 'Food Categories',
  '/foodItem': 'Food Items',
};

export default function ClientHeader() {
    const pathname = usePathname();
    const title = navMap[pathname] || '';
    return (
        <header className="text-xl font-semibold text-center">
            {title}
        </header>
    );
}