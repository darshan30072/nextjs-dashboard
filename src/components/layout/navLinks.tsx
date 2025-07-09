'use client';

import Link from 'next/link';
import { useNavLinksVM } from '@/viewmodels/ComponentViewModel/layout/navLinkViewModel';

export default function NavLinks({ collapsed }: { collapsed: boolean }) {
  const { links } = useNavLinksVM();

  return (
    <ul className="space-y-1">
      {links.map(({ name, href, icon, isActive }) => (
        <li key={name}>
          <Link
            href={href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors duration-200 
              ${isActive ? 'bg-orange-100 text-orange-500 shadow' : 'text-gray-700 hover:bg-gray-100 hover:shadow'}`}
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
      ))}
    </ul>
  );
}
