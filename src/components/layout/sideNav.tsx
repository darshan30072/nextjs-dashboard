'use client';

import Image from 'next/image';
import NavLinks from './navLinks';
import { FiLogOut } from 'react-icons/fi';
import { useSideNavVM } from '@/viewmodels/ComponentViewModel/layout/sideNavViewModel';
import { GrFormPrevious } from 'react-icons/gr';

export default function SideNav({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  const { handleLogout, toggleCollapse } = useSideNavVM(setCollapsed, collapsed);

  return (
    <div
      className={`group flex h-full flex-col bg-white shadow-2xl overflow-hidden transition-[width] ease-in-out
    ${collapsed ? 'w-16 duration-0 group-hover:w-56 group-hover:duration-300' : 'w-56 duration-300'}`}
    >

      {/* Top Logo & Toggle */}
      <div
        className={`bg-orange-500 flex items-center min-h-16 px-3 transition-all duration-300 ease-in-out
          ${collapsed ? 'justify-center group-hover:justify-between' : 'justify-between'}`}
      >
        {/* Logo - only when expanded or hovered */}
        <div
          className={`transition-all ease-in-out overflow-hidden
            ${collapsed
              ? 'opacity-0 w-0 duration-0 group-hover:opacity-100 group-hover:w-auto group-hover:duration-500'
              : 'opacity-100 w-auto duration-500'}`}
        >
          <Image src="/icons/Res_logo.png" alt="F O P" width={100} height={100} className="rounded"/>
        </div>

        {/* Toggle Button Container */}
        <div className="relative w-9 h-9 flex items-center justify-center">
          {/* Mini Logo (only in collapsed mode) */}
          {collapsed && (
            <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              <Image
                src="/icons/Res_logo_1.jpg"
                alt="Mini Logo"
                width={35}
                height={35}
                className="object-contain rounded"
              />
            </div>
          )}

          {/* Toggle Button (opacity based on collapse + hover) */}
          <button
            onClick={toggleCollapse}
            className={`absolute inset-0 flex items-center justify-center w-9 h-9 p-1 rounded-full hover:bg-orange-400 transition-opacity ease-in-out
              ${collapsed
                ? 'opacity-0 duration-0 group-hover:opacity-100 group-hover:duration-300'
                : 'opacity-100 duration-300'}`}
          >
            <GrFormPrevious
              className={`text-3xl text-white transform transition-transform duration-500
                ${collapsed ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
        </div>
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
          className="group flex items-center gap-2 font-semibold text-red-500 hover:text-red-600 hover:bg-gray-100 hover:shadow px-4 py-2 rounded-lg transition-all duration-300 ease-in-out w-full justify-center cursor-pointer"
        >
          <div className="text-xl transition-all duration-300">
            <FiLogOut />
          </div>
          <span
            className={`transition-all transform duration-300 ease-in-out whitespace-nowrap overflow-hidden
              ${collapsed ? 'opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0' : 'opacity-100 translate-x-0'}`}
          >
            Log Out
          </span>
        </button>
      </div>
    </div>
  );
}
