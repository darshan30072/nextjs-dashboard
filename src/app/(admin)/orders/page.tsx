'use client';

import OrderNavbar from '@/components/orders/orderNavbar';
import OrderList from '@/components/orders/orderList';
import OrderDetails from '@/components/orders/orderDetails';
import useOrdersVM from '@/viewmodels/MainScreenViewModel/orders/OrdersViewModel';

export default function OrdersPage() {
  const {
    orders,
    filteredOrders,
    selectedOrder,
    activeTab,
    setActiveTab,
    setSelectedOrder,
    handleStatusChange,
    handleDeleteOrder,
  } = useOrdersVM();

  return (
    <div className="p-4 sm:p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6">
        {/* Order List */}
        <div className="xl:col-span-6 bg-white rounded-xl shadow font-bold border border-gray-200 p-4 sm:p-6">
          <h1 className="text-lg sm:text-xl font-semibold py-1.5 sm:pb-5">Orders List</h1>
          <OrderNavbar activeTab={activeTab} onTabChange={setActiveTab} orders={orders} />
          <div className="max-h-[72vh] overflow-y-auto mt-4 sm:mt-5 [&::-webkit-scrollbar]:hidden scrollbar-hide">
            <OrderList
              orders={filteredOrders}
              onSelect={setSelectedOrder}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteOrder}
            />
          </div>
        </div>

        {/* Order Details */}
        <div className="xl:col-span-6 bg-white rounded-xl shadow font-bold border border-gray-200 p-4 sm:p-6">
          <OrderDetails
            order={selectedOrder}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteOrder}
          />
        </div>
      </div>
    </div>
  );
}
