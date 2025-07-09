'use client';

import { NotificationItemCardProps } from "@/models/notificationsModel";

export default function NotificationItemCard({ item }: NotificationItemCardProps) {
  return (
    <div className="flex p-6 sm:p-8 border-b border-gray-100 last:border-none">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full flex-shrink-0" />
      <div className="flex flex-col justify-center ml-4">
        <p className="text-sm sm:text-base font-medium">
          {item.user}
          <span className="text-gray-400 font-normal ml-2">{item.message}</span>
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.timeAgo}</p>
      </div>
    </div>
  );
}
