'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiSolidCategory } from 'react-icons/bi';
import { GoHomeFill } from 'react-icons/go';
import { MdFastfood } from 'react-icons/md';
import { PiShoppingCartSimpleFill } from 'react-icons/pi';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: <GoHomeFill /> },
  { name: 'Orders', href: '/orders', icon: <PiShoppingCartSimpleFill /> },
  { name: 'Categories', href: '/categories', icon: <BiSolidCategory /> },
  { name: 'Food Items', href: '/foodItem', icon: <MdFastfood /> },
];

export default function NavLinks({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {links.map(({ name, href, icon }) => {
        const isActive = pathname === href;

        return (
          <li key={name}>
            <Link
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors duration-200 
                ${isActive ? 'bg-orange-100 text-orange-500' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <div className={`text-xl transition-all duration-200 ${collapsed ? 'mx-auto' : ''}`}>
                {icon}
              </div>
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 
                ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
              >
                {name}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
