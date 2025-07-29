'use client';

import Loader from "@/components/loader";
import dynamic from 'next/dynamic';
import { useDashboardVM } from "@/viewmodels/MainScreenViewModel/dashboard/DashboardViewModal";

const FaCartShopping = dynamic(() => import('react-icons/fa6').then(mod => mod.FaCartShopping), { ssr: false });
const PiForkKnifeFill = dynamic(() => import('react-icons/pi').then(mod => mod.PiForkKnifeFill), { ssr: false });

export default function DashboardPage() {
    const { statsLoading, stats } = useDashboardVM();

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case "cart":
                return <FaCartShopping />;
            case "knife":
                return <PiForkKnifeFill />;
            default:
                return null;
        }
    };

    return (
        <div className="p-4 sm:p-5 overflow-y-auto">
            {statsLoading ? (
                <div className="flex justify-center items-center min-h-[80vh] font-semibold">
                    <Loader message="Loading Stats..." />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="flex items-center bg-white rounded-xl shadow font-bold border border-gray-200 p-4 sm:p-6"
                        >
                            <div className="bg-orange-100 rounded-full px-3 py-3 me-3">
                                <span className="items-center text-orange-500 text-2xl font-bold">
                                    {renderIcon(stat.iconName)}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-gray-500 text-sm sm:text-base">{stat.label}</h1>
                                <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
