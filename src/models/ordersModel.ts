export interface RawOrder {
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

// Represents a single item in an order
export interface OrderItem {
  item_id_int: number;             // Unique ID of the item
  order_item_price: number;        // Price of the item
  order_item_quantity: number;     // Quantity ordered
  order_item_portion: string;      // Portion name/size (e.g., "Regular", "Large")
  order_comment: string;           // Any custom comment (e.g., "No onions")
  item_name: string;
  item_icon: string;                   // Emoji or icon string for visual (optional)
}

// Represents a full order
export interface Order {
  id: number;
  order_no: string;                // Order ID
  userId: number;                  // User ID who placed the order
  date: string;                    // ISO date string when order was placed
  amount: number;                  // Total item amount
  discount: number;         // Discount amount
  tax: number;                     // Tax value
  netPrice: number;                // Final price after tax and discount
  address: string;                 // Delivery address (frontend dummy if not provided by backend)
  estimationTime: string;         // Estimated delivery time (dummy or dynamic)
  distance: string;               // Distance to customer (dummy or dynamic)
  payment: string;                // Payment method (e.g., "E-Wallet")
  paymentStatus: string;          // Payment status (e.g., "Completed")
  status: Exclude<OrderStatus, 'all'>;
  user: {
    name: string;                 // Customer name (dummy for now)
    since: string;               // Year or date the user registered (dummy)
  };

  items: OrderItem[];             // List of items in the order
}

export type OrderStatus =
  | 'requested'
  | 'accepted'
  | 'inProgress'
  | 'completed'
  | 'rejected'
  | 'canceled'
  | 'all';

export interface OrderNavbarProps {
  activeTab: OrderStatus;
  onTabChange: (tab: OrderStatus) => void;
  orders: Order[];
}

export interface OrderActionButtonsProps {
  order: Order;
  onStatusChange: (id: number, newStatus: Order['status']) => void;
  onDelete: (id: number) => void;
}

export interface OrderListProps {
  orders: Order[];
  onSelect: (order: Order) => void;
  onStatusChange: (id: number, newStatus: Order['status']) => void;
  onDelete: (id: number) => void;
}

export interface OrderDetailsProps {
  order: Order | null;
  onStatusChange: (id: number, newStatus: Order['status']) => void;
  onDelete: (id: number) => void;
}
