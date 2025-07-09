// // Represents a single item in an order
// export interface OrderItem {
//   item_id_int: number;             // Unique ID of the item
//   order_item_price: number;        // Price of the item
//   order_item_quantity: number;     // Quantity ordered
//   order_item_portion: string;      // Portion name/size (e.g., "Regular", "Large")
//   order_comment: string;           // Any custom comment (e.g., "No onions")

//   // Frontend-only fields (optional):
//   item_name: string;
//   item_icon: string;                   // Emoji or icon string for visual (optional)
// }

// // Represents a full order
// export interface Order {
//   id: number;   
//   order_no: string;                // Order ID
//   userId: number;                  // User ID who placed the order
//   date: string;                    // ISO date string when order was placed
//   amount: number;                  // Total item amount
//   discount: number;         // Discount amount
//   tax: number;                     // Tax value
//   netPrice: number;                // Final price after tax and discount
//   address: string;                 // Delivery address (frontend dummy if not provided by backend)
//   estimationTime: string;         // Estimated delivery time (dummy or dynamic)
//   distance: string;               // Distance to customer (dummy or dynamic)
//   payment: string;                // Payment method (e.g., "E-Wallet")
//   paymentStatus: string;          // Payment status (e.g., "Completed")
//   status: 'all' | 'requested' | 'pending' | 'preparing' | 'completed' | 'rejected';
//   user: {
//     name: string;                 // Customer name (dummy for now)
//     since: string;               // Year or date the user registered (dummy)
//   };

//   items: OrderItem[];             // List of items in the order
// }
