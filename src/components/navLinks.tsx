'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiSolidCategory } from 'react-icons/bi';
import { GoHomeFill } from 'react-icons/go';
import { MdFastfood } from 'react-icons/md';
import { PiShoppingCartSimpleFill } from 'react-icons/pi';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: <GoHomeFill /> },
  { name: 'Orders', href: '/orders', icon: <PiShoppingCartSimpleFill  /> },
  { name: 'Categories', href: '/categories', icon: <BiSolidCategory  /> },
  { name: 'Food Items', href: '/foodItem', icon: <MdFastfood  /> },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ name, href, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={name}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${isActive
              ? 'bg-orange-100 text-orange-500'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <div className='text-lg'>
              {icon}
            </div>
            {name}
          </Link>
        );
      })}
    </>
  );
}
