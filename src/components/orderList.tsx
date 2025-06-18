"use client";

import { Order } from "@/interface/orderTypes";
import { format } from "date-fns";
import React from "react";
import OrderActionButtons from "./orderActionButtons";

interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
  onStatusChange: (id: number, newStatus: Order['status']) => void;
}

const OrderList: React.FC<Props> = ({ orders, onSelect, onStatusChange }) => {
  return (
    <div className="text-md space-y-4 mb-7">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onSelect(order)}
          className="p-4 sm:p-5 rounded-xl flex flex-col cursor-pointer bg-gray-50 hover:bg-gray-100 shadow-md text-gray-700"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
            <div className="text-lg font-semibold">Order No. - {order.id}</div>
            <div className="text-gray-400 font-semibold sm:text-end">
              {format(new Date(order.date), "hh:mm a")}
            </div>
            <div className="flex gap-2">
              {order.user.name}
              <div className="text-orange-600">
                ({order.status})
              </div>
            </div>
            <div className="text-lg font-bold text-orange-500 sm:text-end">
              ${order.amount}
            </div>
          </div>

          <hr className="my-3 border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
            <div>
              {order.items.map((item, idx) => (
                <div key={idx}>
                  {item.order_item_quantity}x {item.order_item_portion} {item.item_name} {item.item_icon}
                </div>
              ))}
            </div>
            <div className="flex justify-start sm:justify-end items-center gap-2 text-sm">
              <OrderActionButtons order={order} onStatusChange={onStatusChange} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
