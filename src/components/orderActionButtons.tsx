'use client';

import React from "react";
import { Order } from "@/interface/orderTypes";

interface Props {
  order: Order;
  onStatusChange: (id: number, newStatus: Order['status']) => void;
}

const OrderActionButtons: React.FC<Props> = ({ order, onStatusChange }) => {
  const handleClick = (status: Order['status'], e: React.MouseEvent) => {
    e.stopPropagation?.();
    onStatusChange(order.id, status);
  };

  switch (order.status) {
    case "requested":
      return (
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <button
            onClick={(e) => handleClick("rejected", e)}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-xl font-semibold"
          >
            Reject
          </button>
          <button
            onClick={(e) => handleClick("pending", e)}
            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-xl font-semibold"
          >
            Accept
          </button>
        </div>
      );

    case "pending":
      return (
        <button
          onClick={(e) => handleClick("preparing", e)}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-xl font-semibold"
        >
          Prepare
        </button>
      );

    case "preparing":
      return (
        <button
          onClick={(e) => handleClick("completed", e)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-xl font-semibold"
        >
          Complete
        </button>
      );

    case "completed":
      return (
        <button className="bg-green-100 text-green-700 px-3 py-1 rounded-xl font-semibold">
          Completed
        </button>
      );

    default:
      return null;
  }
};

export default OrderActionButtons;
