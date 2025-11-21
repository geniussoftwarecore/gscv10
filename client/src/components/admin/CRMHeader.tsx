import { Bell, Search, Users, Settings, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { getUnreadCount } from "@/data/notifications";
import { useState, useEffect } from "react";

interface CRMHeaderProps {
  onSearchChange: (value: string) => void;
  onNotificationClick: () => void;
}

export const CRMHeader: React.FC<CRMHeaderProps> = ({
  onSearchChange,
  onNotificationClick,
}) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateUnreadCount = () => {
      setUnreadCount(getUnreadCount(user?.id));
    };

    updateUnreadCount();
    
    // Update every 30 seconds
    const interval = setInterval(updateUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          إدارة العملاء (CRM)
        </h1>
      </div>

      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="البحث في التذاكر..."
            className="w-64 pr-10"
            onChange={(e) => onSearchChange(e.target.value)}
            data-testid="search-tickets"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative"
          onClick={onNotificationClick}
          data-testid="notifications-button"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>

        {/* User Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3" data-testid="user-menu">
              <MoreVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
              {user?.name}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              إدارة المستخدمين
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              إعدادات النظام
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};