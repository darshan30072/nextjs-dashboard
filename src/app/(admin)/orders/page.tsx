'use client';

import { useEffect, useState } from 'react';
import { Order, OrderItem } from '../../../interface/orderTypes';
import OrderList from '@/components/orderList';
import OrderDetails from '@/components/orderDetails';
import OrderNavbar from '@/components/orderNavber';
import { getOrders } from '@/action/orders/getOrders';

interface RawOrder {
  order_discount: number;
  id_int: number;
  user_id_int: string;
  order_amount: number;
  order_tax: number;
  order_net_price: number;
  order_status_id_int: number;
  created_at: string;
  items: OrderItem[];
}

const statusMap: Record<number, Order['status']> = {
  1: 'requested',
  2: 'pending',
  3: 'preparing',
  4: 'completed',
  5: 'rejected',
};  

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('All');

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'All') return true;
    return order.status === activeTab.toLowerCase(); // matches 'requested', 'pending'...
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        console.log('One raw order:', data[0]);

        const transformedOrders: Order[] = (data as RawOrder[]).map((item) => ({
          id: item.id_int,
          userId: Number(item.user_id_int),
          date: item.created_at,
          amount: item.order_amount,
          discount: item.order_discount ?? 0,
          tax: item.order_tax,
          netPrice: item.order_net_price,
          status: statusMap[item.order_status_id_int ?? 1] || 'requested',
          address: "Elm Street, 23", // placeholder
          estimationTime: "10 Min",  // placeholder
          distance: "2.5 Km",        // placeholder
          payment: "E-Wallet",       // placeholder
          paymentStatus: "Completed", // placeholder
          user: {
            name: "Ruby Roben", // placeholder
            since: "2020",      // placeholder
          },
          items: (item.items || []).map((itm) => ({
            ...itm,
            item_name: "Margherita Pizza", // placeholder
            price: itm.order_item_price,
            item_icon: "🍕", // optional placeholder
          }))
        }));

        setOrders(transformedOrders);
        console.log('Fetched orders:', transformedOrders);

      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: Order['status']) => {
    setOrders((prevOrders) =>
      newStatus === 'rejected'
        ? prevOrders.filter((order) => order.id !== id)
        : prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
    );

    // Update selectedOrder if it’s the one being modified
    setSelectedOrder((prev) =>
      prev && prev.id === id
        ? newStatus === 'rejected'
          ? null // Deselect if rejected
          : { ...prev, status: newStatus } // Update status
        : prev
    );
  };

  return (
    <div className="p-4 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6">
        {/* Order List */}
        <div className="xl:col-span-5 bg-white rounded-xl shadow p-4 sm:p-5">
          <div className="text-lg sm:text-xl font-semibold pb-3 sm:pb-5">Orders List</div>
          <OrderNavbar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="max-h-[72vh] overflow-y-auto mt-4 sm:mt-5 [&::-webkit-scrollbar]:hidden scrollbar-hide">
            <OrderList orders={filteredOrders} onSelect={setSelectedOrder} onStatusChange={handleStatusChange} />
          </div>
        </div>

        {/* Order Details */}
        <div className="xl:col-span-7 bg-white rounded-2xl shadow p-4 sm:p-6">
          <OrderDetails order={selectedOrder} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
}
