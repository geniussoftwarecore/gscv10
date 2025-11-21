import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Notification, InsertNotification } from "@shared/schema";

// Notification interface with extended properties
export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<InsertNotification, 'userId'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  getNotificationsForUser: (userId: string) => Notification[];
  getUnreadNotificationsForUser: (userId: string) => Notification[];
  deleteNotification: (notificationId: string) => void;
  clearNotifications: (userId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  userId?: string;
}

// In-memory notifications storage
let notifications: Notification[] = [
  {
    id: "notif-1",
    userId: "admin-1",
    title: "طلب جديد",
    message: "تم استلام طلب جديد لتطوير تطبيق جوال",
    type: "new-request",
    category: "general",
    read: "false",
    actionUrl: "/admin/dashboard",
    createdAt: new Date("2024-08-14T10:00:00Z"),
  },
  {
    id: "notif-2", 
    userId: "user-1",
    title: "تم الرد على طلبك",
    message: "تم الرد على طلب تطوير التطبيق الخاص بك",
    type: "reply",
    category: "project",
    read: "false",
    actionUrl: "/dashboard",
    createdAt: new Date("2024-08-14T11:30:00Z"),
  }
];

export const NotificationProvider = ({ children, userId }: NotificationProviderProps) => {
  const [currentNotifications, setCurrentNotifications] = useState<Notification[]>(notifications);
  const [unreadCount, setUnreadCount] = useState(0);

  // Update unread count when notifications or userId change
  useEffect(() => {
    if (userId) {
      const userNotifications = currentNotifications.filter(notif => notif.userId === userId);
      const unread = userNotifications.filter(notif => notif.read === "false").length;
      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  }, [currentNotifications, userId]);

  const addNotification = (notification: Omit<InsertNotification, 'userId'>) => {
    // Use current user ID if available, otherwise use a default admin user
    const targetUserId = userId || "admin-1";
    
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      title: notification.title,
      message: notification.message,
      type: notification.type || "general",
      category: notification.category || "general",
      read: "false",
      actionUrl: notification.actionUrl || null,
      createdAt: new Date(),
    };

    const updatedNotifications = [newNotification, ...currentNotifications];
    notifications = updatedNotifications;
    setCurrentNotifications(updatedNotifications);
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = currentNotifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: "true" } : notif
    );
    notifications = updatedNotifications;
    setCurrentNotifications(updatedNotifications);
  };

  const markAllAsRead = (targetUserId: string) => {
    const updatedNotifications = currentNotifications.map(notif =>
      notif.userId === targetUserId ? { ...notif, read: "true" } : notif
    );
    notifications = updatedNotifications;
    setCurrentNotifications(updatedNotifications);
  };

  const getNotificationsForUser = (targetUserId: string): Notification[] => {
    return currentNotifications
      .filter(notif => notif.userId === targetUserId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  };

  const getUnreadNotificationsForUser = (targetUserId: string): Notification[] => {
    return getNotificationsForUser(targetUserId).filter(notif => notif.read === "false");
  };

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = currentNotifications.filter(notif => notif.id !== notificationId);
    notifications = updatedNotifications;
    setCurrentNotifications(updatedNotifications);
  };

  const clearNotifications = (targetUserId: string) => {
    const updatedNotifications = currentNotifications.filter(notif => notif.userId !== targetUserId);
    notifications = updatedNotifications;
    setCurrentNotifications(updatedNotifications);
  };

  const value: NotificationContextType = {
    notifications: currentNotifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    getNotificationsForUser,
    getUnreadNotificationsForUser,
    deleteNotification,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};