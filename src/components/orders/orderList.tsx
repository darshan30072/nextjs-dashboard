'use client';

import React from "react";
import { format } from "date-fns";
import OrderActionButtons from "./orderActionButtons";
import { MdOutlineClear } from "react-icons/md";
import { OrderListProps } from "@/models/ordersModel";
import { useOrderListVM } from "@/viewmodels/ComponentViewModel/orders/orderListViewModel";

const OrderList: React.FC<OrderListProps> = ({ orders, onSelect, onStatusChange, onDelete }) => {
  const {
    filterDate,
    handleDateChange,
    clearFilter,
    filteredOrders,
    activeOrdersCount,
  } = useOrderListVM(orders);

  return (
    <div className="text-md space-y-4 mb-5">
      <div className="flex justify-between items-center">
        <div className="text-gray-400 font-normal">
          Total {activeOrdersCount} items
        </div>
        <div className="flex items-center gap-1 text-gray-700">
          <div className="relative">
            <input
              type="date"
              value={filterDate || ''}
              onChange={(e) => handleDateChange(e.target.value)}
              className="appearance-none border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-700 w-[120px] peer"
            />
            {!filterDate && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 bg-white text-sm pr-3 pointer-events-none peer-focus:hidden">
                Select date
              </span>
            )}
          </div>

          <button
            onClick={clearFilter}
            className={`underline ${filterDate ? 'text-xl font-black text-red-500 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
          >
            <MdOutlineClear />
          </button>
        </div>
      </div>

      {filteredOrders.map((order) => (
        <div
          key={order.id}
          onClick={() => onSelect(order)}
          className="p-4 sm:p-5 rounded-xl flex flex-col bg-gray-50 border border-gray-100 hover:bg-gray-100 shadow-md text-gray-700"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
            <div className="flex gap-1 font-semibold">
              Order No - <div>{order.order_no.slice(-5)}</div>
            </div>
            <div className="text-gray-400 font-semibold sm:text-end">
              {format(new Date(order.date), "hh:mm a")}
            </div>
            <div className="flex gap-2">
              <div>{order.user.name}</div>
              <div className="text-orange-600">({order.status})</div>
            </div>
            <div className="text-lg font-bold text-orange-500 sm:text-end">
              ${order.amount.toFixed(2)}
            </div>
          </div>

          <hr className="my-3 border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
            <div>
              {/* <button
                onClick={() => onSelect(order)}
                className="bg-orange-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-orange-600 cursor-pointer"
              >
                View Details
              </button> */}
            </div>
            <div className="flex justify-start sm:justify-end items-center gap-2 text-sm">
              <OrderActionButtons
                order={order}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            </div>
          </div>
        </div>
      ))}

      {filteredOrders.length === 0 && (
        <p className="text-gray-400 text-center">No orders found for this date.</p>
      )}
    </div>
  );
};

export default OrderList;
