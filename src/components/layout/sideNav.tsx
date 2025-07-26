// SideNav.tsx
'use client';

import Image from 'next/image';
import NavLinks from './navLinks';
import { FiLogOut } from 'react-icons/fi';
import { useSideNavVM } from '@/viewmodels/ComponentViewModel/layout/sideNavViewModel';
import { GrFormPrevious } from 'react-icons/gr';

export default function SideNav({
  collapsed, 
  setCollapsed,
  setSidebarOpen,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  setSidebarOpen: (value: boolean) => void;
}) {
  const { handleLogout } = useSideNavVM();
   
  return (
    <div
      className={`group flex h-full flex-col bg-white shadow-xl overflow-hidden transition-[all] ease-in-out
        ${collapsed ? 'w-16 duration-0 group-hover:w-56 group-hover:duration-300' : 'w-56 duration-300'}`}
    >
      {/* Top Logo & Collapse Button */}
      <div
        className={`relative bg-orange-500 min-h-16 px-3 transition-all duration-300 ease-in-out flex items-center ${collapsed ? 'justify-between' : 'justify-between'
          }`}
      >
        {/* Mini Logo – Centered When Collapsed */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:opacity-0 group-hover:scale-50
            ${collapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} 
          `}
        >
          <Image
            src="/icons/Res_logo_1.jpg"
            alt="Mini Logo"
            width={40}
            height={40}
            className="object-contain rounded transition-all duration-300"
          />
        </div>

        {/* Full Logo */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden 
            ${collapsed ? 'opacity-0 w-0 scale-75 group-hover:opacity-100 group-hover:w-auto group-hover:scale-100' : 'opacity-100 w-auto scale-100'}
          `}
        >
          <Image
            src="/icons/Res_logo.png"
            alt="F O P"
            width={100}
            height={100}
            className="rounded transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Collapse Button */}
        <div
          className={`ml-2 hidden lg:flex transition-all duration-300 ease-in-out ${collapsed ? 'opacity-0 group-hover:opacity-100 group-hover:ml-2' : 'opacity-100'
            }`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white text-3xl rounded-full hover:bg-orange-400 transition-all"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <GrFormPrevious
              className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden ml-auto text-white text-3xl rounded-full hover:bg-orange-400"
        >
          <GrFormPrevious />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col flex-grow px-2 py-4">
        <nav className="space-y-2">
          <NavLinks collapsed={collapsed} />
        </nav>
      </div>

      {/* Logout Button */}
      <div className="flex justify-center px-2 py-3 border-t border-gray-300">
        <button
          onClick={handleLogout}
          className="group flex items-center w-full justify-center font-semibold text-red-500 hover:text-red-600 hover:bg-gray-100 hover:shadow px-4 py-2 rounded-lg transition-all duration-300 ease-in-out cursor-pointer"
        >
          <div className="text-xl transition-all duration-300">
            <FiLogOut />
          </div>
          <span
            className={`transition-all transform duration-300 ease-in-out whitespace-nowrap overflow-hidden
              ${collapsed ? 'opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 group-hover:pl-3' : 'pl-3 opacity-100 translate-x-0'}`}
          >
            Log Out
          </span>
        </button>
      </div>
    </div>
  );
}
