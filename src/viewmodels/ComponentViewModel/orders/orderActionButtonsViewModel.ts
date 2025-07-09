'use client';

import { useCallback } from 'react';
import { Order } from '@/models/ordersModel';
import { deleteOrder } from '@/services/ordersService';

interface UseOrderActionVMProps {
  order: Order;
  onStatusChange: (id: number, newStatus: Order['status']) => void;
  onDelete: (id: number) => void;
}

export function useOrderActionVM({ order, onStatusChange, onDelete }: UseOrderActionVMProps) {
  const handleClick = useCallback(
    async (status: Order['status'], e: React.MouseEvent) => {
      e.stopPropagation?.();

      if (status === 'rejected') {
        const confirmed = window.confirm('Are you sure you want to reject and delete this order?');
        if (!confirmed) return;

        try {
          const response = await deleteOrder(order.id); 
          if (response) {
            onDelete(order.id);
          } else {
            alert('Failed to delete the order. Try again.');
          }
        } catch (err) {
          alert('Error deleting the order.');
          console.error(err);
        }
      } else {
        try {
          await onStatusChange(order.id, status);
        } catch (err) {
          alert('Failed to update status.');
          console.error(err);
        }
      }
    },
    [order, onStatusChange, onDelete]
  );

  return { order, handleClick };
}
