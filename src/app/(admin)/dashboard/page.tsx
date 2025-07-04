'use client';

import Loader from "@/components/loader";
import OrderList from "@/components/orders/orderList";
import { useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { PiForkKnifeFill } from "react-icons/pi";
import { getOrders } from "@/action/orders/getOrders";
import { Order, OrderItem } from "@/interface/orderTypes";

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

export default function DashboardPage() {
  const [statsLoading, setStatsLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);

  const stats = [
    { icon: <FaCartShopping />, label: "Running Orders", value: "55" },
    { icon: <PiForkKnifeFill />, label: "Requested Orders", value: "15" },
  ];

  useEffect(() => {
    const fetchPendingOrders = async () => {
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
          address: "Elm Street, 23",
          estimationTime: "10 Min",
          distance: "2.5 Km",
          payment: "E-Wallet",
          paymentStatus: "Completed",
          user: {
            name: "Ruby Roben",
            since: "2020",
          },
          items: (item.items || []).map((itm) => ({
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

        // Only pending orders
        const pending = transformedOrders.filter(order => order.status === 'pending');
        setPendingOrders(pending);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchPendingOrders();
  }, []);

  return (

    <div className="p-4 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
      {statsLoading ? (
        <div className="flex justify-center items-center min-h-[80vh] font-semibold">
          <Loader message="Loading Stats..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center bg-white rounded-xl shadow font-bold border border-gray-200 p-4 sm:p-6"
            >
              <div className="bg-orange-100 rounded-full px-3 py-3 me-3">
                <span className="items-center text-orange-500 text-2xl font-bold">
                  {stat.icon}
                </span>
              </div>
              <div>
                <h1 className="text-gray-500 text-sm sm:text-base">{stat.label}</h1>
                <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}

        </div>
      )}
      <div className="bg-white rounded-xl shadow font-bold border border-gray-200 p-4 sm:p-6">
        <h1 className="text-lg sm:text-xl font-semibold py-1.5 sm:pb-5">Pending Orders</h1>
        <div className="max-h-[72vh] overflow-y-auto mt-4 sm:mt-5 [&::-webkit-scrollbar]:hidden scrollbar-hide">
          <OrderList
            orders={pendingOrders}
            fullOrders={pendingOrders}
            onSelect={() => { }}
            onStatusChange={() => { }}
            onDelete={() => { }}
          />
        </div>
      </div>
    </div>


  );
}
