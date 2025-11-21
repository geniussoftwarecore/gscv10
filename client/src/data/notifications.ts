// Notification system for CRM
export interface CRMNotification {
  id: string;
  type: 'new-request' | 'new-reply' | 'sla-breach' | 'escalation' | 'assignment' | 'status-change';
  title: string;
  message: string;
  targetId: string; // ID of the related ticket/request
  userId?: string; // Specific user notification (optional)
  read: boolean;
  createdAt: string;
  data?: Record<string, any>; // Additional data
}

// Load notifications from localStorage
const loadNotificationsFromStorage = (): CRMNotification[] => {
  try {
    const stored = localStorage.getItem("gsc_notifications");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading notifications:", error);
    return [];
  }
};

// Save notifications to localStorage
const saveNotificationsToStorage = (notifications: CRMNotification[]): void => {
  try {
    localStorage.setItem("gsc_notifications", JSON.stringify(notifications));
  } catch (error) {
    console.error("Error saving notifications:", error);
  }
};

let notifications: CRMNotification[] = loadNotificationsFromStorage();

// Add new notification
export const addNotification = (
  type: CRMNotification['type'],
  title: string,
  message: string,
  targetId: string,
  userId?: string,
  data?: Record<string, any>
): CRMNotification => {
  const notification: CRMNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    targetId,
    userId,
    read: false,
    createdAt: new Date().toISOString(),
    data
  };
  
  notifications.unshift(notification); // Add to beginning for latest first
  saveNotificationsToStorage(notifications);
  
  // Trigger broadcast for real-time updates
  triggerNotificationBroadcast(notification);
  
  return notification;
};

// Get notifications with optional filters
export const getNotifications = (filters?: {
  userId?: string;
  type?: string;
  read?: boolean;
  limit?: number;
}): CRMNotification[] => {
  let filtered = [...notifications];
  
  if (filters?.userId) {
    filtered = filtered.filter(n => !n.userId || n.userId === filters.userId);
  }
  
  if (filters?.type) {
    filtered = filtered.filter(n => n.type === filters.type);
  }
  
  if (filters?.read !== undefined) {
    filtered = filtered.filter(n => n.read === filters.read);
  }
  
  if (filters?.limit) {
    filtered = filtered.slice(0, filters.limit);
  }
  
  return filtered;
};

// Mark notification as read
export const markNotificationAsRead = (id: string): boolean => {
  const notification = notifications.find(n => n.id === id);
  if (!notification) return false;
  
  notification.read = true;
  saveNotificationsToStorage(notifications);
  return true;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = (userId?: string): void => {
  notifications.forEach(notification => {
    if (!userId || !notification.userId || notification.userId === userId) {
      notification.read = true;
    }
  });
  saveNotificationsToStorage(notifications);
};

// Get unread count
export const getUnreadCount = (userId?: string): number => {
  return notifications.filter(n => 
    !n.read && (!userId || !n.userId || n.userId === userId)
  ).length;
};

// Clear old notifications (older than 30 days)
export const clearOldNotifications = (): void => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  notifications = notifications.filter(n => 
    new Date(n.createdAt) > thirtyDaysAgo
  );
  saveNotificationsToStorage(notifications);
};

// Real-time notification broadcasting
const notificationChannelName = 'gsc-notifications';
let notificationChannel: BroadcastChannel | null = null;

// Initialize broadcast channel
export const initNotificationBroadcast = (): void => {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      notificationChannel = new BroadcastChannel(notificationChannelName);
    }
  } catch (error) {
    console.warn("BroadcastChannel not supported, falling back to polling");
  }
};

// Trigger broadcast for new notification
const triggerNotificationBroadcast = (notification: CRMNotification): void => {
  if (notificationChannel) {
    notificationChannel.postMessage({
      type: 'new-notification',
      notification
    });
  }
};

// Listen for broadcast notifications
export const onNotificationBroadcast = (
  callback: (notification: CRMNotification) => void
): (() => void) => {
  if (notificationChannel) {
    const handler = (event: MessageEvent) => {
      if (event.data.type === 'new-notification') {
        callback(event.data.notification);
      }
    };
    
    notificationChannel.addEventListener('message', handler);
    
    return () => {
      notificationChannel?.removeEventListener('message', handler);
    };
  }
  
  // Fallback: return empty cleanup function
  return () => {};
};

// Initialize on module load
initNotificationBroadcast();