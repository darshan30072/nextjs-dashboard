'use client';

import { useEffect, useState } from 'react';
import { Order, OrderItem } from '../../../interface/orderTypes';

import OrderNavbar from '@/components/orders/orderNavber';
import { getOrders } from '@/action/orders/getOrders';
import OrderList from '@/components/orders/orderList';
import OrderDetails from '@/components/orders/orderDetails';

interface RawOrder {
  id_int: number;
  order_no: string;
  user_id_int: string;
  order_amount: number;
  order_discount: number;
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

        const transformedOrders: Order[] = (data as RawOrder[]).map((item) => ({
          id: item.id_int,
          order_no: item.order_no, 
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
            item_id_int: Number(itm.item_id_int),
            order_item_price: Number(itm.order_item_price) || 999,
            order_item_quantity: Number(itm.order_item_quantity) || 0,
            order_item_portion: itm.order_item_portion,
            order_comment: itm.order_comment,

            item_name: "Margherita Pizza", // placeholder
            item_icon: "🍕", // optional placeholder
          }))
        }));

        setOrders(transformedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus?: Order['status']) => {
    setOrders((prevOrders) =>
      newStatus
        ? prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
        : prevOrders.filter((order) => order.id !== id) // if newStatus is undefined, remove the order
    );

    setSelectedOrder((prev) =>
      prev && prev.id === id
        ? newStatus
          ? { ...prev, status: newStatus }
          : null
        : prev
    );
  };

  const handleDeleteOrder = (id: number) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    setSelectedOrder((prev) => (prev?.id === id ? null : prev));
  };

  return (
    <div className="p-4 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6">
        {/* Order List */}
        <div className="xl:col-span-6 bg-white rounded-xl shadow font-bold border border-gray-200 p-4 sm:p-6">
          <h1 className="items-center text-lg sm:text-xl font-semibold py-1.5 sm:pb-5">Orders List</h1>
          <OrderNavbar activeTab={activeTab} onTabChange={setActiveTab} orders={orders}/>
          <div className="max-h-[72vh] overflow-y-auto mt-4 sm:mt-5 [&::-webkit-scrollbar]:hidden scrollbar-hide">
            <OrderList orders={filteredOrders} fullOrders={orders} onSelect={setSelectedOrder} onStatusChange={handleStatusChange} onDelete={handleDeleteOrder}
            />
          </div>
        </div>

        {/* Order Details */}
        <div className="xl:col-span-6 bg-white rounded-xl shadow font-bold border border-gray-200 p-4 sm:p-6">
          <OrderDetails order={selectedOrder} onStatusChange={handleStatusChange} onDelete={handleDeleteOrder} />
        </div>
      </div>
    </div>
  );
}
