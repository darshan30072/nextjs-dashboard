'use client';

import React from 'react';
import { useOrderNavbarVM } from '@/viewmodels/ComponentViewModel/orders/orderNavbarViewModel';
import { OrderNavbarProps } from '@/models/ordersModel';

const OrderNavbar: React.FC<OrderNavbarProps> = ({ activeTab, onTabChange, orders }) => {
  const { tabs, getCount } = useOrderNavbarVM(orders);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-6 gap-1 mb-6 bg-gray-100 p-2 rounded-xl">
      {tabs.map(tab => {
        const count = getCount(tab.value);
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)} // ✅ Pass tab.value (string)
            className={`px-3 py-2 text-xs lg:text-sm rounded-lg transition-all font-medium ${
              activeTab === tab.value
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-orange-100'
            }`}
          >
            {tab.label}
            {tab.value !== 'all' && count > 0 && <> ({count})</>}
          </button>
        );
      })}
    </div>
  );
};

export default OrderNavbar;
