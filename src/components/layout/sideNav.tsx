'use client';

import Image from 'next/image';
import NavLinks from './navLinks';
import { FiLogOut } from 'react-icons/fi';
import { PiCirclesFourDuotone } from 'react-icons/pi';
import { useSideNavVM } from '@/viewmodels/ComponentViewModel/layout/sideNavViewModel';

export default function SideNav({
  collapsed,
  setCollapsed
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  const { handleLogout, toggleCollapse } = useSideNavVM(setCollapsed, collapsed);

  return (
    <div className={`flex h-screen flex-col bg-white border-gray-500 shadow-sm transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
      <div className="bg-orange-500 flex justify-between items-center gap-2 px-3 min-h-16">
        {!collapsed && (
          <div className='text-white text-2xl font-extrabold pl-2'>
            <Image src={"/icons/Res_logo.png"} alt='F O P' width={100} height={100} />
          </div>
        )}
        <button onClick={toggleCollapse} className="pl-1.5 group rounded-full p-1 transition-colors duration-300 hover:bg-orange-400">
          <PiCirclesFourDuotone className='text-3xl text-white transform transition-transform duration-700 group-hover:rotate-180' />
        </button>
      </div>

      <div className="flex flex-col flex-grow px-2 py-4">
        <nav className="space-y-2">
          <NavLinks collapsed={collapsed} />
        </nav>
      </div>

      <div className="flex justify-center px-2 py-3 border-t border-gray-300">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 font-semibold text-red-500 hover:text-red-600 hover:bg-gray-100 hover:shadow px-4 py-2 rounded-lg transition-colors duration-200 w-full justify-center"
        >
          {!collapsed && <span>Log Out</span>}
          <FiLogOut size={20} />
        </button>
      </div>
    </div>
  );
}
