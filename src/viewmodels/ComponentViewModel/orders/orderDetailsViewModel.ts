'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Order } from '@/models/ordersModel';

export function useOrderDetailsVM(order: Order | null) {
  const formattedOrder = useMemo(() => {
    if (!order) return null;

    return {
      ...order,
      formattedDate: format(new Date(order.date), "MMM dd, yyyy | hh:mm a"),
      totalAmount: order.amount.toFixed(2),
      discountAmount: order.discount.toFixed(2),
    };
  }, [order]);

  return {
    formattedOrder,
  };
}
