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
            className={`group flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors duration-200 
              ${isActive ? 'bg-orange-100 text-orange-500 shadow' : 'text-gray-700 hover:bg-gray-100 hover:shadow'}
            `}
          >
            {/* Icon: centers when collapsed, moves left on hover */}
            <div
              className={`text-xl transition-all duration-100 ease-in-out`}
            >
              {icon}
            </div>

            {/* Text: fades + slides in on hover when collapsed */}
            <span
              className={`transition-all transform duration-300 ease-in-out whitespace-nowrap overflow-hidden
                ${collapsed ? 'opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0' : 'opacity-100 translate-x-0'}`}
            >
              {name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
