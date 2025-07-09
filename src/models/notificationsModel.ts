export interface NotificationItem {
  id: number;
  user: string;
  message: string;
  timeAgo: string;
}

export type NotificationItemCardProps = {
  item: NotificationItem;
};