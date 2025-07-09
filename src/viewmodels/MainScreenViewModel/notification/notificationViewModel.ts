import { NotificationItem } from "@/models/notificationsModel";
import { useState, useEffect } from "react";

export function useNotificationVM() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Mock fetch (replace with real API call)
    const mockData: NotificationItem[] = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      user: "Lewis Hamilton",
      message: "Placed a new order",
      timeAgo: "20 min ago",
    }));

    setNotifications(mockData);
  }, []);

  return {
    notifications,
  };
}

