'use client';

import SideNav from '@/components/layout/sideNav';
import { useAdminLayoutVM } from '@/viewmodels/MainScreenViewModel/adminLayoutViewModel';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const {
        sidebarOpen,
        setSidebarOpen,
        collapsed,
        setCollapsed,
        pageTitle,
        goToNotifications,
        goToProfile,
    } = useAdminLayoutVM();

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div
                className={`fixed z-30 inset-y-0 left-0 bg-white shadow-lg transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'w-16' : 'w-56'}`}
            >
                <SideNav collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/10 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100 [&::-webkit-scrollbar]:hidden scrollbar-hide">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between h-16 p-6 bg-white shadow">
                    <button
                        className="lg:hidden text-gray-700 text-2xl"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <FaBars />
                    </button>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold capitalize text-shadow-xs">
                        {pageTitle}
                    </h1>
                    <div className="flex items-center gap-5">
                        <button
                            className="flex items-center text-gray-700 text-2xl"
                            onClick={goToNotifications}
                        >
                            <MdNotifications />
                        </button>
                        <button
                            className="flex justify-between items-center gap-1 text-gray-700 font-bold"
                            onClick={goToProfile}
                        >
                            Admin User <FaUserCircle className="text-2xl" />
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                {children}
            </div>
        </div>
    );
}
