// viewmodels/ComponentViewModel/orders/useOrderListVM.ts
"use client";

import { useState } from "react";
import { isSameDay, parseISO } from "date-fns";
import { Order } from "@/models/ordersModel";

export function useOrderListVM(orders: Order[]) {
  const [filterDate, setFilterDate] = useState<string | null>(null);

  const activeOrdersCount = orders.filter(order => order.status !== 'completed').length;

  const filteredOrders = filterDate
    ? orders.filter(order => isSameDay(parseISO(order.date), parseISO(filterDate)))
    : orders;

  const handleDateChange = (date: string) => {
    setFilterDate(date || null);
  };

  const clearFilter = () => {
    setFilterDate(null);
  };

  return {
    filterDate,
    handleDateChange,
    clearFilter,
    filteredOrders,
    activeOrdersCount,
  };
}
