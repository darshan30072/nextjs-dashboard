// /components/OrderDetails.tsx
'use client';

import { Order } from '@/interface/orderTypes';
import React from 'react';
import OrderActionButtons from './orderActionButtons';

interface Props {
  order: Order | null;
  onStatusChange: (id: number, newStatus: Order['status']) => void;
}

const OrderDetails: React.FC<Props> = ({ order, onStatusChange }) => {
  if (!order) return <p className="text-gray-400">Select an order to view details.</p>;

  const totalAmount = order.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="flex flex-col">
      <h1 className="text-lg sm:text-xl font-semibold pb-3 sm:pb-5">Order Details</h1>

      <div className="bg-white p-4 sm:p-5 border border-gray-300 rounded-xl text-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <h1 className="font-semibold">Order No - {order.id}</h1>
            <div className="text-gray-400 text-sm">{order.date}</div>
          </div>
          <div className='text-right'>
            <div className="font-semibold">{order.user.name}</div>
            <div className="text-gray-400 text-sm">User since {order.user.since}</div>
          </div>
        </div>

        <hr className="border-gray-300 my-2" />
        <p className="text-gray-500 mt-3 mb-4"><strong>📍 {order.address}</strong></p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4 text-xs xl:text-sm text-gray-500">
          <p><strong>Estimation Time:</strong> {order.estimationTime}</p>
          <p className="lg:text-end"><strong>Payment:</strong> {order.payment}</p>
          <p><strong>Distance:</strong> {order.distance}</p>
          <p className="lg:text-end"><strong>Status:</strong> {order.paymentStatus}</p>
        </div>

        <div className="border-t border-gray-300 pt-4 space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <div className='flex gap-3'>
                <div>
                  {item.item_icon || "🍕"}
                </div>
                <div>
                  {item.item_name || "3x Large Margherita Pizza"}
                </div>
              </div>
              <div className='text-orange-500 font-semibold'>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(item.price)}
              </div>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
            <p className="text-gray-500">Total</p>
            <p className="text-orange-500">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-6 text-lg">
          <OrderActionButtons order={order} onStatusChange={onStatusChange} />
        </div>

      </div>
    </div>

  );
};

export default OrderDetails;
