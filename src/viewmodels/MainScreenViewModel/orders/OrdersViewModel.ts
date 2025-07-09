'use client';

import { useEffect, useState } from 'react';
import { Order, OrderStatus, RawOrder } from '@/models/ordersModel';
import { getOrders, updateStatusOrders, deleteOrder } from '@/services/ordersService';

const statusMap: Record<number, Order['status']> = {
  1: 'requested',
  2: 'accepted',
  3: 'inProgress',
  4: 'completed',
  5: 'rejected',
  6: 'canceled',
};

export default function useOrdersVM() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders();
        const transformed: Order[] = (data as RawOrder[]).map(item => ({
          id: item.id_int,
          order_no: item.order_no,
          userId: Number(item.user_id_int),
          date: item.created_at,
          amount: item.order_amount,
          discount: item.order_discount ?? 0,
          tax: item.order_tax,
          netPrice: item.order_net_price,
          status: statusMap[item.order_status_id_int ?? 1] || 'requested',
          address: "Elm Street, 23",
          estimationTime: "10 Min",
          distance: "2.5 Km",
          payment: "E-Wallet",
          paymentStatus: "Completed",
          user: {
            name: "Ruby Roben",
            since: "2020",
          },
          items: (item.items || []).map(itm => ({
            ...itm,
            item_id_int: Number(itm.item_id_int),
            order_item_price: Number(itm.order_item_price) || 999,
            order_item_quantity: Number(itm.order_item_quantity) || 0,
            order_item_portion: itm.order_item_portion,
            order_comment: itm.order_comment,
            item_name: "Margherita Pizza",
            item_icon: "🍕",
          }))
        }));

        setOrders(transformed);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    activeTab === 'all' ? true : order.status === activeTab
  );


  const handleStatusChange = async (id: number, newStatus?: Order['status']) => {
    if (newStatus) await updateStatusOrders(id, newStatus);

    setOrders(prev =>
      newStatus
        ? prev.map(order => (order.id === id ? { ...order, status: newStatus } : order))
        : prev.filter(order => order.id !== id)
    );

    setSelectedOrder(prev =>
      prev && prev.id === id
        ? newStatus
          ? { ...prev, status: newStatus }
          : null
        : prev
    );
  };

  const handleDeleteOrder = async (id: number) => {
    await deleteOrder(id);
    setOrders(prev => prev.filter(order => order.id !== id));
    setSelectedOrder(prev => (prev?.id === id ? null : prev));
  };

  return {
    orders,
    filteredOrders,
    selectedOrder,
    activeTab,
    setActiveTab,
    setSelectedOrder,
    handleStatusChange,
    handleDeleteOrder,
  };
}
