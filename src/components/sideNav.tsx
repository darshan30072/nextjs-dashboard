'use client';

import { removeCookie } from '@/constant/cookie';
import NavLinks from './navLinks';
import { FiLogOut } from 'react-icons/fi';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function SideNav() {

  const handleLogout = () => {
    console.log("logout")
    removeCookie('token');
    location.pathname = "/login";
    toast.success("Logout Successfully!");
  }

  return (
    <div className="flex h-screen flex-col bg-white border-gray-500 shadow-sm">
      {/* Top Brand Header */}
      <div className="bg-orange-500 flex items-center justify-center h-16">
        <div>
          <Image src={"/Res_logo.png"} alt='F O P' width={100} height={100} />
        </div>
      </div>
    
      {/* Navigation */}
      <div className="flex flex-col flex-grow px-4 py-6">
        <nav className="space-y-2">
          <NavLinks />
        </nav>
      </div>

      {/* Admin Info + Logout */}
      <div className="flex justify-center items-center py-3 text-red-500 hover:text-red-600 border-t border-gray-300">
        <button onClick={handleLogout} className='flex flex-row gap-3'>
          Log Out
          <div>
            <FiLogOut size={20} />
          </div>
        </button>
      </div>
    </div>
  );
}