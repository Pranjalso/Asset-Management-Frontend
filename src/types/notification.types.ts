export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  read: boolean;
}

export interface NotificationGroup {
  label: string;
  items: Notification[];
}
