import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Bell,
  MessageSquare,
  AlertTriangle,
  User,
  TrendingUp,
  Clock,
  CheckCheck,
  X,
} from "lucide-react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  type CRMNotification,
  onNotificationBroadcast,
} from "@/data/notifications";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface NotificationsDrawerProps {
  children: React.ReactNode;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<CRMNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
    
    // Set up real-time notification listener
    const cleanup = onNotificationBroadcast((notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return cleanup;
  }, [user?.id]);

  const loadNotifications = () => {
    const allNotifications = getNotifications({
      userId: user?.id,
      limit: 100
    });
    setNotifications(allNotifications);
    setUnreadCount(getUnreadCount(user?.id));
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(user?.id);
    loadNotifications();
  };

  const getNotificationIcon = (type: CRMNotification['type']) => {
    switch (type) {
      case 'new-request':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'new-reply':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'sla-breach':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'escalation':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'assignment':
        return <User className="h-4 w-4 text-purple-500" />;
      case 'status-change':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'all': 'جميع الإشعارات',
      'new-request': 'طلبات جديدة',
      'new-reply': 'ردود جديدة', 
      'sla-breach': 'انتهاكات SLA',
      'escalation': 'تصعيدات',
      'assignment': 'إسنادات',
      'status-change': 'تغييرات الحالة'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const filteredNotifications = selectedType === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === selectedType);

  const getTypeCounts = () => {
    const counts: Record<string, number> = { all: notifications.length };
    notifications.forEach(n => {
      counts[n.type] = (counts[n.type] || 0) + 1;
    });
    return counts;
  };

  const typeCounts = getTypeCounts();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="left" className="w-96 sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              الإشعارات
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                data-testid="mark-all-read"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                تحديد الكل كمقروء
              </Button>
            )}
          </div>
          <SheetDescription>
            آخر الإشعارات والتحديثات من نظام إدارة العملاء
          </SheetDescription>
        </SheetHeader>

        <Tabs value={selectedType} onValueChange={setSelectedType} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">
              الكل ({typeCounts.all || 0})
            </TabsTrigger>
            <TabsTrigger value="new-request" className="text-xs">
              طلبات ({typeCounts['new-request'] || 0})
            </TabsTrigger>
            <TabsTrigger value="sla-breach" className="text-xs">
              SLA ({typeCounts['sla-breach'] || 0})
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      notification.read
                        ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                    }`}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 rtl:space-x-reverse flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <Badge variant="destructive" className="text-xs px-1 py-0">
                                جديد
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: ar,
                              })}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(notification.type)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          data-testid={`mark-read-${notification.id}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredNotifications.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Bell className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا توجد إشعارات</h3>
                    <p className="text-sm">
                      {selectedType === 'all' 
                        ? 'لا توجد إشعارات لعرضها'
                        : `لا توجد إشعارات من نوع "${getTypeLabel(selectedType)}"`
                      }
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <TabsContent value="new-request" className="mt-0">
            {/* Content is handled by the main scroll area above */}
          </TabsContent>

          <TabsContent value="sla-breach" className="mt-0">
            {/* Content is handled by the main scroll area above */}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};