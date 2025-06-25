import React from 'react';

interface OrderNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const OrderNavbar: React.FC<OrderNavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = ['All', 'Requested', 'Pending', 'Preparing', 'Completed'];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1  mb-6 bg-gray-100 p-2 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-3 py-2 sm:px-1 sm:py-1 text-xs lg:text-sm rounded-lg transition-all duration-200 font-medium ${activeTab === tab
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-orange-100'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default OrderNavbar;
