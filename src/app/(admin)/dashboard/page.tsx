'use client';

import Loader from "@/components/loader";
import { useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { PiForkKnifeFill } from "react-icons/pi";

export default function DashboardPage() {
  const [statsLoading, setStatsLoading] = useState(true);

  const stats = [
    { icon: <FaCartShopping />, label: "Total Orders", value: "1,205" },
    { icon: <PiForkKnifeFill />, label: "Total Request", value: "05" },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatsLoading(false);
    }); // simulate 0.5 second loading
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      {/* Stats Section */}
      <div className="p-4 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
        {statsLoading ? (
          <div className="flex justify-center items-center h-32">
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
                    {stat.icon}
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
    </div>
  );
}



