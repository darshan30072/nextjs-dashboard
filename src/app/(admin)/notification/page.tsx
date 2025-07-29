'use client';

import NotificationItemCard from "@/components/notifications/notificationCard";
import { useNotificationVM } from "@/viewmodels/ComponentViewModel/notification/notificationViewModel";

export default function Notification() {
  const { notifications } = useNotificationVM();

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 [&::-webkit-scrollbar]:hidden scrollbar-hide">
      <div className="bg-white rounded-xl shadow font-bold border border-gray-200 p-4 sm:p-6">
        {notifications.map((item) => (
          <NotificationItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
