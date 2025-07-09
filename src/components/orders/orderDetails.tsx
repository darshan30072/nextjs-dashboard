'use client';

import React from 'react';
import OrderActionButtons from './orderActionButtons';
import { OrderDetailsProps } from '@/models/ordersModel';
import { useOrderDetailsVM } from '@/viewmodels/ComponentViewModel/orders/orderDetailsViewModel';

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onStatusChange, onDelete }) => {
  const { formattedOrder } = useOrderDetailsVM(order);

  if (!formattedOrder) return <div className="text-gray-400">Select an order to view details.</div>;

  return (
    <div className="flex flex-col">
      <h1 className="text-lg sm:text-xl font-semibold pb-3 sm:pb-5">Order Details</h1>

      <div className="bg-white p-4 sm:p-5 border border-gray-300 rounded-xl text-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <div className="flex gap-1 font-semibold">
              Order No -
              <div>{formattedOrder.order_no.slice(-5)}</div>
            </div>
            <div className="text-gray-400 text-sm">{formattedOrder.formattedDate}</div>
          </div>
          <div className='text-right'>
            <div className="font-semibold">{formattedOrder.userId} {formattedOrder.user.name}</div>
            <div className="text-gray-400 text-sm">User since {formattedOrder.user.since}</div>
          </div>
        </div>

        <hr className="border-gray-300 my-2" />
        <p className="text-gray-500 mt-3 mb-4"><strong>📍 {formattedOrder.address}</strong></p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4 text-xs xl:text-sm text-gray-500">
          <p><strong>Estimation Time:</strong> {formattedOrder.estimationTime}</p>
          <p className="lg:text-end"><strong>Payment:</strong> {formattedOrder.payment}</p>
          <p><strong>Distance:</strong> {formattedOrder.distance}</p>
          <p className="lg:text-end"><strong>Status:</strong> {formattedOrder.paymentStatus}</p>
        </div>

        <div className="border-t border-gray-300 pt-4 space-y-2">
          {formattedOrder.items.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between">
                <div className='flex gap-1'>
                  <div>{item.order_item_quantity}x</div>
                  <div>{item.item_icon || "🍕"} {item.item_name}</div>
                </div>
                <div className='text-orange-500 font-semibold'>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(item.order_item_price)}
                </div>
              </div>

              <div className="flex justify-between text-gray-500 mt-3">
                <p>Discount</p>
                <p className="text-green-500">-${formattedOrder.discountAmount}</p>
              </div>

              <div className="flex justify-between text-gray-500 mt-3">
                <p>GST</p>
                <p>{formattedOrder.tax}%</p>
              </div>
            </div>
          ))}

          <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
            <p className="text-gray-500">Total</p>
            <p className="text-orange-500">${formattedOrder.totalAmount}</p>
          </div>
        </div>

        <div className="mt-6 text-lg">
          <OrderActionButtons
            order={formattedOrder}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
