import { Order } from "@/models/ordersModel";

export function useOrderNavbarVM(orders: Order[]) {
  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Requested', value: 'requested' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Rejected', value: 'rejected' },
  ] as const;

  const getCount = (status: string) =>
    status === 'all' ? orders.length : orders.filter(order => order.status === status).length;

  return { tabs, getCount };
}
