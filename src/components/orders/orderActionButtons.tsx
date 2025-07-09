'use client';

import React from 'react';
import { useOrderActionVM } from '@/viewmodels/ComponentViewModel/orders/orderActionButtonsViewModel';
import { Order } from '@/models/ordersModel';

interface OrderActionButtonsProps {
  order: Order;
  onStatusChange: (id: number, newStatus: Order['status']) => void;
  onDelete: (id: number) => void;
}

const OrderActionButtons: React.FC<OrderActionButtonsProps> = (props) => {
  const { order, handleClick } = useOrderActionVM(props);

  switch (order.status) {
    case 'requested':
      return (
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <button
            onClick={(e) => handleClick('rejected', e)}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-xl font-semibold"
          >
            Reject
          </button>
          <button
            onClick={(e) => handleClick('accepted', e)}
            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-xl font-semibold"
          >
            Accept
          </button>
        </div>
      );

    case 'accepted':
      return (
        <button
          onClick={(e) => handleClick('inProgress', e)}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-xl font-semibold"
        >
          Start Preparing
        </button>
      );

    case 'inProgress':
      return (
        <button
          onClick={(e) => handleClick('completed', e)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-xl font-semibold"
        >
          Complete
        </button>
      );

    case 'completed':
      return (
        <button className="bg-green-100 text-green-700 px-3 py-1 rounded-xl font-semibold cursor-default">
          Completed
        </button>
      );

    case 'rejected':
    case 'canceled':
      return (
        <button className="bg-gray-200 text-gray-500 px-3 py-1 rounded-xl font-semibold cursor-default">
          {order.status === 'rejected' ? 'Rejected' : 'Canceled'}
        </button>
      );

    default:
      return null;
  }
};

export default OrderActionButtons;
