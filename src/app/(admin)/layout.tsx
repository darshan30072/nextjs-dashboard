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
                className={`group fixed z-30 top-0 left-0 h-screen bg-white shadow flex flex-col transition-[all] ease-in-out
                    ${collapsed ? 'w-16 duration-500 group-hover:w-56 group-hover:duration-500' : 'w-56 duration-500'}
                    ${sidebarOpen ? 'block' : 'hidden'} lg:block`}
            >
                <SideNav
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    setSidebarOpen={setSidebarOpen}
                />
            </div>
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/10 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div
                className={`flex-1 flex flex-col overflow-y-auto bg-gray-100 transition-[all] duration-500 ease-in-out
                  ${collapsed ? 'lg:ml-16 duration-500' : 'xl:ml-56 lg:ml-56 duration-500'}`}
            >

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center lg:justify-between h-16 p-6 bg-white shadow">
                    <button
                        className="lg:hidden text-gray-700 text-2xl pr-3"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <FaBars />
                    </button>
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold capitalize text-shadow-xs">
                            {pageTitle}
                        </h1>
                        <div className="flex items-center gap-1">
                            <button
                                className="flex items-center text-gray-700 text-2xl p-1 rounded-full transition-all duration-300 hover:bg-gray-100 hover:shadow cursor-pointer"
                                onClick={goToNotifications}
                            >
                                <MdNotifications />
                            </button>
                            <button
                                className="flex items-center gap-1 text-gray-700 p-1 rounded-full transition-all duration-300 hover:bg-gray-100 hover:shadow cursor-pointer"
                                onClick={goToProfile}
                            >
                                <FaUserCircle className="text-2xl" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                {children}
            </div>
        </div>
    );
}
